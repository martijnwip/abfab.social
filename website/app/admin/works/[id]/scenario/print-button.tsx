"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors cursor-pointer bg-transparent border-none"
    >
      Afdrukken
    </button>
  );
}
