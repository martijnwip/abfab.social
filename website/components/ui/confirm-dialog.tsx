"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Bevestigen",
  confirmVariant = "primary",
  onConfirm,
}: Props) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-ink/30 z-40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-paper border border-ink/15 w-full max-w-sm p-8 shadow-[0_4px_24px_rgba(26,26,26,0.12)] focus:outline-none">
          <DialogPrimitive.Title className="text-[18px] font-black tracking-tight mb-2">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="text-[13px] text-ink/60 leading-relaxed mb-6">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="flex gap-3 justify-end">
            <DialogPrimitive.Close className="text-xs font-black uppercase tracking-[0.12em] px-4 py-2.5 border border-ink/20 text-ink hover:border-ink transition-colors cursor-pointer">
              Annuleren
            </DialogPrimitive.Close>
            <button
              onClick={() => { onConfirm(); onOpenChange(false); }}
              className={`text-xs font-black uppercase tracking-[0.12em] px-4 py-2.5 cursor-pointer transition-colors ${
                confirmVariant === "danger"
                  ? "bg-terracotta text-paper hover:bg-terracotta/90"
                  : "bg-ink text-paper hover:bg-ink/85"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
