"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const button = cva(
  "inline-flex items-center justify-center font-black uppercase tracking-[0.12em] text-xs transition-colors disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:     "bg-terracotta text-paper hover:bg-terracotta/90",
        secondary:   "border border-ink text-ink hover:bg-ink hover:text-paper",
        ghost:       "text-ink hover:bg-ink/8",
        destructive: "bg-ink text-paper hover:bg-ink/85",
        seafoam:     "bg-seafoam text-ink hover:bg-seafoam/80",
      },
      size: {
        sm: "px-3 py-2 text-[10px]",
        md: "px-5 py-3.5",
        lg: "px-7 py-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
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
