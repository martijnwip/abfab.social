type Props = {
  label?: string;
  title: string;
  description?: string;
  footer?: React.ReactNode;
};

export function Card({ label, title, description, footer }: Props) {
  return (
    <div className="bg-white border border-ink/12 p-6 flex flex-col gap-4">
      {label && (
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-terracotta">
          {label}
        </p>
      )}
      <div className="space-y-2">
        <h3 className="text-[22px] font-black tracking-tight leading-tight">{title}</h3>
        {description && (
          <p className="text-[13px] leading-[1.65] text-ink/60">{description}</p>
        )}
      </div>
      {footer && (
        <div className="flex items-center gap-3 mt-auto pt-2">{footer}</div>
      )}
    </div>
  );
}
