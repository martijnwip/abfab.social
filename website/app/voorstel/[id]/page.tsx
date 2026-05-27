import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import InterestForm from "./interest-form";
import type { ScenarioData } from "@/app/api/works/scenario/route";

type Work = {
  id: string;
  originele_titel: string;
  auteur: string | null;
  jaar_eerste_publicatie: number | null;
  cover_image_url: string | null;
  tags: string[] | null;
  paginas: number | null;
  beschrijving: string | null;
  scenario: unknown;
  voorstel_drempel: number;
};

type Source = {
  id: string;
  type: string;
  titel: string | null;
  beschrijving: string | null;
  bron: string | null;
};

function SectionHeader({ label, nr }: { label: string; nr: string }) {
  return (
    <div className="flex items-baseline justify-between pb-3 border-b border-ink/12 mb-8">
      <span className="text-[9px] font-black uppercase tracking-label text-ink/40">{label}</span>
      <span className="text-[9px] font-mono text-ink/25">{nr}</span>
    </div>
  );
}

async function fetchWork(id: string) {
  const supabase = await createClient();
  const [{ data: work }, { data: sources }, { count: interestCount }] =
    await Promise.all([
      supabase.from("works").select("id, originele_titel, auteur, jaar_eerste_publicatie, cover_image_url, tags, paginas, beschrijving, scenario, voorstel_drempel").eq("id", id).single(),
      supabase.from("work_sources").select("id, type, titel, beschrijving, bron").eq("work_id", id).order("created_at"),
      supabase.from("work_interests").select("*", { count: "exact", head: true }).eq("work_id", id),
    ]);
  return { work, sources, interestCount: interestCount ?? 0 };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { work } = await fetchWork(id);
  if (!work) return { title: "Tijdgeest" };
  const w = work as Work;
  const auteur = w.auteur ? ` van ${w.auteur}` : "";
  const drempel = w.voorstel_drempel ?? 6;
  const eersteAlinea = w.beschrijving?.split("\n\n")[0];
  const description = eersteAlinea
    ? `Tijdgeest zoekt lezers voor een avond over dit boek. ${eersteAlinea.replace(/\*([^*]+)\*/g, "$1")}`
    : `Tijdgeest zoekt ${drempel} lezers voor een avond over ${w.originele_titel}${auteur}. Doe jij mee?`;
  return {
    title: `${w.originele_titel}${auteur}`,
    description,
  };
}

