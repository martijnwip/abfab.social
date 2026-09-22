export default function Loading() {
  return (
    <>
      <div className="border-b border-ink/10 bg-paper sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-ink/20">Tijdgeest</span>
          <div className="h-7 w-7 rounded-full bg-ink/10 animate-pulse" />
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-16 animate-pulse">
        <div className="h-2.5 w-32 bg-ink/10 mb-8" />
        <div className="h-16 w-full max-w-xl bg-ink/10 mb-2" />
        <div className="h-16 w-2/3 max-w-xl bg-ink/10 mb-8" />
        <div className="h-3 w-full max-w-lg bg-ink/10 mb-2" />
        <div className="h-3 w-2/3 max-w-lg bg-ink/10 mb-14" />
        <div className="border border-ink/15 h-28 max-w-2xl" />
      </section>
    </>
  );
}
