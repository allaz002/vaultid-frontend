import { create } from "zustand";
import type { AuthTokens, User } from "@/lib/types";

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;

    setAuth: (data: { user?: User | null; tokens: AuthTokens | null }) => void;
    setTokens: (tokens: AuthTokens | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    tokens: null,

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
        }))
}));