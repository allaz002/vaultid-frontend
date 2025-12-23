"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/auth-api";

type Status = "idle" | "loading" | "success" | "error";

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(
    () => searchParams.get("token") ?? "",
    [searchParams],
  );

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token. Please use the link from your email.");
        return;
      }

      setStatus("loading");
      setMessage("Verifying your email…");

      try {
        await authApi.verifyEmail(token);

        setStatus("success");
        setMessage("Email verified successfully. Redirecting to dashboard…");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ??
          err?.message ??
          "Verification failed. The link may be invalid or expired.";

        setStatus("error");
        setMessage(Array.isArray(msg) ? msg.join(", ") : String(msg));
      }
    };

    run();
  }, [token, router]);

  return (
    <div className="max-w-md w-full rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-3">
      <h1 className="text-xl font-semibold">Verify email</h1>

      {status === "loading" && (
        <p className="text-sm text-slate-300">{message}</p>
      )}

      {status === "success" && (
        <p className="text-sm text-emerald-400">{message}</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-400">{message}</p>
      )}
    </div>
  );
}
