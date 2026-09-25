export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatResponse {
  success: boolean;
  message: string;
  data: {
    answer: string;
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
      error.message || "Unable to communicate with AI assistant",
    );
  }

  return data as T;
}

export const aiApi = {
  ask: async ({
    libraryId,
    message,
    history,
  }: {
    libraryId: string;
    message: string;
    history: AIChatMessage[];
  }): Promise<AIChatResponse> => {
    const response = await fetch(
      `/api/library/${libraryId}/ai`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message,
          history,
        }),
      },
    );

    return parseResponse<AIChatResponse>(response);
  },
};