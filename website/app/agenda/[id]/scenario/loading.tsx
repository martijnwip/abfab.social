export default function Loading() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="border-b border-ink/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-ink/20">← Terug naar agenda</span>
        <span className="text-[9px] font-black uppercase tracking-label text-ink/20">Gespreksgids</span>
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
