"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6 pb-3 border-b border-ink/10">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start gap-4 mb-5">
      <span className="text-[11px] text-ink/35 font-mono w-28 pt-3 shrink-0">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignPage() {
  const [checked, setChecked] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [selectVal, setSelectVal] = useState("");

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-3">
          Tijdgeest · Intern
        </p>
        <h1 className="text-[48px] font-black tracking-tight leading-none mb-3">
          Component Guide
        </h1>
        <p className="text-[15px] text-ink/55 max-w-md">
          Overzicht van alle UI-componenten. Niet publiek toegankelijk.
        </p>
      </div>

      {/* KLEUREN */}
      <Section title="Kleuren">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Ink",        cls: "bg-ink",        hex: "#1A1A1A" },
            { name: "Paper",      cls: "bg-paper border border-ink/10", hex: "#F2EFE6" },
            { name: "Terracotta", cls: "bg-terracotta", hex: "#C97B5C" },
            { name: "Seafoam",    cls: "bg-seafoam",    hex: "#A8C4B8" },
            { name: "Mustard",    cls: "bg-mustard",    hex: "#D4A84B" },
            { name: "Krant",      cls: "bg-krant",      hex: "#D8D4C6" },
            { name: "Muted",      cls: "bg-muted",      hex: "rgba(26,26,26,.55)" },
          ].map((c) => (
            <div key={c.name}>
              <div className={`h-14 w-full ${c.cls} mb-2`} />
              <p className="text-xs font-black">{c.name}</p>
              <p className="text-[11px] font-mono text-ink/40">{c.hex}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TYPOGRAFIE */}
      <Section title="Typografie">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono text-ink/35 mb-1">Display · 76px · black</p>
            <p className="text-[56px] font-black tracking-tight leading-none">Tijdgeest.</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-ink/35 mb-1">H1 · 36px · black</p>
            <p className="text-[36px] font-black tracking-tight">Lees samen, denk verder.</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-ink/35 mb-1">H2 · 24px · black</p>
            <p className="text-2xl font-black tracking-tight">Boek van de maand</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-ink/35 mb-1">Body · 15px · regular</p>
            <p className="text-[15px] leading-[1.6] text-ink/70 max-w-md">
              Tijdgeest brengt nieuwsgierige lezers bij elkaar in kleine, zorgvuldig samengestelde sessies. Eén boek per maand, één avond.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-ink/35 mb-1">Label · 10px · black · uppercase</p>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/50">De boeken van dit moment</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-ink/35 mb-1">Mono · 11px</p>
            <p className="text-[11px] font-mono text-ink/50">Historische fictie · 512 bladzijden</p>
          </div>
        </div>
      </Section>

      {/* KNOPPEN */}
      <Section title="Knoppen">
        <Row label="Primary">
          <Button variant="primary" size="sm">Klein</Button>
          <Button variant="primary">Normaal</Button>
          <Button variant="primary" size="lg">Groot</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </Row>
        <Row label="Secondary">
          <Button variant="secondary" size="sm">Klein</Button>
          <Button variant="secondary">Normaal</Button>
          <Button variant="secondary" size="lg">Groot</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </Row>
        <Row label="Destructive">
          <Button variant="destructive">Verwijderen</Button>
          <Button variant="destructive" disabled>Disabled</Button>
        </Row>
        <Row label="Ghost">
          <Button variant="ghost">Annuleren</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </Row>
        <Row label="Seafoam">
          <Button variant="seafoam">Goedkeuren</Button>
        </Row>
      </Section>

      {/* BADGES */}
      <Section title="Badges">
        <Row label="Status">
          <Badge variant="pending" />
          <Badge variant="approved" />
          <Badge variant="rejected" />
        </Row>
        <Row label="Rollen">
          <Badge variant="member" />
          <Badge variant="admin" />
        </Row>
        <Row label="Custom label">
          <Badge variant="pending" label="In behandeling" />
          <Badge variant="approved" label="Actief lid" />
          <Badge variant="rejected" label="Niet toegelaten" />
        </Row>
      </Section>

      {/* FORMULIERELEMENTEN */}
      <Section title="Formulierelementen">
        <div className="max-w-sm space-y-5">
          <Input label="E-mailadres" placeholder="jouw@email.nl" type="email" />
          <Input label="Met hint" placeholder="Voer tekst in" hint="Dit veld is optioneel." />
          <Input label="Met foutmelding" placeholder="Voer tekst in" error="Dit veld is verplicht." defaultValue="fout" />
          <Input label="Disabled" placeholder="Niet bewerkbaar" disabled />
          <Select
            label="Rol"
            options={[
              { value: "member", label: "Member" },
              { value: "admin", label: "Admin" },
            ]}
            value={selectVal}
            onValueChange={setSelectVal}
          />
          <Select
            label="Disabled select"
            options={[{ value: "a", label: "Optie A" }]}
            disabled
          />
          <div className="space-y-3">
            <Checkbox id="cb1" label="Ik ga akkoord met de voorwaarden" checked={checked} onCheckedChange={setChecked} />
            <Checkbox id="cb2" label="Disabled checkbox" disabled />
          </div>
          <div className="space-y-3">
            <Switch id="sw1" label="Notificaties inschakelen" checked={switched} onCheckedChange={setSwitched} />
            <Switch id="sw2" label="Disabled switch" disabled />
          </div>
        </div>
      </Section>

      {/* ALERTS */}
      <Section title="Alerts">
        <div className="space-y-3 max-w-lg">
          <Alert variant="info">Dit is een informatieve melding voor de gebruiker.</Alert>
          <Alert variant="success" title="Gelukt">Je aanmelding is bevestigd en verwerkt.</Alert>
          <Alert variant="warning" title="Let op">Je sessie verloopt over 10 minuten.</Alert>
          <Alert variant="error" title="Fout">Er is iets misgegaan. Probeer het opnieuw.</Alert>
        </div>
      </Section>

      {/* SEPARATOR */}
      <Section title="Separator">
        <div className="space-y-6 max-w-sm">
          <div>
            <p className="text-sm mb-4">Boven de scheidslijn</p>
            <Separator />
            <p className="text-sm mt-4">Onder de scheidslijn</p>
          </div>
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm">Links</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Rechts</span>
          </div>
        </div>
      </Section>

      {/* DIALOG */}
      <Section title="Dialog / Modal">
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent
              title="Aanmelding bevestigen"
              description="Weet je zeker dat je je wilt aanmelden voor deze sessie? Je ontvangt een bevestiging per e-mail."
            >
              <div className="space-y-4">
                <Input label="Opmerking (optioneel)" placeholder="Eventuele toelichting…" />
                <div className="flex gap-3 pt-2">
                  <Button variant="primary">Bevestigen</Button>
                  <Button variant="ghost">Annuleren</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Verwijder dialog</Button>
            </DialogTrigger>
            <DialogContent
              title="Work verwijderen?"
              description="Dit kan niet ongedaan worden gemaakt. Alle gekoppelde sessies blijven behouden."
            >
              <div className="flex gap-3 pt-2">
                <Button variant="destructive">Verwijderen</Button>
                <Button variant="ghost">Annuleren</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Section>

      {/* ONTBREKEND */}
      <Section title="Ontbrekend / nog te ontwerpen">
        <div className="space-y-2 text-[13px] text-ink/60">
          <p>— Toast / notificatie (tijdelijk zichtbaar, auto-dismiss)</p>
          <p>— Radio group component</p>
          <p>— Tooltip component</p>
          <p>— Pagination component</p>
          <p>— Boekkaart component (herbruikbaar)</p>
          <p>— Leesclub kaart component</p>
          <p>— Avatar component</p>
          <p>— Skeleton / loading state</p>
        </div>
      </Section>
    </main>
  );
}
