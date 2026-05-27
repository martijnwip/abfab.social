import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { rejectNomination } from "../actions";

export default async function NominationsPage() {
  const supabase = await createClient();
  const service = createServiceClient();

  const { data: nominations } = await supabase
    .from("nominations")
    .select("id, titel, auteur, waarom, aantal_medelezers, voorkeur_locatie, status, created_at, member_id, members(user_id)")
    .order("created_at", { ascending: false });

  // E-mails ophalen via service client
  const userIds = [...new Set(
    (nominations ?? [])
      .map((n) => (n as unknown as { members: { user_id: string } | null }).members?.user_id)
      .filter(Boolean) as string[]
  )];

  const { data: { users: authUsers } } = userIds.length
    ? await service.auth.admin.listUsers({ perPage: 1000 })
    : { data: { users: [] } };

  const emailMap = new Map((authUsers ?? []).map((u) => [u.id, u.email ?? ""]));

  const rows = (nominations ?? []).map((n) => {
    const nx = n as unknown as {
      id: string;
      titel: string;
      auteur: string | null;
      waarom: string | null;
      aantal_medelezers: number;
      voorkeur_locatie: string;
      status: string;
      created_at: string;
      members: { user_id: string } | null;
    };
    const userId = nx.members?.user_id ?? null;
    const email = userId ? (emailMap.get(userId) ?? userId) : "—";
    return { ...nx, email };
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">Admin</p>
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="text-[36px] font-black tracking-tight leading-tight">Nominations</h1>
        <span className="text-[12px] font-mono text-ink/40">{rows.length} voorstel{rows.length !== 1 ? "len" : ""}</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-ink/40">Nog geen nominaties ontvangen.</p>
      ) : (
        <div className="space-y-0 divide-y divide-ink/10">
          {/* Header */}
          <div className="grid grid-cols-[1fr_160px_80px_120px_120px_140px] gap-6 pb-3">
            {["Titel / Auteur", "Ingediend door", "Lezers", "Locatie", "Status", ""].map((h) => (
              <p key={h} className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40">{h}</p>
            ))}
          </div>

          {rows.map((n) => {
            const approveUrl = `/admin/works/new?nomination_id=${n.id}&titel=${encodeURIComponent(n.titel)}&auteur=${encodeURIComponent(n.auteur ?? "")}&waarom=${encodeURIComponent(n.waarom ?? "")}`;
            return (
              <div key={n.id} className={`grid grid-cols-[1fr_160px_80px_120px_120px_140px] gap-6 py-5 items-start ${n.status !== "pending" ? "opacity-50" : ""}`}>
                <div>
                  <p className="text-[15px] font-black leading-tight">{n.titel}</p>
                  {n.auteur && <p className="text-[12px] text-ink/50 mt-0.5">{n.auteur}</p>}
                  {n.waarom && (
                    <p className="text-[12px] text-ink/45 italic mt-2 leading-relaxed">
                      &ldquo;{n.waarom}&rdquo;
                    </p>
                  )}
                </div>

                <p className="text-[12px] text-ink/60 truncate pt-0.5">{n.email}</p>

                <p className="text-[14px] font-black pt-0.5">{n.aantal_medelezers}</p>

                <span className={`inline-block text-[9px] font-black uppercase tracking-[0.12em] px-2.5 py-1 mt-0.5 w-fit ${
                  n.voorkeur_locatie === "buurt" ? "bg-seafoam/30 text-ink/70" : "bg-krant/60 text-ink/70"
                }`}>
                  {n.voorkeur_locatie === "buurt" ? "In de buurt" : "Online"}
                </span>

                <span className={`inline-block text-[9px] font-black uppercase tracking-[0.12em] px-2.5 py-1 mt-0.5 w-fit ${
                  n.status === "approved"
                    ? "bg-seafoam/40 text-ink/60"
                    : n.status === "rejected"
                    ? "bg-terracotta/15 text-terracotta/70"
                    : "bg-mustard/20 text-ink/60"
                }`}>
                  {n.status === "approved" ? "Goedgekeurd" : n.status === "rejected" ? "Afgewezen" : "In behandeling"}
                </span>

                <div className="pt-0.5 flex flex-col gap-2">
                  {n.status === "pending" && (
                    <>
                      <Link
                        href={approveUrl}
                        className="text-[10px] font-black uppercase tracking-[0.12em] border border-ink/20 px-3 py-2 hover:bg-ink hover:text-paper hover:border-ink transition-colors text-center"
                      >
                        Goedkeuren →
                      </Link>
                      <form action={rejectNomination.bind(null, n.id)}>
                        <button
                          type="submit"
                          className="w-full text-[10px] font-black uppercase tracking-[0.12em] border border-terracotta/30 px-3 py-2 text-terracotta hover:bg-terracotta hover:text-paper hover:border-terracotta transition-colors cursor-pointer bg-transparent"
                        >
                          Afwijzen
                        </button>
                      </form>
                    </>
                  )}
                  {n.status !== "pending" && (
                    <p className="text-[11px] font-mono text-ink/30">
                      {new Date(n.created_at).toLocaleDateString("nl-NL", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
