import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth";

export async function GET() {
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

    const library = await prisma.library.findMany({
      where: {
        userId: authUser.userId,
      },

      orderBy: {
        updatedAt: "desc",
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

        _count: {
          select: {
            notes: true,
          },
        },

        progress: {
          select: {
            watchedSeconds: true,
            durationSeconds: true,
            completed: true,
            updatedAt: true,
          },
        },
      },
    });

    const formattedLibrary = library.map((item) => {
      const duration = item.duration ?? item.progress?.durationSeconds ?? 0;

      const watchedSeconds = item.progress?.watchedSeconds ?? 0;

      const progress =
        duration > 0
          ? Math.min(100, Math.round((watchedSeconds / duration) * 100))
          : 0;

      return {
        id: item.id,
        videoId: item.videoId,
        title: item.title,
        channel: item.channel,
        thumbnail: item.thumbnail,
        description: item.description,
        duration,
        watchedSeconds,
        progress,
        completed: item.progress?.completed ?? false,
        notesCount: item._count.notes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Library fetched successfully",

        data: {
          library: formattedLibrary,

          total: formattedLibrary.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_LIBRARY_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch your library",
      },
      { status: 500 },
    );
  }
}

import {
  extractYouTubeVideoId,
  getYouTubeVideoMetadata,
} from "@/utils/youtube";
import { z } from "zod";

const addVideoSchema = z.object({
  input: z
    .string()
    .trim()
    .min(1, "YouTube video ID or URL is required")
    .max(500, "Input is too long"),
});

export async function POST(request: Request) {
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

    const body = await request.json();

    const validation = addVideoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ||
            "Invalid YouTube video input",
        },
        { status: 422 },
      );
    }

    const videoId = extractYouTubeVideoId(validation.data.input);

    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid YouTube video ID or YouTube video URL.",
        },
        { status: 422 },
      );
    }

    const existingVideo = await prisma.library.findUnique({
      where: {
        userId_videoId: {
          userId: authUser.userId,
          videoId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingVideo) {
      return NextResponse.json(
        {
          success: false,
          message: "This video is already in your library.",
          data: {
            libraryId: existingVideo.id,
          },
        },
        { status: 409 },
      );
    }

    const youtubeVideo = await getYouTubeVideoMetadata(videoId);

    if (!youtubeVideo) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't find that YouTube video. Make sure the video ID or URL is correct.",
        },
        { status: 404 },
      );
    }

    const libraryVideo = await prisma.library.create({
      data: {
        userId: authUser.userId,
        videoId: youtubeVideo.videoId,
        title: youtubeVideo.title,
        channel: youtubeVideo.channel,
        thumbnail: youtubeVideo.thumbnail,
        duration: youtubeVideo.duration,
        description: youtubeVideo.description,

        progress: {
          create: {
            userId: authUser.userId,
            watchedSeconds: 0,
            durationSeconds: youtubeVideo.duration,
            completed: false,
          },
        },
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Video added to your library",
        data: {
          video: libraryVideo,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("ADD_LIBRARY_VIDEO_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add this YouTube video",
      },
      { status: 500 },
    );
  }
}
