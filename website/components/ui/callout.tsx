type CalloutVariant = "success" | "warning" | "danger" | "neutral";

const styles: Record<CalloutVariant, { wrap: string; dot: string; label: string }> = {
  success: { wrap: "bg-seafoam/20 border border-seafoam/40",       dot: "bg-seafoam",      label: "text-seafoam" },
  warning: { wrap: "bg-mustard/15 border border-mustard/30",       dot: "bg-mustard",      label: "text-ink/70" },
  danger:  { wrap: "bg-terracotta/12 border border-terracotta/25", dot: "bg-terracotta",   label: "text-terracotta" },
  neutral: { wrap: "bg-krant/50 border border-ink/12",             dot: "bg-ink/30",       label: "text-ink" },
};

type Props = {
  variant?: CalloutVariant;
  label: string;
  children: React.ReactNode;
};

export function Callout({ variant = "neutral", label, children }: Props) {
  const s = styles[variant];
  return (
    <div className={`flex items-start gap-3 px-5 py-4 ${s.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full mt-[6px] shrink-0 ${s.dot}`} />
      <p className="text-[13px] leading-[1.65]">
        <span className={`font-black ${s.label}`}>{label} </span>
        <span className="text-ink/70">{children}</span>
      </p>
    </div>
  );
}
