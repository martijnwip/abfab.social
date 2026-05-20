"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { createWork, uploadCover, type WorkPayload } from "../actions";
import TagSelector from "../tag-selector";

type Mode = "search" | "manual";

type OLResult = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  language?: string[];
  cover_i?: number;
};

const empty: WorkPayload = {
  originele_titel: "",
  subtitel: null,
  auteur: "",
  jaar_eerste_publicatie: null,
  taal_origineel: null,
  cover_image_url: null,
  open_library_work_id: null,
  tags: [],
};

export default function WorkForm({ availableTags }: { availableTags: string[] }) {
  const [mode, setMode] = useState<Mode>("search");

  // Search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OLResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<OLResult | null>(null);

  // Form state
  const [fields, setFields] = useState<WorkPayload>(empty);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    setSelected(null);
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,language,cover_i&limit=8`;
      const res = await fetch(url);
      const json = await res.json();
      setResults(json.docs ?? []);
    } catch {
      setError("Kon Open Library niet bereiken.");
    }
    setSearching(false);
  }

  function handleSelect(result: OLResult) {
    const workId = result.key.replace("/works/", "");
    setSelected(result);
    setFields({
      originele_titel: result.title,
      auteur: result.author_name?.[0] ?? "",
      jaar_eerste_publicatie: result.first_publish_year ?? null,
      taal_origineel: result.language?.[0] ?? null,
      cover_image_url: result.cover_i
        ? `https://covers.openlibrary.org/b/id/${result.cover_i}-L.jpg`
        : null,
      open_library_work_id: workId,
    });
    setCoverPreview(
      result.cover_i
        ? `https://covers.openlibrary.org/b/id/${result.cover_i}-M.jpg`
        : null
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
    else setCoverPreview(null);
  }

  function field(key: keyof WorkPayload) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value || null }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fields.originele_titel || !fields.auteur) {
      setError("Titel en auteur zijn verplicht.");
      return;
    }

    startTransition(async () => {
      try {
        let coverUrl = fields.cover_image_url ?? null;

        if (coverFile) {
          const fd = new FormData();
          fd.append("file", coverFile);
          coverUrl = await uploadCover(fd);
        }

        await createWork({
          ...fields,
          jaar_eerste_publicatie: fields.jaar_eerste_publicatie
            ? Number(fields.jaar_eerste_publicatie)
            : null,
          cover_image_url: coverUrl,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Er ging iets mis.");
      }
    });
  }

  function resetForm() {
    setFields(empty);
    setCoverPreview(null);
    setCoverFile(null);
    setSelected(null);
    setResults([]);
    setQuery("");
  }

  function switchMode(m: Mode) {
    setMode(m);
    resetForm();
    setError(null);
  }

  const showForm = mode === "manual" || selected !== null;

  return (
    <div className="max-w-2xl">
      {/* Mode toggle */}
      <div className="flex gap-1 mb-10 border border-ink/10 p-1 w-fit">
        {(["search", "manual"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`text-[10px] font-black uppercase tracking-[0.14em] px-5 py-2.5 transition-colors ${
              mode === m
                ? "bg-ink text-paper"
                : "text-ink/40 hover:text-ink"
            }`}
          >
            {m === "search" ? "Open Library" : "Handmatig"}
          </button>
        ))}
      </div>

      {/* Open Library zoeken */}
      {mode === "search" && !selected && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Zoek op titel of auteur…"
              className="flex-1 border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3 hover:bg-ink/85 transition-colors disabled:opacity-50"
            >
              {searching ? "Zoeken…" : "Zoek"}
            </button>
          </div>

          {results.length > 0 && (
            <ul className="divide-y divide-ink/8 border border-ink/10">
              {results.map((r) => (
                <li key={r.key}>
                  <button
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-krant/40 transition-colors text-left"
                  >
                    {r.cover_i ? (
                      <Image
                        src={`https://covers.openlibrary.org/b/id/${r.cover_i}-S.jpg`}
                        alt={r.title}
                        width={36}
                        height={54}
                        className="object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-14 bg-krant shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-black truncate">{r.title}</p>
                      <p className="text-xs text-ink/50 truncate">
                        {r.author_name?.[0]}
                        {r.first_publish_year && ` · ${r.first_publish_year}`}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 && !searching && query && (
            <p className="text-sm text-ink/40">Geen resultaten gevonden.</p>
          )}
        </div>
      )}

      {/* Formulier (beide modi) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {selected && (
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-seafoam">
                Open Library
              </span>
              <button
                type="button"
                onClick={resetForm}
                className="text-[11px] text-ink/40 hover:text-ink transition-colors"
              >
                Andere selectie
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Cover preview + upload */}
            <div className="sm:col-span-2 flex items-start gap-6">
              <div className="w-24 shrink-0 aspect-2/3 bg-krant overflow-hidden relative">
                {coverPreview ? (
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-ink/20 text-[10px] font-black uppercase tracking-widest">
                    Cover
                  </div>
                )}
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/50">
                  Cover afbeelding
                </p>
                {fields.cover_image_url && !coverFile && (
                  <p className="text-xs text-ink/40 font-mono break-all">
                    {fields.cover_image_url.slice(0, 48)}…
                  </p>
                )}
                {mode === "manual" || selected ? (
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-[10px] font-black uppercase tracking-[0.12em] border border-ink/20 px-3 py-2 hover:border-ink transition-colors"
                    >
                      {coverFile ? coverFile.name : "Afbeelding uploaden"}
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* Velden */}
            <div className="sm:col-span-2">
              <Label>Originele titel *</Label>
              <Input
                value={fields.originele_titel}
                onChange={(e) => setFields((f) => ({ ...f, originele_titel: e.target.value }))}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Subtitel</Label>
              <Input
                value={fields.subtitel ?? ""}
                onChange={field("subtitel")}
                placeholder="Optionele subtitel"
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Auteur *</Label>
              <Input
                value={fields.auteur}
                onChange={(e) => setFields((f) => ({ ...f, auteur: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Jaar eerste publicatie</Label>
              <Input
                type="number"
                value={fields.jaar_eerste_publicatie ?? ""}
                onChange={field("jaar_eerste_publicatie")}
                placeholder="bijv. 1984"
              />
            </div>

            <div>
              <Label>Taal origineel</Label>
              <Input
                value={fields.taal_origineel ?? ""}
                onChange={field("taal_origineel")}
                placeholder="bijv. nl, en, fr"
              />
            </div>

            {mode === "manual" && (
              <div className="sm:col-span-2">
                <Label>Open Library Work ID (optioneel)</Label>
                <Input
                  value={fields.open_library_work_id ?? ""}
                  onChange={field("open_library_work_id")}
                  placeholder="bijv. OL82563W"
                  className="font-mono"
                />
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label>Tags</Label>
            <TagSelector
              tags={availableTags}
              selected={fields.tags ?? []}
              onChange={(tags) => setFields((f) => ({ ...f, tags }))}
            />
          </div>

          {error && (
            <p className="text-[13px] text-terracotta">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Opslaan…" : "Work opslaan"}
            </button>
            <a
              href="/admin/works"
              className="border border-ink/20 text-ink text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:border-ink transition-colors"
            >
              Annuleren
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">
      {children}
    </label>
  );
}

function Input({
  className = "",
  ...props
}: React.ComponentProps<"input"> & { className?: string }) {
  return (
    <input
      {...props}
      className={`w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors ${className}`}
    />
  );
}
