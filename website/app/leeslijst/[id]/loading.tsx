export default function Loading() {
  return (
    <>
      <div className="border-b border-ink/10 bg-paper sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-ink/20">Tijdgeest</span>
          <div className="h-7 w-7 rounded-full bg-ink/10 animate-pulse" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20 animate-pulse">
        <div className="h-2.5 w-56 bg-ink/10 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-16 items-start">
          <div>
            <div className="aspect-3/2 bg-ink/10" />
            <div className="h-2.5 w-32 bg-ink/10 mt-3 mx-auto" />
          </div>

          <div className="pt-0 md:pt-2">
            <div className="flex gap-2 mb-6">
              <div className="h-6 w-20 bg-ink/10" />
              <div className="h-6 w-24 bg-ink/10" />
            </div>
            <div className="h-16 w-full max-w-md bg-ink/10 mb-3" />
            <div className="h-6 w-40 bg-ink/10 mb-8" />
            <div className="h-3 w-full max-w-lg bg-ink/10 mb-2" />
            <div className="h-3 w-2/3 max-w-lg bg-ink/10 mb-10" />
            <div className="border-t border-ink/12 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-2 w-16 bg-ink/10 mb-2" />
                  <div className="h-4 w-12 bg-ink/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
