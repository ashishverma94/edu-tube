import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth";
import { prisma } from "@/config/prisma";
import { z } from "zod";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Library video ID is required",
        },
        { status: 400 },
      );
    }

    const video = await prisma.library.findFirst({
      where: {
        id,
        userId: authUser.userId,
      },
      select: {
        id: true,
        videoId: true,
        title: true,
        channel: true,
        thumbnail: true,
        duration: true,
        description: true,
        createdAt: true,
        updatedAt: true,

        notes: {
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
        },

        progress: {
          select: {
            id: true,
            watchedSeconds: true,
            durationSeconds: true,
            completed: true,
            createdAt: true,
            updatedAt: true,
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

    const duration = video.duration ?? video.progress?.durationSeconds ?? 0;

    const watchedSeconds = video.progress?.watchedSeconds ?? 0;

    const progress =
      duration > 0
        ? Math.min(100, Math.round((watchedSeconds / duration) * 100))
        : 0;

    return NextResponse.json({
      success: true,
      message: "Video fetched successfully",
      data: {
        video: {
          id: video.id,
          videoId: video.videoId,
          title: video.title,
          channel: video.channel,
          thumbnail: video.thumbnail,
          duration,
          description: video.description,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,

          notes: video.notes,

          watchedSeconds,
          progress,
          completed: video.progress?.completed ?? false,

          progressData: video.progress,
        },
      },
    });
  } catch (error) {
    console.error("GET_LIBRARY_VIDEO_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch video",
      },
      { status: 500 },
    );
  }
}

const updateLibrarySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(300, "Title is too long")
    .optional(),

  description: z
    .string()
    .trim()
    .max(5000, "Description is too long")
    .optional(),
});

export async function PATCH(request: Request, { params }: RouteContext) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Library video ID is required",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const validation = updateLibrarySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message || "Invalid video data",
        },
        { status: 422 },
      );
    }

    const existingVideo = await prisma.library.findFirst({
      where: {
        id,
        userId: authUser.userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingVideo) {
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 },
      );
    }

    const video = await prisma.library.update({
      where: {
        id,
      },
      data: validation.data,
      select: {
        id: true,
        videoId: true,
        title: true,
        channel: true,
        thumbnail: true,
        duration: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Video updated successfully",
      data: {
        video,
      },
    });
  } catch (error) {
    console.error("UPDATE_LIBRARY_VIDEO_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update video",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Library video ID is required",
        },
        { status: 400 },
      );
    }

    const video = await prisma.library.findFirst({
      where: {
        id,
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

    await prisma.library.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Video removed from your library",
    });
  } catch (error) {
    console.error("DELETE_LIBRARY_VIDEO_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to remove video",
      },
      { status: 500 },
    );
  }
}
