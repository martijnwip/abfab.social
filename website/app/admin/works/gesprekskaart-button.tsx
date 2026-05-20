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
      setError(String(err));
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
    <div className="flex flex-col gap-1.5 mt-1">
      <button
        onClick={handleGenerate}
        disabled={busy || hasKaart}
        className="block w-full text-left p-0 m-0 bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-ink/50 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        {generating ? "Genereren…" : "Maak gesprekskaart"}
      </button>

      {hasKaart && (
        <button
          onClick={handleDelete}
          disabled={busy}
          className="block w-full text-left p-0 m-0 bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline disabled:opacity-40 cursor-pointer"
        >
          Verwijder gesprekskaart
        </button>
      )}

      {error && <p className="text-[10px] text-terracotta">{error}</p>}
    </div>
  );
}
