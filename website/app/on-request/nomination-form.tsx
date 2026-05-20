"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NominationForm() {
  const [count, setCount] = useState(4);
  const [locatie, setLocatie] = useState<"buurt" | "online">("buurt");
  const [titel, setTitel] = useState("");
  const [auteur, setAuteur] = useState("");
  const [waarom, setWaarom] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from("nominations").insert({
      titel,
      auteur: auteur || null,
      waarom: waarom || null,
      aantal_medelezers: count,
      voorkeur_locatie: locatie,
      email,
    });

    if (error) {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">Ontvangen</p>
        <h3 className="text-[28px] font-black tracking-tight mb-3">Je nominatie is bewaard.</h3>
        <p className="text-[14px] text-ink/60 max-w-sm mx-auto leading-relaxed">
          We nemen contact op zodra het format live gaat of het minimum aan medelezers is bereikt.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* Titel + Auteur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">Titel</label>
          <input
            required
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
            placeholder="bv. Tegen de natuur"
            className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-ink/30"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">Auteur</label>
          <input
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            placeholder="bv. Tommy Wieringa"
            className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-ink/30"
          />
        </div>
      </div>

      {/* Waarom */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">
          Waarom dit boek? (optioneel)
        </label>
        <textarea
          rows={4}
          value={waarom}
          onChange={(e) => setWaarom(e.target.value)}
          placeholder="In één of twee zinnen — wat maakt dit boek de moeite van een avond waard?"
          className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-ink/30 resize-none"
        />
      </div>

      {/* Aantal + Locatie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-3">
            Aantal medelezers (min. 4)
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(4, c - 1))}
              className="w-12 h-12 border border-ink/20 flex items-center justify-center text-lg text-ink/60 hover:border-ink hover:text-ink transition-colors cursor-pointer"
            >
              –
            </button>
            <div className="w-14 h-12 border-t border-b border-ink/20 flex items-center justify-center text-[18px] font-black">
              {count}
            </div>
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(12, c + 1))}
              className="w-12 h-12 border border-ink/20 flex items-center justify-center text-lg text-ink/60 hover:border-ink hover:text-ink transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
          <p className="text-[11px] text-ink/40 mt-2">Inclusief jezelf. Maximaal 12.</p>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-3">
            Voorkeur locatie
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { value: "buurt" as const, label: "Bij mij in de buurt" },
              { value: "online" as const, label: "Online · Zoom" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLocatie(opt.value)}
                className={`flex items-center gap-2.5 px-4 py-3 border text-sm transition-colors cursor-pointer text-left ${
                  locatie === opt.value
                    ? "border-ink text-ink"
                    : "border-ink/20 text-ink/50 hover:border-ink/50"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  locatie === opt.value ? "border-terracotta" : "border-ink/30"
                }`}>
                  {locatie === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-terracotta" />
                  )}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* E-mail */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">
          Je e-mailadres
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naam@voorbeeld.nl"
          className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-ink/30"
        />
      </div>

      {/* Footer */}
      {error && <p className="text-[13px] text-terracotta">{error}</p>}

      <div className="border-t border-ink/12 pt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <p className="text-[11px] text-ink/45 leading-relaxed">
          Door te nomineren ga je akkoord met de huisregels van Tijdgeest.
          Je voorstel is niet bindend — pas als de kring vol is en jij bevestigt,
          gaat de avond door.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto shrink-0 bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? "Verzenden…" : "Nomineer deze titel"}
        </button>
      </div>

    </form>
  );
}
