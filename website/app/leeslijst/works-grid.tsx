"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Session = {
  id: string;
  datum: string;
  locatie: string | null;
};

type Work = {
  id: string;
  originele_titel: string;
  subtitel: string | null;
  auteur: string;
  jaar_eerste_publicatie: number | null;
  cover_image_url: string | null;
  tags: string[];
  sessions: Session[];
};

type Props = {
  works: Work[];
  allTags: string[];
};

function sessionStatus(sessions: Session[]): "nu" | "binnenkort" | "archief" | null {
  if (!sessions.length) return null;
  const now = new Date();
  const upcoming = sessions.filter((s) => new Date(s.datum) >= now);
  if (!upcoming.length) return "archief";
  const diff = (new Date(upcoming[0].datum).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 14 ? "nu" : "binnenkort";
}

function formatDate(datum: string) {
  return new Date(datum).toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

export default function WorksGrid({ works, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCounts = allTags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = works.filter((w) => w.tags.includes(tag)).length;
    return acc;
  }, {});

  const withoutTag = works.filter((w) => !w.tags.length);
  const archived = works.filter((w) => sessionStatus(w.sessions) === "archief");

  const filtered =
    activeTag === "__zonder__"
      ? withoutTag
      : activeTag === "__archief__"
      ? archived
      : activeTag
      ? works.filter((w) => w.tags.includes(activeTag))
      : works;

  const filters: { key: string | null; label: string; count: number }[] = [
    { key: null, label: "Alle titels", count: works.length },
    ...allTags
      .filter((t) => tagCounts[t] > 0)
      .map((t) => ({ key: t, label: t, count: tagCounts[t] })),
    { key: "__zonder__", label: "Zonder tag", count: withoutTag.length },
    ...(archived.length ? [{ key: "__archief__", label: "Archief", count: archived.length }] : []),
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {filters.map((f) => {
          const active = activeTag === f.key;
          return (
            <button
              key={f.key ?? "all"}
              onClick={() => setActiveTag(f.key)}
              className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 border transition-colors cursor-pointer ${
                active ? "bg-ink text-paper border-ink" : "border-ink/20 text-ink/60 hover:border-ink/50"
              }`}
            >
              {f.label} <span className={active ? "text-paper/60" : "text-ink/35"}>{f.count}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[12px] text-ink/40 mb-6">{filtered.length} titel{filtered.length !== 1 ? "s" : ""}</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-ink/40">Geen titels gevonden.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((w) => {
            const status = sessionStatus(w.sessions);
            const nextSession = w.sessions
              .filter((s) => new Date(s.datum) >= new Date())
              .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())[0];

            return (
              <Link key={w.id} href={`/leeslijst/${w.id}`} className="border border-ink/12 bg-white flex flex-col hover:shadow-md transition-shadow">
                {/* Boek cover */}
                <div className="bg-krant/40 p-5 pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center">
                      <span className="text-[9px] font-black text-paper">T</span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-label text-ink/40">
                      Tijdgeest
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-terracotta mb-1">{w.auteur}</p>
                  <p className="text-[15px] font-black leading-tight tracking-tight mb-1">{w.originele_titel}</p>
                  {w.subtitel && (
                    <p className="text-[11px] text-ink/50 leading-snug mb-3">{w.subtitel}</p>
                  )}
                  {/* Cover afbeelding */}
                  <div className="relative aspect-3/2 overflow-hidden mt-3">
                    {w.cover_image_url ? (
                      <Image src={w.cover_image_url} alt={w.originele_titel} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-terracotta" />
                    )}
                  </div>
                </div>

                {/* Card inhoud */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {status === "nu" && (
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] bg-terracotta text-paper px-2.5 py-1">
                        Nu lezend
                      </span>
                    )}
                    {status === "binnenkort" && (
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] border border-ink/20 text-ink/60 px-2.5 py-1">
                        Komt eraan
                      </span>
                    )}
                    {status === "archief" && (
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] border border-ink/15 text-ink/35 px-2.5 py-1">
                        Archief
                      </span>
                    )}
                    {w.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-[0.12em] border border-ink/20 text-ink/60 px-2.5 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[18px] font-black tracking-tight leading-tight mb-1">{w.originele_titel}</p>
                  <p className="text-[12px] text-ink/50 mb-1">{w.auteur}</p>
                  {w.jaar_eerste_publicatie && (
                    <p className="text-[11px] font-mono text-ink/35 mb-4">{w.jaar_eerste_publicatie}</p>
                  )}

                  {nextSession && (
                    <>
                      <div className="border-t border-ink/10 mt-auto pt-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink/40 mb-1">Avond</p>
                        <p className="text-[13px] text-ink/70">{formatDate(nextSession.datum)} · 20:00</p>
                        <span className="text-[12px] font-black text-ink underline mt-2 inline-block">
                          Doe mee →
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
