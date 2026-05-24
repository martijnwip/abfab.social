import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ScenarioData } from "@/app/api/works/scenario/route";

const FASES = [
  { nr: "01", pre: null,      italic: "Opening",    min: 10, eind: "00:10" },
  { nr: "02", pre: "Plot &",  italic: "Personages", min: 20, eind: "00:30" },
  { nr: "03", pre: "Stijl &", italic: "Structuur",  min: 15, eind: "00:45" },
  { nr: "04", pre: null,      italic: "Thema's",    min: 20, eind: "01:05", accent: true },
  { nr: "05", pre: null,      italic: "Afsluiting", min: 10, eind: "01:15" },
] as const;

const TOTAL = 75;

function SubLabel({ label, slot, count }: { label: string; slot: string; count: string }) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-3">
      <span className="text-[9px] font-black uppercase tracking-label text-ink/50 shrink-0">{label}</span>
      <div className="flex-1 border-b border-ink/20" />
      <span className="text-[9px] font-mono text-ink/35 shrink-0">{slot} · {count}</span>
    </div>
  );
}

function Q({ prefix, children }: { prefix: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mt-4">
      <span className="text-[11px] font-black text-terracotta shrink-0 pt-0.5 w-7">{prefix}</span>
      <p className="text-[14px] font-black leading-snug">{children}</p>
    </div>
  );
}

function FaseSidebar({ fase, start }: { fase: typeof FASES[number]; start: string }) {
  return (
    <div className="shrink-0 w-44">
      <p className="text-[9px] font-black uppercase tracking-label text-terracotta mb-2">
        Fase {fase.nr} —
      </p>
      <div className="text-[32px] font-black leading-tight">
        {fase.pre && <span className="block">{fase.pre}</span>}
        <em className="text-terracotta italic">{fase.italic}</em>
      </div>
      <p className="text-[44px] font-black leading-none mt-3 tabular-nums">
        {fase.min}
        <span className="text-[12px] font-normal text-ink/40 ml-1">min</span>
      </p>
      <p className="text-[10px] font-mono text-ink/30 mt-3">{start} → {fase.eind}</p>
    </div>
  );
}

