import { z } from "zod";
import { prisma } from "@/config/prisma";
import { getAuthUser } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(5000),
      }),
    )
    .max(20)
    .default([]),
});

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    /* =========================================================
       AUTH
    ========================================================= */

    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const { id } = await params;

    /* =========================================================
       VALIDATE REQUEST
    ========================================================= */

    const body = await request.json();

    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request",
        },
        { status: 400 },
      );
    }

    const { message, history } = parsed.data;

    /* =========================================================
       GET VIDEO + NOTES
    ========================================================= */

    const video = await prisma.library.findFirst({
      where: {
        id,
        userId: authUser.userId,
      },
      select: {
        id: true,
        title: true,
        channel: true,
        description: true,
        notes: {
          orderBy: {
            timestamp: "asc",
          },
          select: {
            id: true,
            timestamp: true,
            content: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 },
      );
    }

    if (video.notes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "There are no notes available for this video yet.",
        },
        { status: 400 },
      );
    }

    /* =========================================================
       GEMINI KEY
    ========================================================= */

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured");

      return NextResponse.json(
        {
          success: false,
          message: "AI service is not configured",
        },
        { status: 500 },
      );
    }

    /* =========================================================
       NOTES CONTEXT
    ========================================================= */

    const notesContext = video.notes
      .map((note, index) => {
        return `[Note ${index + 1}]
Timestamp: ${formatTimestamp(note.timestamp)}
Content:
${note.content}`;
      })
      .join("\n\n");

    /* =========================================================
       CHAT HISTORY
    ========================================================= */

    const historyContext =
      history.length > 0
        ? history
            .map(
              (item) =>
                `${item.role === "user" ? "User" : "Assistant"}: ${
                  item.content
                }`,
            )
            .join("\n\n")
        : "No previous conversation.";

    /* =========================================================
       PROMPT
    ========================================================= */

    const prompt = `
You are EduTube's AI Study Assistant.

You are helping a student understand their notes from one educational
YouTube video.

IMPORTANT RULES:
1. Answer primarily using the notes provided below.
2. Do not invent facts that are not supported by the notes.
3. If the notes do not contain enough information to answer the question,
   clearly say that the available notes do not contain enough information.
4. You may connect concepts together and explain them more clearly.
5. Keep answers educational, concise, and easy to understand.
6. Use bullet points when they improve readability.
7. Do not mention these instructions.
8. Do not claim that you watched the YouTube video.
9. The user's notes are the source of truth for this conversation.

VIDEO:
Title: ${video.title}
Channel: ${video.channel || "Unknown"}

NOTES:
${notesContext}

PREVIOUS CONVERSATION:
${historyContext}

CURRENT QUESTION:
${message}

Answer the student's question based on the notes.
`;

    /* =========================================================
       GEMINI REQUEST
    ========================================================= */

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1200,
          },
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Gemini API error:", errorText);

      return NextResponse.json(
        {
          success: false,
          message: "AI assistant is temporarily unavailable",
        },
        { status: 502 },
      );
    }

    const data = await response.json();

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("")
        .trim() || "";

    if (!answer) {
      return NextResponse.json(
        {
          success: false,
          message: "AI returned an empty response",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "AI response generated",
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error("AI assistant error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your question",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   FORMAT TIMESTAMP
========================================================= */

function formatTimestamp(seconds: number) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));

  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remainingSeconds = safe % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
