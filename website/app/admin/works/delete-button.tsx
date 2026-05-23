"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteWork } from "./actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function DeleteButton({
  id,
  titel,
  redirectTo,
  className,
}: {
  id: string;
  titel: string;
  redirectTo?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  function handleConfirm() {
    setErrorMsg(null);
    startTransition(async () => {
      const result = await deleteWork(id);
      if (result.error) {
        setErrorMsg(result.error);
        setOpen(false);
      } else if (redirectTo) {
        router.push(redirectTo);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => { setErrorMsg(null); setOpen(true); }}
        disabled={isPending}
        className={className ?? "block w-full text-left p-0 m-0 bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline disabled:opacity-40 transition-colors cursor-pointer"}
      >
        {isPending ? "…" : "Verwijderen"}
      </button>

      {errorMsg && (
        <p className="text-[10px] text-terracotta leading-snug mt-1">{errorMsg}</p>
      )}

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`"${titel}" verwijderen?`}
        description="Dit kan niet ongedaan worden gemaakt."
        confirmLabel="Verwijderen"
        confirmVariant="danger"
        onConfirm={handleConfirm}
      />
    </>
  );
}
