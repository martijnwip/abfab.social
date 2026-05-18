"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as Label from "@radix-ui/react-label";

type Props = {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function Switch({ id, label, checked, onCheckedChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="relative w-9 h-5 bg-ink/15 data-[state=checked]:bg-terracotta transition-colors focus:outline-none disabled:opacity-40"
      >
        <SwitchPrimitive.Thumb className="block w-3.5 h-3.5 bg-paper translate-x-0.5 data-[state=checked]:translate-x-[18px] transition-transform shadow-sm" />
      </SwitchPrimitive.Root>
      <Label.Root htmlFor={id} className="text-sm cursor-pointer select-none">
        {label}
      </Label.Root>
    </div>
  );
}
