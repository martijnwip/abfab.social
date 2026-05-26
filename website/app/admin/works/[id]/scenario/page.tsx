import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import PrintButton from "./print-button";
import ShareButton from "./share-button";
import type { ScenarioData } from "@/app/api/works/scenario/route";
import ScenarioView from "@/components/scenario-view";

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: work } = await supabase
    .from("works")
    .select("id, originele_titel, auteur, jaar_eerste_publicatie, scenario")
    .eq("id", id)
    .single();

  if (!work) notFound();

  const raw = work.scenario;
  const s: ScenarioData | null = raw
    ? typeof raw === "string"
      ? JSON.parse(raw)
      : (raw as unknown as ScenarioData)
    : null;

  return (
    <div className="bg-paper min-h-screen">
      <div className="print:hidden border-b border-ink/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href={`/admin/works/${id}/edit`} className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
          ← Terug
        </Link>
        <div className="flex items-center gap-6">
          <ShareButton workId={id} />
          <PrintButton />
        </div>
      </div>

      {s ? (
        <ScenarioView work={work} s={s} />
      ) : (
        <div className="max-w-205 mx-auto px-4 sm:px-8 py-10">
          <p className="text-sm text-ink/40">Nog geen scenario gegenereerd.</p>
        </div>
      )}
    </div>
  );
}
