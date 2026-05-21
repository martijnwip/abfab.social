"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RemoveSignupButton({ signupId, naam }: { signupId: string; naam: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRemove() {
    if (!confirm(`${naam} verwijderen van deze sessie?`)) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("session_signups").delete().eq("id", signupId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline disabled:opacity-40 cursor-pointer"
    >
      {isPending ? "…" : "Verwijder"}
    </button>
  );
}
