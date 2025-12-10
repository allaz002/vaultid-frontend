import Image from "next/image";
import styles from "./page.module.css";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full mx-4 rounded-xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">VaultID</h1>
        <p className="text-sm text-slate-400 mb-6">
          Secure authentication & user management
        </p>

        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Frontend-Setup ist fertig.
          </p>

          <Button className="w-full" variant="default">
            Login
          </Button>
        </div>
      </div>
    </main>
  );
}
