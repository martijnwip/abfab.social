type AlertVariant = "info" | "success" | "warning" | "error";

const styles: Record<AlertVariant, string> = {
  info:    "bg-krant/60 border-ink/15 text-ink",
  success: "bg-seafoam/25 border-seafoam text-ink",
  warning: "bg-mustard/20 border-mustard/40 text-ink",
  error:   "bg-terracotta/15 border-terracotta/40 text-terracotta",
};

export function Alert({
  variant = "info",
  title,
  children,
}: {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border px-5 py-4 ${styles[variant]}`}>
      {title && (
        <p className="text-[10px] font-black uppercase tracking-[0.16em] mb-1 opacity-60">
          {title}
        </p>
      )}
      <p className="text-[13px] leading-relaxed">{children}</p>
    </div>
  );
}
