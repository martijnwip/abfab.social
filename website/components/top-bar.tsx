import Image from "next/image";

export default function TopBar() {
  return (
    <div className="bg-terracotta text-paper h-8 flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src="/avatar-ivoor.svg"
            alt="Tijdgeest avatar"
            width={20}
            height={20}
          />
          <span className="text-[10px] font-black uppercase tracking-label text-paper/90">
            Tijdgeest · De boeken van dit moment
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:block text-[10px] font-black uppercase tracking-label text-paper/90">
            Seizoen 01 · Voorjaar 2026
          </span>
        </div>
      </div>
    </div>
  );
}
