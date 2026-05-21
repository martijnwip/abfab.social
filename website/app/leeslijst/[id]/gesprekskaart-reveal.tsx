"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

type Item = { vraag: string; toelichting: string };

export default function GesprekskaartReveal({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40">
            Gesprekskaart
          </p>
          <button
            onClick={() => setRevealed(false)}
            className="text-[10px] text-ink/30 hover:text-ink transition-colors cursor-pointer"
          >
            Verbergen
          </button>
        </div>
        <ol className="space-y-6">
          {items.map((item, i) => (
            <li key={i} className="grid grid-cols-[24px_1fr] gap-4">
              <span className="text-[11px] font-black text-terracotta pt-0.5">{i + 1}.</span>
              <div>
                <p className="text-[15px] font-black leading-snug mb-1.5">{item.vraag}</p>
                <p className="text-[13px] text-ink/55 leading-relaxed">{item.toelichting}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button className="mt-6 text-xs font-black uppercase tracking-[0.12em] border border-ink/20 px-5 py-2.5 text-ink/60 hover:border-ink hover:text-ink transition-colors cursor-pointer">
          Bekijk gesprekskaart
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-ink/30 z-40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-paper border border-ink/15 w-full max-w-sm p-8 shadow-[0_4px_24px_rgba(26,26,26,0.12)] focus:outline-none">
          <DialogPrimitive.Title className="text-[20px] font-black tracking-tight mb-3">
            Spoiler alert
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-[14px] text-ink/60 leading-relaxed mb-8">
            De gesprekskaart bevat vragen die dieper ingaan op het boek. Je leest ze het beste ná het lezen — ze kunnen de leeservaring beïnvloeden.
          </DialogPrimitive.Description>
          <div className="flex gap-3">
            <button
              onClick={() => { setOpen(false); setRevealed(true); }}
              className="flex-1 bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] py-3 hover:bg-ink/85 transition-colors cursor-pointer"
            >
              Ik heb het boek uit
            </button>
            <DialogPrimitive.Close className="flex-1 border border-ink/20 text-ink text-xs font-black uppercase tracking-[0.12em] py-3 hover:border-ink transition-colors cursor-pointer">
              Annuleren
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
