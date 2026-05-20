import Image from "next/image";
import Nav from "@/components/nav";
import Link from "next/link";

export const metadata = {
  title: "Over Tijdgeest — Een leesgenootschap",
};

function SideLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="w-36 shrink-0 hidden md:block pt-1">
      <p className="text-[11px] font-black text-ink/40 mb-2">{num}.</p>
      <div className="border-t border-ink/20 pt-2">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function OverPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-16">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/35 mb-8">
          Over Tijdgeest · Een leesgenootschap
        </p>
        <h1 className="font-editorial text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.02em] mb-1">
          Je hebt het boek uit.
        </h1>
        <h1 className="font-editorial italic text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.02em] mb-8">
          Nu wil je erover praten.
        </h1>
        <div className="w-12 border-t-2 border-ink mb-8" />
        <p className="text-[17px] text-ink/70 leading-relaxed">
          Eén boek. Eén kleine groep. Eén avond die verder gaat.
        </p>
      </section>

      {/* I — Wat we doen */}
      <section className="max-w-3xl mx-auto px-6 pb-0">
        <div className="flex gap-10 items-start">
          <SideLabel num="I" label="Wat we doen" />
          <div className="flex-1 min-w-0">
            <h2 className="font-editorial text-[36px] md:text-[44px] leading-[1.1] tracking-[-0.015em] mb-8">
              Een open leeslijst, gevuld door de redactie en door lezers zelf.
            </h2>
            <p className="text-[15px] leading-[1.65] text-ink/70 mb-5">
              <span className="float-left font-editorial text-[64px] leading-[0.8] mr-2 mt-1 font-medium">T</span>
              ijdgeest heeft een open leeslijst — gevuld door de redactie en door lezers
              zelf. Romans, essays, non-fictie. Titels die iets zeggen over de wereld zoals
              die nu is.
            </p>
            <p className="text-[15px] leading-[1.65] text-ink/70 mb-12">
              Zie je een boek dat je wilt lezen? Meld je aan. Tussen de vier en acht lezers,
              en de avond gaat door.{" "}
              <strong className="font-black text-ink">
                Geen abonnement, geen verplichte aanwezigheid.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* Foto */}
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <div className="relative aspect-[16/7] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80"
            alt="Een leesclub in de Pijp"
            fill
            className="object-cover grayscale"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/35">
            Plate II · De stille kant van een avond
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/35">
            Een leesclub in de Pijp, voorjaar 2025
          </p>
        </div>
      </section>

      {/* II — Hoe we lezen */}
      <section className="bg-terracotta text-paper py-16 mt-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-10 items-start">
            <div className="w-36 shrink-0 hidden md:block pt-1">
              <p className="text-[11px] font-black text-paper/40 mb-2">II.</p>
              <div className="border-t border-paper/20 pt-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-paper/40">
                  Hoe we lezen
                </p>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-editorial text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.015em] text-paper mb-6">
                Eén leeslijst. Drie manieren om mee te lezen.
              </h2>
              <p className="text-[15px] leading-[1.65] text-paper/75 mb-10">
                Tijdgeest heeft één leeslijst. Elk boek kan een of meer tags hebben die
                aangeven wat voor avond het wordt.
              </p>

              <div className="border-t border-paper/20">
                {[
                  {
                    tag: "In één ruk",
                    desc: "Een novelle of kort verhaal dat je in één avond uitleest. Geen weken plannen, geen achterstand. Goed voor wie lang niet heeft gelezen.",
                    link: null,
                  },
                  {
                    tag: "Boek & Film",
                    desc: "Lees het boek voordat de film uitkomt. Daarna kijk je nooit meer hetzelfde.",
                    link: null,
                  },
                  {
                    tag: "On Request",
                    desc: "Een titel genomineerd door een lezer. Zodra vier mensen zich aanmelden, plannen we een avond.",
                    link: { label: "Lees verder →", href: "/on-request" },
                  },
                ].map((f) => (
                  <div key={f.tag} className="flex flex-col sm:grid sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 py-5 border-b border-paper/20 items-start">
                    <span className="inline-block bg-ink text-paper text-[9px] font-black uppercase tracking-[0.14em] px-2.5 py-1.5 w-fit">
                      {f.tag}
                    </span>
                    <p className="text-[14px] leading-[1.65] text-paper/75">
                      {f.desc}{" "}
                      {f.link && (
                        <Link href={f.link.href} className="underline font-black text-paper">
                          {f.link.label}
                        </Link>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-[13px] italic text-paper/55 mt-8 leading-relaxed">
                Staat er geen tag bij een titel? Dan is het gewoon een goed boek dat de
                moeite waard is om samen te lezen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* III — Hoe het begon */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex gap-10 items-start">
          <SideLabel num="III" label="Hoe het begon" />
          <div className="flex-1 min-w-0">
            <h2 className="font-editorial text-[36px] md:text-[44px] leading-[1.1] tracking-[-0.015em] mb-8">
              Een plek voor mensen die serieus lezen,{" "}
              <em>maar niet serieus hoeven te doen.</em>
            </h2>
            <p className="text-[15px] leading-[1.65] text-ink/70 mb-5">
              Tijdgeest is begonnen als een eenvoudig idee: een plek voor mensen die
              serieus lezen, maar niet serieus hoeven te doen.
            </p>
            <p className="text-[15px] leading-[1.65] text-ink/70 mb-14">
              De avonden zijn al begonnen.
            </p>

            {/* Handtekening */}
            <div className="flex items-center gap-5">
              <svg width="80" height="32" viewBox="0 0 80 32" fill="none" className="text-ink/50">
                <path d="M4 24 C10 8, 20 28, 30 16 C40 4, 50 28, 60 20 C68 14, 72 22, 76 18"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
              <div>
                <p className="text-[15px] font-black tracking-tight">Martijn</p>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40 mt-0.5">
                  Oprichter · Tijdgeest
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
