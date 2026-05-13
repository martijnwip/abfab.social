"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes("rate limit")) {
        setError("Te veel pogingen — wacht even en probeer het opnieuw.");
      } else {
        setError(`Fout: ${error.message}`);
      }
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleTokenSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/50 mb-6">
          Tijdgeest
        </p>

        {sent ? (
          <>
            <h1 className="text-3xl font-black tracking-tight leading-tight mb-4">
              Check je inbox.
            </h1>
            <p className="text-[15px] leading-[1.6] text-ink/60 mb-8">
              We hebben een inloglink gestuurd naar{" "}
              <span className="font-bold text-ink">{email}</span>. Klik op de
              link in de mail, of vul de code in die je hebt ontvangen.
            </p>

            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="token"
                  className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2"
                >
                  Inlogcode
                </label>
                <input
                  id="token"
                  type="text"
                  inputMode="numeric"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value.trim())}
                  placeholder="12345678"
                  maxLength={8}
                  className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm tracking-[0.3em] focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              {error && (
                <p className="text-[13px] text-terracotta">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || token.length < 8}
                className="w-full bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Controleren…" : "Bevestig code"}
              </button>
            </form>

            <button
              onClick={() => { setSent(false); setError(null); setToken(""); }}
              className="mt-4 text-[11px] text-ink/40 hover:text-ink transition-colors"
            >
              Ander e-mailadres gebruiken
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black tracking-tight leading-tight mb-2">
              Inloggen.
            </h1>
            <p className="text-[15px] text-ink/60 mb-8">
              Geen wachtwoord nodig — we sturen je een inloglink.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2"
                >
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              {error && (
                <p className="text-[13px] text-terracotta">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Versturen…" : "Stuur inloglink"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
