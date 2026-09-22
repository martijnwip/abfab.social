"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  workId: string;
  titel: string;
  hasKaart: boolean;
};

export default function GesprekskaartButton({ workId, titel, hasKaart }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/session/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_id: workId }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Fout bij genereren.");
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
    setGenerating(false);
  }

  function handleDelete() {
    if (!confirm(`Gesprekskaart voor "${titel}" verwijderen?`)) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("works").update({ gesprekskaart: null }).eq("id", workId);
      router.refresh();
    });
  }

  const busy = generating || isPending;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleGenerate}
        disabled={busy}
        className="text-[10px] font-black uppercase tracking-widest text-ink/50 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none p-0 m-0"
      >
        {generating ? "Genereren…" : hasKaart ? "Opnieuw genereren" : "Maak gesprekskaart"}
      </button>

      {hasKaart && (
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline disabled:opacity-40 cursor-pointer bg-transparent border-none p-0 m-0"
        >
          Verwijder kaart
        </button>
      )}

      {error && <p className="text-[10px] text-terracotta ml-2">{error}</p>}
    </div>
  );
}
