"use client";

import { useEffect } from "react";
import axios from "axios";
import type { AuthTokens } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export function AuthBootstrap() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const refreshToken = useAuthStore((s) => s.tokens?.refreshToken);

  const setTokens = useAuthStore((s) => s.setTokens);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  useEffect(() => {
    if (!hasHydrated) return;

    const run = async () => {
      try {
        if (!refreshToken) return;

        const { data } = await axios.post<AuthTokens>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        setTokens(data);
      } catch {
        clearAuth();
      } finally {
        setBootstrapped(true);
      }
    };

    run();
  }, [hasHydrated]);

  return null;
}
