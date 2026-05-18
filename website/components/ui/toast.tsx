type ToastVariant = "dark" | "accent";

type Props = {
  variant?: ToastVariant;
  message: React.ReactNode;
  action?: { label: string; onClick?: () => void };
};

const styles: Record<ToastVariant, { wrap: string; dot: string; action: string }> = {
  dark:   { wrap: "bg-ink text-paper",           dot: "bg-terracotta", action: "text-terracotta font-black hover:underline" },
  accent: { wrap: "bg-terracotta text-paper",    dot: "bg-paper/60",   action: "text-paper font-black hover:underline" },
};

export function Toast({ variant = "dark", message, action }: Props) {
  const s = styles[variant];
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-3 text-[13px] shadow-[0_2px_8px_rgba(26,26,26,0.12)] ${s.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      <span className="leading-snug">{message}</span>
      {action && (
        <button onClick={action.onClick} className={`ml-1 shrink-0 cursor-pointer ${s.action}`}>
          {action.label}
        </button>
      )}
    </div>
  );
}
