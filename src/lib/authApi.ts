export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
}

async function parseResponse<T>(res: Response): Promise<T> {
  let data: unknown;

  try {
    data = await res.json();
  } catch {
    throw new Error("Something went wrong. Please try again.");
  }

  if (!res.ok) {
    const error = data as ApiErrorResponse;

    throw new Error(
      error?.message || "Something went wrong. Please try again.",
    );
  }

  return data as T;
}

export const authApi = {
  register: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    return parseResponse<AuthResponse>(res);
  },

  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return parseResponse<AuthResponse>(res);
  },

  me: async (): Promise<AuthResponse> => {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    return parseResponse<AuthResponse>(res);
  },

  logout: async (): Promise<LogoutResponse> => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    return parseResponse<LogoutResponse>(res);
  },
};
