"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteTagButton({ id, naam }: { id: string; naam: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Tag "${naam}" verwijderen?`)) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("tags").delete().eq("id", id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline disabled:opacity-40 cursor-pointer"
    >
      {isPending ? "…" : "Verwijder"}
    </button>
  );
}