export default async function VoorstelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { work, sources, interestCount } = await fetchWork(id);

  if (!work) notFound();

  const w = work as Work;
  const drempel = w.voorstel_drempel ?? 6;

  // Beschrijving: eerste alinea = lead, rest = body
  const rawBeschrijving = w.beschrijving ?? "";
  const alineas = rawBeschrijving.split(/\n\n+/).filter(Boolean);
  const lead = alineas[0] ?? null;
  const bodyLinks = alineas[1] ?? null;
  const bodyRechts = alineas[2] ?? null;

  // Synopsis als fallback
  const scenario = w.scenario
    ? typeof w.scenario === "string" ? JSON.parse(w.scenario) : (w.scenario as ScenarioData)
    : null;
  const synopsis = scenario?.synopsis ?? null;

  // Leestijd
  const leestijd = w.paginas ? `± ${Math.round(w.paginas / 37)} uur` : null;

  // Tags
  const tags = w.tags ?? [];

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

        {/* ── § 01 HERO ── */}
        <section className="mb-16 sm:mb-20">
          <div className="flex items-baseline justify-between pb-3 border-b border-ink/12 mb-8">
            <span className="text-[9px] font-black uppercase tracking-label text-ink/40">Tijdgeest</span>
            <span className="text-[9px] font-mono text-ink/25 uppercase tracking-label">Voorstel · Voorjaar {w.jaar_eerste_publicatie ?? new Date().getFullYear()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-8 sm:gap-12 items-start">
            {/* Cover card */}
            <div className="bg-ink text-paper p-5 pb-0 overflow-hidden">
              <p className="text-[8px] font-black uppercase tracking-label text-paper/35 mb-5">
                {w.auteur?.split(" ").slice(-1)[0]?.toUpperCase()} · {w.jaar_eerste_publicatie}
              </p>
              <div className="w-8 h-0.5 bg-terracotta mb-4" />
              <h2 className="text-[22px] font-black leading-tight text-paper mb-4">
                {w.originele_titel}
                <span className="text-terracotta">.</span>
              </h2>
              <p className="text-[10px] font-black uppercase tracking-label text-paper/50 mb-5">
                {w.auteur?.toUpperCase()}
              </p>
              {w.cover_image_url ? (
                <div className="relative aspect-3/2 -mx-5 overflow-hidden mt-2">
                  <Image src={w.cover_image_url} alt={w.originele_titel} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-32 -mx-5 bg-ink/40 mt-2" />
              )}
              <div className="flex items-center justify-between py-3 border-t border-paper/10 mt-0">
                <span className="text-[8px] font-mono text-paper/30">
                  {tags[0] ? `${tags[0].toUpperCase().slice(0, 12)}` : ""}
                  {tags[1] ? ` · ${tags[1].toUpperCase().slice(0, 8)}` : ""}
                </span>
                {w.paginas && (
                  <span className="text-[8px] font-mono text-paper/30">{w.paginas} p.</span>
                )}
              </div>
            </div>

            {/* Rechts: tags + titel + meta */}
            <div className="pt-2">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-black uppercase tracking-label border border-ink/20 px-2.5 py-1 text-ink/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Titel */}
              <h1 className="text-[40px] sm:text-[56px] font-black leading-[0.95] tracking-tight mb-5">
                {w.originele_titel.split(" ").length > 2 ? (
                  <>
                    {w.originele_titel.split(" ").slice(0, -1).join(" ")}{" "}
                    <em className="italic text-terracotta">
                      {w.originele_titel.split(" ").slice(-1)[0]}.
                    </em>
                  </>
                ) : (
                  <>{w.originele_titel}<span className="text-terracotta">.</span></>
                )}
              </h1>

              {/* Auteur */}
              {w.auteur && (
                <p className="text-[15px] text-ink/60 mb-8 leading-snug">
                  Een roman van <strong className="text-ink font-black">{w.auteur}</strong>
                  {tags[0] && <> — {tags[0].toLowerCase()}</>}
                </p>
              )}

              {/* Metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t border-ink/12">
                {[
                  { label: "Jaar", value: w.jaar_eerste_publicatie?.toString() ?? "—" },
                  { label: "Pagina's", value: w.paginas ? String(w.paginas) : "—" },
                  { label: "Genre", value: tags[0] ?? "—" },
                  { label: "Leestijd", value: leestijd ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-r last:border-r-0 border-b sm:border-b-0 border-ink/12 py-4 pr-4 sm:pr-6 first:pl-0 pl-4">
                    <p className="text-[9px] font-black uppercase tracking-label text-ink/35 mb-1">{label}</p>
                    <p className="text-[18px] font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── § 02 OVER DIT BOEK ── */}
        {(lead || synopsis) && (
          <section className="mb-16 sm:mb-20 border-t border-ink/12 pt-8">
            <SectionHeader label="Over dit boek" nr="§ 02" />

            {/* Lead */}
            {(lead || synopsis) && (
              <p className="text-[22px] sm:text-[28px] font-black leading-[1.3] tracking-tight mb-8 max-w-3xl">
                {renderWithEmphasis(lead ?? synopsis ?? "")}
              </p>
            )}

            {/* Body 2-kolommen */}
            {(bodyLinks || bodyRechts || synopsis) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
                <p className="text-[14px] text-ink/65 leading-relaxed">
                  {bodyLinks ?? synopsis ?? ""}
                </p>
                {bodyRechts && (
                  <p className="text-[14px] text-ink/65 leading-relaxed">{bodyRechts}</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── § 03 BRONNEN ── */}
        {(sources ?? []).length > 0 && (
          <section className="mb-16 sm:mb-20 border-t border-ink/12 pt-8">
            <SectionHeader label="Wat er over gezegd wordt" nr="§ 03" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
              {(sources as Source[]).slice(0, 3).map((s) => (
                <div key={s.id}>
                  <p className="text-[9px] font-black uppercase tracking-label text-terracotta mb-3">
                    {s.type} · {s.titel?.split("·")[0]?.trim() ?? s.type}
                  </p>
                  {s.beschrijving && (
                    <p className="text-[15px] font-black leading-snug mb-3 italic">
                      &ldquo;{s.beschrijving}&rdquo;
                    </p>
                  )}
                  {s.bron && (
                    <a
                      href={s.bron}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-black uppercase tracking-label text-ink/40 hover:text-ink underline underline-offset-4 transition-colors"
                    >
                      Lees verder →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── § 04 AANMELDINGSTELLER ── */}
        <InterestForm workId={w.id} aanmeldingen={interestCount} drempel={drempel} />

        {/* ── § 05 WAAR ── */}
        <section className="mb-16 sm:mb-20 border-t border-ink/12 pt-8">
          <SectionHeader label="Waar" nr="§ 05" />
          <p className="text-[22px] sm:text-[28px] font-black leading-snug mb-3">
            <span className="text-terracotta">■</span>{" "}
            De avond is{" "}
            <em className="italic text-terracotta">bij jou in de buurt</em>
            {" "}— we kiezen samen een plek zodra we de {drempel} vol hebben.
          </p>
          <p className="text-[13px] text-ink/40">
            Amsterdam · Utrecht · Haarlem · meestal op donderdagavond.
          </p>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-ink/12 pt-6 flex items-baseline justify-between">
          <p className="text-[15px] font-black">Tijdgeest<span className="text-terracotta">.</span></p>
          <p className="text-[11px] font-mono text-ink/35">tijdgeestleest.nl</p>
        </footer>

      </div>
    </div>
  );
}

// Helpers
function renderWithEmphasis(text: string) {
  // Wrap *...* in italic terracotta spans
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) =>
    part.startsWith("*") && part.endsWith("*")
      ? <em key={i} className="italic text-terracotta">{part.slice(1, -1)}</em>
      : part
  );
}
