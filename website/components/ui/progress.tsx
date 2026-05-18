type Props = {
  label?: string;
  value: number;
  max?: number;
};

export function Progress({ label, value, max = 100 }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">{label}</p>
      )}
      <div className="h-1.5 bg-ink/12 w-full overflow-hidden">
        <div
          className="h-full bg-terracotta transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
