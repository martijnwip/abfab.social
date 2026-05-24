import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import PrintButton from "./print-button";
import type { ScenarioData } from "@/app/api/works/scenario/route";

function SectionLabel({ children, min }: { children: React.ReactNode; min?: number }) {
  return (
    <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-ink/10">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/35">{children}</p>
      {min && <p className="text-[10px] font-mono text-ink/25">{min} min</p>}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/35 mt-5 mb-1">{children}</p>;
}

function Q({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] font-black leading-snug mt-4">{children}</p>;
}

function T({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] leading-relaxed text-ink/70 mt-1.5">{children}</p>;
}

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: work } = await supabase
    .from("works")
    .select("id, originele_titel, auteur, jaar_eerste_publicatie, scenario")
    .eq("id", id)
    .single();

  if (!work) notFound();

  const raw = work.scenario;
  const s: ScenarioData | null = raw
    ? typeof raw === "string"
      ? JSON.parse(raw)
      : (raw as unknown as ScenarioData)
    : null;

  return (
    <div className="bg-paper min-h-screen">
      <div className="print:hidden border-b border-ink/10 px-8 py-3 flex items-center justify-between">
        <Link href={`/admin/works/${id}/edit`} className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
          ← Terug
        </Link>
        <PrintButton />
      </div>

      <div className="max-w-150 mx-auto px-8 py-12">

        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/35 mb-2">Gespreksscenario</p>
        <h1 className="text-[28px] font-black tracking-tight leading-tight mb-1">{work.originele_titel}</h1>
        <p className="text-[14px] text-ink/50 mb-8">
          {work.auteur}{work.jaar_eerste_publicatie ? ` · ${work.jaar_eerste_publicatie}` : ""}
          {s?.genre ? ` · ${s.genre}` : ""}
        </p>

        {!s ? (
          <p className="text-sm text-ink/40">Nog geen scenario gegenereerd.</p>
        ) : (
          <div className="space-y-12">

            {/* ── Metadata ── */}
            <div className="border border-ink/10 p-6">
              <dl className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-2 text-[13px]">
                <dt className="text-ink/40 font-black uppercase tracking-[0.12em] text-[9px] pt-0.5">Titel</dt>
                <dd className="text-ink/80">{work.originele_titel}</dd>
                <dt className="text-ink/40 font-black uppercase tracking-[0.12em] text-[9px] pt-0.5">Auteur</dt>
                <dd className="text-ink/80">{work.auteur}</dd>
                {s.genre && (
                  <>
                    <dt className="text-ink/40 font-black uppercase tracking-[0.12em] text-[9px] pt-0.5">Genre</dt>
                    <dd className="text-ink/80">{s.genre}</dd>
                  </>
                )}
                {work.jaar_eerste_publicatie && (
                  <>
                    <dt className="text-ink/40 font-black uppercase tracking-[0.12em] text-[9px] pt-0.5">Jaar</dt>
                    <dd className="text-ink/80">{work.jaar_eerste_publicatie}</dd>
                  </>
                )}
                {s.synopsis && (
                  <>
                    <dt className="text-ink/40 font-black uppercase tracking-[0.12em] text-[9px] pt-0.5 mt-3">Omschrijving</dt>
                    <dd className="text-ink/80 mt-3 leading-relaxed">{s.synopsis}</dd>
                  </>
                )}
              </dl>
            </div>

            {/* ── Opening ── */}
            <div>
              <SectionLabel min={10}>Opening</SectionLabel>
              <T>{s.welkomstwoord}</T>
              <Label>IJsbreker</Label>
              <Q>{s.ijsbreker_vraag}</Q>
            </div>

            {/* ── Plot & Personages ── */}
            <div>
              <SectionLabel min={20}>Plot &amp; Personages</SectionLabel>
              {s.personages && (
                <>
                  <Label>Personages</Label>
                  <T>{s.personages}</T>
                </>
              )}
              <Q>{s.vraag_1}</Q>
              <Q>{s.vraag_2}</Q>
            </div>

            {/* ── Stijl & Structuur ── */}
            <div>
              <SectionLabel min={15}>Stijl &amp; Structuur</SectionLabel>
              <Q>{s.vraag_3}</Q>
              {s.stijl_fragment && (
                <div className="mt-4 pl-4 border-l-2 border-ink/15">
                  <p className="text-[13px] italic text-ink/55 leading-relaxed">&ldquo;{s.stijl_fragment}&rdquo;</p>
                  {s.stijl_fragment_toelichting && (
                    <p className="text-[12px] text-ink/40 mt-1.5">{s.stijl_fragment_toelichting}</p>
                  )}
                </div>
              )}
              {s.vergelijkingsvraag && (
                <>
                  <Label>Vergelijkingsvraag</Label>
                  <Q>{s.vergelijkingsvraag}</Q>
                </>
              )}
            </div>

            {/* ── Thema's ── */}
            <div>
              <SectionLabel min={20}>Thema&apos;s</SectionLabel>
              <Q>{s.vraag_4}</Q>
              <Q>{s.vraag_5}</Q>
              <Label>Actualiteit</Label>
              <Q>{s.actualiteitsvraag}</Q>
            </div>

            {/* ── Afsluiting ── */}
            <div>
              <SectionLabel min={10}>Afsluiting</SectionLabel>
              <div className="space-y-4">
                <div>
                  <p className="text-[14px] font-black">Citaatronde</p>
                  <T>Wie heeft een zin aangestreept, en waarom juist die?</T>
                </div>
                <div>
                  <p className="text-[14px] font-black">Cijfer</p>
                  <T>Iedereen schrijft eerst zelf een cijfer op — dan pas delen. Voorkomt dat de groep elkaar beïnvloedt.</T>
                </div>
                <div>
                  <p className="text-[14px] font-black">Aanrader?</p>
                  <T>Zou je dit boek aanraden — en aan wie specifiek?</T>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
