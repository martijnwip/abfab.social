import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import RemoveSignupButton from "./remove-signup-button";
import DeleteSessionButton from "../delete-session-button";

async function updateSessie(formData: FormData) {
  "use server";
  const id = formData.get("session_id") as string;
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  await supabase.from("book_sessions").update({
    datum: formData.get("datum") as string,
    tijdstip: formData.get("tijdstip") as string,
    eindtijd: (formData.get("eindtijd") as string) || null,
    locatie: (formData.get("locatie") as string) || null,
    notitie: (formData.get("notitie") as string) || null,
    max_deelnemers: parseInt(formData.get("max_deelnemers") as string) || 12,
    groepscijfer: (formData.get("groepscijfer") as string)
      ? parseFloat(formData.get("groepscijfer") as string)
      : null,
  }).eq("id", id);
  revalidatePath(`/admin/sessies/${id}`);
}

export default async function SessieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const service = createServiceClient();

  const { data: session } = await supabase
    .from("book_sessions")
    .select("id, datum, tijdstip, eindtijd, locatie, notitie, max_deelnemers, groepscijfer, works(id, originele_titel, auteur, gesprekskaart)")
    .eq("id", id)
    .single();

  if (!session) notFound();

  const sessionData = session as unknown as {
    tijdstip?: string;
    eindtijd?: string;
    locatie?: string | null;
    notitie?: string | null;
    max_deelnemers?: number;
    groepscijfer?: number | null;
    works: { id: string; originele_titel: string; auteur: string; gesprekskaart: { vraag: string; toelichting: string }[] | null }
  };
  const work = sessionData.works;

  // Signups ophalen
  const { data: signups } = await supabase
    .from("session_signups")
    .select("id, member_id, members(user_id)")
    .eq("session_id", id);

  // E-mailadressen via service client (auth.users)
  const userIds = (signups ?? [])
    .map((s) => (s as unknown as { members: { user_id: string } | null }).members?.user_id)
    .filter((id): id is string => !!id);

  const { data: { users: authUsers } } = userIds.length
    ? await service.auth.admin.listUsers({ perPage: 1000 })
    : { data: { users: [] } };

  const emailMap = new Map((authUsers ?? []).map((u) => [u.id, u.email ?? ""]));

  const signupsWithEmail = (signups ?? []).map((s) => {
    const userId = (s as unknown as { members: { user_id: string } | null }).members?.user_id ?? null;
    return {
      id: s.id,
      userId: userId ?? s.member_id,
      email: userId ? emailMap.get(userId) ?? userId : "Onbekend lid",
    };
  });

  const gesprekskaart: { sectie?: string; vraag: string; toelichting: string }[] = work?.gesprekskaart ?? [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin · Sessies
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

        {/* Links: werk + gesprekskaart */}
        <div>
          <h1 className="text-[32px] font-black tracking-tight leading-tight mb-1">
            {work?.originele_titel}
          </h1>
          <p className="text-[14px] text-ink/50 mb-10">{work?.auteur}</p>

          {gesprekskaart.length > 0 ? (
            <>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-5">
                Gesprekskaart
              </p>
              <div className="space-y-8">
                {(() => {
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
            </>
          ) : (
            <p className="text-sm text-ink/40">Nog geen gesprekskaart gegenereerd.</p>
          )}
        </div>

        {/* Rechts: datum + aanmeldingen */}
        <div className="space-y-8">

          {/* Datum aanpassen */}
          <div className="border border-ink/12 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
              Datum &amp; tijdstip
            </p>
            <form action={updateSessie} className="space-y-3">
              <input type="hidden" name="session_id" value={id} />

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">Datum</label>
                <input
                  name="datum"
                  type="date"
                  defaultValue={session.datum}
                  className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">Begintijd</label>
                  <input
                    name="tijdstip"
                    type="time"
                    defaultValue={(sessionData.tijdstip ?? "20:00").slice(0, 5)}
                    step="60"
                    className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">Eindtijd</label>
                  <input
                    name="eindtijd"
                    type="time"
                    defaultValue={sessionData.eindtijd ? sessionData.eindtijd.slice(0, 5) : ""}
                    step="60"
                    className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">Locatie</label>
                <input
                  name="locatie"
                  type="text"
                  defaultValue={sessionData.locatie ?? ""}
                  placeholder="bijv. Café De Jaren, Amsterdam"
                  className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">Max. deelnemers</label>
                <input
                  name="max_deelnemers"
                  type="number"
                  defaultValue={sessionData.max_deelnemers ?? 12}
                  min="1"
                  max="100"
                  className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">Notitie</label>
                <textarea
                  name="notitie"
                  rows={2}
                  defaultValue={sessionData.notitie ?? ""}
                  placeholder="bijv. Slotavond van de M-cyclus."
                  className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">
                  Groepscijfer <span className="text-ink/30 font-normal normal-case tracking-normal">(0 – 10, halve waarden toegestaan)</span>
                </label>
                <input
                  name="groepscijfer"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue={sessionData.groepscijfer ?? ""}
                  placeholder="bijv. 8.5"
                  className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] py-2.5 hover:bg-ink/85 transition-colors cursor-pointer"
              >
                Opslaan
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-ink/10 flex justify-end">
              <DeleteSessionButton id={id} label="Sessie verwijderen" redirectAfter />
            </div>
          </div>

          {/* Aanmeldingen */}
          <div className="border border-ink/12 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
              Aanmeldingen ({signupsWithEmail.length})
            </p>
            {signupsWithEmail.length === 0 ? (
              <p className="text-sm text-ink/40">Nog niemand aangemeld.</p>
            ) : (
              <ul className="divide-y divide-ink/8">
                {signupsWithEmail.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2.5">
                    <span className="text-[13px] text-ink/70 truncate mr-4">{s.email}</span>
                    <RemoveSignupButton signupId={s.id} naam={s.email} />
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
