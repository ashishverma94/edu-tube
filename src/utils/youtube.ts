const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos";

export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim();

  if (!value) return null;

  // Direct YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    // youtube.com/watch?v=VIDEO_ID
    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const videoId = url.searchParams.get("v");

      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }

      // youtube.com/embed/VIDEO_ID
      // youtube.com/shorts/VIDEO_ID
      // youtube.com/live/VIDEO_ID
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (
        pathParts.length >= 2 &&
        ["embed", "shorts", "live"].includes(pathParts[0])
      ) {
        const videoId = pathParts[1];

        if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return videoId;
        }
      }
    }

    // youtu.be/VIDEO_ID
    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];

      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function parseYouTubeDuration(duration: string): number {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);

  if (!match) return 0;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

export interface YouTubeVideoMetadata {
  videoId: string;
  title: string;
  description: string;
  channel: string;
  thumbnail: string | null;
  duration: number;
}

export async function getYouTubeVideoMetadata(
  videoId: string,
): Promise<YouTubeVideoMetadata | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  const url = new URL(YOUTUBE_API_URL);

  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("YOUTUBE_API_ERROR:", response.status, await response.text());

    throw new Error("Unable to fetch YouTube video information");
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const video = data.items[0];

  const snippet = video.snippet;
  const contentDetails = video.contentDetails;

  return {
    videoId: video.id,
    title: snippet.title,
    description: snippet.description || "",
    channel: snippet.channelTitle || "",
    thumbnail:
      snippet.thumbnails?.maxres?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      null,
    duration: parseYouTubeDuration(contentDetails?.duration || ""),
  };
}
