"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type WorkPayload = {
  originele_titel: string;
  subtitel?: string | null;
  auteur: string;
  jaar_eerste_publicatie?: number | null;
  taal_origineel?: string | null;
  cover_image_url?: string | null;
  open_library_work_id?: string | null;
};

export async function updateWork(id: string, payload: WorkPayload) {
  const supabase = await createClient();

  const { error } = await supabase.from("works").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  redirect("/admin/works");
}

export async function deleteWork(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("works").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/works");
}

export async function createWork(payload: WorkPayload) {
  const supabase = await createClient();

  const { error } = await supabase.from("works").insert(payload);
  if (error) throw new Error(error.message);

  redirect("/admin/works");
}

export async function uploadCover(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Geen bestand geselecteerd.");

  const service = createServiceClient();
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await service.storage.from("covers").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = service.storage.from("covers").getPublicUrl(path);
  return data.publicUrl;
}
