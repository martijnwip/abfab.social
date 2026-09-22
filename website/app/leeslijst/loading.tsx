export default function Loading() {
  return (
    <>
      <div className="border-b border-ink/10 bg-paper sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-ink/20">Tijdgeest</span>
          <div className="h-7 w-7 rounded-full bg-ink/10 animate-pulse" />
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 pt-12 pb-12 animate-pulse">
        <div className="h-2.5 w-24 bg-ink/10 mb-6" />
        <div className="h-14 w-3/4 bg-ink/10 mb-1" />
        <div className="h-14 w-1/2 bg-ink/10 mb-8" />
        <div className="h-3 w-full max-w-xl bg-ink/10 mb-2" />
        <div className="h-3 w-2/3 max-w-xl bg-ink/10" />
      </section>

      <div className="border-t border-ink/15" />

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-3/2 bg-ink/10 mb-4" />
            <div className="h-3 w-1/3 bg-ink/10 mb-2" />
            <div className="h-4 w-2/3 bg-ink/10" />
          </div>
        ))}
      </div>
    </>
  );
}
