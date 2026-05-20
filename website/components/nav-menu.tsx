"use client";

import { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Leeslijst",  href: "/leeslijst" },
  { label: "Formats",    href: "/#formats" },
  { label: "On Request", href: "/on-request" },
  { label: "Agenda",     href: "/agenda" },
  { label: "Over ons",   href: "/over" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <NavigationMenu.Root className="hidden md:block">
        <NavigationMenu.List className="flex gap-8">
          {navLinks.map((link) => (
            <NavigationMenu.Item key={link.href}>
              <NavigationMenu.Link asChild>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href ? "text-ink" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* Hamburger — alleen mobiel */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden flex items-center justify-center w-9 h-9 text-ink cursor-pointer"
        aria-label={open ? "Menu sluiten" : "Menu openen"}
      >
        {open ? <Cross2Icon width={18} height={18} /> : <HamburgerMenuIcon width={18} height={18} />}
      </button>

      {/* Mobiel dropdown */}
      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-paper border-b border-ink/10 z-50 shadow-[0_4px_16px_rgba(26,26,26,0.08)]">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-[15px] font-medium border-b border-ink/6 last:border-0 transition-colors ${
                  pathname === link.href ? "text-ink font-black" : "text-ink/60 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
