"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-me";
import { useAuthStore } from "@/store/auth-store";
import { LogoutButton } from "@/components/logout-button";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useMe();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || isError) {
      router.push("/login");
    }
  }, [isAuthenticated, isError, router]);

  if (isLoading) {
    return (
      <main className="p-6">
        <p>Loading dashboard…</p>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Logged in as {data.email}
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm text-slate-300">
            Protected area
          </p>
        </section>
      </div>
    </main>
  );
}
