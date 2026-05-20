import Nav from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import WorksGrid from "./works-grid";

export const metadata = {
  title: "Leeslijst — Tijdgeest",
};

export default async function LeeslijstPage() {
  const supabase = await createClient();

  const [{ data: works }, { data: tags }, { data: sessions }] = await Promise.all([
    supabase
      .from("works")
      .select("id, originele_titel, subtitel, auteur, jaar_eerste_publicatie, cover_image_url, tags")
      .order("created_at", { ascending: false }),
    supabase.from("tags").select("naam").order("naam"),
    supabase
      .from("book_sessions")
      .select("id, work_id, datum, locatie")
      .order("datum", { ascending: true }),
  ]);

  const worksWithSessions = (works ?? []).map((w) => ({
    ...w,
    tags: w.tags ?? [],
    sessions: (sessions ?? []).filter((s) => s.work_id === w.id),
  }));

  const tagNames = (tags ?? []).map((t) => t.naam);
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-6">
          De leeslijst
        </p>
        <h1 className="font-editorial text-[56px] md:text-[72px] leading-none tracking-[-0.02em] mb-1">
          Eén leeslijst.
        </h1>
        <h1 className="font-editorial italic text-[56px] md:text-[72px] leading-none tracking-[-0.02em] mb-8">
          Drie manieren om mee te lezen.
        </h1>
        <p className="text-[15px] leading-[1.7] text-ink/70 max-w-xl">
          Elke titel kan een of meer tags hebben —{" "}
          <strong className="font-black text-ink">In Één Ruk</strong>,{" "}
          <strong className="font-black text-ink">Boek & Film</strong> of{" "}
          <strong className="font-black text-ink">On Request</strong>{" "}
          — die aangeven wat voor avond het wordt. Staat er geen tag bij? Dan is het gewoon
          een goed boek dat de moeite waard is om samen te lezen.
        </p>
      </section>

      <div className="border-t border-ink/15" />

      <WorksGrid works={worksWithSessions} allTags={tagNames} />
    </>
  );
}
