export default function Loading() {
  return (
    <>
      <div className="border-b border-ink/10 bg-paper sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-ink/20">Tijdgeest</span>
          <div className="h-7 w-7 rounded-full bg-ink/10 animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-2.5 w-40 bg-ink/10 mb-8" />
        <div className="h-14 w-2/3 bg-ink/10 mb-3" />
        <div className="h-14 w-1/2 bg-ink/10 mb-10" />
        <div className="h-3 w-full max-w-md bg-ink/10 mb-2" />
        <div className="h-3 w-2/3 max-w-md bg-ink/10" />
      </div>
    </>
  );
}
