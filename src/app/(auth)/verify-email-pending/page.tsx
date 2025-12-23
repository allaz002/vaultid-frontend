"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPendingPage() {
  const router = useRouter();

  return (
    <Card className="border border-slate-800 bg-slate-900/60 p-6">
      <h1 className="text-xl font-semibold mb-2">
        Email verification required
      </h1>

      <p className="text-sm text-slate-400 mb-4">
        Please verify your email address before accessing your dashboard.
        Check your inbox for the verification link.
      </p>

      <Button onClick={() => router.push("/login")}>
        Back to login
      </Button>
    </Card>
  );
}
