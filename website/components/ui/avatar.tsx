type AvatarVariant = "member" | "admin" | "soft" | "guest";

const styles: Record<AvatarVariant, string> = {
  member: "bg-terracotta text-paper",
  admin:  "bg-ink text-paper",
  soft:   "bg-terracotta/30 text-terracotta",
  guest:  "bg-terracotta/12 text-terracotta/60",
};

export function Avatar({
  initials,
  variant = "member",
  size = "md",
}: {
  initials: string;
  variant?: AvatarVariant;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-10 h-10 text-[12px]",
    lg: "w-14 h-14 text-[16px]",
  };

  return (
    <div className={`rounded-full flex items-center justify-center font-black uppercase shrink-0 ${styles[variant]} ${sizes[size]}`}>
      {initials.slice(0, 2)}
    </div>
  );
}
