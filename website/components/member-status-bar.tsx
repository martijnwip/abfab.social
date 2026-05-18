import { createClient } from "@/lib/supabase/server";

export default async function MemberStatusBar() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("status")
    .eq("user_id", user.id)
    .single();

  if (!member || member.status !== "pending") return null;

  return (
    <div className="bg-seafoam text-ink">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-ink/40 shrink-0" />
        <p className="text-[12px] font-medium leading-snug">
          Je aanmelding is ontvangen en wordt beoordeeld. Je krijgt toegang zodra een admin je account heeft goedgekeurd.
        </p>
      </div>
    </div>
  );
}
