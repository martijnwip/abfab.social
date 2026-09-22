"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useSessionSignup(sessionId: string, memberId: string | null, initialSignedUp: boolean) {
  const [signedUp, setOptimisticSignedUp] = useOptimistic(initialSignedUp);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function signUp() {
    setError(null);
    startTransition(async () => {
      setOptimisticSignedUp(true);
      const supabase = createClient();
      const { error } = await supabase
        .from("session_signups")
        .insert({ session_id: sessionId, member_id: memberId });
      if (error) setError("Er ging iets mis. Probeer het opnieuw.");
      else router.refresh();
    });
  }

  function cancelSignup() {
    startTransition(async () => {
      setOptimisticSignedUp(false);
      const supabase = createClient();
      await supabase
        .from("session_signups")
        .delete()
        .eq("session_id", sessionId)
        .eq("member_id", memberId!);
      router.refresh();
    });
  }

  return { signedUp, isPending, error, signUp, cancelSignup };
}
