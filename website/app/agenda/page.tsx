import Nav from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import AgendaList from "./agenda-list";

export const metadata = {
  title: "Agenda — Tijdgeest",
};

export default async function AgendaPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const { data: sessions } = await supabase
    .from("book_sessions")
    .select("id, datum, tijdstip, eindtijd, locatie, notitie, max_deelnemers, work_id, works(id, originele_titel, auteur, cover_image_url, tags, scenario)")
    .gte("datum", today)
    .order("datum", { ascending: true });

  const upcomingSessions = sessions ?? [];
  const sessionIds = upcomingSessions.map((s) => s.id);

  const { count: totalSignups } = sessionIds.length
    ? await supabase
        .from("session_signups")
        .select("*", { count: "exact", head: true })
        .in("session_id", sessionIds)
    : { count: 0 };

  const totalSpots = upcomingSessions.reduce((sum, s) => sum + ((s as unknown as { max_deelnemers?: number }).max_deelnemers ?? 12), 0);
  const freeSpots = totalSpots - (totalSignups ?? 0);

  // Seizoensspanne
  let seizoen = "–";
  let seizoenJaar = "";
  if (upcomingSessions.length > 0) {
    const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    const first = new Date(upcomingSessions[0].datum);
    const last = new Date(upcomingSessions[upcomingSessions.length - 1].datum);
    const fm = months[first.getMonth()];
    const lm = months[last.getMonth()];
    seizoen = first.getMonth() === last.getMonth() ? fm.charAt(0).toUpperCase() + fm.slice(1) : `${fm.charAt(0).toUpperCase() + fm.slice(1)} – ${lm}`;
    seizoenJaar = `voorjaar – najaar ${last.getFullYear()}`;
  }

  // Member ophalen voor signups
  let member: { id: string; status: string } | null = null;
  let mySignupIds: string[] = [];

  if (user) {
    const { data: m } = await supabase
      .from("members")
      .select("id, status")
      .eq("user_id", user.id)
      .single();
    member = m;

    if (member && sessionIds.length) {
      const { data: signups } = await supabase
        .from("session_signups")
        .select("session_id")
        .eq("member_id", member.id)
        .in("session_id", sessionIds);
      mySignupIds = (signups ?? []).map((s) => s.session_id);
    }
  }

  // Signup counts + emails per sessie
  const signupCountMap: Record<string, number> = {};
  const signupAvatarsMap: Record<string, string[]> = {};

  if (sessionIds.length) {
    const service = createServiceClient();

    const { data: signupRows } = await supabase
      .from("session_signups")
      .select("session_id, members(user_id)")
      .in("session_id", sessionIds);

    const userIds = [...new Set(
      (signupRows ?? []).map((r) => (r as unknown as { members: { user_id: string } }).members.user_id)
    )];

    const { data: { users: authUsers } } = userIds.length
      ? await service.auth.admin.listUsers({ perPage: 1000 })
      : { data: { users: [] } };

    const emailMap = new Map((authUsers ?? []).map((u) => [u.id, u.email ?? ""]));

    for (const row of signupRows ?? []) {
      const sid = row.session_id;
      const userId = (row as unknown as { members: { user_id: string } }).members.user_id;
      const email = emailMap.get(userId) ?? "";
      const initials = email.slice(0, 2).toUpperCase();
      signupCountMap[sid] = (signupCountMap[sid] ?? 0) + 1;
      if (!signupAvatarsMap[sid]) signupAvatarsMap[sid] = [];
      signupAvatarsMap[sid].push(initials);
    }
  }

  const sessionsForList = upcomingSessions.map((s) => {
    const sx = s as unknown as {
      tijdstip?: string;
      eindtijd?: string;
      locatie?: string | null;
      notitie?: string | null;
      max_deelnemers?: number;
      works: { id: string; originele_titel: string; auteur: string; cover_image_url: string | null; tags: string[] };
    };
    return {
      id: s.id,
      datum: s.datum,
      tijdstip: sx.tijdstip ?? null,
      eindtijd: sx.eindtijd ?? null,
      locatie: sx.locatie ?? null,
      notitie: sx.notitie ?? null,
      maxDeelnemers: sx.max_deelnemers ?? 12,
      signupCount: signupCountMap[s.id] ?? 0,
      signupAvatars: signupAvatarsMap[s.id] ?? [],
      hasScenario: !!(sx.works as unknown as { scenario?: unknown }).scenario,
      work: sx.works,
    };
  });

  const isMember = !!member;
  const isApproved = member?.status === "approved";

  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6">
          De agenda
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end mb-12">
          <div>
            <h1 className="font-editorial text-[52px] md:text-[68px] leading-none tracking-[-0.02em] mb-0">
              Eén avond,
            </h1>
            <h1 className="font-editorial italic text-[52px] md:text-[68px] leading-none tracking-[-0.02em]">
              één boek, één gesprek.
            </h1>
          </div>
          <p className="text-[15px] leading-[1.7] text-ink/65 max-w-sm">
            De geplande avonden van Tijdgeest. Inschrijven kan als lid —
            voor één avond, voor een seizoen, of voor zo lang als het lezen
            je bevalt.
          </p>
        </div>

        {/* Stats — zelfde grid als sessierijen zodat kolommen uitlijnen */}
        <div className="border-t border-ink/15 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <p className="font-editorial text-[42px] leading-none mb-1">{upcomingSessions.length}</p>
            <p className="text-[11px] text-ink/50">geplande avonden</p>
          </div>
          <div>
            <p className="font-editorial text-[42px] leading-none mb-1">{Math.max(0, freeSpots)}</p>
            <p className="text-[11px] text-ink/50">plekken nog vrij</p>
          </div>
          <div>
            {user ? (
              <>
                <p className="font-editorial text-[42px] leading-none mb-1">{mySignupIds.length}</p>
                <p className="text-[11px] text-ink/50">op jouw lijst</p>
              </>
            ) : (
              <>
                <p className="font-editorial text-[42px] leading-none mb-1">{seizoen}</p>
                <p className="text-[11px] text-ink/50">{seizoenJaar || "komende maanden"}</p>
              </>
            )}
          </div>
          <div>
            <p className="font-editorial text-[42px] leading-none mb-1">Sinds&nbsp;'26</p>
            <p className="text-[11px] text-ink/50">Tijdgeest Genootschap</p>
          </div>
        </div>
      </section>

      {/* Banner voor niet-ingelogde bezoekers */}
      {!user && (
        <section className="max-w-6xl mx-auto px-6 mb-10">
          <div className="bg-terracotta px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-ink/25 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-paper" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-label text-paper/70 mb-1">
                  Voor leden
                </p>
                <p className="text-[13px] font-black text-paper leading-snug">
                  Aanmelden voor een avond kan zodra je bent ingelogd. De locatie zie je dan ook.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/login"
                className="border border-paper text-paper text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2.5 hover:bg-paper hover:text-terracotta transition-colors"
              >
                Inloggen
              </Link>
              <Link
                href="/login"
                className="bg-ink text-paper text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2.5 hover:bg-ink/85 transition-colors"
              >
                Word lid →
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="border-t border-ink/15" />

      {/* Sessie lijst */}
      <AgendaList
        sessions={sessionsForList}
        memberId={member?.id ?? null}
        memberStatus={(member?.status ?? null) as "pending" | "approved" | "rejected" | null}
        mySignupIds={mySignupIds}
        isLoggedIn={!!user}
      />

    </>
  );
}
