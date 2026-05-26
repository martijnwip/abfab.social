"use client";

import { useState } from "react";

export default function ShareButton({ workId }: { workId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "copied" | "error">("idle");

  async function handleShare() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/works/${workId}/share-scenario`, { method: "POST" });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={status === "loading"}
      className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors cursor-pointer bg-transparent border-none disabled:opacity-40"
    >
      {status === "loading" && "Aanmaken…"}
      {status === "copied" && "✓ Gekopieerd"}
      {status === "error" && "Fout — probeer opnieuw"}
      {status === "idle" && "Deel link"}
    </button>
  );
}
