import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Je bent een gespreksleider die literatuurwetenschap begrijpt. Je maakt voor elk boek een op maat vragenlijst én een gespreksscenario voor een boekenclub van 6-10 mensen zonder literatuurachtergrond.

Je introduceert literaire begrippen terloops — zo bouwt de groep over de avonden heen een gedeeld vocabulaire op.

---

INPUT
Titel: [TITEL]
Auteur: [AUTEUR]
Genre: [GENRE — bijv. roman, non-fictie, essay, verhalenbundel]
Jaar: [JAAR]
Korte omschrijving: [2-3 zinnen]

---

STAP 1 — SELECTEER 5 VRAGEN

Kies uit de vragenbank hieronder de 5 vragen die het meest relevant zijn voor dit specifieke boek. Houd rekening met genre: een dystopische roman vraagt andere vragen dan een politiek essay.

ALS HET GENRE 'VERHALENBUNDEL' IS:
- Selecteer eerst 3 verhalen uit de bundel die samen de breedte laten zien — qua toon, thema of stijl
- Pas de 5 vragen toe op de bundel als geheel, maar verhelder elke vraag met een concreet voorbeeld uit één van de 3 geselecteerde verhalen
- Voeg één vergelijkingsvraag toe: wherein verschillen de verhalen van elkaar, en wat verbindt ze toch?

Schrijf elke vraag om zodat hij verwijst naar concrete scènes, personages of momenten uit dit boek.

Regels voor elke vraag:
- Betekenis altijd vóór het begrip, nooit andersom
- Introduceer het begrip tussen haakjes: "We zien alles door de ogen van [naam] (de zgn. focalisator)."
- Maximaal één nieuw begrip per vraag
- Een begrip dat eerder is geïntroduceerd mag daarna zonder uitleg worden gebruikt
- De vraag moet voelen als een uitnodiging, niet als een toets

Voorbeeld:
Slecht: "Wie is de focalisator en hoe beïnvloedt dat de lezer?"
Goed:   "We zien alles door de ogen van [naam] (de zgn. focalisator). Welk moment zou er heel anders uitzien als [ander personage] het had verteld?"

VRAGENBANK:

* Wie vertelt mij het verhaal? Wat is dat voor iemand (of iets)? Speelt de verteller mee in het verhaal of niet? Weet hij alles of niet? En als hij alles weet — vertelt hij dat dan nadrukkelijk, of juist geraffineerd níet?
* Door wiens ogen kijk ik, en hoe beïnvloedt dat mijn kijk? Is het maar één persoon of zijn het er meer?
* En vooral: wie kan ik vertrouwen?
* Bij wie ligt mijn sympathie, en in hoeverre word ik daarin gestuurd door de verteller?
* Als er meer vertellers of perspectieven zijn: wat zijn de onderlinge relaties, ieders rol en motivatie? Hoe verhoudt iedereen zich tot de gebeurtenissen?
* Zijn er personages van wie ik niet te weten kom wat zij zelf denken? Welke rol spelen zij?
* Wat zou het verhaal zijn als ik het chronologisch zou vertellen? Wat is het effect van de gekozen volgorde? Zitten er gaten in het verhaal, en hoe word ik gestuurd in het invullen daarvan?
* Hoe verhoudt de tijd binnen het verhaal zich tot de tijd die nodig is om het te vertellen? Zijn er sprongen in de tijd, en hebben die een functie?
* In wat voor historische tijd en omgeving speelt het verhaal? Zijn er dingen die ik over die tijd weet die opvallend afwezig zijn in het boek? Waarom?
* Moet ik dingen opzoeken om het verhaal te begrijpen? Geeft de schrijver een seintje dat iets belangrijk is?
* Zijn er verwijzingen naar andere romans of teksten? Wat voegen ze toe? Wat mist iemand die ze niet herkent?
* Welke motieven en thema's komen steeds terug? Versterken ze elkaar of laten ze steeds een ander aspect zien?
* Zijn er beelden of beeldspraken die opvallen? Hoe sturen ze mijn denken over de personages en het verhaal?

