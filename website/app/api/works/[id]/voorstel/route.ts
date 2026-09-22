import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: work } = await supabase
    .from("works")
    .select("voorstel_actief")
    .eq("id", id)
    .single();

  if (!work) return NextResponse.json({ error: "Work niet gevonden" }, { status: 404 });

  const nieuweWaarde = !(work as unknown as { voorstel_actief: boolean }).voorstel_actief;

  const { error: updateError } = await supabase
    .from("works")
    .update({ voorstel_actief: nieuweWaarde })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ actief: nieuweWaarde });
}
