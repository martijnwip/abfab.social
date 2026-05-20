/**
 * Session Preparation Agent
 *
 * Required environment variables (.env.local + Vercel):
 *   ANTHROPIC_API_KEY      — Anthropic API key
 *   GUARDIAN_API_KEY       — The Guardian Open Platform
 *   GOOGLE_BOOKS_API_KEY   — Google Books API
 *   YOUTUBE_API_KEY        — YouTube Data API v3
 */

import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Tool definitions ───────────────────────────────────────────────────────

const tools: Anthropic.Tool[] = [
  {
    name: "open_library",
    description:
      "Fetch book metadata from Open Library: pages, description, cover image URL. Input: title and author.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Book title" },
        author: { type: "string", description: "Author name" },
      },
      required: ["title", "author"],
    },
  },
  {
    name: "google_books",
    description:
      "Fetch book description and genre from Google Books. Input: title and author.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string" },
        author: { type: "string" },
      },
      required: ["title", "author"],
    },
  },
  {
    name: "guardian_reviews",
    description:
      "Search The Guardian for reviews of this book or author. Returns article titles, URLs and summaries.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query (title + author)" },
      },
      required: ["query"],
    },
  },
  {
    name: "wikipedia",
    description:
      "Fetch the Wikipedia summary for the book or author. Try the book title first, fall back to the author.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Wikipedia page title to look up" },
      },
      required: ["query"],
    },
  },
  {
    name: "youtube_interviews",
    description:
      "Search YouTube for author interviews or book discussions. Returns video titles, URLs.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query (author + interview)" },
      },
      required: ["query"],
    },
  },
];

// ─── Tool implementations ────────────────────────────────────────────────────

async function runTool(name: string, input: Record<string, string>): Promise<string> {
  try {
    switch (name) {
      case "open_library": {
        const q = encodeURIComponent(`${input.title} ${input.author}`);
        const res = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=1&fields=key,title,author_name,number_of_pages_median,first_sentence,cover_i`);
        const json = await res.json();
        const doc = json.docs?.[0];
        if (!doc) return JSON.stringify({ error: "Not found" });
        return JSON.stringify({
          pages: doc.number_of_pages_median ?? null,
          first_sentence: doc.first_sentence?.value ?? null,
          cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
          ol_key: doc.key ?? null,
        });
      }

      case "google_books": {
        const q = encodeURIComponent(`intitle:${input.title}+inauthor:${input.author}`);
        const key = process.env.GOOGLE_BOOKS_API_KEY ?? "";
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&key=${key}`);
        const json = await res.json();
        const item = json.items?.[0]?.volumeInfo;
        if (!item) return JSON.stringify({ error: "Not found" });
        return JSON.stringify({
          description: item.description ?? null,
          categories: item.categories ?? [],
          page_count: item.pageCount ?? null,
          language: item.language ?? null,
        });
      }

      case "guardian_reviews": {
        const q = encodeURIComponent(input.query);
        const key = process.env.GUARDIAN_API_KEY ?? "";
        const res = await fetch(
          `https://content.guardianapis.com/search?q=${q}&section=books&show-fields=trailText&page-size=5&api-key=${key}`
        );
        const json = await res.json();
        const results = (json.response?.results ?? []).map((r: Record<string, unknown>) => ({
          title: r.webTitle,
          url: r.webUrl,
          summary: (r.fields as Record<string, unknown>)?.trailText ?? null,
        }));
        return JSON.stringify(results);
      }

      case "wikipedia": {
        const title = encodeURIComponent(input.query);
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
        if (!res.ok) return JSON.stringify({ error: "Not found" });
        const json = await res.json();
        return JSON.stringify({
          summary: json.extract ?? null,
          url: json.content_urls?.desktop?.page ?? null,
        });
      }

      case "youtube_interviews": {
        const q = encodeURIComponent(input.query);
        const key = process.env.YOUTUBE_API_KEY ?? "";
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=5&key=${key}`
        );
        const json = await res.json();
        const items = (json.items ?? []).map((i: Record<string, unknown>) => {
          const snippet = i.snippet as Record<string, unknown>;
          const id = i.id as Record<string, unknown>;
          return {
            titel: snippet?.title ?? "",
            url: `https://www.youtube.com/watch?v=${id?.videoId}`,
            platform: "YouTube",
          };
        });
        return JSON.stringify(items);
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err) {
    return JSON.stringify({ error: String(err) });
  }
}

// ─── Output schema (for Claude's reference) ─────────────────────────────────

