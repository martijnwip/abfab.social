"use client";

import { useState } from "react";
import { BookmarkIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TooltipProvider, Tooltip } from "@/components/ui/tooltip";

function PreviewBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative bg-krant/40 border border-ink/10 p-10 flex items-center justify-center min-h-40">
      <span className="absolute top-3 right-4 text-[10px] font-mono text-ink/30">{label}</span>
      {children}
    </div>
  );
}

export default function OverlaysSection() {
  const [time, setTime] = useState("1-3");

  return (
    <TooltipProvider>
      <div className="space-y-0">

        {/* Tooltip */}
        <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p className="text-[13px] font-black mb-2">Tooltip</p>
            <p className="text-[12px] leading-[1.6] text-ink/60">
              Inkt op ivoor; korte hint, één regel.
            </p>
          </div>
          <PreviewBox label="tooltip · top">
            <Tooltip content="Bewaar in je leeslijst" side="top">
              <Button variant="gray-outline" size="icon">
                <BookmarkIcon />
              </Button>
            </Tooltip>
          </PreviewBox>
        </div>

        <div className="border-t border-ink/10 my-8" />

        {/* DropdownMenu */}
        <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p className="text-[13px] font-black mb-2">DropdownMenu</p>
            <p className="text-[12px] leading-[1.6] text-ink/60">
              Witte surface, accent-3 hover, mono shortcuts.
            </p>
          </div>
          <PreviewBox label="menu · open">
            <div className="bg-white border border-ink/12 shadow-[0_4px_16px_rgba(26,26,26,0.12)] w-52">
              <div className="px-4 py-2 border-b border-ink/8">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/35">Acties</p>
              </div>
              {[
                { label: "Open in lezer",        shortcut: "↵",    danger: false, checked: false },
                { label: "Toevoegen aan plank",   shortcut: "⌘ B",  danger: false, checked: false },
                { label: "Markeer als gelezen",   shortcut: "⌘ ⇧ M",danger: false, checked: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between px-4 py-2 hover:bg-terracotta/8 cursor-pointer">
                  <span className="text-[13px]">{item.label}</span>
                  <span className="text-[11px] font-mono text-ink/30">{item.shortcut}</span>
                </div>
              ))}
              <div className="px-4 py-2 border-t border-ink/8">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/35">Weergave</p>
              </div>
              <div className="flex items-center justify-between px-4 py-2 hover:bg-terracotta/8 cursor-pointer">
                <span className="text-[13px] text-terracotta">Toon omslagen</span>
                <CheckIcon className="text-terracotta w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between px-4 py-2 hover:bg-terracotta/8 cursor-pointer">
                <span className="text-[13px]">Compacte modus</span>
              </div>
              <div className="border-t border-ink/8">
                <div className="flex items-center justify-between px-4 py-2 hover:bg-terracotta/8 cursor-pointer">
                  <span className="text-[13px] text-terracotta">Verwijder</span>
                  <span className="text-[11px] font-mono text-ink/30">⌫</span>
                </div>
              </div>
            </div>
          </PreviewBox>
        </div>

        <div className="border-t border-ink/10 my-8" />

        {/* Dialog */}
        <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p className="text-[13px] font-black mb-2">Dialog</p>
            <p className="text-[12px] leading-[1.6] text-ink/60">
              Ivoor surface, inkt-rand. Geen translucent backdrop in onze theme.
            </p>
          </div>
          <PreviewBox label="dialog · open">
            <div className="bg-paper border border-ink/20 shadow-[0_4px_24px_rgba(26,26,26,0.12)] w-full max-w-sm p-7 relative">
              <button className="absolute top-4 right-4 text-ink/30 hover:text-ink transition-colors cursor-pointer text-lg leading-none">✕</button>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-terracotta mb-4">
                Editie 04 · 14 mei
              </p>
              <h3 className="text-[22px] font-black tracking-tight leading-tight mb-3">
                Schrijf je in voor de leeskring
              </h3>
              <p className="text-[13px] leading-[1.65] text-ink/60 mb-5">
                Vier korte sessies, elke donderdagavond. Geen verplichte aanwezigheid — luister later terug wanneer je wilt.
              </p>
              <p className="text-[11px] font-black mb-3">Hoeveel tijd heb je per week?</p>
              <SegmentedControl
                defaultValue="1-3"
                options={[
                  { value: "lt1",  label: "< 1 u" },
                  { value: "1-3",  label: "1–3 u" },
                  { value: "gt3",  label: "3+ u" },
                ]}
                onChange={setTime}
              />
              <div className="flex gap-3 mt-6 justify-end">
                <Button variant="soft" size="md">Misschien later</Button>
                <Button variant="solid" size="md">Ik doe mee</Button>
              </div>
            </div>
          </PreviewBox>
        </div>

        <div className="border-t border-ink/10 my-8" />

        {/* Toast */}
        <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p className="text-[13px] font-black mb-2">Toast</p>
            <p className="text-[12px] leading-[1.6] text-ink/60">
              Inkt-surface, terracotta-accent. Één regel + één actie.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-1">
            <Toast
              variant="dark"
              message={<>Notitie bewaard bij <strong>Hoofdstuk 7</strong>.</>}
              action={{ label: "Bekijken" }}
            />
            <Toast
              variant="accent"
              message="Je bent ingeschreven voor Editie 04."
              action={{ label: "Ongedaan maken" }}
            />
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
}
