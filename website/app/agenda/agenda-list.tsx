"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionSignup } from "@/lib/hooks/use-session-signup";

type Work = {
  id: string;
  originele_titel: string;
  auteur: string;
  cover_image_url: string | null;
  tags: string[];
};

type SessionItem = {
  id: string;
  datum: string;
  tijdstip: string | null;
  eindtijd: string | null;
  locatie: string | null;
  notitie: string | null;
  maxDeelnemers: number;
  signupCount: number;
  signupAvatars: string[];
  hasScenario: boolean;
  work: Work;
};

type MonthGroup = { label: string; sessions: SessionItem[] };

type Props = {
  sessions: SessionItem[];
  memberId: string | null;
  memberStatus: "pending" | "approved" | "rejected" | null;
  mySignupIds: string[];
  isLoggedIn: boolean;
};

function groupByMonth(sessions: SessionItem[]): MonthGroup[] {
  const map = new Map<string, SessionItem[]>();
  for (const s of sessions) {
    const d = new Date(s.datum);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return Array.from(map.entries()).map(([, items]) => {
    const d = new Date(items[0].datum);
    const month = d.toLocaleDateString("nl-NL", { month: "long" });
    return {
      label: `${month.charAt(0).toUpperCase() + month.slice(1)} ${d.getFullYear()}`,
      sessions: items,
    };
  });
}

function calendarUrl(s: SessionItem): string {
  const d = new Date(s.datum);
  const [sh, sm] = (s.tijdstip ?? "20:00").slice(0, 5).split(":").map(Number);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), sh, sm);
  let end: Date;
  if (s.eindtijd) {
    const [eh, em] = s.eindtijd.slice(0, 5).split(":").map(Number);
    end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), eh, em);
  } else {
    end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  }
  const fmt = (dt: Date) => dt.toISOString().replace(/[-:]/g, "").split(".")[0];
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `Tijdgeest · ${s.work.originele_titel}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: s.notitie ?? "",
    location: s.locatie ?? "",
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function BookCoverMini({ work }: { work: Work }) {
  return (
    <div className="w-22 shrink-0 border border-ink/10 bg-krant/30 overflow-hidden">
      <div className="px-2 pt-2 pb-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="w-4 h-4 rounded-full bg-ink flex items-center justify-center shrink-0">
            <span className="text-[7px] font-black text-paper">T</span>
          </div>
          <span className="text-[6px] font-black uppercase tracking-label text-ink/40">Tijdgeest</span>
        </div>
        <p className="text-[7px] font-black text-terracotta leading-tight truncate">{work.auteur}</p>
        <p className="text-[8px] font-black leading-tight tracking-tight line-clamp-2 mt-0.5">{work.originele_titel}</p>
      </div>
      <div className="relative aspect-3/2 overflow-hidden mt-1.5">
        {work.cover_image_url ? (
          <Image src={work.cover_image_url} alt={work.originele_titel} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-terracotta" />
        )}
      </div>
    </div>
  );
}

function SpoilerDialog({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-6">
      <div className="bg-paper max-w-sm w-full p-8 shadow-xl">
        <p className="text-[9px] font-black uppercase tracking-label text-terracotta mb-4">Let op</p>
        <h2 className="text-[22px] font-black leading-tight mb-3">
          Deze pagina bevat<br /><em className="text-terracotta italic">spoilers.</em>
        </h2>
        <p className="text-[13px] text-ink/60 leading-relaxed mb-8">
          Het scenario onthult de verhaallijn, personages en thema's van het boek.
          Lees dit alleen als je het boek al uit hebt.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/agenda/${sessionId}/scenario`)}
            className="flex-1 bg-ink text-paper text-[10px] font-black uppercase tracking-[0.12em] py-3 hover:bg-ink/85 transition-colors cursor-pointer"
          >
            Toch bekijken →
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-ink/20 text-ink text-[10px] font-black uppercase tracking-[0.12em] py-3 hover:border-ink/50 transition-colors cursor-pointer"
          >
            Annuleren
          </button>
        </div>
      </div>
    </div>
  );
}

