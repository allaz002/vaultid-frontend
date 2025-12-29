import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { ResetPasswordClient } from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-sm text-slate-300">Loading…</p>}>
        <ResetPasswordClient />
      </Suspense>
    </PageShell>
  );
}
