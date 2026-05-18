"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "@radix-ui/react-icons";

type Option = { value: string; label: string };

type Props = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
};

export function Select({ label: labelText, placeholder = "Selecteer…", options, value, onValueChange, disabled }: Props) {
  return (
    <div className="space-y-1.5">
      {labelText && (
        <Label.Root className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50">
          {labelText}
        </Label.Root>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger className="flex items-center justify-between w-full border border-ink/20 bg-paper px-4 py-3 text-sm text-left focus:outline-none focus:border-ink transition-colors data-[placeholder]:text-ink/30 disabled:opacity-40">
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDownIcon className="text-ink/40" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="bg-paper border border-ink/15 shadow-lg z-50 overflow-hidden">
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
              <ChevronUpIcon />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport>
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-krant/50 focus:bg-krant/50 focus:outline-none data-[highlighted]:bg-krant/50"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ml-auto">
                    <CheckIcon className="text-terracotta" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
              <ChevronDownIcon />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
