import * as Label from "@radix-ui/react-label";

type InputSize = "1" | "2" | "3";

const sizeStyles: Record<InputSize, string> = {
  "1": "px-3 py-1.5 text-[12px]",
  "2": "px-4 py-2.5 text-sm",
  "3": "px-4 py-3 text-base",
};

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  inputSize?: InputSize;
};

export function Input({
  label: labelText,
  hint,
  error,
  id,
  prefix,
  inputSize = "2",
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? labelText?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {labelText && (
        <Label.Root
          htmlFor={inputId}
          className="block text-[11px] font-black text-ink"
        >
          {labelText}
        </Label.Root>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35 flex items-center">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full border ${error ? "border-terracotta" : "border-ink/20"} bg-paper
            ${prefix ? "pl-8" : ""} ${sizeStyles[inputSize]}
            focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20
            placeholder:text-ink/30 disabled:opacity-40 transition-colors ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-[11px] text-ink/45">{hint}</p>}
      {error && <p className="text-[11px] text-terracotta">{error}</p>}
    </div>
  );
}
