import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import DeleteTagButton from "./delete-tag-button";

async function addTag(formData: FormData) {
  "use server";
  const naam = (formData.get("naam") as string)?.trim();
  if (!naam) return;
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  await supabase.from("tags").insert({ naam });
  revalidatePath("/admin/tags");
}

export default async function TagsPage() {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("id, naam")
    .order("naam");

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin
      </p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">
        Tags
      </h1>

      <div className="max-w-sm space-y-8">
        {/* Huidige tags */}
        <div className="space-y-2">
          {tags?.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between border border-ink/10 px-4 py-2.5 bg-white">
              <span className="text-sm font-medium">{tag.naam}</span>
              <DeleteTagButton id={tag.id} naam={tag.naam} />
            </div>
          ))}
          {!tags?.length && (
            <p className="text-sm text-ink/40">Nog geen tags.</p>
          )}
        </div>

        {/* Nieuwe tag toevoegen */}
        <form action={addTag} className="flex gap-3">
          <input
            name="naam"
            required
            placeholder="Nieuwe tag…"
            className="flex-1 border border-ink/20 bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors"
          />
          <button
            type="submit"
            className="bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-terracotta/90 transition-colors cursor-pointer"
          >
            Toevoegen
          </button>
        </form>
      </div>
    </main>
  );
}
