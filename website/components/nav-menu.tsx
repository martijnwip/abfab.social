"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

const navLinks = [
  { label: "Boeken", href: "/boeken" },
  { label: "Leesclubs", href: "/leesclubs" },
  { label: "Edities", href: "/edities" },
  { label: "Agenda", href: "/agenda" },
];

export default function NavMenu() {
  return (
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
  );
}
