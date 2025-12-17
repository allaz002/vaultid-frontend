"use client";

import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const { tokens, clearAuth } = useAuthStore();

  const logout = async () => {
    if (tokens?.refreshToken) {
      await authApi.logout({ refreshToken: tokens.refreshToken });
    }
    clearAuth();
    router.push("/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
