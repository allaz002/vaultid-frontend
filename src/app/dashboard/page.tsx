"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";

import { useMe } from "@/hooks/use-me";
import { useAuthStore } from "@/store/auth-store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export default function DashboardPage() {
  const router = useRouter();

  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const tokens = useAuthStore((s) => s.tokens);

  const isAuthenticated = !!tokens?.refreshToken;

  const { data, isLoading, isError, error, refetch } = useMe(
    !!tokens?.accessToken,
  );

  const axiosError = error as AxiosError | null;

  useEffect(() => {
    if (!hasHydrated || !isBootstrapped) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isError && axiosError?.response?.status === 403) {
      router.push("/verify-email-pending");
    }
  }, [
    hasHydrated,
    isBootstrapped,
    isAuthenticated,
    isError,
    axiosError,
    router,
  ]);

  if (!hasHydrated || !isBootstrapped) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-300">Restoring session…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-300">Loading dashboard…</p>
      </div>
    );
  }

  if (isError && axiosError?.response?.status !== 403) {
    return (
      <div className="p-6">
        <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg w-full max-w-md">
          <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
          <p className="text-sm text-slate-400 mb-4">
            Could not load user data.
          </p>

          <Button className="w-full" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const displayName = data.name?.trim() ? data.name : data.email;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <p className="text-sm text-slate-400">
                Welcome, <span className="text-slate-200">{displayName}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Signed in as {data.email}
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-300">
              Protected area
            </p>
          </div>

        </Card>
      </div>
    </div>
  );
}
