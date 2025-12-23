import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Suspense fallback={<p className="text-sm text-slate-300">Loading…</p>}>
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
}
