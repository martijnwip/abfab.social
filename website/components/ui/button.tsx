"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const button = cva(
  "inline-flex items-center justify-center gap-1.5 font-black uppercase tracking-[0.12em] text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        // Accent (terracotta)
        solid:        "bg-terracotta text-paper hover:bg-terracotta/90",
        soft:         "bg-terracotta/15 text-terracotta hover:bg-terracotta/25",
        outline:      "border border-terracotta text-terracotta hover:bg-terracotta/10",
        ghost:        "text-ink/60 hover:text-ink hover:bg-ink/6",
        // Gray (ink)
        "gray-solid":   "bg-ink text-paper hover:bg-ink/85",
        "gray-soft":    "bg-krant text-ink hover:bg-krant/70",
        "gray-outline": "border border-ink/25 text-ink hover:bg-ink/6",
        // Semantic
        seafoam:      "bg-seafoam text-ink hover:bg-seafoam/80",
        // Legacy aliases
        primary:      "bg-terracotta text-paper hover:bg-terracotta/90",
        secondary:    "border border-ink text-ink hover:bg-ink hover:text-paper",
        destructive:  "bg-ink text-paper hover:bg-ink/85",
      },
      size: {
        1:  "px-3 py-1 text-[10px] h-6",
        2:  "px-4 py-2 text-[11px] h-8",
        3:  "px-5 py-2.5 text-xs h-10",
        4:  "px-7 py-3.5 text-sm h-12",
        // Legacy aliases
        sm: "px-3 py-2 text-[10px]",
        md: "px-5 py-3.5",
        lg: "px-7 py-4 text-sm",
        icon: "w-8 h-8 p-0 text-sm",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

type Props = React.ComponentProps<"button"> &
  VariantProps<typeof button> & { asChild?: boolean };

export function Button({ variant, size, asChild, className = "", ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={button({ variant, size, className })} {...props} />;
}
