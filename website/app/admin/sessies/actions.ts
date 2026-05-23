"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteSession(id: string, redirectAfter = false): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Remove signups first to satisfy FK
  await supabase.from("session_signups").delete().eq("session_id", id);

  const { error } = await supabase.from("book_sessions").delete().eq("id", id);
  if (error) return { error: error.message };

  if (redirectAfter) {
    redirect("/admin/sessies");
  }

  revalidatePath("/admin/sessies");
  return {};
}
