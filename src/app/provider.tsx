"use client";

import { Toaster } from "sonner";
import { authApi } from "@/lib/authApi";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuthStore } from "@/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: false,
          },
        },
      }),
  );

  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const response = await authApi.me();

        if (!mounted) return;

        setAuth(response.data.user);
      } catch {
        if (!mounted) return;

        logout();
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [setAuth, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position={isMobile ? "bottom-center" : "top-right"}
        toastOptions={{
          classNames: {
            title: "font-display font-bold text-sm",
            description: "font-body text-xs mt-0.5",
          },
        }}
      />

      {children}
    </QueryClientProvider>
  );
}
