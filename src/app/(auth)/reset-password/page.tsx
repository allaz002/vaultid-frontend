import { Suspense } from "react";
import { ResetPasswordClient } from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Suspense fallback={<p className="text-sm text-slate-300">Loading…</p>}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
}
