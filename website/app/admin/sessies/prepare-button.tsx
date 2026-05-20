"use client";

import { useState } from "react";

export default function PrepareButton({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<unknown>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handlePrepare() {
    setStatus("loading");
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/session/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Onbekende fout");
        setStatus("error");
      } else {
        setResult(json);
        setStatus("done");
      }
    } catch (err) {
      setErrorMsg(String(err));
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handlePrepare}
        disabled={status === "loading"}
        className="text-xs font-black uppercase tracking-widest bg-terracotta text-paper px-4 py-2 hover:bg-terracotta/90 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {status === "loading" ? "Agent bezig…" : "Bereid voor"}
      </button>

      {status === "loading" && (
        <p className="text-[12px] text-ink/40 animate-pulse">
          Claude verzamelt informatie via Open Library, Google Books, Guardian, Wikipedia en YouTube…
        </p>
      )}

      {status === "error" && (
        <p className="text-[12px] text-terracotta">{errorMsg}</p>
      )}

      {status === "done" && result && (
        <details className="border border-ink/10 bg-white">
          <summary className="px-4 py-3 text-[11px] font-black uppercase tracking-widest cursor-pointer text-ink/60 hover:text-ink">
            Sessie-voorbereiding bekijken
          </summary>
          <pre className="px-4 py-4 text-[11px] font-mono text-ink/70 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
