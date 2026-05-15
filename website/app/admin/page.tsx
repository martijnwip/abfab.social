import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import MembersTable from "./members-table";

export default async function AdminPage() {
  const supabase = await createClient();
  const service = createServiceClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Haal alle members en auth emails parallel op
  const [{ data: members, error }, { data: { users: authUsers } }] = await Promise.all([
    supabase
      .from("members")
      .select("id, user_id, role, status, created_at")
      .order("created_at", { ascending: false }),
    service.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (error) throw new Error(error.message);

  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

  const membersWithEmail = (members ?? []).map((m) => ({
    ...m,
    email: emailMap.get(m.user_id) ?? "",
  }));

  const pending  = membersWithEmail.filter((m) => m.status === "pending")  ?? [];
  const approved = membersWithEmail.filter((m) => m.status === "approved") ?? [];
  const rejected = membersWithEmail.filter((m) => m.status === "rejected") ?? [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin
      </p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-2">
        Leden
      </h1>
      <p className="text-[15px] text-ink/60 mb-10">
        {membersWithEmail.length} leden totaal —{" "}
        <span className="text-mustard font-medium">{pending.length} pending</span>,{" "}
        <span className="font-medium">{approved.length} approved</span>,{" "}
        <span className="text-terracotta font-medium">{rejected.length} rejected</span>
      </p>

      {pending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-mustard mb-4">
            Pending ({pending.length})
          </h2>
          <MembersTable members={pending} />
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-[0.18em] text-ink/40 mb-4">
          Approved ({approved.length})
        </h2>
        <MembersTable members={approved} />
      </section>

      {rejected.length > 0 && (
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-terracotta mb-4">
            Rejected ({rejected.length})
          </h2>
          <MembersTable members={rejected} />
        </section>
      )}
    </main>
  );
}
