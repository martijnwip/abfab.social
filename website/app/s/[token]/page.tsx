import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import type { ScenarioData } from "@/app/api/works/scenario/route";
import ScenarioView from "@/components/scenario-view";

export default async function SharedScenarioPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const service = createServiceClient();

  const { data: shareToken } = await service
    .from("scenario_share_tokens")
    .select("work_id, expires_at")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!shareToken) notFound();

  const { data: work } = await service
    .from("works")
    .select("id, originele_titel, auteur, jaar_eerste_publicatie, scenario")
    .eq("id", shareToken.work_id)
    .single();

  if (!work) notFound();

  const raw = work.scenario;
  const s: ScenarioData | null = raw
    ? typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as ScenarioData)
    : null;

  if (!s) notFound();

  const expiresDate = new Date(shareToken.expires_at).toLocaleDateString("nl-NL", {
    day: "numeric", month: "long",
  });

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-krant/40 border-b border-ink/10 px-4 sm:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-black">▲</span>
          <span className="text-[9px] font-black uppercase tracking-label text-ink/55">
            Tijdgeest · Gespreksscenario
          </span>
        </div>
        <p className="text-[9px] text-ink/35 font-black uppercase tracking-widest">
          Geldig t/m {expiresDate}
        </p>
      </div>
      <ScenarioView work={work} s={s} />
    </div>
  );
}
