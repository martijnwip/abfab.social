"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { addWorkSource, deleteWorkSource } from "./source-actions";

const SOURCE_TYPES = [
  { value: "podcast",           label: "Podcasttranscriptie" },
  { value: "interview",         label: "Interview met auteur" },
  { value: "artikel",           label: "Krantenartikel / recensie" },
  { value: "lezing",            label: "Lezing of talk" },
  { value: "overig",            label: "Overig" },
];

type Source = {
  id: string;
  type: string;
  titel: string | null;
  beschrijving: string | null;
  inhoud: string;
  bron: string | null;
};

export default function SourcesSection({ workId, initialSources }: { workId: string; initialSources: Source[] }) {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState("podcast");
  const [titel, setTitel] = useState("");
  const [beschrijving, setBeschrijving] = useState("");
  const [inhoud, setInhoud] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [bron, setBron] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  function reset() {
    setType("podcast");
    setTitel("");
    setBeschrijving("");
    setInhoud("");
    setFileName(null);
    setBron("");
    setAdding(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setInhoud((ev.target?.result as string) ?? "");
    reader.readAsText(file, "UTF-8");
  }

  function handleAdd() {
    if (!inhoud.trim()) return;
    startTransition(async () => {
      const result = await addWorkSource(workId, { type, titel: titel || null, beschrijving: beschrijving || null, inhoud, bron: bron || null });
      if (result) {
        setSources((prev) => [...prev, result as Source]);
        reset();
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteWorkSource(id);
      setSources((prev) => prev.filter((s) => s.id !== id));
      setDeletingId(null);
      router.refresh();
    });
  }

  const inputClass = "w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5";

  return (
    <div className="mt-16 pt-10 border-t border-ink/10 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40">
          Bronnen voor gesprekskaart
        </p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-[10px] font-black uppercase tracking-[0.12em] border border-ink/20 px-3 py-2 hover:bg-ink hover:text-paper hover:border-ink transition-colors cursor-pointer"
          >
            + Bron toevoegen
          </button>
        )}
      </div>

      {/* Bestaande bronnen */}
      {sources.length === 0 && !adding && (
        <p className="text-sm text-ink/40 mb-6">Nog geen bronnen toegevoegd. Voeg een podcasttranscriptie of interview toe om de gesprekskaart te verrijken.</p>
      )}

      <div className="space-y-4 mb-6">
        {sources.map((s) => {
          const typeLabel = SOURCE_TYPES.find((t) => t.value === s.type)?.label ?? s.type;
          return (
            <div key={s.id} className="border border-ink/12 bg-white p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="inline-block text-[9px] font-black uppercase tracking-[0.12em] bg-krant/60 text-ink/60 px-2.5 py-1 mr-2">
                    {typeLabel}
                  </span>
                  {s.titel && (
                    <span className="text-[14px] font-black">{s.titel}</span>
                  )}
                  {s.beschrijving && (
                    <p className="text-[12px] text-ink/55 mt-1">{s.beschrijving}</p>
                  )}
                  {s.bron && (
                    <p className="text-[11px] font-mono text-ink/40 mt-1">{s.bron}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  className="shrink-0 text-[10px] font-black uppercase tracking-widest text-ink/30 hover:text-terracotta transition-colors cursor-pointer disabled:opacity-40"
                >
                  {deletingId === s.id ? "…" : "Verwijderen"}
                </button>
              </div>
              <p className="text-[12px] text-ink/55 leading-relaxed line-clamp-3">{s.inhoud}</p>
            </div>
          );
        })}
      </div>

      {/* Toevoegen formulier */}
      {adding && (
        <div className="border border-ink/15 p-6 space-y-4 bg-krant/10">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/50">Nieuwe bron</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                {SOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Titel (optioneel)</label>
              <input
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                placeholder="bijv. De Correspondent #42"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Toelichting (optioneel)</label>
            <input
              value={beschrijving}
              onChange={(e) => setBeschrijving(e.target.value)}
              placeholder="bijv. De Groene Amsterdammer podcast met Tommy Wieringa en Bas Heijne"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Bron / URL (optioneel)</label>
            <input
              value={bron}
              onChange={(e) => setBron(e.target.value)}
              placeholder="bijv. https://podcast.nl/aflevering"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Transcriptie / tekst * (.txt)</label>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`${inputClass} text-left cursor-pointer ${fileName ? "text-ink" : "text-ink/35"}`}
            >
              {fileName ?? "Kies een .txt bestand…"}
            </button>
            {fileName && inhoud && (
              <p className="text-[11px] text-ink/40 mt-1.5">
                {inhoud.length.toLocaleString("nl-NL")} tekens geladen
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              disabled={isPending || !inhoud.trim()}
              className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-40"
            >
              {isPending ? "Opslaan…" : "Bron opslaan"}
            </button>
            <button
              onClick={reset}
              className="border border-ink/20 text-ink text-xs font-black uppercase tracking-[0.12em] px-5 py-2.5 hover:border-ink transition-colors cursor-pointer"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
