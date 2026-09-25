import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { getAuthUser } from "@/utils/auth";
import { z } from "zod";

interface RouteContext {
  params: Promise<{
    id: string;
    noteId: string;
  }>;
}

const updateNoteSchema = z.object({
  timestamp: z
    .number()
    .int()
    .min(0, "Timestamp cannot be negative")
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Note cannot be empty")
    .max(5000, "Note is too long")
    .optional(),
});

export async function PATCH(
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

    const { id: libraryId, noteId } = await params;

    const body = await request.json();

    const validation = updateNoteSchema.safeParse(body);

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

    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        libraryId,
        userId: authUser.userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        {
          success: false,
          message: "Note not found",
        },
        { status: 404 },
      );
    }

    if (validation.data.timestamp !== undefined) {
      const video = await prisma.library.findFirst({
        where: {
          id: libraryId,
          userId: authUser.userId,
        },
        select: {
          duration: true,
        },
      });

      if (
        video?.duration &&
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
    }

    const note = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: validation.data,
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
      message: "Note updated successfully",
      data: {
        note,
      },
    });
  } catch (error) {
    console.error("UPDATE_NOTE_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update note",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    const { id: libraryId, noteId } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        libraryId,
        userId: authUser.userId,
      },
      select: {
        id: true,
      },
    });

    if (!note) {
      return NextResponse.json(
        {
          success: false,
          message: "Note not found",
        },
        { status: 404 },
      );
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_NOTE_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete note",
      },
      { status: 500 },
    );
  }
}