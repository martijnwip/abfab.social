export default function Loading() {
  return (
    <>
      <div className="border-b border-ink/10 bg-paper sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-ink/20">Tijdgeest</span>
          <div className="h-7 w-7 rounded-full bg-ink/10 animate-pulse" />
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10 animate-pulse">
        <div className="h-2.5 w-24 bg-ink/10 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end mb-12">
          <div>
            <div className="h-16 w-56 bg-ink/10 mb-2" />
            <div className="h-16 w-72 bg-ink/10" />
          </div>
          <div className="h-3 w-full max-w-sm bg-ink/10" />
        </div>

        <div className="border-t border-ink/15 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-10 w-10 bg-ink/10 mb-2" />
              <div className="h-2.5 w-20 bg-ink/10" />
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-ink/15" />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-ink/12 p-6 flex gap-6">
            <div className="w-24 h-24 bg-ink/10 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-3 w-1/4 bg-ink/10 mb-3" />
              <div className="h-5 w-1/2 bg-ink/10 mb-2" />
              <div className="h-3 w-1/3 bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
