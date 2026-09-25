export interface LibraryVideo {
  id: string;
  videoId: string;
  title: string;
  channel: string | null;
  thumbnail: string | null;
  description: string | null;

  duration: number;

  watchedSeconds: number;
  progress: number;
  completed: boolean;

  notesCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface LibraryResponse {
  success: boolean;
  message: string;

  data: {
    library: LibraryVideo[];
    total: number;
  };
}

export interface AddLibraryVideoResponse {
  success: boolean;
  message: string;
  data: {
    video: {
      id: string;
      videoId: string;
      title: string;
      channel: string | null;
      thumbnail: string | null;
      duration: number;
      description: string | null;
      createdAt: string;
    };
  };
}

export interface LibraryVideoDetail extends LibraryVideo {
  notes: {
    id: string;
    timestamp: number;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];

  watchedSeconds: number;
  progress: number;
  completed: boolean;

  progressData: {
    id: string;
    watchedSeconds: number;
    durationSeconds: number;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface LibraryVideoDetailResponse {
  success: boolean;
  message: string;
  data: {
    video: LibraryVideoDetail;
  };
}

export const libraryApi = {
  getAll: async (): Promise<LibraryResponse> => {
    const response = await fetch("/api/library", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

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

      throw new Error(error.message || "Unable to fetch your library");
    }

    return data as LibraryResponse;
  },

  addVideo: async (input: string): Promise<AddLibraryVideoResponse> => {
    const response = await fetch("/api/library", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        input,
      }),
    });

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

      throw new Error(error.message || "Unable to add YouTube video");
    }

    return data as AddLibraryVideoResponse;
  },

  getById: async (libraryId: string): Promise<LibraryVideoDetailResponse> => {
    const response = await fetch(`/api/library/${libraryId}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

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

      throw new Error(error.message || "Unable to fetch video");
    }

    return data as LibraryVideoDetailResponse;
  },

  delete: async (libraryId: string) => {
    const response = await fetch(`/api/library/${libraryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      throw new Error(error.message || "Failed to delete library item");
    }

    return response.json();
  },
};
