import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditWorkForm from "./edit-work-form";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: work }, { data: tags }] = await Promise.all([
    supabase.from("works").select("*").eq("id", id).single(),
    supabase.from("tags").select("naam").order("naam"),
  ]);

  if (!work) notFound();

  const tagNames = tags?.map((t) => t.naam) ?? [];

  const gesprekskaart: { vraag: string; toelichting: string }[] = work.gesprekskaart ?? [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin · Works
      </p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">
        Work bewerken
      </h1>
      <EditWorkForm work={work} availableTags={tagNames} />

      {gesprekskaart.length > 0 && (
        <div className="mt-16 pt-10 border-t border-ink/10 max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6">
            Gesprekskaart
          </p>
          <ol className="space-y-6">
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
        </div>
      )}
    </main>
  );
}
