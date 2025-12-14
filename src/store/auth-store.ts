import { create } from "zustand";
import type { AuthTokens, User } from "@/lib/types";

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    setAuth: (data: { user?: User | null; tokens: AuthTokens | null }) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    tokens: null,
    isAuthenticated: false,

    setAuth: ({ user, tokens }) =>
        set(() => ({
            user: user ?? null,
            tokens,
            isAuthenticated: !!tokens,
        })),

    clearAuth: () =>
        set(() => ({
            user: null,
            tokens: null,
            isAuthenticated: false,
        }))
}));