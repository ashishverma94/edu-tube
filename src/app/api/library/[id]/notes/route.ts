import { z } from "zod";
import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const createNoteSchema = z.object({
  timestamp: z
    .number()
    .int()
    .min(0, "Timestamp cannot be negative"),

  content: z
    .string()
    .trim()
    .min(1, "Note cannot be empty")
    .max(5000, "Note is too long"),
});

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { id: libraryId } = await params;

    const video = await prisma.library.findFirst({
      where: {
        id: libraryId,
        userId: authUser.userId,
      },
      select: {
        id: true,
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

    const notes = await prisma.note.findMany({
      where: {
        libraryId,
        userId: authUser.userId,
      },
      orderBy: {
        timestamp: "asc",
      },
      select: {
        id: true,
        timestamp: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notes fetched successfully",
      data: {
        notes,
        total: notes.length,
      },
    });
  } catch (error) {
    console.error("GET_NOTES_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch notes",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { id: libraryId } = await params;

    const body = await request.json();

    const validation = createNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ||
            "Invalid note",
        },
        { status: 422 },
      );
    }

    const video = await prisma.library.findFirst({
      where: {
        id: libraryId,
        userId: authUser.userId,
      },
      select: {
        id: true,
        duration: true,
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

    if (
      video.duration &&
      validation.data.timestamp > video.duration
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Timestamp cannot exceed video duration",
        },
        { status: 422 },
      );
    }

    const note = await prisma.note.create({
      data: {
        userId: authUser.userId,
        libraryId,
        timestamp: validation.data.timestamp,
        content: validation.data.content,
      },
      select: {
        id: true,
        timestamp: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Note created successfully",
        data: {
          note,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE_NOTE_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create note",
      },
      { status: 500 },
    );
  }
}