type BadgeVariant = "solid" | "soft" | "outline" | "pending" | "approved" | "rejected" | "member" | "admin";
type StatusVariant = "success" | "warning" | "danger" | "neutral";

const styles: Record<BadgeVariant, string> = {
  solid:    "bg-terracotta text-paper",
  soft:     "bg-terracotta/15 text-terracotta",
  outline:  "border border-terracotta text-terracotta",
  pending:  "bg-mustard/20 text-ink",
  approved: "bg-seafoam/40 text-ink",
  rejected: "bg-terracotta/20 text-terracotta",
  member:   "bg-krant text-ink",
  admin:    "bg-ink text-paper",
};

const statusStyles: Record<StatusVariant, { badge: string; dot: string }> = {
  success: { badge: "bg-seafoam/30 text-ink",       dot: "bg-seafoam" },
  warning: { badge: "bg-mustard/25 text-ink",        dot: "bg-mustard" },
  danger:  { badge: "bg-terracotta/20 text-terracotta", dot: "bg-terracotta" },
  neutral: { badge: "bg-krant/60 text-ink/50",       dot: "bg-ink/30" },
};

export function Badge({
  variant = "soft",
  label,
}: {
  variant?: BadgeVariant;
  label: string;
}) {
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-[0.14em] px-2.5 py-1 ${styles[variant]}`}>
      {label}
    </span>
  );
}

export function StatusBadge({
  variant = "neutral",
  label,
}: {
  variant?: StatusVariant;
  label: string;
}) {
  const s = statusStyles[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {label}
    </span>
  );
}
