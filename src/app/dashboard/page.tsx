"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";

import { useMe } from "@/hooks/use-me";
import { useAuthStore } from "@/store/auth-store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { PageShell } from "@/components/page-shell";

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
      <PageShell>
        <p className="text-sm text-slate-300">Restoring session…</p>
      </PageShell>
    );
  }

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <PageShell>
        <p className="text-sm text-slate-300">Loading dashboard…</p>
      </PageShell>
    );
  }

  if (isError && axiosError?.response?.status !== 403) {
    return (
      <PageShell>
        <Card className="w-full max-w-md border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <h1 className="mb-2 text-xl font-semibold">Dashboard</h1>
          <p className="mb-4 text-sm text-slate-400">
            Could not load user data.
          </p>

          <Button className="w-full" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </PageShell>
    );
  }

  if (!data) return null;

  const displayName = data.name?.trim() ? data.name : data.email;

  return (
    <PageShell>
      <div className="w-full max-w-4xl space-y-6">
        <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <p className="text-sm text-slate-400">
                Welcome,{" "}
                <span className="text-slate-200">{displayName}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
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
    </PageShell>
  );
}
