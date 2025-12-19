import { ReactNode } from "react";
import { AuthHeader } from "@/components/layout/auth-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_55%),linear-gradient(to_bottom,#020617,#020617)]">
      <AuthHeader />

      <div className="min-h-screen flex items-center justify-center p-6">
        {children}
      </div>
    </main>
  );
}
