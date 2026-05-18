"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

type Option = { value: string; label: string; disabled?: boolean };

type Props = {
  options: Option[];
  value?: string;
  onValueChange?: (v: string) => void;
  orientation?: "horizontal" | "vertical";
};

export function RadioGroup({ options, value, onValueChange, orientation = "vertical" }: Props) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className={`flex gap-3 ${orientation === "horizontal" ? "flex-row items-center" : "flex-col"}`}
    >
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2.5">
          <RadioGroupPrimitive.Item
            value={opt.value}
            disabled={opt.disabled}
            className="w-4 h-4 rounded-full border border-ink/30 bg-paper flex items-center justify-center
              focus:outline-none data-[state=checked]:border-terracotta disabled:opacity-40 transition-colors"
          >
            <RadioGroupPrimitive.Indicator className="w-2 h-2 rounded-full bg-terracotta" />
          </RadioGroupPrimitive.Item>
          <label className={`text-sm select-none ${opt.disabled ? "opacity-40" : "cursor-pointer"}`}>
            {opt.label}
          </label>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
