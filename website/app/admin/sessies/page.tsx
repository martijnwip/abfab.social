import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteSessionButton from "./delete-session-button";

async function createSession(formData: FormData) {
  "use server";
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  await supabase.from("book_sessions").insert({
    work_id: formData.get("work_id") as string,
    datum: formData.get("datum") as string,
    tijdstip: (formData.get("tijdstip") as string) || "20:00",
    eindtijd: (formData.get("eindtijd") as string) || null,
    locatie: (formData.get("locatie") as string) || null,
    notitie: (formData.get("notitie") as string) || null,
    max_deelnemers: parseInt(formData.get("max_deelnemers") as string) || 12,
    voertaal: "NL",
  });
  revalidatePath("/admin/sessies");
}

export default async function SessiesPage() {
  const supabase = await createClient();

  const [{ data: sessions }, { data: works }] = await Promise.all([
    supabase
      .from("book_sessions")
      .select("id, datum, tijdstip, eindtijd, locatie, max_deelnemers, works(originele_titel, auteur)")
      .order("datum", { ascending: true }),
    supabase
      .from("works")
      .select("id, originele_titel, auteur")
      .order("originele_titel"),
  ]);

  const inputClass = "w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-ink transition-colors";
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.18em] text-ink/50 mb-2";

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">Admin</p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">Sessies</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12">

        {/* Nieuwe sessie */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-ink/40 mb-5">
            Nieuwe sessie
          </h2>
          <form action={createSession} className="space-y-4">
            <div>
              <label className={labelClass}>Boek</label>
              <select name="work_id" required className={inputClass}>
                <option value="">Selecteer een boek…</option>
                {works?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.originele_titel} — {w.auteur}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Datum</label>
              <input name="datum" type="date" required className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Begintijd</label>
                <input name="tijdstip" type="time" defaultValue="20:00" step="60" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Eindtijd (optioneel)</label>
                <input name="eindtijd" type="time" step="60" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Locatie (optioneel)</label>
              <input name="locatie" type="text" placeholder="bijv. Café De Jaren, Amsterdam" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Max. deelnemers</label>
              <input name="max_deelnemers" type="number" defaultValue="12" min="1" max="100" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Notitie (optioneel)</label>
              <textarea
                name="notitie"
                rows={2}
                placeholder="bijv. Slotavond van de M-cyclus. Wij zorgen voor wijn en water."
                className={`${inputClass} resize-none`}
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
            <div className="space-y-3">
              {sessions.map((s) => {
                const work = (s as unknown as { works: { originele_titel: string; auteur: string } }).works;
                const tijd = `${((s as unknown as { tijdstip?: string }).tijdstip ?? "20:00").slice(0, 5)}`;
                const eindtijd = (s as unknown as { eindtijd?: string }).eindtijd;
                const tijdStr = eindtijd ? `${tijd} – ${eindtijd.slice(0, 5)}` : tijd;
                return (
                  <div key={s.id} className="border border-ink/12 bg-white px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-[15px]">{work?.originele_titel}</p>
                        <p className="text-[12px] text-ink/50 mt-0.5">{work?.auteur}</p>
                        <p className="text-[12px] font-mono text-ink/40 mt-1">
                          {new Date(s.datum).toLocaleDateString("nl-NL", {
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                          })}
                          {" · "}{tijdStr}
                          {s.locatie && ` · ${s.locatie}`}
                          {" · "}{(s as unknown as { max_deelnemers?: number }).max_deelnemers ?? 12} plekken
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <DeleteSessionButton id={s.id} label="Verwijderen" />
                        <Link
                          href={`/admin/sessies/${s.id}`}
                          className="text-[10px] font-black uppercase tracking-widest text-ink/50 hover:text-ink transition-colors"
                        >
                          Bewerken →
                        </Link>
                      </div>
                    </div>
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
