import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "./delete-button";

export default async function WorksPage() {
  const supabase = await createClient();

  const { data: works } = await supabase
    .from("works")
    .select("id, originele_titel, auteur, jaar_eerste_publicatie, cover_image_url")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
            Admin
          </p>
          <h1 className="text-[36px] font-black tracking-tight leading-tight">
            Works
          </h1>
        </div>
        <Link
          href="/admin/works/new"
          className="bg-terracotta text-paper text-xs font-black uppercase tracking-[0.12em] px-5 py-3 hover:bg-terracotta/90 transition-colors"
        >
          + Work toevoegen
        </Link>
      </div>

      {!works?.length ? (
        <p className="text-sm text-ink/40">Nog geen works toegevoegd.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {works.map((w) => (
            <div key={w.id} className="group border border-ink/10 bg-white flex flex-col p-3">
              <div className="relative aspect-[2/3] bg-krant overflow-hidden">
                {w.cover_image_url && (
                  <Image
                    src={w.cover_image_url}
                    alt={w.originele_titel}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs font-black leading-tight">{w.originele_titel}</p>
                <p className="text-[11px] text-ink/50 mt-0.5">{w.auteur}</p>
                {w.jaar_eerste_publicatie && (
                  <p className="text-[11px] text-ink/40 mt-0.5">{w.jaar_eerste_publicatie}</p>
                )}
                <div className="flex flex-col gap-1.5 mt-auto pt-4 border-t border-ink/8">
                  <Link
                    href={`/admin/works/${w.id}/edit`}
                    className="text-[10px] font-black uppercase tracking-widest text-ink/50 hover:text-ink transition-colors"
                  >
                    Bewerken
                  </Link>
                  <DeleteButton id={w.id} titel={w.originele_titel} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
