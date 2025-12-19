"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { authApi } from "@/lib/auth-api";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { AuthCard } from "@/components/auth/auth-card";

type Status = "idle" | "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

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
      setMessage("");

      try {
        await authApi.verifyEmail( token );

        setStatus("success");
        setMessage("Email verified successfully. You can now sign in.");
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ??
          error?.message ??
          "Verification failed. The link may be invalid or expired.";
        setStatus("error");
        setMessage(Array.isArray(msg) ? msg.join(", ") : String(msg));
      }
    };

    run();
  }, [token]);

  return (
    <PageShell>
      <AuthCard
        title="Verify email"
        subtitle="We’re confirming your email address."
      >
        {status === "loading" && (
          <p className="text-sm text-muted-foreground">Verifying…</p>
        )}

        {status === "success" && (
          <p className="text-sm text-emerald-400">{message}</p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-400">{message}</p>
        )}

        <div className="mt-6 space-y-3">
          <Button className="w-full h-11" onClick={() => router.push("/login")}>
            Go to login
          </Button>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            Create a new account
          </button>
        </div>
      </AuthCard>
    </PageShell>
  );
}
