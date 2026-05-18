function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[11px] font-mono text-ink/35">{index}</span>
        <h2 className="text-[12px] font-black uppercase tracking-[0.18em] text-ink">{title}</h2>
        <div className="flex-1 border-t border-ink/15" />
      </div>
      {children}
    </section>
  );
}

function FaviconBox({
  size,
  label,
  sub,
  dark = false,
}: {
  size: number;
  label: string;
  sub: string;
  dark?: boolean;
}) {
  return (
    <div className={`border border-ink/12 p-6 flex flex-col items-center gap-4 ${dark ? "bg-ink" : "bg-white"}`}>
      <div className="flex items-center justify-center" style={{ width: 64, height: 64 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.ico"
          alt="favicon"
          width={size}
          height={size}
          style={{ imageRendering: "pixelated", width: size, height: size }}
        />
      </div>
      <div className="text-center">
        <p className={`text-[12px] font-black ${dark ? "text-paper" : "text-ink"}`}>{label}</p>
        <p className={`text-[10px] font-mono mt-0.5 ${dark ? "text-paper/40" : "text-ink/40"}`}>{sub}</p>
      </div>
    </div>
  );
}

function EnlargedBox({
  size,
  renderSize,
  label,
  sub,
  smooth = false,
}: {
  size: number;
  renderSize: number;
  label: string;
  sub: string;
  smooth?: boolean;
}) {
  return (
    <div className="border border-ink/12 bg-white p-8 flex flex-col items-center gap-5">
      <div className="flex items-center justify-center" style={{ width: renderSize, height: renderSize }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.ico"
          alt="favicon"
          width={size}
          height={size}
          style={{
            imageRendering: smooth ? "auto" : "pixelated",
            width: renderSize,
            height: renderSize,
          }}
        />
      </div>
      <div className="text-center">
        <p className="text-[12px] font-black">{label}</p>
        <p className="text-[10px] font-mono text-ink/40 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function FaviconGuidePage() {
  return (
    <main className="min-h-screen bg-paper px-12 py-12 max-w-[900px] mx-auto">

      {/* Header */}
      <header className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6">
          Favicon · Uit lezerssilhouet
        </p>
        <h1 className="text-[52px] font-black tracking-tight leading-none mb-8">
          Tijdgeest<span className="text-terracotta italic font-medium">.</span>
        </h1>
        <div className="border-t border-ink/30" />
      </header>

      {/* Intro */}
      <p className="text-[13px] leading-[1.7] text-ink/70 max-w-xl mb-12">
        Een vereenvoudigde versie van het lezerssilhouet uit de brand guide — terracotta achtergrond, inkt-silhouet, ivoren boekband.
        Geleverd als <code className="font-mono text-[12px]">.ico</code> met drie embedded resoluties plus losse PNG&apos;s voor moderne browsers.
      </p>

      {/* 01 Browser tab */}
      <Section index="01" title="In de browser-tab">
        <div className="border border-ink/12 bg-white rounded-sm overflow-hidden">
          <div className="bg-krant/60 px-3 pt-3 pb-0 flex items-end gap-1">
            {[
              "Tijdgeest — Modern Leesg…",
              "Editie 04 · Boek vd maand",
              "Aantekeningen — hfdst. 7",
            ].map((tab, i) => (
              <div
                key={tab}
                className={`flex items-center gap-2 px-3 py-2 text-[11px] rounded-t-sm border border-b-0 max-w-[190px] ${
                  i === 0
                    ? "bg-paper border-ink/15 font-medium"
                    : "bg-krant/40 border-transparent text-ink/50"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicon.ico" alt="" width={14} height={14} className="shrink-0" style={{ imageRendering: "pixelated" }} />
                <span className="truncate">{tab}</span>
                <span className="ml-auto text-ink/30 shrink-0">✕</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 px-4 py-2.5 bg-paper">
            <p className="text-[11px] font-mono text-ink/35">tijdgeest.nl/editie/04</p>
          </div>
        </div>
      </Section>

      {/* 02 Resoluties */}
      <Section index="02" title="Resoluties (1×, ware grootte)">
        <div className="grid grid-cols-4 gap-3">
          <FaviconBox size={16} label="16 × 16"  sub="browser tab" />
          <FaviconBox size={32} label="32 × 32"  sub="bookmark · retina tab" />
          <FaviconBox size={48} label="48 × 48"  sub="Windows taskbar" />
          <FaviconBox size={48} label="op inkt"  sub="contrast check" dark />
        </div>
      </Section>

      {/* 03 Vergrote weergave */}
      <Section index="03" title="Vergrote weergave">
        <div className="grid grid-cols-3 gap-3">
          <EnlargedBox size={48} renderSize={128} label="48px → 128px (pixelated)" sub="laat exacte pixel-rendering zien" />
          <EnlargedBox size={48} renderSize={128} label="48px → 128px (smooth)"    sub="zoals browsers vaak weergeven" smooth />
          <EnlargedBox size={16} renderSize={128} label="16px → 128px (pixelated)" sub="pixel-niveau detail" />
        </div>
      </Section>

      {/* 04 Geleverde bestanden */}
      <Section index="04" title="Geleverde bestanden">
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "favicon.ico",    desc: "16 · 32 · 48 px" },
            { name: "favicon-16.png", desc: "16 × 16" },
            { name: "favicon-32.png", desc: "32 × 32" },
            { name: "favicon-48.png", desc: "48 × 48" },
          ].map((f) => (
            <div key={f.name} className="border border-ink/12 bg-white px-4 py-3">
              <p className="text-[12px] font-black font-mono">{f.name}</p>
              <p className="text-[11px] font-mono text-ink/40 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 HTML-snippet */}
      <Section index="05" title="HTML-snippet">
        <div className="border border-ink/12 bg-white px-6 py-5">
          <p className="font-mono text-[11px] text-ink/35 mb-3">{`<!-- in <head> -->`}</p>
          {[
            `<link rel="icon" type="image/x-icon" href="/favicon.ico" />`,
            `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />`,
            `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />`,
            `<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />`,
          ].map((line) => (
            <p key={line} className="font-mono text-[11px] leading-[1.8]">
              <span className="text-terracotta">{`<link`}</span>
              <span className="text-ink/60">{line.slice(5, line.lastIndexOf(" />"))}</span>
              <span className="text-terracotta">{` />`}</span>
            </p>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-ink/15 pt-6 flex items-center justify-between mt-8">
        <p className="text-[11px] text-ink/40">Tijdgeest · Favicon set</p>
        <p className="text-[11px] text-ink/40">v1.0 · Mei 2026</p>
      </footer>

    </main>
  );
}
