import * as Label from "@radix-ui/react-label";

type Props = React.ComponentProps<"textarea"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Textarea({ label: labelText, hint, error, id, className = "", ...props }: Props) {
  const inputId = id ?? labelText?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {labelText && (
        <Label.Root htmlFor={inputId} className="block text-[11px] font-black text-ink">
          {labelText}
        </Label.Root>
      )}
      <textarea
        id={inputId}
        rows={5}
        className={`w-full border ${error ? "border-terracotta" : "border-ink/20"} bg-paper px-4 py-3 text-sm
          focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20
          placeholder:text-ink/30 disabled:opacity-40 transition-colors resize-y ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-[11px] text-ink/45">{hint}</p>}
      {error && <p className="text-[11px] text-terracotta">{error}</p>}
    </div>
  );
}
