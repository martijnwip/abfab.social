"use client";

import { useState, useTransition } from "react";
import { deleteWork } from "./actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function DeleteButton({ id, titel }: { id: string; titel: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(() => deleteWork(id));
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="block w-full text-left p-0 m-0 bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline disabled:opacity-40 transition-colors cursor-pointer"
      >
        {isPending ? "…" : "Verwijderen"}
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`"${titel}" verwijderen?`}
        description="Dit kan niet ongedaan worden gemaakt. Alle gekoppelde sessies blijven behouden."
        confirmLabel="Verwijderen"
        confirmVariant="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
}
