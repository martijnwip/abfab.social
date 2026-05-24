import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import EditWorkForm from "./edit-work-form";
import SourcesSection from "./sources-section";
import BookTextSection from "./book-text-section";
import WorkSidebar from "./work-sidebar";
import WorkTabNav from "./work-tab-nav";
import WorkHeaderActions from "./work-header-actions";
import DeleteButton from "../../delete-button";

type GesprekskaaartItem = { sectie?: string; vraag: string; toelichting: string };

type Source = {
  id: string;
  type: string;
  titel: string | null;
  beschrijving: string | null;
  inhoud: string;
  bron: string | null;
  created_at?: string;
};

function SectionHeader({
  nr,
  label,
  sub,
  actions,
}: {
  nr: string;
  label: string;
  sub?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 mb-6 border-b border-ink/10">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-ink/25">{nr}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-ink/70">{label}</span>
        {sub && <span className="text-[10px] text-ink/35">— {sub}</span>}
      </div>
      {actions}
    </div>
  );
}

function SourceTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    podcast:   { label: "Podcast",   cls: "bg-seafoam/30 text-ink/70" },
    interview: { label: "Interview", cls: "bg-krant/50 text-ink/70" },
    artikel:   { label: "Artikel",   cls: "bg-ink/8 text-ink/60" },
    boektekst: { label: "Boektekst", cls: "bg-ink/8 text-ink/60" },
    lezing:    { label: "Lezing",    cls: "bg-ink/8 text-ink/60" },
    overig:    { label: "Overig",    cls: "bg-ink/8 text-ink/60" },
  };
  const { label, cls } = map[type] ?? { label: type, cls: "bg-ink/8 text-ink/60" };
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${cls}`}>
      {label}
    </span>
  );
}

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const service = createServiceClient();

  const [{ data: work }, { data: tags }, { data: sources }, { data: sessions }] =
    await Promise.all([
      supabase.from("works").select("*").eq("id", id).single(),
      supabase.from("tags").select("naam").order("naam"),
      supabase.from("work_sources").select("id, type, titel, beschrijving, inhoud, bron, created_at").eq("work_id", id).order("created_at"),
      supabase.from("book_sessions").select("id, datum, locatie, sessie_type, status").eq("work_id", id).order("datum", { ascending: false }),
    ]);

  if (!work) notFound();

  const tagNames = tags?.map((t) => t.naam) ?? [];
  const gesprekskaart: GesprekskaaartItem[] = work.gesprekskaart ?? [];
  const bookTextPath: string | null = (work as unknown as { book_text_path: string | null }).book_text_path ?? null;
  const scenario = (work as unknown as { scenario: unknown }).scenario ?? null;
  const hasScenario = !!scenario;
  const hasKaart = gesprekskaart.length > 0;
  const hasBookQuestions = gesprekskaart.some((q) => q.sectie === "Op basis van de boektekst");

  // Gesprekskaart stats
  const sectionCounts: { naam: string; count: number; source?: Source }[] = [];
  const seen = new Set<string>();
  for (const item of gesprekskaart) {
    const naam = item.sectie ?? "";
    if (!seen.has(naam)) {
      seen.add(naam);
      const source = (sources ?? []).find(
        (s) => s.titel && naam.includes(s.titel)
      );
      sectionCounts.push({ naam, count: 0, source: source ?? undefined });
    }
    const entry = sectionCounts.find((s) => s.naam === naam);
    if (entry) entry.count++;
  }

  // Groepeer gesprekskaart per sectie
  const sections: { naam: string; items: GesprekskaaartItem[]; source?: Source }[] = [];
  for (const item of gesprekskaart) {
    const naam = item.sectie ?? "";
    const last = sections[sections.length - 1];
    if (last && last.naam === naam) last.items.push(item);
    else {
      const sc = sectionCounts.find((s) => s.naam === naam);
      sections.push({ naam, items: [item], source: sc?.source });
    }
  }
  const hasHeaders = sections.some((s) => s.naam !== "");
  let counter = 0;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <p className="text-[9px] font-black uppercase tracking-widest text-ink/35 mb-6">
          <Link href="/admin" className="hover:text-ink transition-colors">Admin</Link>
          {" / "}
          <Link href="/admin/works" className="hover:text-ink transition-colors">Works</Link>
          {" / "}
          <span className="text-ink/55">{work.originele_titel}</span>
        </p>

        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] font-black tracking-tight leading-tight">
              {work.originele_titel}
            </h1>
            <p className="text-[13px] text-ink/45 mt-0.5">
              {work.auteur}
              {work.jaar_eerste_publicatie ? ` · ${work.jaar_eerste_publicatie}` : ""}
              {work.tags?.length ? ` · ${(work.tags as string[])[0]}` : ""}
            </p>
            {/* Status badges */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <StatusPill color="green">Actief</StatusPill>
              {(sources?.length ?? 0) > 0 && (
                <StatusPill>{sources!.length} bronnen</StatusPill>
              )}
              {gesprekskaart.length > 0 && (
                <StatusPill>{gesprekskaart.length} vragen</StatusPill>
              )}
            </div>
          </div>
          <WorkHeaderActions workId={id} hasScenario={hasScenario} />
        </div>

        {/* Body: sidebar + content */}
        <div className="grid grid-cols-[200px_1fr] gap-10 items-start">

          {/* Sidebar */}
          <WorkSidebar
            work={{
              id: work.id,
              originele_titel: work.originele_titel,
              cover_image_url: (work as unknown as { cover_image_url: string | null }).cover_image_url ?? null,
              open_library_work_id: (work as unknown as { open_library_work_id: string | null }).open_library_work_id ?? null,
              created_at: work.created_at as string,
              updated_at: work.updated_at as string,
            }}
            hasKaart={hasKaart}
          />

          {/* Main content */}
          <div>
            <WorkTabNav
              sourcesCount={sources?.length ?? 0}
              gesprekskaartCount={gesprekskaart.length}
              sessiesCount={sessions?.length ?? 0}
            />

            {/* ── 01 Metadata ── */}
            <section id="metadata" className="pt-8 pb-16 border-b border-ink/8">
              <SectionHeader
                nr="01"
                label="Metadata"
                sub="boekgegevens en categorie"
                actions={<span className="text-[9px] font-black uppercase tracking-widest text-ink/25">Auto-saved</span>}
              />
              <div className="max-w-2xl">
                <EditWorkForm work={work} availableTags={tagNames} />
              </div>
            </section>

            {/* ── 02 Bronnen ── */}
            <section id="bronnen" className="pt-8 pb-16 border-b border-ink/8">
              <SectionHeader
                nr="02"
                label="Bronnen"
                sub="input voor de AI-gesprekskaart"
                actions={
                  <a href="#bronnen" className="text-[9px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
                    + Bron toevoegen
                  </a>
                }
              />

              {/* Source cards */}
              {(sources ?? []).length > 0 && (
                <div className="space-y-3 mb-6 max-w-2xl">
                  {(sources ?? []).map((src) => (
                    <SourceCard key={src.id} source={src as Source} workId={id} />
                  ))}
                </div>
              )}

              {/* Book text */}
              <div className="max-w-2xl">
                <BookTextSection workId={id} initialPath={bookTextPath} />
              </div>

              {/* Sources section (add form) */}
              <div className="max-w-2xl mt-4">
                <SourcesSection workId={id} initialSources={(sources ?? []) as Source[]} />
              </div>
            </section>

            {/* ── 03 Gesprekskaart ── */}
            <section id="gesprekskaart" className="pt-8 pb-16 border-b border-ink/8">
              <SectionHeader
                nr="03"
                label="Gesprekskaart"
                sub={gesprekskaart.length > 0 ? `${gesprekskaart.length} vragen, gegroepeerd per bron` : "nog geen vragen"}
                actions={
                  hasKaart ? (
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/works/${id}/kaart`}
                        className="text-[9px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                      >
                        Bekijk als kaart →
                      </Link>
                    </div>
                  ) : null
                }
              />

              {gesprekskaart.length > 0 && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 border border-ink/10 p-4">
                    <StatCell label="Vragen totaal" value={String(gesprekskaart.length)} />
                    {sectionCounts.map((s) => (
                      <StatCell
                        key={s.naam}
                        label={s.source ? `Uit ${s.source.type}` : "Uit boek & research"}
                        value={String(s.count)}
                        sub={(s.source?.titel ?? s.naam) || "Primaire bron"}
                      />
                    ))}
                  </div>

                  {/* Questions grouped */}
                  <div className="space-y-8 max-w-2xl">
                    {sections.map((section, si) => (
                      <div key={si}>
                        {hasHeaders && (
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-ink/10">
                            <div className="flex items-center gap-2">
                              {section.source && (
                                <SourceTypeBadge type={(section.source as Source).type} />
                              )}
                              {section.naam && (
                                <span className="text-[10px] font-black uppercase tracking-widest text-ink/55">
                                  {section.naam}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-ink/30">
                              {section.items.length} {section.items.length === 1 ? "vraag" : "vragen"}
                            </span>
                          </div>
                        )}
                        <ol className="space-y-5">
                          {section.items.map((item) => {
                            counter++;
                            const n = counter;
                            return (
                              <li key={n} className="grid grid-cols-[24px_1fr] gap-4">
                                <span className="text-[11px] font-black text-terracotta pt-0.5">{n}.</span>
                                <div>
                                  <p className="text-[14px] font-black leading-snug mb-1">{item.vraag}</p>
                                  <p className="text-[12px] text-ink/50 leading-relaxed">{item.toelichting}</p>
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {gesprekskaart.length === 0 && (
                <p className="text-[13px] text-ink/40">Nog geen gesprekskaart gegenereerd. Voeg bronnen toe en gebruik de knop "Genereer gesprekskaart" in de zijbalk.</p>
              )}
            </section>

            {/* ── 04 Avondscenario ── */}
            <section id="scenario" className="pt-8 pb-16 border-b border-ink/8">
              <SectionHeader
                nr="04"
                label="Avondscenario"
                sub="geprinte gids voor de boekclubavond"
              />

              <div className="max-w-2xl">
                {hasScenario ? (
                  <div className="bg-ink text-paper p-6">
                    <p className="text-[9px] font-black uppercase tracking-widest text-paper/40 mb-3">
                      Gespreksscenario · 75 minuten · 5 fases
                    </p>
                    <p className="text-[20px] font-black leading-tight mb-3">
                      Één avond, één boek, <em className="text-terracotta italic">vijf</em> fases.
                    </p>
                    <p className="text-[12px] text-paper/55 leading-relaxed mb-5">
                      Het scenario is gegenereerd op basis van de huidige gesprekskaart. Regenereer om te synchroniseren met de laatste vragen.
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/works/${id}/scenario`}
                        className="px-4 py-2 border border-paper/25 text-[10px] font-black uppercase tracking-widest text-paper/70 hover:text-paper hover:border-paper/50 transition-colors"
                      >
                        Bekijk huidige
                      </Link>
                      <WorkHeaderActions workId={id} hasScenario={hasScenario} />
                    </div>
                  </div>
                ) : (
                  <div className="border border-ink/10 p-6">
                    <p className="text-[13px] text-ink/40 mb-4">Nog geen scenario gegenereerd.</p>
                    <WorkHeaderActions workId={id} hasScenario={false} />
                  </div>
                )}
              </div>
            </section>

            {/* ── Sessies ── */}
            {(sessions ?? []).length > 0 && (
              <section id="sessies" className="pt-8 pb-16 border-b border-ink/8">
                <SectionHeader
                  nr="05"
                  label="Sessies"
                  sub={`${sessions!.length} geplande of afgeronde bijeenkomsten`}
                />
                <div className="space-y-3 max-w-2xl">
                  {sessions!.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-3 border-b border-ink/8">
                      <div>
                        <p className="text-[13px] font-black">
                          {s.datum
                            ? new Date(s.datum).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                            : "Datum onbekend"}
                        </p>
                        <p className="text-[11px] text-ink/45 mt-0.5">
                          {s.sessie_type ?? "—"} · {s.locatie ?? "—"}
                        </p>
                      </div>
                      <Link
                        href={`/admin/sessies/${s.id}`}
                        className="text-[9px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                      >
                        Bekijk →
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Verwijder ── */}
            <section id="verwijder" className="pt-8 pb-8">
              <SectionHeader nr="" label="Boek verwijderen" />
              <div className="max-w-2xl border border-terracotta/20 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-terracotta mb-2">Boek verwijderen</p>
                <p className="text-[13px] text-ink/55 leading-relaxed mb-4">
                  Verwijdert dit boek, alle bronnen, de gesprekskaart en het scenario. Sessies blijven bewaard met een verwijderd-markering. Kan niet ongedaan worden gemaakt.
                </p>
                <DeleteButton
                  id={id}
                  titel={work.originele_titel}
                  redirectTo="/admin/works"
                  className="px-4 py-2 border border-terracotta/40 text-[10px] font-black uppercase tracking-widest text-terracotta hover:bg-terracotta hover:text-paper transition-colors cursor-pointer bg-transparent"
                />
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ children, color }: { children: React.ReactNode; color?: "green" | "amber" }) {
  const cls =
    color === "green" ? "bg-seafoam/25 text-ink/70" :
    color === "amber" ? "bg-amber-100 text-amber-700" :
    "bg-ink/8 text-ink/55";
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 ${cls}`}>
      {children}
    </span>
  );
}

function StatCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-ink/35 mb-1">{label}</p>
      <p className="text-[24px] font-black leading-none">{value}</p>
      {sub && <p className="text-[10px] text-ink/40 mt-1 truncate">{sub}</p>}
    </div>
  );
}

function SourceCard({ source, workId }: { source: Source; workId: string }) {
  return (
    <div className="border border-ink/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <SourceTypeBadge type={source.type} />
          <div className="min-w-0">
            <p className="text-[13px] font-black leading-snug truncate">{source.titel ?? source.type}</p>
            {source.bron && (
              <p className="text-[11px] text-ink/40 truncate mt-0.5">{source.bron}</p>
            )}
            {source.beschrijving && (
              <p className="text-[12px] text-ink/55 leading-relaxed mt-1 line-clamp-2">{source.beschrijving}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[9px] font-black uppercase tracking-widest text-ink/40">
          <Link href={source.bron ?? "#"} className="hover:text-ink transition-colors" target="_blank">Bekijk</Link>
          <span className="text-ink/20">·</span>
          <span className="hover:text-ink cursor-pointer transition-colors">Vervang</span>
          <span className="text-ink/20">·</span>
          <span className="text-terracotta hover:underline cursor-pointer">Verwijder</span>
        </div>
      </div>
    </div>
  );
}
