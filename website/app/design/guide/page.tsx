export default function ComponentGuidePage() {
  return (
    <main className="min-h-screen bg-paper px-12 py-12 max-w-360 mx-auto">

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6">
              UI Library · Radix Themes · Custom Theme
            </p>
            <h1 className="text-[52px] font-black tracking-tight leading-none">
              Tijdgeest<span className="text-terracotta italic font-medium">.</span>
            </h1>
          </div>
          <div className="text-right pt-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink mb-1">
              Component Sheet
            </p>
            <p className="text-[12px] text-ink/50">v0.1 · Mei 2026</p>
            <p className="text-[12px] text-ink/50">Afgeleid van Brand Guide v1.0</p>
          </div>
        </div>
        <div className="border-t border-ink/30 mt-8" />
      </header>

      {/* Sectie 00 */}
      <Section index="00" title="Mapping op Radix Themes">
        <p className="text-[13px] leading-[1.7] text-ink/70 max-w-3xl mb-8">
          Tijdgeest&apos;s editorial palette wordt vertaald naar twee custom Radix-kleurschalen (
          <code className="font-mono text-[12px]">accent</code> en{" "}
          <code className="font-mono text-[12px]">gray</code>), plus drie semantische tokens.
          De ondersteunende accents Zeegroen en Mosterd worden ingezet voor statussen en uitlichtingen,
          niet als primaire UI-kleur. Scherpe hoeken (<code className="font-mono text-[12px]">radius=&quot;1&quot;</code>
          ), een warme gray afgeleid van Inkt/Ivoor, en terracotta als enige actie-accent — passend bij het
          &quot;korte zinnen, royale witruimte&quot;-principe uit de gids.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TokenCard
            label="AccentColor"
            swatch="#C97B5C"
            name="Terracotta"
            sub="step 9 · #C97B5C"
          />
          <TokenCard
            label="GrayColor"
            swatch="#6B6457"
            name="Warm Gray"
            sub="custom · ivoor → inkt"
          />
          <TokenCard
            label="Radius"
            swatch="#C97B5C"
            name="Scale 1 · 2 px"
            sub="editorial, scherp"
          />
          <TokenCard
            label="PanelBackground"
            swatch="#F2EFE6"
            swatchBorder
            name="Solid"
            sub="geen translucent"
          />
        </div>
      </Section>

      {/* Sectie 01 */}
      <Section index="01" title="Kleurenschalen — 12 stappen">
        <p className="text-[13px] leading-[1.7] text-ink/70 max-w-3xl mb-8">
          Volledige Radix-conforme schalen voor accent en gray. Stap 9 is de &quot;solid&quot; — voor terracotta is dat de brand-hex #C97B5C. Steps
          1–2 zijn app/subtle backgrounds, 3–5 zijn component fills, 6–8 borders, 9–10 solid surfaces, 11–12 tekst.
        </p>

        {/* Accent */}
        <ColorScale
          label="Accent"
          sub="Terracotta"
          cssVar="--accent-1 → --accent-12"
          steps={[
            { n: 1,  hex: "FBF7F1" },
            { n: 2,  hex: "F6EDDF" },
            { n: 3,  hex: "EFDEC8" },
            { n: 4,  hex: "E8CDB0" },
            { n: 5,  hex: "E0BB97" },
            { n: 6,  hex: "D8A77E" },
            { n: 7,  hex: "D29268" },
            { n: 8,  hex: "CB8462" },
            { n: 9,  hex: "C97B5C", solid: true },
            { n: 10, hex: "B86A4D" },
            { n: 11, hex: "8E4B33" },
            { n: 12, hex: "4D2A1D" },
          ]}
        />

        {/* Gray */}
        <ColorScale
          label="Gray"
          sub="Warm"
          cssVar="--gray-1 → --gray-12"
          steps={[
            { n: 1,  hex: "F7F4EC" },
            { n: 2,  hex: "F2EFE6" },
            { n: 3,  hex: "EBE6DA" },
            { n: 4,  hex: "E2DCCD" },
            { n: 5,  hex: "D6CFBE" },
            { n: 6,  hex: "C2BAA8" },
            { n: 7,  hex: "A89F8C" },
            { n: 8,  hex: "8E8573" },
            { n: 9,  hex: "6E6655", solid: true },
            { n: 10, hex: "56503F" },
            { n: 11, hex: "3E392C" },
            { n: 12, hex: "1A1A1A" },
          ]}
        />

        {/* Semantisch */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink">
              Semantisch
            </p>
            <p className="text-[11px] font-mono text-ink/35">success · warning · danger</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <SemanticScale
              name="Success · Zeegroen"
              steps={[
                { hex: "#C8E8E0", label: "3" },
                { hex: "#5E9E8A", label: "9" },
                { hex: "#2A5C4A", label: "11" },
              ]}
            />
            <SemanticScale
              name="Warning · Mosterd"
              steps={[
                { hex: "#F5EDBA", label: "3" },
                { hex: "#C49A1A", label: "9" },
                { hex: "#7A6210", label: "11" },
              ]}
            />
            <SemanticScale
              name="Danger · Terra-diep"
              steps={[
                { hex: "#F5DDD5", label: "3" },
                { hex: "#C97B5C", label: "9" },
                { hex: "#7A3520", label: "11" },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* Sectie 02 */}
      <Section index="02" title="Radius · Type · Motion">

        {/* Radius */}
        <TokenRow
          label="Radius"
          description="We kiezen scale-1 als basis. Cirkels (avatar, switch) gebruiken radius-full."
          tokens={["--radius-1 · 2px", "--radius-2 · 3px", "--radius-3 · 4px", "--radius-4 · 6px"]}
        >
          <div className="flex items-end gap-6">
            {[
              { label: "none",     radius: "rounded-none" },
              { label: "1 · 2px",  radius: "rounded-sm" },
              { label: "2 · 3px",  radius: "rounded" },
              { label: "3 · 4px",  radius: "rounded-md" },
              { label: "4 · 6px",  radius: "rounded-lg" },
              { label: "full",     radius: "rounded-full" },
            ].map((r) => (
              <div key={r.label} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 bg-terracotta ${r.radius}`} />
                <p className="text-[10px] font-mono text-ink/45">{r.label}</p>
              </div>
            ))}
          </div>
        </TokenRow>

        <div className="border-t border-ink/10 my-8" />

        {/* Type tokens */}
        <TokenRow
          label="Type tokens"
          description="Helvetica Neue als single-family, mono voor data en codes."
          tokens={["--font-sans", "--font-mono"]}
        >
          <div className="space-y-2">
            <p className="text-[42px] font-black tracking-tight leading-none">
              Tijdgeest leest mee.
            </p>
            <p className="text-[15px] leading-relaxed text-ink/75">
              Body — een boek per maand, samen gelezen.
            </p>
            <p className="font-mono text-[13px] text-ink/50">
              Mono — editie 04 · 240 leden
            </p>
          </div>
        </TokenRow>

        <div className="border-t border-ink/10 my-8" />

        {/* Motion */}
        <TokenRow
          label="Motion"
          description="Korte, rustige transitions — geen bouncy easing."
          tokens={["120ms ease · hover", "180ms ease-out · enter", "240ms ease-in · exit"]}
        >
          <div className="space-y-5 w-full max-w-lg pt-2">
            {[
              { ms: 120, width: "w-24" },
              { ms: 180, width: "w-40" },
              { ms: 240, width: "w-56" },
            ].map((m) => (
              <div key={m.ms} className="flex items-center gap-5">
                <span className="text-[11px] font-mono text-ink/40 w-8 shrink-0">{m.ms}</span>
                <div className={`h-px bg-terracotta ${m.width}`} />
              </div>
            ))}
          </div>
        </TokenRow>

      </Section>

    </main>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[11px] font-mono text-ink/35">{index}</span>
        <h2 className="text-[13px] font-black uppercase tracking-[0.18em] text-ink">
          {title}
        </h2>
        <div className="flex-1 border-t border-ink/15" />
      </div>
      {children}
    </section>
  );
}

function TokenCard({
  label,
  swatch,
  swatchBorder = false,
  name,
  sub,
}: {
  label: string;
  swatch: string;
  swatchBorder?: boolean;
  name: string;
  sub: string;
}) {
  return (
    <div className="border border-ink/12 bg-white p-5">
      <p className="text-[9px] font-black uppercase tracking-label text-ink/40 mb-4">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 shrink-0 ${swatchBorder ? "border border-ink/15" : ""}`}
          style={{ backgroundColor: swatch }}
        />
        <div>
          <p className="text-[13px] font-black leading-tight">{name}</p>
          <p className="text-[11px] font-mono text-ink/45 mt-0.5">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function ColorScale({
  label,
  sub,
  cssVar,
  steps,
}: {
  label: string;
  sub: string;
  cssVar: string;
  steps: { n: number; hex: string; solid?: boolean }[];
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink">
          {label} — <span className="font-medium normal-case tracking-normal">{sub}</span>
        </p>
        <p className="text-[11px] font-mono text-ink/35">{cssVar}</p>
      </div>
      <div className="border border-ink/10 grid grid-cols-12">
        {steps.map((s) => (
          <div key={s.n} className="border-r border-ink/10 last:border-r-0">
            <div className="h-20" style={{ backgroundColor: `#${s.hex}` }} />
            <div className="px-2 py-2 bg-white border-t border-ink/10">
              <p className={`text-[10px] font-mono mb-2 ${s.solid ? "font-black text-ink" : "text-ink/50"}`}>
                {s.n}
              </p>
              <p className="text-[9px] font-mono text-ink/40 uppercase">{s.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenRow({
  label,
  description,
  tokens,
  children,
}: {
  label: string;
  description: string;
  tokens: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
      <div>
        <p className="text-[13px] font-black mb-2">{label}</p>
        <p className="text-[12px] leading-[1.6] text-ink/60 mb-4">{description}</p>
        <div className="space-y-1">
          {tokens.map((t) => (
            <p key={t} className="text-[11px] font-mono text-ink/40">{t}</p>
          ))}
        </div>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}

function SemanticScale({
  name,
  steps,
}: {
  name: string;
  steps: { hex: string; label: string }[];
}) {
  return (
    <div>
      <div className="grid grid-cols-3 mb-3">
        {steps.map((s) => (
          <div key={s.label} className="h-16" style={{ backgroundColor: s.hex }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-black">{name}</p>
        <p className="text-[11px] font-mono text-ink/40">
          {steps.map((s) => s.label).join(" · ")}
        </p>
      </div>
    </div>
  );
}
