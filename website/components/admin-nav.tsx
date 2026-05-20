"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Leden",    href: "/admin" },
  { label: "Works",    href: "/admin/works" },
  { label: "Tags",     href: "/admin/tags" },
  { label: "Sessies",  href: "/admin/sessies" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <nav className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-[11px] font-black uppercase tracking-label text-paper/40">
            Admin
          </span>
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "text-paper"
                      : "text-paper/40 hover:text-paper/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <span className="hidden sm:block text-[11px] text-paper/40 font-mono truncate max-w-48">
          {email}
        </span>
      </div>
    </nav>
  );
}
