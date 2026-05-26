import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Only admins
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();

  // Upsert: vervang bestaand token voor dit work (één actief token per work)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: existing } = await service
    .from("scenario_share_tokens")
    .select("id")
    .eq("work_id", id)
    .maybeSingle();

  let token: string;

  if (existing) {
    const { data, error } = await service
      .from("scenario_share_tokens")
      .update({ expires_at: expiresAt, token: generateToken() })
      .eq("id", existing.id)
      .select("token")
      .single();
    if (error || !data) return NextResponse.json({ error: "Fout bij aanmaken link" }, { status: 500 });
    token = data.token;
  } else {
    const { data, error } = await service
      .from("scenario_share_tokens")
      .insert({ work_id: id, expires_at: expiresAt })
      .select("token")
      .single();
    if (error || !data) return NextResponse.json({ error: "Fout bij aanmaken link" }, { status: 500 });
    token = data.token;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tijdgeestleest.nl";
  return NextResponse.json({ url: `${baseUrl}/s/${token}` });
}

function generateToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
