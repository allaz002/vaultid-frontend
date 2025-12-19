import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens, User } from "@/lib/types";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;

  hasHydrated: boolean;
  isBootstrapped: boolean;

  setAuth: (data: { user?: User | null; tokens: AuthTokens | null }) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  clearAuth: () => void;

  setHasHydrated: (v: boolean) => void;
  setBootstrapped: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,

      hasHydrated: false,
      isBootstrapped: false,

      setAuth: ({ user, tokens }) =>
        set(() => ({
          user: user ?? null,
          tokens,
        })),

      setTokens: (tokens) => set(() => ({ tokens })),

      clearAuth: () =>
        set(() => ({
          user: null,
          tokens: null,
        })),

      setHasHydrated: (v) => set(() => ({ hasHydrated: v })),
      setBootstrapped: (v) => set(() => ({ isBootstrapped: v })),
    }),
    {
      name: "vaultid-auth",
      partialize: (state) => ({
        tokens: state.tokens?.refreshToken
          ? { refreshToken: state.tokens.refreshToken }
          : null,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
