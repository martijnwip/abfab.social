import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import RemoveSignupButton from "./remove-signup-button";

async function updateSessie(formData: FormData) {
  "use server";
  const id = formData.get("session_id") as string;
  const datum = formData.get("datum") as string;
  const tijdstip = formData.get("tijdstip") as string;
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  await supabase.from("book_sessions").update({ datum, tijdstip }).eq("id", id);
  revalidatePath(`/admin/sessies/${id}`);
}

export default async function SessieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const service = createServiceClient();

  const { data: session } = await supabase
    .from("book_sessions")
    .select("id, datum, tijdstip, locatie, works(id, originele_titel, auteur, gesprekskaart)")
    .eq("id", id)
    .single();

  if (!session) notFound();

  const work = (session as unknown as {
    works: { id: string; originele_titel: string; auteur: string; gesprekskaart: { vraag: string; toelichting: string }[] | null }
  }).works;

  // Signups ophalen
  const { data: signups } = await supabase
    .from("session_signups")
    .select("id, member_id, members(user_id)")
    .eq("session_id", id);

  // E-mailadressen via service client (auth.users)
  const userIds = (signups ?? []).map(
    (s) => (s as unknown as { members: { user_id: string } }).members.user_id
  );

  const { data: { users: authUsers } } = userIds.length
    ? await service.auth.admin.listUsers({ perPage: 1000 })
    : { data: { users: [] } };

  const emailMap = new Map((authUsers ?? []).map((u) => [u.id, u.email ?? ""]));

  const signupsWithEmail = (signups ?? []).map((s) => {
    const userId = (s as unknown as { members: { user_id: string } }).members.user_id;
    return { id: s.id, userId, email: emailMap.get(userId) ?? userId };
  });

  const gesprekskaart = work?.gesprekskaart ?? [];

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
              <ol className="space-y-5">
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
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 mb-1.5">Tijdstip</label>
                <input
                  name="tijdstip"
                  type="time"
                  defaultValue={(session as { tijdstip?: string }).tijdstip ?? "20:00"}
                  className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
                />
              </div>
              {session.locatie && (
                <p className="text-[12px] text-ink/45">{session.locatie}</p>
              )}
              <button
                type="submit"
                className="w-full bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] py-2.5 hover:bg-ink/85 transition-colors cursor-pointer"
              >
                Opslaan
              </button>
            </form>
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