function SignupAction({
  session,
  memberId,
  memberStatus,
  initialSignedUp,
  isLoggedIn,
}: {
  session: SessionItem;
  memberId: string | null;
  memberStatus: "pending" | "approved" | "rejected" | null;
  initialSignedUp: boolean;
  isLoggedIn: boolean;
}) {
  const { signedUp, isPending, error, signUp, cancelSignup } = useSessionSignup(
    session.id,
    memberId,
    initialSignedUp
  );
  const [showSpoilerDialog, setShowSpoilerDialog] = useState(false);

  // Scenario unlocked 1 week before session date
  const sessionDate = new Date(session.datum);
  const unlockDate = new Date(sessionDate);
  unlockDate.setDate(unlockDate.getDate() - 7);
  const scenarioUnlocked = new Date() >= unlockDate;

  if (!isLoggedIn) {
    return (
      <Link
        href="/login?next=/agenda"
        className="block w-full border border-ink text-ink text-[10px] font-black uppercase tracking-[0.12em] px-4 py-3 text-center hover:bg-ink hover:text-paper transition-colors"
      >
        Aanmelden
      </Link>
    );
  }

  if (memberStatus === "pending") {
    return (
      <p className="text-[11px] text-mustard font-black uppercase tracking-widest">
        Aanvraag in behandeling
      </p>
    );
  }

  if (memberStatus !== "approved") return null;

  const isFull = session.signupCount >= session.maxDeelnemers;

  if (signedUp) {
    return (
      <>
        {showSpoilerDialog && (
          <SpoilerDialog sessionId={session.id} onClose={() => setShowSpoilerDialog(false)} />
        )}
        <div className="space-y-2">
          {session.hasScenario && scenarioUnlocked && (
            <button
              onClick={() => setShowSpoilerDialog(true)}
              className="block w-full bg-terracotta text-paper text-[10px] font-black uppercase tracking-[0.12em] px-4 py-3 text-center hover:bg-terracotta/85 transition-colors cursor-pointer"
            >
              Bekijk scenario →
            </button>
          )}
          <a
            href={calendarUrl(session)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-ink text-ink text-[10px] font-black uppercase tracking-[0.12em] px-4 py-3 text-center hover:bg-ink hover:text-paper transition-colors"
          >
            Voeg toe aan agenda
          </a>
          <button
            onClick={cancelSignup}
            disabled={isPending}
            className="block w-full text-center text-[11px] text-ink/40 hover:text-terracotta underline transition-colors cursor-pointer disabled:opacity-40"
          >
            {isPending ? "…" : "Afmelden"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={signUp}
        disabled={isPending || isFull}
        className="block w-full bg-ink text-paper text-[10px] font-black uppercase tracking-[0.12em] px-4 py-3 text-center hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "Aanmelden…" : isFull ? "Vol" : "Aanmelden →"}
      </button>
      {error && <p className="text-[11px] text-terracotta">{error}</p>}
    </div>
  );
}

export default function AgendaList({ sessions, memberId, memberStatus, mySignupIds, isLoggedIn }: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Verzamel unieke tags uit sessies
  const allTags = Array.from(
    new Set(sessions.flatMap((s) => s.work?.tags ?? []))
  ).sort();

  // Filter logica
  const filtered =
    activeFilter === "mijn"
      ? sessions.filter((s) => mySignupIds.includes(s.id))
      : activeFilter
      ? sessions.filter((s) => (s.work?.tags ?? []).includes(activeFilter))
      : sessions;

  const groups = groupByMonth(filtered);

  const btnClass = (active: boolean) =>
    `text-[11px] font-black uppercase tracking-widest px-4 py-2 border transition-colors cursor-pointer ${
      active ? "bg-ink text-paper border-ink" : "border-ink/20 text-ink/60 hover:border-ink/50"
    }`;

  if (sessions.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-sm text-ink/40">Momenteel zijn er geen avonden gepland.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          <button className={btnClass(activeFilter === null)} onClick={() => setActiveFilter(null)}>
            Alle avonden <span className={activeFilter === null ? "text-paper/60" : "text-ink/35"}>{sessions.length}</span>
          </button>
          {isLoggedIn && (
            <button className={btnClass(activeFilter === "mijn")} onClick={() => setActiveFilter("mijn")}>
              Mijn aanmeldingen <span className={activeFilter === "mijn" ? "text-paper/60" : "text-ink/35"}>{mySignupIds.length}</span>
            </button>
          )}
          {allTags.map((tag) => (
            <button key={tag} className={btnClass(activeFilter === tag)} onClick={() => setActiveFilter(tag)}>
              {tag}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-label text-ink/40 hidden sm:block">Weergave</span>
          <div className="flex">
            <button className="text-[10px] font-black uppercase tracking-[0.12em] px-4 py-2 bg-ink text-paper cursor-default">
              Lijst
            </button>
            <button className="text-[10px] font-black uppercase tracking-[0.12em] px-4 py-2 border border-l-0 border-ink/20 text-ink/40 cursor-not-allowed" disabled>
              Maandweergave
            </button>
          </div>
        </div>
      </div>

      {/* Sessies per maand */}
      <div className="space-y-0">
        {groups.length === 0 ? (
          <p className="text-sm text-ink/40">Geen avonden gevonden.</p>
        ) : (
          groups.map((group, i) => (
            <div key={group.label} className={i > 0 ? "border-t border-ink/15 pt-16 mt-16" : ""}>

              {/* Maand header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-ink/15 mb-0">
                <h2 className="font-editorial text-[42px] leading-none">
                  <span className="italic">{group.label.split(" ")[0]}</span>
                  {" "}
                  <span className="text-ink/30 not-italic text-[36px]">{group.label.split(" ")[1]}</span>
                </h2>
                <span className="text-[10px] font-black uppercase tracking-label text-ink/40">
                  {group.sessions.length} avond{group.sessions.length !== 1 ? "en" : ""}
                </span>
              </div>

              {/* Sessie rijen */}
              <div className="divide-y divide-ink/8">
                {group.sessions.map((s) => {
                  const d = new Date(s.datum);
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = d.toLocaleDateString("nl-NL", { month: "long" });
                  const weekday = d.toLocaleDateString("nl-NL", { weekday: "short" }).toUpperCase();
                  const startTijd = (s.tijdstip ?? "20:00").slice(0, 5);
                  const eindTijd = s.eindtijd ? s.eindtijd.slice(0, 5) : null;
                  const tijdStr = eindTijd ? `${startTijd} – ${eindTijd}` : startTijd;
                  const isSignedUp = mySignupIds.includes(s.id);
                  const spotsLeft = s.maxDeelnemers - s.signupCount;
                  const fillPct = Math.min(100, Math.round((s.signupCount / s.maxDeelnemers) * 100));
                  const firstTag = s.work?.tags?.[0] ?? null;
                  const locationLines = s.locatie ? s.locatie.split("\n") : [];

                  return (
                    <div key={s.id} className="grid grid-cols-[100px_88px_1fr_240px] gap-6 py-8 items-start">

                      {/* Datum */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">{weekday}</p>
                        <p className="font-editorial text-[72px] leading-none text-ink">{day}</p>
                        <p className="text-[12px] text-ink/50 mt-1">{month}</p>
                        <p className="text-[11px] font-mono text-ink/40 mt-0.5">{tijdStr}</p>
                      </div>

                      {/* Cover */}
                      <BookCoverMini work={s.work} />

                      {/* Inhoud */}
                      <div className="min-w-0 pt-1">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {firstTag && (
                            <span className="text-[8px] font-black uppercase tracking-[0.15em] bg-terracotta text-paper px-2.5 py-1">
                              {firstTag}
                            </span>
                          )}
                          {isSignedUp && (
                            <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.15em] bg-ink text-paper px-2.5 py-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-seafoam shrink-0" />
                              Je gaat
                            </span>
                          )}
                        </div>

                        <p className="text-[26px] font-black leading-tight tracking-tight mb-1">
                          {s.work?.originele_titel}
                        </p>
                        <p className="text-[14px] text-ink/50 italic mb-5">{s.work?.auteur}</p>

                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1.5">Locatie</p>
                        {isLoggedIn && locationLines.length > 0 ? (
                          <div className="mb-4">
                            <p className="text-[14px] font-black text-ink">{locationLines[0]}</p>
                            {locationLines[1] && (
                              <p className="text-[13px] text-ink/55">{locationLines[1]}</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-4">
                            <svg className="w-3 h-3 text-ink/30 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[13px] text-ink/40 italic">
                              {isLoggedIn ? "Wordt bekendgemaakt" : "Zichtbaar zodra je je aanmeldt"}
                            </span>
                          </div>
                        )}

                        {s.notitie && (
                          <p className="text-[13px] text-ink/55 italic">
                            &ldquo;{s.notitie}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Aanmeldingen + actie */}
                      <div className="pt-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-3">Aanmeldingen</p>

                        {/* Teller + avatars */}
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-[32px] font-editorial leading-none">
                            <span className="text-terracotta">{s.signupCount}</span>
                            <span className="text-ink/30">/{s.maxDeelnemers}</span>
                          </p>
                          {s.signupAvatars.length > 0 && (
                            <div className="flex -space-x-2">
                              {s.signupAvatars.slice(0, 4).map((initials, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-ink border-2 border-paper flex items-center justify-center">
                                  <span className="text-[8px] font-black text-paper">{initials}</span>
                                </div>
                              ))}
                              {s.signupCount > 4 && (
                                <div className="w-7 h-7 rounded-full bg-ink/70 border-2 border-paper flex items-center justify-center">
                                  <span className="text-[8px] font-black text-paper">+{s.signupCount - 4}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="h-px bg-ink/10 w-full mb-2 overflow-hidden">
                          <div className="h-full bg-terracotta transition-all" style={{ width: `${fillPct}%` }} />
                        </div>

                        <p className="text-[11px] text-ink/45 mb-4">
                          {spotsLeft > 0 ? `Nog ${spotsLeft} plek${spotsLeft !== 1 ? "ken" : ""}` : "Helaas, vol"}
                        </p>

                        <SignupAction
                          session={s}
                          memberId={memberId}
                          memberStatus={memberStatus}
                          initialSignedUp={isSignedUp}
                          isLoggedIn={isLoggedIn}
                        />
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
