import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { getAuthUser } from "@/utils/auth";
import { z } from "zod";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const progressSchema = z.object({
  watchedSeconds: z
    .number()
    .int()
    .min(0),

  durationSeconds: z
    .number()
    .int()
    .min(0)
    .optional(),

  completed: z
    .boolean()
    .optional(),
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

    const progress = await prisma.videoProgress.findFirst({
      where: {
        libraryId,
        userId: authUser.userId,
      },
      select: {
        id: true,
        watchedSeconds: true,
        durationSeconds: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!progress) {
      return NextResponse.json(
        {
          success: false,
          message: "Progress not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Progress fetched successfully",
      data: {
        progress,
      },
    });
  } catch (error) {
    console.error("GET_VIDEO_PROGRESS_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch video progress",
      },
      { status: 500 },
    );
  }
}

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

    const { id: libraryId } = await params;

    const body = await request.json();

    const validation = progressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ||
            "Invalid progress data",
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

    const durationSeconds =
      validation.data.durationSeconds ??
      video.duration ??
      0;

    const watchedSeconds = Math.min(
      validation.data.watchedSeconds,
      durationSeconds > 0
        ? durationSeconds
        : validation.data.watchedSeconds,
    );

    const completed =
      validation.data.completed ??
      (durationSeconds > 0 &&
        watchedSeconds >= durationSeconds);

    const progress = await prisma.videoProgress.upsert({
      where: {
        libraryId,
      },
      create: {
        userId: authUser.userId,
        libraryId,
        watchedSeconds,
        durationSeconds,
        completed,
      },
      update: {
        watchedSeconds,
        durationSeconds,
        completed,
      },
      select: {
        id: true,
        watchedSeconds: true,
        durationSeconds: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully",
      data: {
        progress,
      },
    });
  } catch (error) {
    console.error("UPDATE_VIDEO_PROGRESS_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update video progress",
      },
      { status: 500 },
    );
  }
}