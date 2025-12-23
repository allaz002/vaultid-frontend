"use client";

import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPendingPage() {
  const router = useRouter();

  return (
    <PageShell>
      <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg w-full max-w-md">
        <h1 className="text-xl font-semibold mb-1">
          Email verification required
        </h1>

        <p className="text-sm text-slate-400 mb-6">
          Please verify your email address before accessing your dashboard.
          Check your inbox and click the verification link.
        </p>

      </Card>
    </PageShell>
  );
}
