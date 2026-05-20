"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  sessionId: string;
  memberId: string | null;
  memberStatus: "pending" | "approved" | "rejected" | null;
  alreadySignedUp: boolean;
  loginUrl: string;
};

export default function SessionSignupClient({
  sessionId,
  memberId,
  memberStatus,
  alreadySignedUp: initialSignedUp,
  loginUrl,
}: Props) {
  const [signedUp, setSignedUp] = useState(initialSignedUp);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Niet ingelogd
  if (!memberStatus) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          href={loginUrl}
          className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-ink/85 transition-colors"
        >
          Log in om je aan te melden
        </Link>
        <p className="text-[12px] text-ink/45">
          Nog geen account?{" "}
          <Link href={loginUrl} className="underline hover:text-ink transition-colors">
            Registreer je
          </Link>
        </p>
      </div>
    );
  }

  // Pending
  if (memberStatus === "pending") {
    return (
      <div className="flex items-start gap-3 border border-ink/12 px-5 py-4 max-w-md">
        <span className="w-2 h-2 rounded-full bg-mustard shrink-0 mt-1.5" />
        <p className="text-[13px] text-ink/65 leading-relaxed">
          Je account wordt nog beoordeeld. Zodra je bent goedgekeurd kun je
          je aanmelden voor avonden.
        </p>
      </div>
    );
  }

  // Rejected
  if (memberStatus === "rejected") {
    return (
      <p className="text-[13px] text-ink/50">
        Je account is helaas niet goedgekeurd. Neem contact op voor meer informatie.
      </p>
    );
  }

  // Goedgekeurd — al aangemeld
  if (signedUp) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-seafoam" />
          <span className="text-[14px] font-black">Je bent aangemeld voor deze avond.</span>
        </div>
        <button
          onClick={() => {
            startTransition(async () => {
              const supabase = createClient();
              await supabase
                .from("session_signups")
                .delete()
                .eq("session_id", sessionId)
                .eq("member_id", memberId!);
              setSignedUp(false);
              router.refresh();
            });
          }}
          disabled={isPending}
          className="text-[11px] text-ink/40 hover:text-terracotta underline transition-colors cursor-pointer disabled:opacity-40"
        >
          {isPending ? "…" : "Afmelden"}
        </button>
      </div>
    );
  }

  // Goedgekeurd — nog niet aangemeld
  return (
    <div className="space-y-2">
      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const supabase = createClient();
            const { error } = await supabase
              .from("session_signups")
              .insert({ session_id: sessionId, member_id: memberId });
            if (error) {
              setError("Er ging iets mis. Probeer het opnieuw.");
            } else {
              setSignedUp(true);
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Aanmelden…" : "Reserveer een plek →"}
      </button>
      {error && <p className="text-[12px] text-terracotta">{error}</p>}
    </div>
  );
}
