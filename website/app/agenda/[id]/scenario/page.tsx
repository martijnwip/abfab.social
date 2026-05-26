import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ScenarioData } from "@/app/api/works/scenario/route";
import ScenarioView from "@/components/scenario-view";

export default async function ReaderScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/agenda");

  const { data: session } = await supabase
    .from("book_sessions")
    .select("id, datum, works(id, originele_titel, auteur, jaar_eerste_publicatie, scenario)")
    .eq("id", id)
    .single();

  if (!session) notFound();

  const sessionData = session as unknown as {
    datum: string;
    works: { id: string; originele_titel: string; auteur: string; jaar_eerste_publicatie?: number; scenario: unknown };
  };

  // Pas beschikbaar vanaf 1 week voor de sessiedatum
  const sessionDate = new Date(sessionData.datum);
  const unlockDate = new Date(sessionDate);
  unlockDate.setDate(unlockDate.getDate() - 7);
  if (new Date() < unlockDate) notFound();

  const { data: member } = await supabase
    .from("members")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (!member || member.status !== "approved") redirect("/agenda");

  const { data: signup } = await supabase
    .from("session_signups")
    .select("id")
    .eq("session_id", id)
    .eq("member_id", member.id)
    .maybeSingle();

  if (!signup) redirect("/agenda");

  const work = sessionData.works;
  const raw = work.scenario;
  const s: ScenarioData | null = raw
    ? typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as ScenarioData)
    : null;

  if (!s) notFound();

  return (
    <div className="bg-paper min-h-screen">
      <div className="border-b border-ink/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/agenda" className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">
          ← Terug naar agenda
        </Link>
        <span className="text-[9px] font-black uppercase tracking-label text-ink/30">Gespreksgids</span>
      </div>
      <ScenarioView work={work} s={s} />
    </div>
  );
}
