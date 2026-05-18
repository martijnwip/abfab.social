"use client";

type Props = {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  onChange?: (v: number) => void;
};

export function Slider({ label, value = 50, min = 0, max = 100, onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">{label}</p>
      )}
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-px bg-ink/15" />
        <div className="absolute left-0 h-px bg-terracotta" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="absolute inset-x-0 w-full opacity-0 cursor-pointer h-5"
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-terracotta border-2 border-paper shadow -translate-x-1/2"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}
