import * as SeparatorPrimitive from "@radix-ui/react-separator";

export function Separator({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      className={orientation === "horizontal" ? "border-t border-ink/10 w-full" : "border-l border-ink/10 h-full"}
    />
  );
}
