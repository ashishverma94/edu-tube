export interface VideoProgress {
  id: string;
  watchedSeconds: number;
  durationSeconds: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressResponse {
  success: boolean;
  message: string;
  data: {
    progress: VideoProgress;
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("Unable to read server response");
  }

  if (!response.ok) {
    const error = data as {
      message?: string;
    };

    throw new Error(error.message || "Unable to update progress");
  }

  return data as T;
}

export const progressApi = {
  get: async (libraryId: string): Promise<ProgressResponse> => {
    const response = await fetch(`/api/library/${libraryId}/progress`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    return parseResponse<ProgressResponse>(response);
  },

  update: async ({
    libraryId,
    watchedSeconds,
    durationSeconds,
    completed,
  }: {
    libraryId: string;
    watchedSeconds: number;
    durationSeconds?: number;
    completed?: boolean;
  }): Promise<ProgressResponse> => {
    const response = await fetch(`/api/library/${libraryId}/progress`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        watchedSeconds,
        durationSeconds,
        completed,
      }),
    });

    return parseResponse<ProgressResponse>(response);
  },
};
