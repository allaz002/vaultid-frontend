"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/health-api";

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full mx-4 rounded-xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">VaultID Frontend</h1>

        {isLoading && (
          <p className="text-sm text-slate-400">Prüfe Backend-Health…</p>
        )}

        {isError && (
          <p className="text-sm text-red-400">
            Konnte Backend nicht erreichen.
            <br />
            {(error as Error).message}
          </p>
        )}

        {data && (
          <p className="text-sm text-emerald-400">
            Backend-Status: <span className="font-semibold">{data.status}</span>
          </p>
        )}
      </div>
    </main>
  );
}
