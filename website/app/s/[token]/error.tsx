"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[s/[token]/error]", error);
  }, [error]);

  return (
    <div className="bg-paper min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-terracotta mb-4">
          Er ging iets mis
        </p>
        <h1 className="text-[24px] font-black tracking-tight leading-tight mb-4">
          Dit gedeelde scenario kon niet worden geladen.
        </h1>
        <button
          onClick={reset}
          className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink/85 transition-colors cursor-pointer"
        >
          Opnieuw proberen
        </button>
      </div>
    </div>
  );
}
