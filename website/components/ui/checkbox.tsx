"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as Label from "@radix-ui/react-label";
import { CheckIcon } from "@radix-ui/react-icons";

type Props = {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({ id, label, checked, onCheckedChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-3">
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
        disabled={disabled}
        className="w-4 h-4 border border-ink/30 bg-paper flex items-center justify-center focus:outline-none focus:border-ink data-[state=checked]:bg-ink data-[state=checked]:border-ink disabled:opacity-40 transition-colors"
      >
        <CheckboxPrimitive.Indicator>
          <CheckIcon className="text-paper w-3 h-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <Label.Root htmlFor={id} className="text-sm cursor-pointer select-none">
        {label}
      </Label.Root>
    </div>
  );
}
