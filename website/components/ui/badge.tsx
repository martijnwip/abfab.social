type BadgeVariant = "pending" | "approved" | "rejected" | "member" | "admin";

const styles: Record<BadgeVariant, string> = {
  pending:  "bg-mustard/20 text-ink",
  approved: "bg-seafoam/40 text-ink",
  rejected: "bg-terracotta/20 text-terracotta",
  member:   "bg-krant text-ink",
  admin:    "bg-ink text-paper",
};

export function Badge({ variant, label }: { variant: BadgeVariant; label?: string }) {
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-[0.14em] px-2.5 py-1 ${styles[variant]}`}>
      {label ?? variant}
    </span>
  );
}
