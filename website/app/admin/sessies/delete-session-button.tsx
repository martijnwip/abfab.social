"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSession } from "./actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function DeleteSessionButton({
  id,
  label,
  redirectAfter = false,
}: {
  id: string;
  label: string;
  redirectAfter?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  function handleConfirm() {
    setErrorMsg(null);
    startTransition(async () => {
      const result = await deleteSession(id, redirectAfter);
      if (result?.error) {
        setErrorMsg(result.error);
        setOpen(false);
      } else if (!redirectAfter) {
        router.refresh();
      }
    });
  }

  return (
    <>
      <button
        onClick={() => { setErrorMsg(null); setOpen(true); }}
        disabled={isPending}
        className="shrink-0 text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline disabled:opacity-40 transition-colors cursor-pointer"
      >
        {isPending ? "…" : label}
      </button>

      {errorMsg && (
        <p className="text-[10px] text-terracotta leading-snug mt-1">{errorMsg}</p>
      )}

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Sessie verwijderen?"
        description="Alle aanmeldingen voor deze sessie worden ook verwijderd. Dit kan niet ongedaan worden gemaakt."
        confirmLabel="Verwijderen"
        confirmVariant="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
}
