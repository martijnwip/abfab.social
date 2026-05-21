import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import EditWorkForm from "./edit-work-form";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const service = createServiceClient();

  const [{ data: work }, { data: tags }] = await Promise.all([
    supabase.from("works").select("*").eq("id", id).single(),
    supabase.from("tags").select("naam").order("naam"),
  ]);

  if (!work) notFound();

  const selectFields = "id, titel, auteur, waarom, aantal_medelezers, voorkeur_locatie, created_at, member_id, members(user_id)";

  // Zoek nominatie: eerst op work_id (nieuwe flow), dan op titel (oude flow)
  const { data: nominationByWorkId } = await supabase
    .from("nominations")
    .select(selectFields)
    .eq("work_id", id)
    .maybeSingle();

  const { data: nominationByTitel } = !nominationByWorkId
    ? await supabase
        .from("nominations")
        .select(selectFields)
        .eq("titel", work.originele_titel)
        .eq("status", "approved")
        .maybeSingle()
    : { data: null };

  const nomination = nominationByWorkId ?? nominationByTitel;

  const tagNames = tags?.map((t) => t.naam) ?? [];
  const gesprekskaart: { vraag: string; toelichting: string }[] = work.gesprekskaart ?? [];

  // E-mail ophalen via member_id → user_id → auth.users
  let nominatorEmail: string | null = null;
  if (nomination) {
    const userId = (nomination as unknown as { members: { user_id: string } | null }).members?.user_id;
    if (userId) {
      const { data: { user } } = await service.auth.admin.getUserById(userId);
      nominatorEmail = user?.email ?? null;
    }
    // Fallback: zoek direct via member_id als de join niets geeft
    if (!nominatorEmail) {
      const memberId = (nomination as unknown as { member_id: string | null }).member_id;
      if (memberId) {
        const { data: member } = await supabase
          .from("members")
          .select("user_id")
          .eq("id", memberId)
          .single();
        if (member?.user_id) {
          const { data: { user } } = await service.auth.admin.getUserById(member.user_id);
          nominatorEmail = user?.email ?? null;
        }
      }
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin · Works
      </p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">
        Work bewerken
      </h1>

      {/* Nominatie — boven het formulier */}
      {nomination && (() => {
        const nom = nomination as unknown as {
          created_at: string;
          aantal_medelezers: number;
          voorkeur_locatie: string;
          waarom: string | null;
        };
        return (
          <div className="max-w-2xl mb-10 border border-terracotta/30 bg-terracotta/5 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/60">
                  Genomineerd door lid
                </p>
              </div>
              <Link
                href="/admin/nominations"
                className="text-[10px] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
              >
                Alle nominations →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-1">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">Ingediend door</p>
                <p className="text-[13px] text-ink/70 truncate">{nominatorEmail ?? "—"}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">Datum</p>
                <p className="text-[13px] font-mono text-ink/70">
                  {new Date(nom.created_at).toLocaleDateString("nl-NL", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">Medelezers</p>
                <p className="text-[20px] font-black leading-none">
                  {nom.aantal_medelezers}
                  <span className="text-[11px] font-normal text-ink/40 ml-1">min.</span>
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">Locatie</p>
                <span className={`inline-block text-[9px] font-black uppercase tracking-[0.12em] px-2.5 py-1 ${
                  nom.voorkeur_locatie === "buurt" ? "bg-seafoam/30 text-ink/70" : "bg-krant/60 text-ink/70"
                }`}>
                  {nom.voorkeur_locatie === "buurt" ? "In de buurt" : "Online"}
                </span>
              </div>
            </div>

            {nom.waarom && (
              <p className="text-[13px] text-ink/65 italic leading-relaxed border-l-2 border-terracotta pl-4">
                &ldquo;{nom.waarom}&rdquo;
              </p>
            )}
          </div>
        );
      })()}

      <EditWorkForm work={work} availableTags={tagNames} />

      {/* Gesprekskaart */}
      {gesprekskaart.length > 0 && (
        <div className="mt-16 pt-10 border-t border-ink/10 max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6">
            Gesprekskaart
          </p>
          <ol className="space-y-6">
            {gesprekskaart.map((item, i) => (
              <li key={i} className="grid grid-cols-[24px_1fr] gap-4">
                <span className="text-[11px] font-black text-terracotta pt-0.5">{i + 1}.</span>
                <div>
                  <p className="text-[14px] font-black leading-snug mb-1">{item.vraag}</p>
                  <p className="text-[12px] text-ink/55 leading-relaxed">{item.toelichting}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </main>
  );
}
