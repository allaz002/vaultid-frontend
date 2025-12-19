import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link
      href="/login"
      className="flex items-center gap-3 select-none"
      aria-label="VaultID"
    >
      {/* LOGO – ohne Box */}
      <Image
        src="/logo.png"
        alt="VaultID logo"
        width={44}
        height={44}
        priority
        className="block"
      />

      {/* TEXT */}
      <div className="leading-tight">
        <p className="text-base font-semibold text-slate-100">
          VaultID
        </p>
        <p className="text-xs text-slate-400">
          Secure identity platform
        </p>
      </div>
    </Link>
  );
}
