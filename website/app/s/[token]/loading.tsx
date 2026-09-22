export default function Loading() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-krant/40 border-b border-ink/10 px-4 sm:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-black">▲</span>
          <span className="text-[9px] font-black uppercase tracking-label text-ink/40">
            Tijdgeest · Gespreksscenario
          </span>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-3 w-32 bg-ink/10 mb-6" />
        <div className="h-12 w-2/3 bg-ink/10 mb-10" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-10">
            <div className="h-2.5 w-28 bg-ink/10 mb-3" />
            <div className="h-3 w-full bg-ink/10 mb-2" />
            <div className="h-3 w-4/5 bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
