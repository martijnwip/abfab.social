"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function uploadBookText(
  workId: string,
  formData: FormData
): Promise<{ path?: string; fileName?: string; error?: string }> {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "Geen bestand geselecteerd." };

  const service = createServiceClient();

  // Ensure bucket exists (no-op if it already does)
  await service.storage.createBucket("book-texts", {
    public: false,
    fileSizeLimit: 20971520,
    allowedMimeTypes: ["text/plain"],
  });

  const path = `${workId}/${Date.now()}.txt`;

  const { error } = await service.storage.from("book-texts").upload(path, file, {
    contentType: "text/plain",
    upsert: true,
  });

  if (error) return { error: error.message };

  const supabase = await createClient();

  // Remove old file if there was one
  const { data: work } = await supabase
    .from("works")
    .select("book_text_path")
    .eq("id", workId)
    .single();

  if (work?.book_text_path && work.book_text_path !== path) {
    await service.storage.from("book-texts").remove([work.book_text_path]);
  }

  await supabase.from("works").update({ book_text_path: path }).eq("id", workId);
  revalidatePath(`/admin/works/${workId}/edit`);
  return { path, fileName: file.name };
}

export async function deleteBookText(workId: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: work } = await supabase
    .from("works")
    .select("book_text_path")
    .eq("id", workId)
    .single();

  if (work?.book_text_path) {
    const service = createServiceClient();
    await service.storage.from("book-texts").remove([work.book_text_path]);
  }

  await supabase.from("works").update({ book_text_path: null }).eq("id", workId);
  revalidatePath(`/admin/works/${workId}/edit`);
  return {};
}
