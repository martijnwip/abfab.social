import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import EditWorkForm from "./edit-work-form";
import SourcesSection from "./sources-section";
import BookTextSection from "./book-text-section";
import BookQuestionsButton from "./book-questions-button";
import ScenarioButton from "./scenario-button";
import DeleteButton from "../../delete-button";
import GesprekskaartButton from "../../gesprekskaart-button";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const service = createServiceClient();

  const [{ data: work }, { data: tags }, { data: sources }] = await Promise.all([
    supabase.from("works").select("*").eq("id", id).single(),
    supabase.from("tags").select("naam").order("naam"),
    supabase.from("work_sources").select("id, type, titel, beschrijving, inhoud, bron").eq("work_id", id).order("created_at"),
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
  const gesprekskaart: { sectie?: string; vraag: string; toelichting: string }[] = work.gesprekskaart ?? [];
  const bookTextPath: string | null = (work as unknown as { book_text_path: string | null }).book_text_path ?? null;
  const hasBookQuestions = gesprekskaart.some((q) => q.sectie === "Op basis van de boektekst");
  const scenario: string | null = (work as unknown as { scenario: string | null }).scenario ?? null;

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
        <Link href="/admin/works" className="hover:text-ink transition-colors">Admin · Works</Link>
      </p>

      <div className="flex items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[36px] font-black tracking-tight leading-tight">
            {work.originele_titel}
          </h1>
          <p className="text-[14px] text-ink/50 mt-1">{work.auteur}{work.jaar_eerste_publicatie ? ` · ${work.jaar_eerste_publicatie}` : ""}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 pt-1 flex-wrap justify-end">
          <GesprekskaartButton
            workId={id}
            titel={work.originele_titel}
            hasKaart={!!work.gesprekskaart}
          />
          <BookQuestionsButton
            workId={id}
            hasBookText={!!bookTextPath}
            hasBookQuestions={hasBookQuestions}
          />
          <ScenarioButton workId={id} hasScenario={!!scenario} />
          <span className="w-px h-3 bg-ink/15" />
          <DeleteButton
            id={id}
            titel={work.originele_titel}
            redirectTo="/admin/works"
            className="text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 m-0"
          />
        </div>
      </div>

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

      {/* Bronnen */}
      <SourcesSection workId={id} initialSources={sources ?? []} />

      {/* Boektekst */}
      <BookTextSection workId={id} initialPath={bookTextPath} />

      {/* Gesprekskaart */}
      {gesprekskaart.length > 0 && (
        <div className="mt-16 pt-10 border-t border-ink/10 max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6">
            Gesprekskaart
          </p>
          <div className="space-y-8">
            {(() => {
              // Groepeer op sectie
              const sections: { naam: string; items: typeof gesprekskaart }[] = [];
              for (const item of gesprekskaart) {
                const naam = item.sectie ?? "";
                const last = sections[sections.length - 1];
                if (last && last.naam === naam) last.items.push(item);
                else sections.push({ naam, items: [item] });
              }
              const hasHeaders = sections.some((s) => s.naam !== "");
              let counter = 0;
              return sections.map((section, si) => (
                <div key={si}>
                  {hasHeaders && section.naam && (
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-4 pb-2 border-b border-ink/10">
                      {section.naam}
                    </p>
                  )}
                  <ol className="space-y-5">
                    {section.items.map((item) => {
                      counter++;
                      const n = counter;
                      return (
                        <li key={n} className="grid grid-cols-[24px_1fr] gap-4">
                          <span className="text-[11px] font-black text-terracotta pt-0.5">{n}.</span>
                          <div>
                            <p className="text-[14px] font-black leading-snug mb-1">{item.vraag}</p>
                            <p className="text-[12px] text-ink/55 leading-relaxed">{item.toelichting}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {scenario && (
        <div className="mt-10 pt-8 border-t border-ink/10 max-w-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-1">Gespreksscenario</p>
            <p className="text-[12px] text-ink/50">Scenario gegenereerd — klaar om te bekijken.</p>
          </div>
          <Link
            href={`/admin/works/${id}/scenario`}
            className="text-[10px] font-black uppercase tracking-widest text-ink/50 hover:text-ink transition-colors shrink-0"
          >
            Bekijk scenario →
          </Link>
        </div>
      )}
    </main>
  );
}
