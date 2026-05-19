import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditWorkForm from "./edit-work-form";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .single();

  if (!work) notFound();

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin · Works
      </p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">
        Work bewerken
      </h1>
      <EditWorkForm work={work} />
    </main>
  );
}
