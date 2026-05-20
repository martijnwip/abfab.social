"use client";

type Props = {
  tags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
};

export default function TagSelector({ tags, selected, onChange }: Props) {
  function toggle(tag: string) {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag]
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`text-[10px] font-black uppercase tracking-[0.12em] px-3 py-1.5 border transition-colors cursor-pointer ${
              active
                ? "bg-ink text-paper border-ink"
                : "border-ink/20 text-ink/50 hover:border-ink/50 hover:text-ink"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
