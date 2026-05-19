import Nav from "@/components/nav";
import NominationForm from "./nomination-form";

export const metadata = {
  title: "On Request — Tijdgeest",
};

export default function OnRequestPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-16">

        {/* Breadcrumb */}
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/35 mb-8">
          De Formats{" "}
          <span className="mx-2">/</span>
          On Request
        </p>

        {/* Badges */}
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 bg-terracotta/20 text-terracotta text-[10px] font-black uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            Nieuw format
          </span>
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full border border-ink/25 text-ink">
            Vooraanmelding open
          </span>
        </div>

        {/* Titel */}
        <h1 className="text-[56px] md:text-[76px] font-black leading-[0.93] tracking-[-0.025em] mb-8 max-w-2xl">
          On Request.
          <br />
          De titel die jij
          <br />
          graag wilt lezen.
        </h1>

        {/* Intro */}
        <p className="text-[17px] leading-[1.65] text-ink/65 max-w-xl mb-14">
          Onze leesclubs lezen wat het genootschap kiest. On Request draait het
          om: jij geeft een titel op, en zodra er genoeg medelezers zijn,
          plannen we een avond.
        </p>

        {/* Notice */}
        <div className="border border-ink/15 px-7 py-6 flex items-start gap-4 max-w-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta shrink-0 mt-1" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-label text-ink/50 mb-2">
              Let op · Nog niet live
            </p>
            <p className="text-[14px] leading-[1.7] text-ink/65">
              On Request is nog niet functioneel — we starten dit format in het
              najaar van 2026. Je kunt nu al een titel nomineren; we bewaren je
              voorstel en nemen contact op zodra het format live gaat. Vroege
              nominaties bepalen welke boeken als eerste worden ingepland.
            </p>
          </div>
        </div>

      </section>

      {/* Separator */}
      <div className="border-t border-ink/15" />

      {/* Hoe werkt het */}
      <section className="bg-krant/40 py-16">
        <div className="max-w-4xl mx-auto px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-5">
          Hoe werkt het?
        </p>
        <h2 className="text-[42px] font-black tracking-tight leading-tight mb-14">
          Vier stappen, een nieuwe leesavond.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              n: "01",
              title: "Nomineer een titel",
              body: "Geef het boek op dat jij graag met anderen wilt bespreken. Roman, essay, debuut — alles kan, zolang het in vertaling of origineel verkrijgbaar is.",
            },
            {
              n: "02",
              title: "Bepaal de kring",
              body: "Geef aan hoeveel medelezers je zoekt — minimaal vier, maximaal twaalf. Hoe groter de kring, hoe langer het kan duren voor we vol zitten.",
            },
            {
              n: "03",
              title: "Wij verzamelen",
              body: "Wij plaatsen je nominatie op de open lijst. Andere leden schrijven zich in. Zodra het minimum bereikt is, nemen we contact op.",
            },
            {
              n: "04",
              title: "Bij jou of online",
              body: "Jij kiest: een avond bij jou in de buurt, of online via Zoom. Wij regelen de uitnodiging, de leidraad en — als je dat wilt — een begeleider.",
            },
          ].map((step) => (
            <div key={step.n}>
              <p className="text-[13px] font-black text-ink mb-3">{step.n}</p>
              <div className="border-t border-ink/20 mb-5" />
              <h3 className="text-[17px] font-black tracking-tight mb-3">{step.title}</h3>
              <p className="text-[13px] leading-[1.7] text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>
        </div>
      </section>
      <div className="border-t border-ink/15" />

      {/* Onze voorbereiding */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Links */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-5">
              Onze voorbereiding
            </p>
            <h2 className="text-[42px] font-black tracking-tight leading-tight mb-8">
              Geen vast programma, wel een goede basis.
            </h2>
            <p className="text-[15px] leading-[1.7] text-ink/65 mb-5">
              Voordat de avond plaatsvindt, zoeken we uit waar het boek eerder
              is besproken — recensies, podcasts, interviews met de auteur.
              Niet om te imiteren, maar om context te geven.
            </p>
            <p className="text-[15px] leading-[1.7] text-ink/65">
              Daarnaast stellen we een aantal vragen op die als leidraad
              dienen voor het gesprek. Geen huiswerk, geen vragenlijst —
              gewoon vier of vijf openers die het gesprek op gang helpen als
              het stil valt.
            </p>
          </div>

          {/* Rechts */}
          <div>
            {[
              { label: "Recensies",             value: "NRC, De Standaard, De Groene, internationale pers." },
              { label: "Podcasts &\nInterviews", value: "Auteur in gesprek met andere lezers en denkers." },
              { label: "Gesprekskaart",          value: "Vier tot vijf vragen, gestuurd één week voor de avond." },
              { label: "Begeleider",             value: "Optioneel — een ervaren lezer modereert het gesprek." },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-[160px_1fr] gap-6 py-5 border-b border-ink/12 first:border-t first:border-ink/12">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-ink/70 whitespace-pre-line leading-relaxed">
                  {row.label}
                </p>
                <p className="text-[14px] leading-[1.65] text-ink/65">{row.value}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
      <div className="border-t border-ink/15" />

      {/* Nominatieformulier */}
      <section className="bg-terracotta py-16 px-6">
        <div className="max-w-2xl mx-auto bg-paper px-10 py-12">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
            Nomineer een titel
          </p>
          <h2 className="text-[36px] font-black tracking-tight leading-tight mb-3">
            Welk boek wil jij bespreken?
          </h2>
          <p className="text-[14px] leading-[1.65] text-ink/60 mb-10">
            Vul je voorstel in. We bewaren je nominatie en nemen contact op zodra
            het format live gaat of het minimum aan medelezers is bereikt.
          </p>
          <NominationForm />
        </div>
      </section>
    </>
  );
}
