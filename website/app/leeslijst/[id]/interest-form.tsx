"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function InterestForm({ workId, initialEmail }: { workId: string; initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("work_interests")
      .insert({ work_id: workId, email });

    if (error) {
      if (error.code === "23505") {
        // Al aangemeld
        setSubmitted(true);
      } else {
        setError("Er ging iets mis. Probeer het opnieuw.");
      }
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-seafoam shrink-0" />
        <p className="text-[14px] text-ink/60">
          Je ontvangt een mail zodra er een datum bekend is.
        </p>
      </div>
    );
  }

  // Ingelogd: toon alleen knop
  if (initialEmail) {
    return (
      <div className="space-y-2">
        <button
          onClick={async () => {
            setLoading(true);
            setError(null);
            const supabase = createClient();
            const { error } = await supabase
              .from("work_interests")
              .insert({ work_id: workId, email: initialEmail });
            if (error && error.code !== "23505") {
              setError("Er ging iets mis. Probeer het opnieuw.");
            } else {
              setSubmitted(true);
            }
            setLoading(false);
          }}
          disabled={loading}
          className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-ink/85 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Versturen…" : "Houd me op de hoogte"}
        </button>
        {error && <p className="text-[12px] text-terracotta">{error}</p>}
      </div>
    );
  }

  // Niet ingelogd: toon email formulier
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jouw@email.nl"
        className="flex-1 border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-ink/30"
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3 hover:bg-ink/85 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Versturen…" : "Houd me op de hoogte"}
      </button>
      {error && <p className="text-[12px] text-terracotta">{error}</p>}
    </form>
  );
}
