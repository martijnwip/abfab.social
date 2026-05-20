import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import InterestForm from "./interest-form";
import SessionSignup from "./session-signup";
import { createServiceClient } from "@/lib/supabase/service";

function sessionStatus(sessions: { datum: string }[]): "nu" | "binnenkort" | null {
  const now = new Date();
  const upcoming = sessions.filter((s) => new Date(s.datum) >= now);
  if (!upcoming.length) return null;
  const diff = (new Date(upcoming[0].datum).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 14 ? "nu" : "binnenkort";
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .single();

  if (!work) notFound();

  const { data: sessions } = await supabase
    .from("book_sessions")
    .select("id, datum, locatie")
    .eq("work_id", id)
    .order("datum", { ascending: true });

  const allSessions = sessions ?? [];
  const status = sessionStatus(allSessions);
  const nextSession = allSessions.find((s) => new Date(s.datum) >= new Date());

  const { count: signupCount } = nextSession
    ? await supabase
        .from("session_signups")
        .select("*", { count: "exact", head: true })
        .eq("session_id", nextSession.id)
    : { count: 0 };

  const { data: { user } } = await supabase.auth.getUser();

  // Admin check via service client (bypast RLS)
  const service = createServiceClient();
  const isAdmin = user
    ? await service
        .from("members")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .eq("status", "approved")
        .single()
        .then(({ data }) => !!data)
    : false;

  const firstTag = work.tags?.[0] ?? null;
  const gesprekskaart: { vraag: string; toelichting: string }[] = work.gesprekskaart ?? [];


  return (
    <>
      <Nav />

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        {/* Breadcrumb */}
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/35 mb-10">
          <Link href="/leeslijst" className="hover:text-ink transition-colors">Leeslijst</Link>
          {firstTag && (
            <> <span className="mx-2">/</span> {firstTag}</>
          )}
          <span className="mx-2">/</span>
          <span className="text-ink">{work.originele_titel}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-16 items-start">

          {/* Links: boek cover */}
          <div>
            <div className="border border-ink/12 bg-white">
              {/* Header */}
              <div className="bg-terracotta px-5 py-3 flex items-center justify-between">
                <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center">
                  <span className="text-[10px] font-black text-paper">T</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-label text-paper">
                  Tijdgeest
                </span>
              </div>

              {/* Boek info */}
              <div className="px-6 pt-6 pb-4 bg-krant/20">
                <p className="text-[13px] font-black text-terracotta mb-2">{work.auteur}</p>
                <h2 className="text-[28px] font-black leading-tight tracking-tight mb-2">
                  {work.originele_titel}
                </h2>
                {work.subtitel && (
                  <p className="text-[13px] text-ink/50">{work.subtitel}</p>
                )}
              </div>

              {/* Cover afbeelding */}
              <div className="relative aspect-3/2 overflow-hidden">
                {work.cover_image_url ? (
                  <Image src={work.cover_image_url} alt={work.originele_titel} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-terracotta" />
                )}
              </div>
            </div>

            {/* Caption */}
            <div className="mt-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-label text-ink/40">
                Tijdgeest Editie
              </p>
              <p className="text-[11px] font-mono text-ink/35 mt-0.5">
                {work.jaar_eerste_publicatie}
                {work.paginas ? ` · ${work.paginas} pagina's` : ""}
              </p>
            </div>
          </div>

          {/* Rechts: inhoud */}
          <div className="pt-0 md:pt-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {status === "nu" && (
                <span className="text-[10px] font-black uppercase tracking-[0.12em] bg-terracotta text-paper px-3 py-1.5">
                  Nu lezend
                </span>
              )}
              {status === "binnenkort" && (
                <span className="text-[10px] font-black uppercase tracking-[0.12em] border border-ink/25 text-ink px-3 py-1.5">
                  Komt eraan
                </span>
              )}
              {(work.tags ?? []).map((tag: string) => (
                <span key={tag} className="text-[10px] font-black uppercase tracking-[0.12em] border border-ink/25 text-ink px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>

            {/* Titel */}
            <h1 className="font-editorial text-[52px] md:text-[64px] leading-none tracking-[-0.02em] mb-3">
              {work.originele_titel}
            </h1>
            <p className="font-editorial italic text-[20px] text-ink/60 mb-6">
              {work.auteur}
            </p>
            <div className="w-10 border-t border-ink/30 mb-8" />

            {/* Beschrijving */}
            {work.beschrijving ? (
              <div className="space-y-4 mb-10">
                {work.beschrijving.split("\n").filter(Boolean).map((p: string, i: number) => (
                  <p key={i} className="text-[15px] leading-[1.7] text-ink/70">{p}</p>
                ))}
              </div>
            ) : (
              <div className="mb-10" />
            )}

            {/* Metadata grid */}
            <div className="border-t border-ink/12 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Jaar", value: work.jaar_eerste_publicatie },
                { label: "Pagina's", value: work.paginas },
                { label: "Taal origineel", value: work.taal_origineel },
                { label: "Format", value: (work.tags ?? []).join(" · ") || null },
              ].map((m) => m.value ? (
                <div key={m.label}>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">{m.label}</p>
                  <p className="text-[14px] text-ink/80">{m.value}</p>
                </div>
              ) : null)}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              {nextSession && (
                <Link
                  href="#aanmelden"
                  className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-ink/85 transition-colors"
                >
                  Doe mee aan deze avond
                </Link>
              )}
              <button className="border border-ink text-ink text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-ink hover:text-paper transition-colors cursor-pointer">
                Volg dit boek
              </button>
            </div>
          </div>
        </div>
        {/* II — De avond */}
        <section id="aanmelden" className="mt-20 pt-16 border-t border-ink/12">
          <div className="flex gap-10 items-start">
            {/* Sidebar */}
            <div className="w-36 shrink-0 hidden md:block pt-1">
              <p className="text-[11px] font-black text-ink/40 mb-2">I.</p>
              <div className="border-t border-ink/20 pt-2">
                <p className="text-[9px] font-black uppercase tracking-label text-ink/40">De Avond</p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-editorial text-[40px] md:text-[52px] leading-none tracking-[-0.02em] mb-10">
                {nextSession
                  ? "Eén avond, één boek, een gesprek dat blijft hangen."
                  : "Nog geen datum gepland."}
              </h2>

              {nextSession ? (
                /* Met sessie */
                <div className="border border-ink/15 p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-label text-ink/40 mb-3">Wanneer</p>
                      <p className="font-editorial text-[28px] leading-none">
                        {new Date(nextSession.datum).toLocaleDateString("nl-NL", {
                          weekday: "short", day: "numeric", month: "long",
                        })} · 20:00
                      </p>
                    </div>
                    {nextSession.locatie && (
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-label text-ink/40 mb-3">Waar</p>
                        <p className="text-[18px] font-medium leading-snug">{nextSession.locatie}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-ink/10 pt-6 flex items-center justify-between gap-6 flex-wrap">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-label text-ink/40 mb-3">Lezers</p>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {Array.from({ length: Math.min(signupCount ?? 0, 5) }).map((_, i) => (
                            <div key={i} className="w-9 h-9 rounded-full bg-ink border-2 border-paper flex items-center justify-center">
                              <span className="text-[10px] font-black text-paper">·</span>
                            </div>
                          ))}
                          {(signupCount ?? 0) === 0 && (
                            <div className="w-9 h-9 rounded-full border-2 border-dashed border-ink/25" />
                          )}
                        </div>
                        <p className="text-[15px] text-ink/70">
                          <span className="font-black text-ink">{signupCount ?? 0}</span> van 12 plekken
                        </p>
                      </div>
                    </div>
                    <SessionSignup sessionId={nextSession.id} workId={id} />
                  </div>
                </div>
              ) : (
                /* Zonder sessie */
                <div className="border border-ink/15 p-8 max-w-2xl">
                  <p className="text-[15px] leading-[1.7] text-ink/60 mb-6">
                    We zijn bezig met het plannen van een avond voor dit boek.
                    Laat je e-mailadres achter — je krijgt een mail zodra er een datum
                    bekend is of wordt voorgesteld.
                  </p>
                  <InterestForm workId={id} initialEmail={user?.email} />
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Gesprekskaart — alleen zichtbaar voor admins */}
        {isAdmin && gesprekskaart.length > 0 && (
          <section className="mt-20 pt-16 border-t border-ink/12">
            <div className="flex gap-10 items-start">
              <div className="w-36 shrink-0 hidden md:block pt-1">
                <p className="text-[11px] font-black text-ink/40 mb-2">II.</p>
                <div className="border-t border-ink/20 pt-2">
                  <p className="text-[9px] font-black uppercase tracking-label text-ink/40">
                    Gesprekskaart
                  </p>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="font-editorial text-[36px] leading-none tracking-[-0.02em]">
                    Gesprekskaart
                  </h2>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-terracotta/15 text-terracotta px-2.5 py-1">
                    Admin
                  </span>
                </div>

                <ol className="space-y-6">
                  {gesprekskaart.map((item, i) => (
                    <li key={i} className="grid grid-cols-[24px_1fr] gap-4">
                      <span className="text-[11px] font-black text-terracotta pt-0.5">{i + 1}.</span>
                      <div>
                        <p className="text-[15px] font-black leading-snug mb-1.5">{item.vraag}</p>
                        <p className="text-[13px] text-ink/55 leading-relaxed">{item.toelichting}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
