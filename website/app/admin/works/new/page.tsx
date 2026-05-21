import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import WorkForm from "./work-form";

export default async function NewWorkPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const supabase = await createClient();
  const service = createServiceClient();
  const { data: tags } = await supabase.from("tags").select("naam").order("naam");
  const tagNames = tags?.map((t) => t.naam) ?? [];

  const params = await searchParams;

  let nomination: { id: string; titel: string; auteur: string; waarom: string; nominatorEmail: string | null } | null = null;

  if (params.nomination_id) {
    const { data: nom } = await supabase
      .from("nominations")
      .select("id, titel, auteur, waarom, member_id, members(user_id)")
      .eq("id", params.nomination_id)
      .single();

    let nominatorEmail: string | null = null;
    if (nom) {
      const userId = (nom as unknown as { members: { user_id: string } | null }).members?.user_id;
      if (userId) {
        const { data: { user } } = await service.auth.admin.getUserById(userId);
        nominatorEmail = user?.email ?? null;
      }
    }

    nomination = {
      id: params.nomination_id,
      titel: nom?.titel ?? params.titel ?? "",
      auteur: nom?.auteur ?? params.auteur ?? "",
      waarom: nom?.waarom ?? params.waarom ?? "",
      nominatorEmail,
    };
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin · Works
      </p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">
        Work toevoegen
      </h1>
      <WorkForm availableTags={tagNames} nomination={nomination} />
    </main>
  );
}
