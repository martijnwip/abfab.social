import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import PrepareButton from "./prepare-button";

async function createSession(formData: FormData) {
  "use server";
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  await supabase.from("book_sessions").insert({
    work_id: formData.get("work_id") as string,
    datum: formData.get("datum") as string,
    locatie: (formData.get("locatie") as string) || null,
    voertaal: "NL",
  });
  revalidatePath("/admin/sessies");
}

export default async function SessiesPage() {
  const supabase = await createClient();

  const [{ data: sessions }, { data: works }] = await Promise.all([
    supabase
      .from("book_sessions")
      .select("id, datum, locatie, voertaal, session_prep, works(originele_titel, auteur)")
      .order("datum", { ascending: false }),
    supabase
      .from("works")
      .select("id, originele_titel, auteur")
      .order("originele_titel"),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">Admin</p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">Sessies</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">

        {/* Nieuwe sessie */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-ink/40 mb-5">
            Nieuwe sessie
          </h2>
          <form action={createSession} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">
                Boek
              </label>
              <select
                name="work_id"
                required
                className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors"
              >
                <option value="">Selecteer een boek…</option>
                {works?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.originele_titel} — {w.auteur}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">
                Datum
              </label>
              <input
                name="datum"
                type="date"
                required
                className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2">
                Locatie (optioneel)
              </label>
              <input
                name="locatie"
                type="text"
                placeholder="bijv. Café De Jaren, Amsterdam"
                className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] py-3 hover:bg-ink/85 transition-colors cursor-pointer"
            >
              Sessie aanmaken
            </button>
          </form>
        </div>

        {/* Sessie lijst */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-ink/40 mb-5">
            Geplande sessies
          </h2>
          {!sessions?.length ? (
            <p className="text-sm text-ink/40">Nog geen sessies aangemaakt.</p>
          ) : (
            <div className="space-y-5">
              {sessions.map((s) => {
                const work = (s as unknown as { works: { originele_titel: string; auteur: string } }).works;
                const hasPrep = !!s.session_prep;
                return (
                  <div key={s.id} className="border border-ink/12 bg-white p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-[15px]">{work?.originele_titel}</p>
                        <p className="text-[12px] text-ink/50 mt-0.5">{work?.auteur}</p>
                        <p className="text-[12px] font-mono text-ink/40 mt-1">
                          {new Date(s.datum).toLocaleDateString("nl-NL", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                          })}
                          {s.locatie && ` · ${s.locatie}`}
                        </p>
                      </div>
                      {hasPrep && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-seafoam/30 text-ink px-2.5 py-1 shrink-0">
                          Voorbereid
                        </span>
                      )}
                    </div>
                    <PrepareButton sessionId={s.id} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
