import * as Label from "@radix-ui/react-label";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label: labelText, hint, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? labelText?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="space-y-1.5">
      {labelText && (
        <Label.Root
          htmlFor={inputId}
          className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50"
        >
          {labelText}
        </Label.Root>
      )}
      <input
        id={inputId}
        className={`w-full border ${error ? "border-terracotta" : "border-ink/20"} bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-ink/30 disabled:opacity-40 ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-[11px] text-ink/40">{hint}</p>}
      {error && <p className="text-[11px] text-terracotta">{error}</p>}
    </div>
  );
}
