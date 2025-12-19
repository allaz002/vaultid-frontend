"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-me";
import { useAuthStore } from "@/store/auth-store";
import { LogoutButton } from "@/components/logout-button";
import { BrandLogo } from "@/components/brand/brand-logo";

export default function DashboardPage() {
  const router = useRouter();

  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const tokens = useAuthStore((s) => s.tokens);
  const isAuthenticated = !!tokens?.refreshToken;

  const { data, isLoading, isError, refetch } = useMe(!!tokens?.accessToken);

  useEffect(() => {
    if (!hasHydrated || !isBootstrapped) return;
    if (!isAuthenticated) router.push("/login");
  }, [hasHydrated, isBootstrapped, isAuthenticated, router]);

  if (!hasHydrated || !isBootstrapped) {
    return (
      <main className="p-6">
        <p>Restoring session…</p>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <main className="p-6">
        <p>Loading dashboard…</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-6">
        <p>Could not load user data.</p>
        <button className="underline text-sm" onClick={() => refetch()}>
          Retry
        </button>
      </main>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Logged in as {data.email}
        </p>
      </div>

      <button
        className="text-sm underline text-slate-300"
        onClick={() => refetch()}
      >
        Refetch /users/me
      </button>

      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-sm text-slate-300">
          Protected area
        </p>
      </section>
    </div>
  );
}
