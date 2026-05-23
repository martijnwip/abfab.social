"use client";

import { useState } from "react";

function renderScenario(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={key++} className="h-3" />);
    } else if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      const content = trimmed.replace(/^#{2,3}\s+/, "");
      elements.push(
        <p key={key++} className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mt-6 mb-2 pb-2 border-b border-ink/10">
          {content}
        </p>
      );
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push(
        <p key={key++} className="text-[13px] font-black text-ink mt-3 mb-1">
          {trimmed.slice(2, -2)}
        </p>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <p key={key++} className="text-[13px] text-ink/75 leading-relaxed pl-4 relative before:absolute before:left-0 before:content-['–'] before:text-ink/30">
          {trimmed.slice(2)}
        </p>
      );
    } else {
      // Inline bold: replace **text** with <strong>
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={key++} className="text-[13px] text-ink/80 leading-relaxed">
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={i} className="font-black text-ink">{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    }
  }

  return elements;
}

export default function ScenarioDisplay({ scenario }: { scenario: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-16 pt-10 border-t border-ink/10 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40">
          Gespreksscenario
        </p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[10px] text-ink/30 hover:text-ink transition-colors cursor-pointer"
        >
          {open ? "Verbergen" : "Tonen"}
        </button>
      </div>

      {open && (
        <div className="space-y-1">
          {renderScenario(scenario)}
        </div>
      )}
    </div>
  );
}
