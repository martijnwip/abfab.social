"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScenarioButton({
  workId,
  hasScenario,
}: {
  workId: string;
  hasScenario: boolean;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/works/scenario", {
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

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="text-[10px] font-black uppercase tracking-widest text-ink/50 hover:text-ink disabled:opacity-40 cursor-pointer bg-transparent border-none p-0 m-0 transition-colors"
      >
        {generating
          ? "Genereren…"
          : hasScenario
          ? "Scenario opnieuw"
          : "Genereer scenario"}
      </button>
      {error && <p className="text-[10px] text-terracotta">{error}</p>}
    </div>
  );
}
