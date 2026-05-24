"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WorkHeaderActions({
  workId,
  hasScenario,
}: {
  workId: string;
  hasScenario: boolean;
}) {
  const router = useRouter();
  const [genKaart, setGenKaart] = useState(false);
  const [genScenario, setGenScenario] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function regenerateKaart() {
    setGenKaart(true);
    setError(null);
    const res = await fetch("/api/session/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ work_id: workId }),
    });
    if (!res.ok) setError((await res.json()).error ?? "Fout");
    else router.refresh();
    setGenKaart(false);
  }

  async function regenerateScenario() {
    setGenScenario(true);
    setError(null);
    const res = await fetch("/api/works/scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ work_id: workId }),
    });
    if (!res.ok) setError((await res.json()).error ?? "Fout");
    else router.refresh();
    setGenScenario(false);
  }

  return (
    <div className="flex items-center gap-3 shrink-0">
      {error && <span className="text-[10px] text-terracotta">{error}</span>}
      <HeaderBtn onClick={regenerateKaart} disabled={genKaart || genScenario}>
        {genKaart ? "Genereren…" : "↺ Opnieuw genereren"}
      </HeaderBtn>
      <HeaderBtn onClick={regenerateScenario} disabled={genKaart || genScenario}>
        {genScenario ? "Genereren…" : "↺ Scenario opnieuw"}
      </HeaderBtn>
      {hasScenario && (
        <Link
          href={`/admin/works/${workId}/scenario`}
          className="px-4 py-2 bg-ink text-paper text-[10px] font-black uppercase tracking-widest hover:bg-ink/80 transition-colors"
        >
          → Bekijk scenario
        </Link>
      )}
    </div>
  );
}

function HeaderBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 border border-ink/20 text-[10px] font-black uppercase tracking-widest text-ink/60 hover:text-ink hover:border-ink/40 transition-colors bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