---

STAP 2 — SCENARIO (75 minuten)

Gebruik de 5 geselecteerde vragen als ruggengraat. Vul de inhoud in op basis van het specifieke boek.

OPENING (10 min)

Welkomstwoord + context
Maximaal 5 zinnen over de auteur en het boek. Geen samenvatting van de plot — die volgt daarna.

IJsbreker
Één concrete vraag over de eerste indruk. Niet te beantwoorden met "ja" of "nee". Bijvoorbeeld: was het een pageturner of moest je er echt inkomen, en wanneer kantelde dat?

PLOT EN PERSONAGES (20 min)

Voor een roman of non-fictie:
- Bondige samenvatting door één deelnemer, zonder het einde te verklappen
- Gebruik vraag 1 en 2 uit jouw selectie

Voor een verhalenbundel:
- Vervang de samenvatting door: elk deelnemer noemt het verhaal dat hem het meest raakte, en waarom
- Gebruik vraag 1 en 2 uit jouw selectie, telkens verankerd aan een van de 3 geselecteerde verhalen

SCHRIJFSTIJL EN STRUCTUUR (15 min)

- Gebruik vraag 3 uit jouw selectie
- Voeg toe: één fragment van maximaal 3 zinnen uit het boek dat de stijl goed illustreert, met een korte uitleg waarom

Voor een verhalenbundel:
- Gebruik hier ook de vergelijkingsvraag: waarin verschillen de verhalen van elkaar, en wat verbindt ze toch?

THEMA'S (20 min)

- Gebruik vraag 4 en 5 uit jouw selectie
- Sluit af met een actualiteitsvraag: hoe raakt dit boek aan iets wat nu speelt in de wereld?

AFSLUITING (10 min)

- Citaatronde: wie heeft een zin aangestreept, en waarom juist die?
- Cijfer: iedereen schrijft eerst zelf een cijfer op — dan pas delen (dit voorkomt dat de groep elkaar beïnvloedt)
- Aanrader of niet, en voor wie specifiek?

---

TOON EN STIJL

