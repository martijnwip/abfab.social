"use client";

import { useTransition } from "react";
import { deleteWork } from "./actions";

export default function DeleteButton({ id, titel }: { id: string; titel: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`"${titel}" verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    startTransition(() => deleteWork(id));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-[0.1em] text-terracotta hover:underline disabled:opacity-40 mt-1"
    >
      {isPending ? "…" : "Verwijderen"}
    </button>
  );
}
