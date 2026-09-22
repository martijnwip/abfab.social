export default function Loading() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-pulse">
        <div className="flex items-baseline justify-between pb-3 border-b border-ink/12 mb-8">
          <div className="h-2.5 w-20 bg-ink/10" />
          <div className="h-2.5 w-32 bg-ink/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-8 sm:gap-12 items-start">
          <div className="aspect-3/4 bg-ink/10" />

          <div className="pt-2">
            <div className="flex gap-2 mb-6">
              <div className="h-6 w-20 bg-ink/10" />
              <div className="h-6 w-16 bg-ink/10" />
            </div>
            <div className="h-16 w-full max-w-md bg-ink/10 mb-5" />
            <div className="h-4 w-2/3 bg-ink/10 mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t border-ink/12">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-r last:border-r-0 border-ink/12 py-4 pr-4">
                  <div className="h-2 w-12 bg-ink/10 mb-2" />
                  <div className="h-4 w-8 bg-ink/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
