"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type SidebarWork = {
  id: string;
  originele_titel: string;
  cover_image_url: string | null;
  open_library_work_id: string | null;
  created_at: string;
  updated_at: string;
};

function fmt(d: string) {
  return new Date(d)
    .toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "2-digit" })
    .replace(/\//g, "-");
}

export default function WorkSidebar({
  work,
  hasKaart,
  voorstelActief,
}: {
  work: SidebarWork;
  hasKaart: boolean;
  voorstelActief: boolean;
  hasNominatie: boolean;
}) {
  const router = useRouter();
  const [generatingKaart, setGeneratingKaart] = useState(false);
  const [generatingScenario, setGeneratingScenario] = useState(false);
  const [deletingKaart, startDeleteKaart] = useTransition();
  const [isVoorstelActief, setIsVoorstelActief] = useState(voorstelActief);
  const [togglingVoorstel, setTogglingVoorstel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortId = `wk_${work.id.replace(/-/g, "").slice(0, 6)}`;
  const voorstelUrl = `https://www.tijdgeestleest.nl/voorstel/${work.id}`;

  async function toggleVoorstel() {
    setTogglingVoorstel(true);
    setError(null);
    const res = await fetch(`/api/works/${work.id}/voorstel`, { method: "POST" });
    if (!res.ok) setError((await res.json()).error ?? "Fout");
    else {
      const { actief } = await res.json();
      setIsVoorstelActief(actief);
      router.refresh();
    }
    setTogglingVoorstel(false);
  }

  async function copyVoorstelUrl() {
    await navigator.clipboard.writeText(voorstelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function generateKaart() {
    setGeneratingKaart(true);
    setError(null);
    const res = await fetch("/api/session/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ work_id: work.id }),
    });
    if (!res.ok) setError((await res.json()).error ?? "Fout");
    else router.refresh();
    setGeneratingKaart(false);
  }

  async function generateScenario() {
    setGeneratingScenario(true);
    setError(null);
    const res = await fetch("/api/works/scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ work_id: work.id }),
    });
    if (!res.ok) setError((await res.json()).error ?? "Fout");
    else router.refresh();
    setGeneratingScenario(false);
  }

  function deleteKaart() {
    if (!confirm("Gesprekskaart verwijderen?")) return;
    startDeleteKaart(async () => {
      const supabase = createClient();
      await supabase.from("works").update({ gesprekskaart: null }).eq("id", work.id);
      router.refresh();
    });
  }

  const busy = generatingKaart || generatingScenario || deletingKaart;

  return (
    <aside className="sticky top-8 space-y-6">
      {/* Cover */}
      <div>
        <div className="relative aspect-2/3 bg-ink/10 overflow-hidden mb-2">
          {work.cover_image_url ? (
            <Image src={work.cover_image_url} alt={work.originele_titel} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-ink/15 text-[40px] font-black">▲</div>
          )}
        </div>
        <button className="w-full py-1.5 text-[9px] font-black uppercase tracking-widest text-ink/35 hover:text-ink border border-ink/15 bg-transparent cursor-pointer transition-colors">
          Afbeelding vervangen
        </button>
      </div>

      {/* Metadata */}
      <div className="space-y-1.5">
        {[
          { label: "ID",         value: shortId },
          { label: "Aangemaakt", value: fmt(work.created_at) },
          { label: "Gewijzigd",  value: fmt(work.updated_at) },
          ...(work.open_library_work_id
            ? [{ label: "Open Library", value: work.open_library_work_id }]
            : []),
        ].map(({ label, value }) => (
          <div key={label} className="grid grid-cols-[80px_1fr] items-baseline gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-ink/30">{label}</span>
            <span className="text-[11px] font-mono text-ink/55">{value}</span>
          </div>
        ))}
      </div>

      {/* Generatie */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-ink/25 mb-1.5">Generatie</p>
        <div className="border border-ink/12 divide-y divide-ink/8">
          <SidebarItem icon="↺" shortcut="⌘G" disabled={busy} onClick={generateKaart}>
            {generatingKaart ? "Genereren…" : "Genereer gesprekskaart"}
          </SidebarItem>
          <SidebarItem icon="⊡" shortcut="⌘S" disabled={busy} onClick={generateScenario}>
            {generatingScenario ? "Genereren…" : "Genereer scenario"}
          </SidebarItem>
        </div>
      </div>

      {/* Publiceren */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-ink/25 mb-1.5">Publiceren</p>
        <div className="border border-ink/12 divide-y divide-ink/8">
          <SidebarItem
            icon={isVoorstelActief ? "◉" : "○"}
            disabled={togglingVoorstel}
            onClick={toggleVoorstel}
          >
            {togglingVoorstel
              ? "Bezig…"
              : isVoorstelActief
              ? "Voorstel actief"
              : "Publiceer voorstel"}
          </SidebarItem>
          {isVoorstelActief && (
            <SidebarItem icon={copied ? "✓" : "⎘"} onClick={copyVoorstelUrl}>
              {copied ? "Gekopieerd!" : "Kopieer link"}
            </SidebarItem>
          )}
        </div>
      </div>

      {/* Tools */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-ink/25 mb-1.5">Tools</p>
        <div className="border border-ink/12 divide-y divide-ink/8">
          <SidebarItem icon="⊕" href="#bronnen">Bron toevoegen</SidebarItem>
          <SidebarItem icon="↓" disabled>Exporteer (PDF)</SidebarItem>
          <SidebarItem icon="≡" disabled>Bekijk audit log</SidebarItem>
        </div>
      </div>

      {/* Gevaarlijk */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-ink/25 mb-1.5">Gevaarlijk</p>
        <div className="border border-ink/12 divide-y divide-ink/8">
          {hasKaart && (
            <SidebarItem icon="🗑" disabled={busy} onClick={deleteKaart} danger>
              Verwijder kaart
            </SidebarItem>
          )}
          <SidebarItem icon="🗑" href="#verwijder" danger>
            Verwijder boek
          </SidebarItem>
        </div>
      </div>

      {error && <p className="text-[10px] text-terracotta">{error}</p>}
    </aside>
  );
}

function SidebarItem({
  icon,
  shortcut,
  disabled,
  onClick,
  href,
  danger,
  children,
}: {
  icon: string;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  const baseClass = `w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-black bg-white transition-colors text-left ${
    disabled
      ? "text-ink/25 cursor-not-allowed"
      : danger
      ? "text-terracotta hover:bg-terracotta/5 cursor-pointer"
      : "text-ink/65 hover:text-ink hover:bg-ink/3 cursor-pointer"
  }`;

  const content = (
    <>
      <span className="text-[11px] w-4 text-center shrink-0">{icon}</span>
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="text-[9px] font-mono text-ink/25 bg-ink/6 px-1.5 py-0.5">{shortcut}</span>
      )}
    </>
  );

  if (href && !disabled) {
    return <a href={href} className={baseClass}>{content}</a>;
  }

  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} className={baseClass}>
      {content}
    </button>
  );
}
