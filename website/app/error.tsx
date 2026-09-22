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
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-terracotta mb-4">
          Er ging iets mis
        </p>
        <h1 className="text-[28px] font-black tracking-tight leading-tight mb-4">
          Deze pagina kon niet worden geladen.
        </h1>
        <p className="text-[14px] leading-relaxed text-ink/60 mb-8">
          Probeer het opnieuw, of ga terug naar de homepage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink/85 transition-colors cursor-pointer"
          >
            Opnieuw proberen
          </button>
          <Link
            href="/"
            className="border border-ink text-ink text-xs font-black uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
          >
            Naar home
          </Link>
        </div>
      </div>
    </div>
  );
}
