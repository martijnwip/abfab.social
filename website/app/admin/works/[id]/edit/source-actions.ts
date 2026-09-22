"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type SourceInput = {
  type: string;
  titel: string | null;
  beschrijving: string | null;
  inhoud: string;
  bron: string | null;
};

type WorkSource = SourceInput & { id: string };

export async function addWorkSource(workId: string, source: SourceInput): Promise<WorkSource> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_sources")
    .insert({ work_id: workId, ...source })
    .select("id, type, titel, beschrijving, inhoud, bron")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/works/${workId}/edit`);
  return data as WorkSource;
}

export async function deleteWorkSource(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("work_sources").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
