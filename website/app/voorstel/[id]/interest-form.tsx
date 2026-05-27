"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export default function InterestForm({
  workId,
  aanmeldingen,
  drempel,
}: {
  workId: string;
  aanmeldingen: number;
  drempel: number;
}) {
  const [stage, setStage] = useState<"idle" | "form" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [, startTransition] = useTransition();

  const still = Math.max(0, drempel - aanmeldingen);
  const pct = Math.min(100, Math.round((aanmeldingen / drempel) * 100));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("loading");
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("work_interests")
        .insert({ work_id: workId, email: email.trim().toLowerCase() });
      if (error && error.code === "23505") {
        setStage("success"); // Already registered — treat as success
      } else if (error) {
        setStage("error");
      } else {
        setStage("success");
      }
    });
  }

  return (
    <section className="border-t border-ink/12 pt-8 pb-16">
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8">
        <span className="text-[9px] font-black uppercase tracking-label text-ink/40">Doe je mee?</span>
        <span className="text-[9px] font-mono text-ink/25">§ 04</span>
      </div>

      {/* Counter */}
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[52px] sm:text-[72px] font-black leading-none tracking-tight">
          <span className="text-terracotta">{aanmeldingen}</span>
          <span className="text-ink/25">/ {drempel} lezers aan boord</span>
        </p>
        <div className="hidden sm:block text-right shrink-0 ml-8">
          <p className="text-[9px] font-black uppercase tracking-label text-ink/35 mb-1">Voortgang</p>
          <p className="text-[11px] font-mono text-ink/50">{pct}% · drempel {drempel}/{drempel}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-ink/8 w-full mb-2 overflow-hidden">
        <div className="h-full bg-terracotta transition-all" style={{ width: `${pct}%` }} />
      </div>

      {/* Tick marks */}
      <div className="flex mb-8">
        {Array.from({ length: drempel }, (_, i) => (
          <div
            key={i}
            className="flex-1 text-[9px] font-mono text-ink/30 pt-1"
            style={{ paddingLeft: i === 0 ? 0 : undefined }}
          >
            {i + 1 === drempel ? `${i + 1} · min.` : i + 1}
          </div>
        ))}
      </div>

      {still > 0 && (
        <p className="text-[14px] text-ink/65 mb-6 flex items-start gap-2">
          <span className="text-terracotta shrink-0 mt-0.5">■</span>
          <span>Nog <strong>{still} aanmeling{still !== 1 ? "en" : ""}</strong> nodig om een avond te plannen.</span>
        </p>
      )}

      <p className="text-[16px] sm:text-[18px] text-ink/75 leading-relaxed mb-8 max-w-xl">
        Klinkt goed? Eén klik en je staat erbij — we plannen pas een datum wanneer we met {drempel} zijn.
        <span className="block text-[13px] text-ink/40 mt-1">Geen verplichtingen. Afmelden kan altijd.</span>
      </p>

      {stage === "success" ? (
        <div className="flex items-center gap-3 py-4 border-l-2 border-terracotta pl-5">
          <p className="text-[15px] font-black text-ink">
            ✓ Je staat op de lijst.{" "}
            <span className="font-normal text-ink/55">We laten het je weten zodra we de groep vol hebben.</span>
          </p>
        </div>
      ) : stage === "form" || stage === "loading" || stage === "error" ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="je@emailadres.nl"
            required
            className="flex-1 border border-ink/20 bg-paper px-4 py-3.5 text-[14px] focus:outline-none focus:border-ink/50 transition-colors"
          />
          <button
            type="submit"
            disabled={stage === "loading"}
            className="bg-terracotta text-paper text-[10px] font-black uppercase tracking-label px-8 py-3.5 hover:bg-terracotta/85 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            {stage === "loading" ? "Aanmelden…" : "Bevestig →"}
          </button>
          {stage === "error" && (
            <p className="text-[11px] text-terracotta mt-1">Er ging iets mis — probeer het opnieuw.</p>
          )}
        </form>
      ) : (
        <button
          onClick={() => setStage("form")}
          className="bg-terracotta text-paper text-[11px] font-black uppercase tracking-label px-10 py-4 hover:bg-terracotta/85 transition-colors cursor-pointer"
        >
          Ik doe mee →
        </button>
      )}
    </section>
  );
}
