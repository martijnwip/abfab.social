"use client";

export default function WorkTabNav({
  sourcesCount,
  gesprekskaartCount,
  sessiesCount,
}: {
  sourcesCount: number;
  gesprekskaartCount: number;
  sessiesCount: number;
}) {
  const tabs = [
    { label: "Metadata",      href: "#metadata" },
    { label: "Bronnen",       href: "#bronnen",       count: sourcesCount },
    { label: "Gesprekskaart", href: "#gesprekskaart", count: gesprekskaartCount || undefined },
    { label: "Scenario",      href: "#scenario" },
    { label: "Sessies",       href: "#sessies",        count: sessiesCount || undefined },
  ];

  return (
    <nav className="sticky top-0 z-10 bg-paper border-b border-ink/10 flex -mx-1 mb-0">
      {tabs.map(({ label, href, count }) => (
        <a
          key={href}
          href={href}
          className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-ink/45 hover:text-ink transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          {label}
          {count !== undefined && (
            <span className="text-[9px] font-mono font-normal text-ink/30">{count}</span>
          )}
        </a>
      ))}
    </nav>
  );
}
