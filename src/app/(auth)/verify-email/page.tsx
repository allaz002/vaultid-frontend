"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";
import { Card } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2000);
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      {status === "loading" && (
        <p className="text-sm text-slate-400">Verifying email…</p>
      )}

      {status === "success" && (
        <p className="text-sm text-emerald-400">
          Email verified successfully. Redirecting…
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-400">
          Invalid or expired verification link.
        </p>
      )}
    </Card>
  );
}
