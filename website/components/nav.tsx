"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

const navLinks = [
  { label: "Boeken", href: "/boeken" },
  { label: "Leesclubs", href: "/leesclubs" },
  { label: "Edities", href: "/edities" },
  { label: "Agenda", href: "/agenda" },
];

export default function Nav() {
  return (
    <header className="border-b border-ink/10 bg-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight">
          Tijdgeest
          <span className="italic font-medium text-terracotta">.</span>
        </Link>

        <NavigationMenu.Root className="hidden md:block">
          <NavigationMenu.List className="flex gap-8">
            {navLinks.map((link) => (
              <NavigationMenu.Item key={link.href}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink/60 hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <Link
          href="/lid-worden"
          className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-ink/85 transition-colors"
        >
          Begin lid
        </Link>
      </div>
    </header>
  );
}
