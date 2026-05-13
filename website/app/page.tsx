import Image from "next/image";
import Nav from "@/components/nav";

const clubs = [
  {
    name: "De Late Lezers",
    meta: "Fictie · Amsterdam",
    photo: "photo-1524995997946-a1c2e315a42f",
  },
  {
    name: "Stille Stemmen",
    meta: "Poëzie · Utrecht",
    photo: "photo-1507842217343-583bb7270b66",
  },
  {
    name: "Mangelkalshering",
    meta: "Non-fictie · Rotterdam",
    photo: "photo-1512820790803-83ca734da794",
  },
  {
    name: "Het Tweede Lezen",
    meta: "Klassiekers · Den Haag",
    photo: "photo-1456513080510-7bf3a84b82f8",
  },
  {
    name: "Nachtboek",
    meta: "Thriller · Amsterdam",
    photo: "photo-1495640388908-05fa85288e61",
  },
  {
    name: "Kleine Wonderen",
    meta: "Verhalend · Haarlem",
    photo: "photo-1521587760476-6c12a4b040da",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-10 md:pt-16 pb-0">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/50 mb-8 md:mb-10">
          De boeken van dit moment
        </p>
        <h1 className="text-[42px] md:text-[76px] font-black leading-[0.95] tracking-[-0.025em] mb-6 md:mb-7 max-w-2xl">
          Lees samen,
          <br />
          denk verder.
        </h1>
        <p className="text-[15px] leading-[1.55] text-ink/60 max-w-md mb-8">
          Tijdgeest brengt nieuwsgierige lezers bij elkaar in kleine,
          zorgvuldig samengestelde sessies. Eén boek per maand, één avond, één
          gesprek dat je bijblijft.
        </p>
        <div className="flex gap-3 mb-12">
          <a
            href="/leesclubs"
            className="bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-terracotta/90 transition-colors"
          >
            Plan je leesclub
          </a>
          <a
            href="/over"
            className="border border-ink text-ink text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-ink hover:text-paper transition-colors"
          >
            Meer over Tijdgeest
          </a>
        </div>

        {/* Hero image */}
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
            &ldquo;Think before you speak.<br className="hidden md:block" /> Read before you think.&rdquo;
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
            Aangeraden
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
            Boek van de maand
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
            Het derde deel in Scurati&apos;s M-trilogie — een documentaire
            roman die het verhaal van Mussolini&apos;s regime vertelt op het
            moment dat het begint te wankelen. Spannend, meeslepend en
            onthullend actueel.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-ink/85 transition-colors"
            >
              Bestel dit boek
            </a>
            <a
              href="#"
              className="border border-ink text-ink text-xs font-black uppercase tracking-[0.12em] px-5 py-3.5 hover:bg-ink hover:text-paper transition-colors"
            >
              Lees de bespreking
            </a>
          </div>
        </div>
      </section>

      {/* Leesclubs */}
      <section className="bg-krant/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight">
              Onze leesclubs
            </h2>
            <a
              href="/leesclubs"
              className="text-xs font-black uppercase tracking-[0.15em] text-terracotta hover:underline"
            >
              Zie alle clubs →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {clubs.map((club) => (
              <a key={club.name} href="#" className="group block bg-paper">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/${club.photo}?w=600&q=75`}
                    alt={club.name}
                    fill
                    className="object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 border-t border-ink/10">
                  <h3 className="text-sm font-black">{club.name}</h3>
                  <p className="text-[11px] text-ink/50 mt-0.5">{club.meta}</p>
                </div>
              </a>
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
