"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full mx-4 rounded-xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">VaultID</h1>
        <p className="text-sm text-slate-400 mb-6">
          Secure authentication & user management.
        </p>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-slate-600"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </div>
      </div>
    </main>
  );
}
