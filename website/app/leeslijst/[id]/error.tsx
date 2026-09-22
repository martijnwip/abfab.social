"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[leeslijst/[id]/error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-terracotta mb-4">
          Er ging iets mis
        </p>
        <h1 className="text-[24px] font-black tracking-tight leading-tight mb-4">
          Dit boek kon niet worden geladen.
        </h1>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink/85 transition-colors cursor-pointer"
          >
            Opnieuw proberen
          </button>
          <Link
            href="/leeslijst"
            className="border border-ink text-ink text-xs font-black uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
          >
            Naar leeslijst
          </Link>
        </div>
      </div>
    </div>
  );
}
