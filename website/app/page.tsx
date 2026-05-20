import Image from "next/image";
import Nav from "@/components/nav";


export default function HomePage() {
  return (
    <>
      <Nav />

      {/* Hero tekst */}
      <section className="max-w-6xl mx-auto px-6 pt-10 md:pt-16">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/50 mb-8 md:mb-10">
          Boeken veranderen hoe je kijkt
        </p>
        <h1 className="text-[42px] md:text-[76px] font-black leading-[0.95] tracking-[-0.025em] mb-6 md:mb-7 max-w-2xl">
          Lees samen,
          <br />
          denk verder.
        </h1>
        <p className="text-[15px] leading-[1.55] text-ink/60 max-w-md mb-8">
          Tijdgeest brengt lezers bij elkaar rond één boek. Een kleine groep,
          een goede fles wijn, en een avond die verder gaat dan de samenvatting.
        </p>
        <div className="flex gap-3 mb-4 justify-center">
          <a
            href="/leesclubs"
            className="bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-terracotta/90 transition-colors"
          >
            Registreer je
          </a>
          <a
            href="/over"
            className="border border-ink text-ink text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-ink hover:text-paper transition-colors"
          >
            Bekijk de leeslijst
          </a>
        </div>
        <p className="text-center text-[11px] text-muted mb-12 tracking-wide">
          Kosteloos · Geen verplichtingen
        </p>
      </section>

      {/* Hero afbeelding */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-10 md:pb-16">
        <div className="relative w-full aspect-4/3 md:aspect-16/7 overflow-hidden">
          <Image
            src="/helena-lopes-5Wcv4joSriY-unsplash.jpg"
            alt="Tijdgeest lezers samen"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/20 to-transparent">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-paper/70">
              Zomer editie — Amsterdam 2024
            </span>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-terracotta text-paper py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[22px] md:text-[32px] font-medium italic leading-snug tracking-tight text-paper">
            &ldquo;Think before you speak.
            <br className="hidden md:block" /> Read before you think.&rdquo;
          </p>
          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.22em] text-paper/60">
            Fran Lebowitz
          </p>
        </div>
      </section>

      {/* Boek van de maand */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
        {/* Boekkaart */}
        <div>
          <div className="inline-block bg-terracotta text-paper text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 mb-5">
            Besproken in NRC
          </div>
          <div className="border border-ink/10 p-8 flex gap-7 bg-paper">
            <div className="relative w-28 shrink-0 aspect-[2/3] bg-krant overflow-hidden">
              <Image
                src="/scurati.jpg"
                alt="Het Einde en het Begin"
                fill
                className="object-cover"
              />
            </div>
            <div className="pt-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/50 mb-2">
                Antonio Scurati
              </p>
              <h3 className="text-xl font-black leading-tight tracking-tight">
                Het Einde
                <br />
                en het Begin
              </h3>
              <p className="text-[11px] text-ink/50 mt-4 leading-relaxed font-mono">
                Historische fictie
                <br />
                512 bladzijden
              </p>
            </div>
          </div>
        </div>

        {/* Boekbeschrijving */}
        <div className="pt-0 md:pt-12">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/50 mb-4">
            We lezen nu
          </p>
          <h2 className="text-[36px] font-black tracking-tight leading-[1.05] mb-2">
            Het Einde
            <br />
            en het Begin
          </h2>
          <p className="text-sm font-medium text-ink/50 mb-6 italic">
            Antonio Scurati
          </p>
          <p className="text-[15px] leading-[1.6] text-ink/65 mb-8">
            Het derde deel in Scurati&apos;s M-trilogie — een documentaire roman
            die het verhaal van Mussolini&apos;s regime vertelt op het moment
            dat het begint te wankelen. Spannend, meeslepend en onthullend
            actueel.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.nrc.nl/nieuws/2026/03/17/antonio-scurati-laat-in-het-slotdeel-van-zijn-mussolini-cyclus-diens-geest-op-aarde-terugkeren-a4923206?utm_source=clipboard&utm_medium=clipboard&utm_campaign=share&utm_term=share-modal&gift_token=4923206~1779796678~DHTiBkTDRSeZnWtwrSEdlg~0zgO4CNiPYEGBZu0vVkMWqlKp3S2fQQxzxUK1I4XjNI"
              target="_blank"
              className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-ink/85 transition-colors"
            >
              Recensie in NRC →
            </a>
            <a
              href="#"
              className="border border-ink text-ink text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-ink hover:text-paper transition-colors"
            >
              Meld je aan
            </a>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section id="formats" className="bg-krant/30 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-[42px] font-black tracking-tight leading-tight mb-3">
                De formats
              </h2>
              <p className="text-[15px] text-ink/60 max-w-lg leading-relaxed">
                Niet elke lezer leest hetzelfde, en niet elk boek vraagt om dezelfde avond.
                Kies het ritme dat bij je past.
              </p>
            </div>
            <p className="hidden md:block text-[10px] font-black uppercase tracking-[0.22em] text-ink/35 pt-2">
              Drie manieren om mee te lezen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-ink/12">
            {[
              {
                photo: "photo-1481627834876-b7833e8f5570",
                cat: "Fictie · Kort proza",
                title: "In Één Ruk",
                body: "Een novelle of kort verhaal dat je in één avond uitleest. Geen weken plannen, geen achterstand. Gewoon lezen, en de volgende dag erover praten.",
                link: null,
              },
              {
                photo: "photo-1485846234645-a62644f84728",
                cat: "Fictie · Actueel",
                title: "Boek & Film",
                body: "Lees het boek voordat de film uitkomt. Daarna kijk je nooit meer hetzelfde.",
                link: null,
              },
              {
                photo: "photo-1521587760476-6c12a4b040da",
                cat: "Jouw keuze · Op aanvraag",
                title: "On Request",
                body: "Welk boek wil jij bespreken? Geef een titel op. Zodra vier lezers zich aansluiten, plannen we een avond — bij jou in de buurt of online.",
                link: { label: "Stel een titel voor →", href: "#" },
              },
            ].map((f, i) => (
              <div key={f.title} className={`flex flex-col ${i < 2 ? "md:border-r border-ink/12" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/${f.photo}?w=600&q=75`}
                    alt={f.title}
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1 bg-paper border-t border-ink/12">
                  <p className="text-[10px] font-black uppercase tracking-label text-ink/40 mb-3">
                    {f.cat}
                  </p>
                  <h3 className="text-[28px] font-black tracking-tight leading-tight mb-4">
                    {f.title}
                  </h3>
                  <p className="text-[14px] leading-[1.65] text-ink/60 flex-1">
                    {f.body}
                  </p>
                  {f.link && (
                    <>
                      <div className="border-t border-ink/10 mt-6 pt-5">
                        <a
                          href={f.link.href}
                          className="text-[13px] font-black text-terracotta hover:underline"
                        >
                          {f.link.label}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/10 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span className="text-sm font-black">
            Tijdgeest
            <span className="italic font-medium text-terracotta">.</span>
          </span>
          <span className="text-xs text-ink/40">
            © 2026 Tijdgeest. De boeken van dit moment.
          </span>
        </div>
      </footer>
    </>
  );
}