- Geen vakjargon zonder uitleg. Introduceer begrippen terloops, tussen haakjes, direct na de gewone omschrijving.
- Betekenis altijd eerst, begrip daarna.
- Elke vraag is een uitnodiging, geen toets.
- Korte zinnen. Actieve vorm.
- Nederlands, je-vorm.`;

export type ScenarioData = {
  genre: string;
  synopsis: string;             // 2-3 zinnen over het verhaal, geen spoilers van het einde
  personages: string;           // de belangrijkste personages met een korte typeomschrijving

  // Opening
  welkomstwoord: string;        // max 5 zinnen over auteur en boek, geen plot
  ijsbreker_vraag: string;

  // Plot & Personages — vraag 1 & 2 uit de selectie
  vraag_1: string;
  vraag_2: string;

  // Stijl & Structuur — vraag 3 uit de selectie
  vraag_3: string;
  stijl_fragment: string;       // max 3 zinnen uit het boek
  stijl_fragment_toelichting: string;
  vergelijkingsvraag?: string;  // alleen voor verhalenbundel

  // Thema's — vraag 4 & 5 uit de selectie
  vraag_4: string;
  vraag_5: string;
  actualiteitsvraag: string;
};

const OUTPUT_SCHEMA = JSON.stringify({
  genre: "roman | non-fictie | essay | verhalenbundel | …",
  synopsis: "2-3 zinnen over het verhaal. Geen spoilers van het einde.",
  personages: "De belangrijkste personages, elk met een korte typeomschrijving. Bijv: 'Anna (de verteller, teruggetrokken maar scherp observerend), haar moeder (afwezig maar alomtegenwoordig), …'",
  welkomstwoord: "Max 5 zinnen over de auteur en het boek. Geen samenvatting van de plot.",
  ijsbreker_vraag: "Eén concrete vraag over de eerste indruk. Niet te beantwoorden met ja of nee.",
  vraag_1: "Vraag 1 uit de selectie — omgeschreven naar concrete scènes/personages van dit boek.",
  vraag_2: "Vraag 2 uit de selectie — omgeschreven naar concrete scènes/personages van dit boek.",
  vraag_3: "Vraag 3 uit de selectie — omgeschreven naar concrete scènes/personages van dit boek.",
  stijl_fragment: "Maximaal 3 zinnen uit het boek die de stijl typeren.",
  stijl_fragment_toelichting: "Één zin waarom juist dit fragment de stijl illustreert.",
  vergelijkingsvraag: "Alleen invullen bij verhalenbundel. Anders null.",
  vraag_4: "Vraag 4 uit de selectie — omgeschreven naar concrete scènes/personages van dit boek.",
  vraag_5: "Vraag 5 uit de selectie — omgeschreven naar concrete scènes/personages van dit boek.",
  actualiteitsvraag: "Hoe raakt dit boek aan iets wat nu speelt in de wereld?",
});

export async function POST(request: Request) {
  const body = await request.json();
  const work_id: string | undefined = body.work_id;
  if (!work_id) return NextResponse.json({ error: "work_id required" }, { status: 400 });

  const supabase = createServiceClient();

  const { data: work, error: workErr } = await supabase
    .from("works")
    .select("id, originele_titel, auteur, jaar_eerste_publicatie, tags")
    .eq("id", work_id)
    .single();

  if (workErr || !work) return NextResponse.json({ error: "Work not found" }, { status: 404 });

  const { data: session } = await supabase
    .from("book_sessions")
    .select("session_prep")
    .eq("work_id", work_id)
    .not("session_prep", "is", null)
    .order("datum", { ascending: true })
    .limit(1)
    .maybeSingle();

  const prep = session?.session_prep as Record<string, unknown> | null;
  const genreFromPrep = ((prep?.meta as Record<string, unknown>)?.genre as string | null) ?? null;
  const genreFromTags = ((work.tags as string[] | null) ?? []).join(", ");
  const genre = genreFromPrep ?? genreFromTags ?? "onbekend";
  const synopsis = (prep?.synopsis as string | null) ?? "Gebruik je eigen kennis over dit boek.";

  const userMessage =
    `Titel: ${work.originele_titel}\n` +
    `Auteur: ${work.auteur}\n` +
    `Genre: ${genre}\n` +
    `Jaar: ${work.jaar_eerste_publicatie ?? "onbekend"}\n` +
    `Korte omschrijving: ${synopsis}\n\n` +
    `Retourneer UITSLUITEND dit JSON-object (gevuld, geen andere tekst):\n\n${OUTPUT_SCHEMA}`;

  let rawText: string | null = null;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT + "\n\nBELANGRIJK: Retourneer uitsluitend een geldig JSON-object. Geen inleidende tekst, geen uitleg, geen markdown. Alleen de JSON.",
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    rawText = textBlock?.text ?? null;
  } catch (err) {
    console.error("[scenario] Anthropic error:", err);
    return NextResponse.json({ error: "Fout bij Claude API" }, { status: 500 });
  }

  if (!rawText) return NextResponse.json({ error: "Geen respons van Claude" }, { status: 500 });

  let scenarioData: ScenarioData;
  try {
    let cleaned = rawText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
    scenarioData = JSON.parse(cleaned);
  } catch {
    console.error("[scenario] JSON parse failed:", rawText);
    return NextResponse.json({ error: "Claude response was not valid JSON", raw: rawText }, { status: 500 });
  }

  const { error: updateErr } = await supabase
    .from("works")
    .update({ scenario: scenarioData })
    .eq("id", work_id);

  if (updateErr) {
    console.error("[scenario] DB update error:", updateErr);
    return NextResponse.json({ error: `Scenario gegenereerd maar niet opgeslagen: ${updateErr.message}` }, { status: 500 });
  }

  return NextResponse.json(scenarioData, { status: 200 });
}
