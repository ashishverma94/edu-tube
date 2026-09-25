export interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  success: boolean;
  message: string;
  data: {
    notes: Note[];
    total: number;
  };
}

export interface NoteResponse {
  success: boolean;
  message: string;
  data: {
    note: Note;
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

    throw new Error(
      error.message || "Something went wrong. Please try again.",
    );
  }

  return data as T;
}

export const notesApi = {
  getAll: async (
    libraryId: string,
  ): Promise<NotesResponse> => {
    const response = await fetch(
      `/api/library/${libraryId}/notes`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    return parseResponse<NotesResponse>(response);
  },

  create: async ({
    libraryId,
    timestamp,
    content,
  }: {
    libraryId: string;
    timestamp: number;
    content: string;
  }): Promise<NoteResponse> => {
    const response = await fetch(
      `/api/library/${libraryId}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          timestamp,
          content,
        }),
      },
    );

    return parseResponse<NoteResponse>(response);
  },

  update: async ({
    libraryId,
    noteId,
    timestamp,
    content,
  }: {
    libraryId: string;
    noteId: string;
    timestamp?: number;
    content?: string;
  }): Promise<NoteResponse> => {
    const response = await fetch(
      `/api/library/${libraryId}/notes/${noteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          timestamp,
          content,
        }),
      },
    );

    return parseResponse<NoteResponse>(response);
  },

  delete: async ({
    libraryId,
    noteId,
  }: {
    libraryId: string;
    noteId: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
      `/api/library/${libraryId}/notes/${noteId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    return parseResponse<{
      success: boolean;
      message: string;
    }>(response);
  },
};