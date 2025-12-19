import { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/30">
      <div className="p-6">
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}