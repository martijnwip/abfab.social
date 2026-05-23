import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_CHARS = 300_000;
const SECTION_NAME = "Op basis van de boektekst";

export async function POST(request: Request) {
  const body = await request.json();
  const work_id: string | undefined = body.work_id;
  if (!work_id) return NextResponse.json({ error: "work_id required" }, { status: 400 });

  const supabase = createServiceClient();

  const { data: work, error: workErr } = await supabase
    .from("works")
    .select("id, originele_titel, auteur, jaar_eerste_publicatie, book_text_path, gesprekskaart")
    .eq("id", work_id)
    .single();

  if (workErr || !work) return NextResponse.json({ error: "Work not found" }, { status: 404 });
  if (!work.book_text_path) return NextResponse.json({ error: "Geen boektekst geüpload" }, { status: 400 });

  // Download book text from Supabase Storage
  const { data: fileData, error: fileErr } = await supabase.storage
    .from("book-texts")
    .download(work.book_text_path);

  if (fileErr || !fileData) {
    console.error("[book-questions] Storage download error:", fileErr);
    return NextResponse.json({ error: "Boektekst kon niet worden geladen" }, { status: 500 });
  }

  const fullText = await fileData.text();
  const bookText = fullText.slice(0, MAX_CHARS);
  const truncated = fullText.length > MAX_CHARS;

  const systemPrompt =
    "Je bent een gespreksleider voor Tijdgeest, een Nederlandse literaire boekenclub. " +
    "Je krijgt de volledige (of gedeeltelijke) tekst van een literair werk. " +
    "Genereer 5 à 7 diepgaande vragen die uitnodigen tot een rijk gesprek. " +
    "Focus op: thema's en motieven, karakterontwikkeling, stijl en toon, morele of maatschappelijke kwesties, persoonlijke reflectie. " +
    "Gebruik concrete scènes of passages uit de tekst als aanknopingspunt in de toelichting. " +
    `Elke vraag krijgt sectie "${SECTION_NAME}". ` +
    "BELANGRIJK: Retourneer uitsluitend een geldig JSON-array, geen andere tekst. " +
    `Formaat: [{"sectie": "${SECTION_NAME}", "vraag": "...", "toelichting": "..."}]`;

  const userMessage =
    `Boek: "${work.originele_titel}" van ${work.auteur}` +
    (work.jaar_eerste_publicatie ? ` (${work.jaar_eerste_publicatie})` : "") +
    (truncated
      ? `\n\n[Tekst ingekort tot de eerste ${MAX_CHARS.toLocaleString("nl-NL")} tekens]\n\n`
      : "\n\n") +
    bookText;

  let finalText: string | null = null;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    finalText = textBlock?.text ?? null;
  } catch (err) {
    console.error("[book-questions] Anthropic error:", err);
    return NextResponse.json({ error: "Fout bij Claude API" }, { status: 500 });
  }

  if (!finalText) return NextResponse.json({ error: "Geen respons van Claude" }, { status: 500 });

  let newQuestions: { sectie: string; vraag: string; toelichting: string }[];
  try {
    let cleaned = finalText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
    newQuestions = JSON.parse(cleaned);
  } catch {
    console.error("[book-questions] JSON parse failed. Raw:", finalText);
    return NextResponse.json({ error: "Claude response was not valid JSON", raw: finalText }, { status: 500 });
  }

  // Merge: replace existing book-text section, keep the rest
  const existing = (work.gesprekskaart ?? []) as { sectie?: string; vraag: string; toelichting: string }[];
  const withoutBookSection = existing.filter((q) => q.sectie !== SECTION_NAME);
  const merged = [...withoutBookSection, ...newQuestions];

  await supabase.from("works").update({ gesprekskaart: merged }).eq("id", work_id);

  return NextResponse.json({ questions: newQuestions, total: merged.length }, { status: 200 });
}
