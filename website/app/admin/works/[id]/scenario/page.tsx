import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PrintButton from "./print-button";
import type { ScenarioData } from "@/app/api/works/scenario/route";

const FASES = [
  { nr: "01", naam: "Opening",           min: 10, start: "00:00", eind: "00:10", kleur: false },
  { nr: "02", naam: "Plot & Personages", min: 20, start: "00:10", eind: "00:30", kleur: false },
  { nr: "03", naam: "Stijl & Structuur", min: 15, start: "00:30", eind: "00:45", kleur: false },
  { nr: "04", naam: "Thema's & Symboliek", min: 20, start: "00:45", eind: "01:05", kleur: true  },
  { nr: "05", naam: "Reflectie & Oordeel", min: 10, start: "01:05", eind: "01:15", kleur: false },
  { nr: "06", naam: "Afronding",          min: 5,  start: "01:15", eind: "01:20", kleur: false },
];

function Vraag({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-terracotta/50 pl-4 py-1 mt-3">
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-terracotta/70 mr-2">Vraag</span>
      <span className="text-[13px] italic text-ink/80">{children}</span>
    </div>
  );
}

function Onderdeel({ label, titel, subtitel, children }: {
  label: string;
  titel: string;
  subtitel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-6 h-6 border border-ink/25 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-black">{label}</span>
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-black leading-snug">
          {titel}
          {subtitel && <span className="font-normal text-ink/50"> — {subtitel}</span>}
        </p>
        {children}
      </div>
    </div>
  );
}

