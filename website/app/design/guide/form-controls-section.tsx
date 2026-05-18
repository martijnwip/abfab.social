"use client";

import { useState } from "react";
import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

export default function FormControlsSection() {
  const [radio, setRadio] = useState("papier");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [dark, setDark] = useState(true);
  const [tempo, setTempo] = useState(55);

  return (
    <div className="space-y-0">

      {/* TextField */}
      <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] font-black mb-2">TextField</p>
          <p className="text-[12px] leading-[1.6] text-ink/60">
            Met optioneel prefix-icoon. Focus = terracotta border + soft ring.
          </p>
        </div>
        <div className="space-y-4 max-w-sm">
          <Input
            label="E-mailadres"
            placeholder="lina@tijdgeest.nl"
            type="email"
            prefix={<EnvelopeClosedIcon />}
            hint="We sturen je elke maandag de leesplanning."
          />
          <Input
            label="Wachtwoord"
            type="password"
            defaultValue="••••••"
            prefix={<LockClosedIcon />}
            error="Wachtwoord moet minstens 8 tekens bevatten."
          />
        </div>
      </div>

      <div className="border-t border-ink/10 my-8" />

      {/* Maten */}
      <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] font-black mb-2">Maten</p>
          <p className="text-[12px] leading-[1.6] text-ink/60">
            1 voor inline filters, 3 voor formulieren met focus.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Input inputSize="1" placeholder="Zoek titel of auteur" />
          <Input inputSize="2" placeholder="Standaard" />
          <Input inputSize="3" placeholder="Groot — opmerking" />
        </div>
      </div>

      <div className="border-t border-ink/10 my-8" />

      {/* TextArea & Select */}
      <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] font-black mb-2">TextArea & Select</p>
        </div>
        <div className="flex items-start gap-4">
          <Textarea
            className="max-w-[220px]"
            defaultValue="Wat ik blijf voelen is dat de hoofdpersoon zijn eigen tijd niet bezit. Hij rent door dagen heen alsof hij ze nog ergens moet..."
          />
          <Select
            options={[
              { value: "04", label: "Editie 04 — Mei 2026" },
              { value: "03", label: "Editie 03 — Apr 2026" },
            ]}
            value="04"
          />
        </div>
      </div>

      <div className="border-t border-ink/10 my-8" />

      {/* Checkbox · Radio · Switch */}
      <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] font-black mb-2">Checkbox · Radio · Switch</p>
          <p className="text-[12px] leading-[1.6] text-ink/60">
            Selectie gebruikt terracotta-9 als geactiveerde staat.
          </p>
        </div>
        <div className="flex items-start gap-10">
          <div className="space-y-3">
            <Checkbox id="cb-off"     label="Ongeselecteerd" />
            <Checkbox id="cb-on"      label="Geselecteerd"   checked />
            <Checkbox id="cb-indet"   label="Gedeeltelijk"   checked="indeterminate" />
            <Checkbox id="cb-dis"     label="Uitgeschakeld"  disabled />
          </div>
          <RadioGroup
            value={radio}
            onValueChange={setRadio}
            options={[
              { value: "ebook",  label: "E-book" },
              { value: "papier", label: "Papier" },
              { value: "audio",  label: "Audio" },
            ]}
          />
          <div className="space-y-3">
            <Switch id="sw-email" label="Wekelijkse e-mail"   checked={email}  onCheckedChange={setEmail} />
            <Switch id="sw-push"  label="Push-notificaties"   checked={push}   onCheckedChange={setPush} />
            <Switch id="sw-dark"  label="Donker thema"        checked={dark}   onCheckedChange={setDark} />
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10 my-8" />

      {/* Slider & Progress */}
      <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] font-black mb-2">Slider & Progress</p>
          <p className="text-[12px] leading-[1.6] text-ink/60">
            Track gray-5, vulling accent-9. Voor leestempo en voortgang.
          </p>
        </div>
        <div className="space-y-6 max-w-sm pt-1">
          <Slider label="Leestempo" value={tempo} onChange={setTempo} />
          <Progress label="Voortgang — Hoofdstuk 7 van 12" value={7} max={12} />
        </div>
      </div>

    </div>
  );
}