const OUTPUT_SCHEMA = JSON.stringify({
  meta: { original_title: "", pages: null, genre: "", cover_url: "" },
  synopsis: "",
  receptie: { samenvatting: "", bronnen: [] },
  interviews: [{ titel: "", url: "", platform: "" }],
  gesprekskaart: [{ vraag: "", toelichting: "" }],
});

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json();
  const work_id: string | undefined = body.work_id;
  const session_id: string | undefined = body.session_id;

  if (!work_id && !session_id) {
    return NextResponse.json({ error: "work_id or session_id is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 1. Resolve work
  let resolvedWorkId: string;
  let originele_titel: string;
  let auteur: string;
  let jaar_eerste_publicatie: number | null;

  if (work_id) {
    const { data: work, error } = await supabase
      .from("works")
      .select("id, originele_titel, auteur, jaar_eerste_publicatie")
      .eq("id", work_id)
      .single();
    if (error || !work) return NextResponse.json({ error: "Work not found" }, { status: 404 });
    resolvedWorkId = work.id;
    originele_titel = work.originele_titel;
    auteur = work.auteur;
    jaar_eerste_publicatie = work.jaar_eerste_publicatie;
  } else {
    const { data: session, error: sessionErr } = await supabase
      .from("book_sessions")
      .select("id, work_id, works(originele_titel, auteur, jaar_eerste_publicatie)")
      .eq("id", session_id)
      .single();
    if (sessionErr || !session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const w = (session as unknown as { works: { originele_titel: string; auteur: string; jaar_eerste_publicatie: number | null } }).works;
    resolvedWorkId = (session as { work_id: string }).work_id;
    originele_titel = w.originele_titel;
    auteur = w.auteur;
    jaar_eerste_publicatie = w.jaar_eerste_publicatie;
  }

  // 2. Run agent loop
  const systemPrompt =
    "Je bent een onderzoeksassistent voor Tijdgeest, een Nederlandse boekenclub. " +
    "Voor elk boek verzamel je feitelijke informatie uit de tools die je tot je beschikking hebt. " +
    "Gebruik alleen bronnen die je daadwerkelijk hebt opgehaald — verzin niets. " +
    "Genereer de output als JSON conform het meegestuurde schema. " +
    "De synopsis is maximaal 150 woorden in het Nederlands. " +
    "De gesprekskaart bevat 5 tot 7 vragen die geschikt zijn voor een groepsgesprek over het boek, " +
    "met voor elke vraag een korte toelichting.";

  const userMessage =
    `Bereid de sessie voor voor het boek "${originele_titel}" van ${auteur}` +
    (jaar_eerste_publicatie ? ` (${jaar_eerste_publicatie})` : "") +
    `.\n\nGebruik de beschikbare tools om informatie te verzamelen en retourneer daarna exact dit JSON-schema (gevuld met de gevonden data):\n\n${OUTPUT_SCHEMA}`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  let finalText: string | null = null;

  while (true) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    });

    // Add assistant response to history
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      // Extract text from final response
      const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
      finalText = textBlock?.text ?? null;
      break;
    }

    if (response.stop_reason === "tool_use") {
      // Execute all tool calls in this turn
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        const result = await runTool(block.name, block.input as Record<string, string>);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }

      messages.push({ role: "user", content: toolResults });
      continue;
    }

    // Unexpected stop reason
    break;
  }

  // 3. Parse JSON from Claude's response
  let prepData: Record<string, unknown> | null = null;
  if (finalText) {
    // Strip markdown fences first
    let cleaned = finalText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();

    // Extract the outermost JSON object in case Claude added surrounding text
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.slice(start, end + 1);
    }

    try {
      prepData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Claude response was not valid JSON", raw: finalText },
        { status: 500 }
      );
    }
  }

  // 4a. Gesprekskaart → works (gedeeld door alle sessies van dit werk)
  // 4a. Gesprekskaart → works
  const gesprekskaart = prepData?.gesprekskaart ?? null;
  await supabase
    .from("works")
    .update({ gesprekskaart })
    .eq("id", resolvedWorkId);

  // 4b. Overige prep → book_sessions (alleen als aangeroepen via session_id)
  if (session_id) {
    const { gesprekskaart: _omit, ...sessionPrep } = prepData ?? {};
    await supabase
      .from("book_sessions")
      .update({ session_prep: Object.keys(sessionPrep).length ? sessionPrep : null })
      .eq("id", session_id);
  }

  return NextResponse.json(prepData, { status: 200 });
}