function FaseSection({ fase, children }: {
  fase: typeof FASES[number];
  children: React.ReactNode;
}) {
  const [naamA, naamB] = fase.naam.includes("&")
    ? [fase.naam.split("&")[0].trim() + " &", fase.naam.split("&")[1].trim()]
    : [fase.naam, null];

  return (
    <div className="grid grid-cols-[180px_1fr] gap-8 py-10 border-t border-ink/10">
      {/* Links */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-terracotta mb-2">
          Fase {fase.nr} —
        </p>
        <p className="text-[28px] font-black leading-tight tracking-tight">
          {naamA}
          {naamB && (
            <>
              <br />
              <em className="text-terracotta not-italic font-black">{naamB}</em>
            </>
          )}
          {!naamB && fase.naam === "Opening" && (
            <><br /><em className="text-terracotta italic">Opening</em></>
          )}
        </p>
        <p className="text-[36px] font-black leading-none mt-2 tabular-nums">
          {fase.min}
          <span className="text-[13px] font-normal text-ink/40 ml-1">min.</span>
        </p>
        <p className="text-[10px] font-mono text-ink/30 mt-4">{fase.start} → {fase.eind}</p>
      </div>

      {/* Rechts */}
      <div>{children}</div>
    </div>
  );
}

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: work } = await supabase
    .from("works")
    .select("id, originele_titel, auteur, jaar_eerste_publicatie, cover_image_url, tags, scenario")
    .eq("id", id)
    .single();

  if (!work) notFound();

  const scenario = work.scenario as unknown as ScenarioData | null;
  const tags = (work.tags as string[] | null) ?? [];

  return (
    <div className="bg-paper min-h-screen">
      {/* Admin nav — verborgen bij printen */}
      <div className="print:hidden border-b border-ink/10 px-8 py-3 flex items-center justify-between">
        <Link href={`/admin/works/${id}/edit`} className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
          ← Terug naar bewerken
        </Link>
        <PrintButton />
      </div>

      <div className="max-w-[760px] mx-auto px-8 py-10">

        {/* ── Koptekst ── */}
        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-ink/40 mb-8">
          Tijdgeest · Gespreksgids voor de boekbespreking
        </p>

        <div className="grid grid-cols-[1fr_220px] gap-8 mb-8">
          <div>
            <h1 className="text-[52px] font-black leading-[1.0] tracking-tight">
              Eén avond,<br />
              één boek,<br />
              <em className="text-terracotta not-italic">zes</em> <span>fases.</span>
            </h1>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: "Duur",           waarde: "80 minuten", vet: true },
              { label: "Gespreksleider", waarde: null },
              { label: "Datum",          waarde: null },
              { label: "Editie",         waarde: `Nº — · ${new Date().getFullYear()}` },
            ].map(({ label, waarde, vet }) => (
              <div key={label} className="grid grid-cols-2 items-baseline gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40">{label}</span>
                {waarde
                  ? <span className={`text-[12px] ${vet ? "font-black text-terracotta" : "font-mono text-ink/60"}`}>{waarde}</span>
                  : <span className="border-b border-ink/20 h-px w-full self-end mb-1" />
                }
              </div>
            ))}
          </div>
        </div>

        <hr className="border-ink/15 mb-8" />

        {/* ── Boekkaart ── */}
        <div className="flex items-center gap-5 border-l-2 border-terracotta pl-5 mb-8">
          <div className="w-12 h-16 bg-ink/10 overflow-hidden shrink-0 relative">
            {work.cover_image_url
              ? <Image src={work.cover_image_url} alt={work.originele_titel} fill className="object-cover" />
              : <div className="absolute inset-0 flex items-center justify-center text-ink/20 text-[18px]">▲</div>
            }
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/40 mb-0.5">
              Boek · auteur · jaar
            </p>
            <p className="text-[22px] font-black leading-tight">{work.originele_titel}</p>
            <p className="text-[13px] text-ink/55">{work.auteur}{work.jaar_eerste_publicatie ? ` · ${work.jaar_eerste_publicatie}` : ""}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">Genre / pagina&apos;s</p>
            <p className="text-[12px] text-ink/60">
              {scenario?.genre ?? tags[0] ?? "—"}
              {scenario?.paginas ? ` / ${scenario.paginas}` : ""}
            </p>
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/40">De avond in één oogopslag</p>
            <p className="text-[9px] font-mono text-ink/30">Start → 80 min.</p>
          </div>
          <div className="flex">
            {FASES.map((f) => (
              <div
                key={f.nr}
                className={`flex-none border border-ink/15 ${f.kleur ? "bg-terracotta text-paper" : "bg-white text-ink"}`}
                style={{ flexBasis: `${(f.min / 80) * 100}%` }}
              >
                <div className="px-2 py-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[8px] font-black opacity-50">{f.nr}</span>
                    <span className={`text-[16px] font-black leading-none tabular-nums ${f.kleur ? "" : ""}`}>{f.min}</span>
                    <span className={`text-[8px] self-end pb-0.5 ${f.kleur ? "opacity-70" : "text-ink/40"}`}>{f.eind.replace("00:", "").replace("01:", "1:")}′</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-1.5">
            {FASES.map((f) => (
              <div
                key={f.nr}
                className="text-[8px] font-black uppercase tracking-[0.1em] text-ink/40 leading-tight"
                style={{ flexBasis: `${(f.min / 80) * 100}%` }}
              >
                {f.naam.replace(" &", "\n&")}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-ink/15 mb-2" />

        {/* ── Fase 01: De Opening ── */}
        <FaseSection fase={FASES[0]}>
          <Onderdeel label="A" titel="De aftrap" subtitel="welkom & context">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              De gespreksleider heet iedereen welkom en geeft kort de achtergrond van het boek: titel, auteur, genre, jaar van uitgave. Eén minuut, geen recensie.
            </p>
          </Onderdeel>
          <Onderdeel label="B" titel="De ijsbreker" subtitel="rondje eerste indruk">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Iedereen vat zijn algemene eerste indruk in één à twee zinnen. Nog geen discussie — alleen luisteren en peilen.
            </p>
            <Vraag>{scenario?.ijsbreker_vraag ?? "Was het een pageturner, of moest je er echt inkomen?"}</Vraag>
          </Onderdeel>
        </FaseSection>

        {/* ── Fase 02: Plot & Personages ── */}
        <FaseSection fase={FASES[1]}>
          <Onderdeel label="A" titel="Korte samenvatting" subtitel="door één lezer, geen spoilers van het einde">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Vooraf afgesproken: één iemand vat de verhaallijn bondig samen. Houdt het kader strak — geen einde, geen plottwists. De rest mag aanvullen waar het misloopt.
            </p>
          </Onderdeel>
          <Onderdeel label="B" titel="Karakterontwikkeling" subtitel="wie groeit, wie irriteert">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Hier zit vaak het meeste gesprek. Laat het meanderen, maar grijp terug naar de vraag als het te abstract wordt.
            </p>
            <Vraag>{scenario?.karakter_vraag_1 ?? "Welke personages maakten de grootste groei door?"}</Vraag>
            <Vraag>{scenario?.karakter_vraag_2 ?? "Met wie voelde je sympathie — en wie vond je juist irritant?"}</Vraag>
          </Onderdeel>
        </FaseSection>

        {/* ── Fase 03: Stijl & Structuur ── */}
        <FaseSection fase={FASES[2]}>
          <Onderdeel label="A" titel="Stijl" subtitel="vlot, poëtisch, beschrijvend, fragmentarisch?">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Probeer concreet te worden: laat iemand één zin voorlezen die de stijl typeert.
            </p>
            {scenario?.stijl_fragment && (
              <div className="mt-3 border-l-2 border-ink/20 pl-4">
                <p className="text-[12px] italic text-ink/60 leading-relaxed">&ldquo;{scenario.stijl_fragment}&rdquo;</p>
                {scenario.stijl_fragment_toelichting && (
                  <p className="text-[11px] text-ink/40 mt-1">{scenario.stijl_fragment_toelichting}</p>
                )}
              </div>
            )}
            <Vraag>{scenario?.stijl_vraag ?? "Hoe zou je de schrijfstijl in drie woorden vangen?"}</Vraag>
          </Onderdeel>
          <Onderdeel label="B" titel="Perspectief" subtitel="vanuit wie wordt verteld, en waarom?">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Eerste persoon, alwetende verteller, wisselende perspectieven — het maakt een wereld van verschil voor wat je als lezer voelt.
            </p>
            <Vraag>{scenario?.perspectief_vraag ?? "Waarom zou de auteur voor dit perspectief gekozen hebben — en hoe beïnvloedt het jouw mening?"}</Vraag>
          </Onderdeel>
        </FaseSection>

        {/* ── Fase 04: Thema's & Symboliek ── */}
        <FaseSection fase={FASES[3]}>
          <Onderdeel label="A" titel="De kernboodschap" subtitel={scenario?.kernboodschap_hint ?? "rouw, macht, liefde, identiteit?"}>
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Laat de groep eerst alle thema&apos;s noemen die opvielen, kies daarna samen de twee die je écht uitdiept.
            </p>
            <Vraag>{scenario?.thema_vraag ?? "Wat zijn volgens jou de belangrijkste thema's van dit boek?"}</Vraag>
          </Onderdeel>
          <Onderdeel label="B" titel="Details & motieven" subtitel={scenario?.motief_hint ?? "titel, cover, terugkerende beelden"}>
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Vaak verraapt de titel of de cover meer dan de schrijver toegeeft. Kijk ook naar voorwerpen, plekken of zinnen die telkens terugkomen.
            </p>
            <Vraag>{scenario?.motief_vraag ?? "Welk motief of symbool blijft je het meest bij — en waarom?"}</Vraag>
          </Onderdeel>
        </FaseSection>

        {/* ── Fase 05: Reflectie & Oordeel ── */}
        <FaseSection fase={FASES[4]}>
          <Onderdeel label="A" titel="Quote-ronde" subtitel="iedereen leest één zin voor">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Vraag van tevoren of mensen een zin willen markeren. Pakkend, mooi, ontroerend, of juist irritant — alles mag. Geen toelichting tenzij gevraagd.
            </p>
          </Onderdeel>
          <Onderdeel label="B" titel="Cijfer & aanrader" subtitel="de hamvraag">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Geef het boek gezamenlijk een cijfer (1 t/m 10). Schrijf elk cijfer op een briefje, daarna pas hardop — voorkomt navolging.
            </p>
            <Vraag>{scenario?.aanrader_vraag ?? "Zou je dit boek aanraden aan een ander — en aan wie precies?"}</Vraag>
          </Onderdeel>
        </FaseSection>

        {/* ── Fase 06: Afronding ── */}
        <FaseSection fase={FASES[5]}>
          <Onderdeel label="A" titel="De volgende stap" subtitel="datum, boek, gespreksleider">
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1.5">
              Plan de volgende avond voordat agenda&apos;s vol lopen. Spreek af wie het volgende boek kiest en de avond inleidt. Eindig op tijd — daar wint elke leesclub bij.
            </p>
          </Onderdeel>
        </FaseSection>

        {/* ── Tips voor de gespreksleider ── */}
        <div className="mt-4 bg-ink text-paper p-8">
          <div className="grid grid-cols-[160px_1fr] gap-8 items-start">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-paper/50 mb-3">Voor de gespreksleider</p>
              <p className="text-[24px] font-black leading-tight">Drie regels.<br />Meer niet.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { titel: "Bewaak de klok, niet het script.", tekst: "Loopt fase 02 uit omdat iedereen erin zit? Kort 03 in, niet andersom." },
                { titel: "Stilte mag.", tekst: "Tel tot vijf voor je een vraag herformuleert — het beste antwoord komt uit het ongemak." },
                { titel: "Niemand hoeft alles te zeggen.", tekst: "Maak één rondje per fase waar de stillere stemmen ruimte krijgen, daarna pas vrij gesprek." },
                { titel: "Spoilervrije zone tot 00:30.", tekst: "Het einde komt pas op tafel bij Thema's & Symboliek — niet eerder." },
              ].map(({ titel, tekst }) => (
                <div key={titel}>
                  <p className="text-[11px] leading-snug">
                    <span className="font-black">— {titel}</span>{" "}
                    <span className="text-paper/60">{tekst}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink/10">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/30">▲ Tijdgeest · Modern leesgenootschap</p>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/30">Gespreksgids · V1.0</p>
        </div>

      </div>
    </div>
  );
}
