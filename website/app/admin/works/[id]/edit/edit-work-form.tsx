"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { updateWork, uploadCover, type WorkPayload } from "../../actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type Work = {
  id: string;
  originele_titel: string;
  subtitel: string | null;
  auteur: string;
  jaar_eerste_publicatie: number | null;
  taal_origineel: string | null;
  cover_image_url: string | null;
  open_library_work_id: string | null;
};

export default function EditWorkForm({ work }: { work: Work }) {
  const [fields, setFields] = useState<WorkPayload>({
    originele_titel:       work.originele_titel,
    subtitel:              work.subtitel,
    auteur:                work.auteur,
    jaar_eerste_publicatie: work.jaar_eerste_publicatie,
    taal_origineel:        work.taal_origineel,
    cover_image_url:       work.cover_image_url,
    open_library_work_id:  work.open_library_work_id,
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(work.cover_image_url);
  const [coverFile, setCoverFile]       = useState<File | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [isPending, startTransition]    = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function field(key: keyof WorkPayload) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value || null }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fields.originele_titel || !fields.auteur) {
      setError("Titel en auteur zijn verplicht.");
      return;
    }

    setConfirmOpen(true);
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        let coverUrl = fields.cover_image_url ?? null;
        if (coverFile) {
          const fd = new FormData();
          fd.append("file", coverFile);
          coverUrl = await uploadCover(fd);
        }

        await updateWork(work.id, {
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

  return (
    <>
    <ConfirmDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      title="Wijzigingen opslaan?"
      description={`Weet je zeker dat je de wijzigingen aan "${fields.originele_titel}" wilt opslaan?`}
      confirmLabel="Opslaan"
      onConfirm={handleConfirm}
    />
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Cover */}
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
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/50">Cover afbeelding</p>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[10px] font-black uppercase tracking-[0.12em] border border-ink/20 px-3 py-2 hover:border-ink transition-colors cursor-pointer"
            >
              {coverFile ? coverFile.name : "Afbeelding vervangen"}
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label>Originele titel *</Label>
          <Input value={fields.originele_titel} onChange={(e) => setFields((f) => ({ ...f, originele_titel: e.target.value }))} required />
        </div>

        <div className="sm:col-span-2">
          <Label>Subtitel</Label>
          <Input value={fields.subtitel ?? ""} onChange={field("subtitel")} placeholder="Optionele subtitel" />
        </div>

        <div className="sm:col-span-2">
          <Label>Auteur *</Label>
          <Input value={fields.auteur} onChange={(e) => setFields((f) => ({ ...f, auteur: e.target.value }))} required />
        </div>

        <div>
          <Label>Jaar eerste publicatie</Label>
          <Input type="number" value={fields.jaar_eerste_publicatie ?? ""} onChange={field("jaar_eerste_publicatie")} placeholder="bijv. 1984" />
        </div>

        <div>
          <Label>Taal origineel</Label>
          <Input value={fields.taal_origineel ?? ""} onChange={field("taal_origineel")} placeholder="bijv. nl, en, fr" />
        </div>

        <div className="sm:col-span-2">
          <Label>Open Library Work ID</Label>
          <Input value={fields.open_library_work_id ?? ""} onChange={field("open_library_work_id")} placeholder="bijv. OL82563W" className="font-mono" />
        </div>
      </div>

      {error && <p className="text-[13px] text-terracotta">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Opslaan…" : "Wijzigingen opslaan"}
        </button>
        <a
          href="/admin/works"
          className="border border-ink/20 text-ink text-xs font-black uppercase tracking-[0.12em] px-6 py-3.5 hover:border-ink transition-colors"
        >
          Annuleren
        </a>
      </div>
    </form>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">
      {children}
    </label>
  );
}

function Input({ className = "", ...props }: React.ComponentProps<"input"> & { className?: string }) {
  return (
    <input
      {...props}
      className={`w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors ${className}`}
    />
  );
}