export default async function ReaderScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/agenda");

  // Fetch session with work scenario
  const { data: session } = await supabase
    .from("book_sessions")
    .select("id, datum, works(id, originele_titel, auteur, jaar_eerste_publicatie, scenario)")
    .eq("id", id)
    .single();

  if (!session) notFound();

  const sessionData = session as unknown as {
    datum: string;
    works: { id: string; originele_titel: string; auteur: string; jaar_eerste_publicatie?: number; scenario: unknown };
  };

  // Must be within 1 week of session date
  const sessionDate = new Date(sessionData.datum);
  const unlockDate = new Date(sessionDate);
  unlockDate.setDate(unlockDate.getDate() - 7);
  if (new Date() < unlockDate) notFound();

  // Must be approved member
  const { data: member } = await supabase
    .from("members")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (!member || member.status !== "approved") redirect("/agenda");

  // Must be signed up for this session
  const { data: signup } = await supabase
    .from("session_signups")
    .select("id")
    .eq("session_id", id)
    .eq("member_id", member.id)
    .maybeSingle();

  if (!signup) redirect("/agenda");

  const work = sessionData.works;
  const raw = work.scenario;
  const s: ScenarioData | null = raw
    ? typeof raw === "string"
      ? JSON.parse(raw)
      : (raw as unknown as ScenarioData)
    : null;

  if (!s) notFound();

  const achternaam = work.auteur?.split(" ").at(-1)?.toUpperCase() ?? "DE AUTEUR";

  const now = new Date();
  const maand = now.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
  const maandLabel = maand.charAt(0).toUpperCase() + maand.slice(1);

  const starts = ["00:00", "00:10", "00:30", "00:45", "01:05"];

  return (
    <div className="bg-paper min-h-screen">
      {/* Nav */}
      <div className="border-b border-ink/10 px-8 py-3 flex items-center justify-between">
        <Link href="/agenda" className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
          ← Terug naar agenda
        </Link>
        <span className="text-[9px] font-black uppercase tracking-label text-ink/30">Gespreksgids</span>
      </div>

      <div className="max-w-205 mx-auto px-8 py-10">

        {/* Publicatieheader */}
        <div className="flex items-center justify-between border-b border-ink/20 pb-4 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-black">▲</span>
            <span className="text-[9px] font-black uppercase tracking-label text-ink/55">
              Tijdgeest · Modern Leesgenootschap
            </span>
          </div>
          <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.18em] text-ink/40">
            <span>Maand <span className="text-ink/80 normal-case font-black">{maandLabel}</span></span>
            <span>Duur <span className="text-ink/80">{TOTAL} min</span></span>
          </div>
        </div>

        {/* Boek + synopsis */}
        <div className="grid grid-cols-[1fr_240px] gap-10 mb-10">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/40 mb-5">
              Gespreksscenario · Boek van de maand
            </p>
            <h1 className="text-[60px] font-black leading-[0.93] tracking-tight mb-6">
              {work.originele_titel}
              <span className="text-terracotta">.</span>
            </h1>
            <p className="text-[14px] font-black">
              {work.auteur}
              {s.genre && <span className="font-normal text-ink/45"> · {s.genre}</span>}
              {work.jaar_eerste_publicatie && <span className="font-normal text-ink/45"> · {work.jaar_eerste_publicatie}</span>}
            </p>
          </div>

          {s.synopsis && (
            <div className="bg-krant/25 p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/50 mb-3">Over de bundel</p>
              <p className="text-[13px] italic text-ink/75 leading-relaxed">{s.synopsis}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/40">De avond in één oogopslag</p>
            <p className="text-[9px] font-mono text-ink/30">Start → {TOTAL} min.</p>
          </div>
          <div className="flex">
            {FASES.map((f) => (
              <div
                key={f.nr}
                className={`border border-r-0 last:border-r border-ink/20 px-2 pt-1.5 pb-2 ${"accent" in f && f.accent ? "bg-terracotta text-paper" : "bg-paper text-ink"}`}
                style={{ flexBasis: `${(f.min / TOTAL) * 100}%` }}
              >
                <div className="flex items-end gap-1">
                  <span className={`text-[8px] font-black ${"accent" in f && f.accent ? "text-paper/50" : "text-ink/35"}`}>{f.nr}</span>
                  <span className="text-[20px] font-black leading-none tabular-nums">{f.min}</span>
                  <span className={`text-[8px] pb-0.5 ${"accent" in f && f.accent ? "text-paper/60" : "text-ink/40"}`}>
                    {f.eind.replace("00:", "").replace("01:", "1:")}′
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-1.5">
            {FASES.map((f) => (
              <div
                key={f.nr}
                className="text-[8px] font-black uppercase tracking-widest text-ink/40 leading-tight pr-1"
                style={{ flexBasis: `${(f.min / TOTAL) * 100}%` }}
              >
                {f.pre ? `${f.pre} ${f.italic}` : f.italic}
              </div>
            ))}
          </div>
        </div>

        {/* Fase 01: Opening */}
        <div className="grid grid-cols-[180px_1fr] gap-10 py-10 border-t border-ink/15">
          <FaseSidebar fase={FASES[0]} start={starts[0]} />
          <div>
            <p className="text-[14px] text-ink/65 leading-relaxed">{s.welkomstwoord}</p>
            <SubLabel label="IJsbreker" slot="A" count="1 vraag" />
            <Q prefix="Q.">{s.ijsbreker_vraag}</Q>
          </div>
        </div>

        {/* Fase 02: Plot & Personages */}
        <div className="grid grid-cols-[180px_1fr] gap-10 py-10 border-t border-ink/15">
          <FaseSidebar fase={FASES[1]} start={starts[1]} />
          <div>
            <SubLabel label="Personages" slot="A" count="2 vragen" />
            {s.personages && (
              <p className="text-[13px] text-ink/65 leading-relaxed mb-1">{s.personages}</p>
            )}
            <Q prefix="Q1.">{s.vraag_1}</Q>
            <Q prefix="Q2.">{s.vraag_2}</Q>
          </div>
        </div>

        {/* Fase 03: Stijl & Structuur */}
        <div className="grid grid-cols-[180px_1fr] gap-10 py-10 border-t border-ink/15">
          <FaseSidebar fase={FASES[2]} start={starts[2]} />
          <div>
            <SubLabel
              label={`Wat ${achternaam} wel én niet zegt`}
              slot="A"
              count={s.vergelijkingsvraag ? "1 vraag + citaat + vergelijking" : "1 vraag + citaat"}
            />
            <Q prefix="Q.">{s.vraag_3}</Q>
            {s.stijl_fragment && (
              <div className="mt-5 border border-ink/15 p-5">
                <div className="flex gap-3">
                  <span className="text-[28px] text-terracotta/40 font-black leading-none shrink-0 mt-1">&ldquo;</span>
                  <div>
                    <p className="text-[13px] italic text-ink/70 leading-relaxed">{s.stijl_fragment}</p>
                    {s.stijl_fragment_toelichting && (
                      <p className="text-[11px] text-ink/40 mt-2 leading-relaxed">{s.stijl_fragment_toelichting}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {s.vergelijkingsvraag && (
              <>
                <SubLabel label="Vergelijking" slot="B" count="1 vraag" />
                <Q prefix="Q.">{s.vergelijkingsvraag}</Q>
              </>
            )}
          </div>
        </div>

        {/* Fase 04: Thema's */}
        <div className="grid grid-cols-[180px_1fr] gap-10 py-10 border-t border-ink/15">
          <FaseSidebar fase={FASES[3]} start={starts[3]} />
          <div>
            <SubLabel label="De rode draad" slot="A" count="2 vragen" />
            <Q prefix="Q1.">{s.vraag_4}</Q>
            <Q prefix="Q2.">{s.vraag_5}</Q>
            <SubLabel label="Actualiteit" slot="B" count="1 vraag" />
            <Q prefix="Q.">{s.actualiteitsvraag}</Q>
          </div>
        </div>

        {/* Fase 05: Afsluiting */}
        <div className="grid grid-cols-[180px_1fr] gap-10 py-10 border-t border-ink/15">
          <FaseSidebar fase={FASES[4]} start={starts[4]} />
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/35 mb-2">A · 5 min</p>
              <p className="text-[15px] font-black mb-2">Citaatronde</p>
              <p className="text-[12px] text-ink/55 leading-relaxed mb-3">
                Iedereen leest een aangestreepte zin voor. Geen toelichting tenzij gevraagd.
              </p>
              <p className="text-[13px] font-black leading-snug">
                Wie heeft een zin aangestreept — en waarom juist die?
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/35 mb-2">B · 3 min</p>
              <p className="text-[15px] font-black mb-2">Cijfer</p>
              <p className="text-[12px] text-ink/55 leading-relaxed mb-3">
                Iedereen schrijft eerst zélf een cijfer op (1–10), pas daarna delen. Voorkomt dat de groep elkaar beïnvloedt.
              </p>
              <p className="text-[13px] font-black">Gezamenlijk gemiddelde: ___ / 10</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/35 mb-2">C · 2 min</p>
              <p className="text-[15px] font-black mb-2">Aanrader?</p>
              <p className="text-[12px] text-ink/55 leading-relaxed mb-3">
                De hamvraag — kort en concreet. Niet &ldquo;voor wie ervan houdt&rdquo;, wél een naam, een type, een moment.
              </p>
              <p className="text-[13px] font-black leading-snug">
                Zou je dit boek aanraden — en aan wie specifiek?
              </p>
            </div>
          </div>
        </div>

        {/* Voor de gespreksleider */}
        <div className="bg-ink text-paper p-8 mt-4">
          <div className="grid grid-cols-[160px_1fr] gap-10 items-start">
            <div>
              <p className="text-[9px] font-black uppercase tracking-label text-paper/45 mb-3">Voor de gespreksleider</p>
              <p className="text-[26px] font-black leading-tight">
                Vier<br />
                <em className="text-terracotta italic">spelregels.</em>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { titel: "Bewaak de klok, niet het script.", tekst: "Loopt fase 02 uit omdat iedereen erin zit? Kort 03 in, niet andersom." },
                { titel: "Stilte mag.", tekst: "Tel tot vijf voor je een vraag herformuleert — het beste antwoord komt uit het ongemak." },
                { titel: "Niemand hoeft alles te zeggen.", tekst: "Doe één rondje per fase voor de stillere stemmen, daarna pas vrij gesprek." },
                { titel: "Quote eerst, mening later.", tekst: "Bij twijfel: vraag of iemand de plek in het boek kan vinden." },
              ].map(({ titel, tekst }) => (
                <p key={titel} className="text-[12px] leading-relaxed">
                  <span className="font-black">{titel}</span>{" "}
                  <span className="text-paper/55">{tekst}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-ink/10">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/25">▲ Tijdgeest · Modern Leesgenootschap</p>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/25">Gespreksgids</p>
        </div>

      </div>
    </div>
  );
}
