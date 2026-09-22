"use client";

import Link from "next/link";
import { useSessionSignup } from "@/lib/hooks/use-session-signup";

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
  const { signedUp, isPending, error, signUp, cancelSignup } = useSessionSignup(
    sessionId,
    memberId,
    initialSignedUp
  );

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
          onClick={cancelSignup}
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
        onClick={signUp}
        disabled={isPending}
        className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Aanmelden…" : "Reserveer een plek →"}
      </button>
      {error && <p className="text-[12px] text-terracotta">{error}</p>}
    </div>
  );
}
