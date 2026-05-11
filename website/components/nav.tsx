import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import NavMenu from "./nav-menu";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-ink/10 bg-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight">
          Tijdgeest
          <span className="italic font-medium text-terracotta">.</span>
        </Link>

        <NavMenu />

        {user ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-terracotta text-paper flex items-center justify-center text-[11px] font-black uppercase shrink-0">
              {user.email?.[0]}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-ink/60 font-medium max-w-40 truncate">
                {user.email}
              </span>
              <form action={signOut}>
                <button type="submit" className="text-[11px] text-terracotta font-black uppercase tracking-[0.1em] hover:underline text-left">
                  Uitloggen
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-ink text-paper text-xs font-black uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-ink/85 transition-colors"
          >
            Sign up / in
          </Link>
        )}
      </div>
    </header>
  );
}
