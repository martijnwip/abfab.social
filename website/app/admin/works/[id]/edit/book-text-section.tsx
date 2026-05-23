"use client";

import { useRef, useState, useTransition } from "react";
import { uploadBookText, deleteBookText } from "./book-text-actions";

export default function BookTextSection({
  workId,
  initialPath,
}: {
  workId: string;
  initialPath: string | null;
}) {
  const [path, setPath] = useState<string | null>(initialPath);
  const [fileName, setFileName] = useState<string | null>(
    initialPath ? initialPath.split("/").pop() ?? null : null
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadBookText(workId, fd);
      if (result.error) {
        setError(result.error);
      } else {
        setPath(result.path ?? null);
        setFileName(file.name);
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteBookText(workId);
      if (result.error) {
        setError(result.error);
      } else {
        setPath(null);
        setFileName(null);
      }
    });
  }

  return (
    <div className="mt-10 pt-8 border-t border-ink/10 max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40">
          Boektekst
        </p>
        {!path && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isPending}
            className="text-[10px] font-black uppercase tracking-[0.12em] border border-ink/20 px-3 py-2 hover:bg-ink hover:text-paper hover:border-ink transition-colors cursor-pointer disabled:opacity-40"
          >
            {isPending ? "Uploaden…" : "+ .txt uploaden"}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".txt,text/plain"
        onChange={handleFile}
        className="hidden"
      />

      {path ? (
        <div className="border border-ink/12 bg-white p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-black">{fileName}</p>
            <p className="text-[11px] font-mono text-ink/40 mt-0.5 truncate">{path}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isPending}
              className="text-[10px] font-black uppercase tracking-widest text-ink/50 hover:text-ink transition-colors cursor-pointer disabled:opacity-40"
            >
              Vervangen
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline transition-colors cursor-pointer disabled:opacity-40"
            >
              {isPending ? "…" : "Verwijderen"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink/40">
          Voeg de volledige boektekst toe als .txt bestand om vragen te genereren die direct op de tekst zijn gebaseerd. Max. 20 MB.
        </p>
      )}

      {error && <p className="text-[11px] text-terracotta mt-2">{error}</p>}
    </div>
  );
}
