"use client";

import { Tabs } from "@/components/ui/tabs";
import { SegmentedControl } from "@/components/ui/segmented-control";

export default function NavSection() {
  return (
    <div className="space-y-0">

      {/* Tabs */}
      <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] font-black mb-2">Tabs</p>
          <p className="text-[12px] leading-[1.6] text-ink/60">
            Onderlijning in accent-9, label in inkt voor de actieve tab.
          </p>
        </div>
        <div className="pt-1">
          <Tabs
            tabs={[
              { value: "boeken",       label: "Boeken" },
              { value: "leeskringen",  label: "Leeskringen" },
              { value: "bibliotheek",  label: "Bibliotheek" },
              { value: "aantekeningen",label: "Aantekeningen" },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-ink/10 my-8" />

      {/* SegmentedControl */}
      <div className="grid grid-cols-[280px_1fr] gap-12 items-start">
        <div>
          <p className="text-[13px] font-black mb-2">SegmentedControl</p>
          <p className="text-[12px] leading-[1.6] text-ink/60">
            Voor kleine, exclusieve keuzes (zoals weergave-modi).
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SegmentedControl
            defaultValue="maand"
            options={[
              { value: "maand",    label: "Maand" },
              { value: "kwartaal", label: "Kwartaal" },
              { value: "jaar",     label: "Jaar" },
            ]}
          />
          <SegmentedControl
            defaultValue="raster"
            options={[
              { value: "lijst",  label: "Lijst" },
              { value: "raster", label: "Raster" },
            ]}
          />
        </div>
      </div>

    </div>
  );
}
