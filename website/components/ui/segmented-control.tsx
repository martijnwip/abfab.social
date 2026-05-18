"use client";

import { useState } from "react";

type Option = { value: string; label: string };

type Props = {
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export function SegmentedControl({ options, defaultValue, onChange }: Props) {
  const [selected, setSelected] = useState(defaultValue ?? options[0]?.value);

  function handleSelect(value: string) {
    setSelected(value);
    onChange?.(value);
  }

  return (
    <div className="inline-flex bg-krant/60 border border-ink/12 p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          className={`px-4 py-1.5 text-xs font-black uppercase tracking-[0.1em] transition-colors cursor-pointer
            ${selected === opt.value
              ? "bg-paper text-ink shadow-sm"
              : "text-ink/45 hover:text-ink"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
