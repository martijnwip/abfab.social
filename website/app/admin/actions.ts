"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type MemberStatus = "approved" | "rejected" | "pending";

export async function updateMemberStatus(memberId: string, status: MemberStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("members")
    .update({ status })
    .eq("id", memberId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}
