import WorkForm from "./work-form";

export default function NewWorkPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/40 mb-4">
        Admin · Works
      </p>
      <h1 className="text-[36px] font-black tracking-tight leading-tight mb-10">
        Work toevoegen
      </h1>
      <WorkForm />
    </main>
  );
}
