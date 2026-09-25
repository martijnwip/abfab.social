# Tijdgeest — functionaliteiten per module

Gescand op 2026-09-25. Elke module noemt:
- wat hij doet
- routes en bestanden
- tabellen en storage
- waar hij van afhangt

Onderaan staan de afhankelijkheden tussen modules en een lijst met dode code.

## Kern (basis, niet los te verwijderen)
| # | Module | Wat | Bestanden | Data |
|---|---|---|---|---|
| K1 | **Auth / login** | Inloggen met e-mail-OTP (magic code), uitloggen, auth-callback, sessie verversen in `proxy.ts` | `app/login/`, `app/auth/`, `proxy.ts`, `lib/supabase/*` | `auth.users` |
| K2 | **Layout & navigatie** | Topbalk, hoofdmenu (Leeslijst, Formats, On Request, Agenda, Over ons), foutpagina's en laadschermen | `app/layout.tsx`, `components/nav*.tsx`, `components/top-bar.tsx`, `app/error.tsx`, `app/loading.tsx` | – |
| K3 | **UI-componenten** | Radix-wrappers en brand tokens | `components/ui/*`, `app/globals.css` | – |

## Publieke / ledenmodules
| # | Module | Wat | Bestanden | Data | Afhankelijk van |
|---|---|---|---|---|---|
| M1 | **Homepage (marketing)** | Hero, quote, hardgecodeerd "boek van de maand" (Scurati/NRC), sectie "De formats" (In Eén Ruk, Boek & Film, On Request), footer. Let op: de knop "Registreer je" linkt naar `/leesclubs`, en die route bestaat niet. | `app/page.tsx`, `public/scurati.jpg`, `public/helena-lopes-*.jpg` | geen (statisch) | – |
| M2 | **Over ons** | Statische pagina over de club | `app/over/page.tsx` | – | – |
| M3 | **Leeslijst (overzicht)** | Raster met boeken, tag-filter, komende sessie per boek | `app/leeslijst/page.tsx`, `works-grid.tsx` | `works`, `tags`, `book_sessions` | M9 |
| M4 | **Boekdetailpagina** | Details van een boek, komende sessies, aanmeldteller | `app/leeslijst/[id]/page.tsx` | `works`, `book_sessions`, `session_signups` | M3 |
| M5 | **Aanmelden voor sessies** | Een goedgekeurd lid meldt zich aan of af voor een leesavond (max. aantal deelnemers). Wordt gebruikt op de boekdetailpagina en in de agenda. | `app/leeslijst/[id]/session-signup*.tsx`, `lib/hooks/use-session-signup.ts` | `session_signups` | K1, M13 |
| M6 | **Interesse registreren ("houd me op de hoogte")** | E-mail achterlaten bij een boek zonder sessie | `app/leeslijst/[id]/interest-form.tsx` | `work_interests` | M4 |
| M7 | **Gesprekskaart voor lezers** | Na aanmelding voor een sessie kan het lid de AI-gesprekskaart openklappen (met spoilerwaarschuwing) | `app/leeslijst/[id]/gesprekskaart-reveal.tsx` | `works.gesprekskaart` | M5, M15 |
| M8 | **Agenda** | Lijst met komende sessies, aanmelden, en een link naar het scenario die pas vanaf een bepaalde datum werkt | `app/agenda/page.tsx`, `agenda-list.tsx` | `book_sessions`, `session_signups` | M5, M13 |
| M9 | **Scenario voor lezers** | Het volledige sessiescenario, alleen voor goedgekeurde leden die zich hebben aangemeld | `app/agenda/[id]/scenario/`, `components/scenario-view.tsx` | `works.scenario` | M8, M16 |
| M10 | **On Request (nominaties)** | Pagina die het format uitlegt, plus een formulier waarmee een lid een boek voordraagt (titel, auteur, waarom, aantal medelezers, voorkeurslocatie) | `app/on-request/` | `nominations` | K1, beheer in A4 |
| M11 | **Voorstelpagina (crowdfund-achtig)** | Publieke pagina per boek met voortgangsbalk: "X van de drempel (standaard 6) lezers aan boord", e-mailaanmelding, bronnen en scenario-teaser. Een admin zet de pagina aan of uit met `voorstel_actief`. | `app/voorstel/[id]/`, `app/api/works/[id]/voorstel/route.ts` | `works.voorstel_actief`, `works.voorstel_drempel`, `work_interests`, `work_sources` | A2, M6-tabel |
| M12 | **Gedeeld scenario (publieke link)** | Een admin maakt een deellink. Iedereen met `/s/[token]` kan dan het scenario lezen. | `app/s/[token]/`, `app/api/works/[id]/share-scenario/route.ts`, `app/admin/works/[id]/scenario/share-button.tsx` | `scenario_share_tokens` | M16 |
| M13 | **Lidmaatschap-status** | Een nieuw lid krijgt eerst status `pending`. Een balk laat zien "je aanvraag wordt beoordeeld". Pas als het lid `approved` is, kan het zich aanmelden en scenario's zien. | `components/member-status-bar.tsx` | `members.status` | K1, A1 |

## Beheer (admin, `app/admin/**`)
| # | Module | Wat | Bestanden | Data |
|---|---|---|---|---|
| A0 | **Admin-layout & guard** | Toegangscontrole (alleen `role=admin` en `approved`), admin-menu | `app/admin/layout.tsx`, `components/admin-nav.tsx` | `members` |
| A1 | **Ledenbeheer** | Leden goedkeuren of afwijzen, met welkomstmail via Resend ("Je bent lid van Tijdgeest") | `app/admin/page.tsx`, `members-table.tsx`, `updateMemberStatus` in `app/admin/actions.ts` | `members` |
| A2 | **Boekenbeheer (works CRUD)** | Boek aanmaken, bewerken en verwijderen. Omvat cover uploaden, subtitel, beschrijving, pagina's, tags, en het voorstel aan/uit zetten. | `app/admin/works/` (`page`, `new/`, `actions.ts`, `[id]/edit/edit-work-form.tsx`, `work-sidebar.tsx`, `work-tab-nav.tsx`, `delete-button.tsx`) | `works`, storage `covers` |
| A3 | **Tagbeheer** | Tags aanmaken en verwijderen, en tags kiezen bij een boek | `app/admin/tags/`, `app/admin/works/tag-selector.tsx`, `tags.ts` | `tags`, `works.tags` |
| A4 | **Nominatiebeheer** | Nominaties bekijken, afwijzen (met mail) en verwijderen. Een nominatie goedkeuren doe je door er een boek van te maken, want `createWork` met `nominationId` stuurt de goedkeuringsmail. | `app/admin/nominations/`, `rejectNomination`, `deleteNomination` en `sendNominationStatusEmail` in `app/admin/actions.ts` | `nominations` |
| A5 | **Sessiebeheer** | Sessies plannen en bewerken (datum, tijd, eindtijd, locatie, notitie, max. deelnemers, groepscijfer), aanmeldingen bekijken en verwijderen, sessie verwijderen, gesprekskaart bekijken | `app/admin/sessies/` | `book_sessions`, `session_signups` |
| A6 | **E-mail (Resend)** | Mails bij status van nominaties en goedkeuring van leden, plus een previewroute | `app/admin/actions.ts`, `app/admin/email-preview/route.ts` | – |

## AI-contentmodules (Anthropic)
| # | Module | Wat | Bestanden | Data |
|---|---|---|---|---|
| M14 | **Bronnen per boek** | Admin voegt bronnen toe, zoals podcasttranscripties en recensies. Die dienen als input voor de AI. | `app/admin/works/[id]/edit/sources-section.tsx`, `source-actions.ts` | `work_sources` |
| M15 | **Gesprekskaart-generator** | AI maakt discussievragen op basis van de bronnen en slaat ook `session_prep` op | `app/api/session/prepare/route.ts`, knoppen in `work-sidebar.tsx` en `work-header-actions.tsx` | `works.gesprekskaart`, `book_sessions.session_prep` |
| M16 | **Scenario-generator** | AI maakt een volledig avondscenario (`ScenarioData`). Er is een adminweergave en een printknop. | `app/api/works/scenario/route.ts`, `app/admin/works/[id]/scenario/` (page, print-button), `components/scenario-view.tsx` | `works.scenario` |
| M17 | **Boektekst + boekvragen** | Admin uploadt de volledige boektekst. De AI maakt daaruit vragen in de sectie "Op basis van de boektekst" en voegt die toe aan de gesprekskaart. | `book-text-section.tsx`, `book-text-actions.ts`, `app/api/works/book-questions/route.ts` | `works.book_text_path`, storage `book-texts` |

## Interne tools
| # | Module | Wat | Bestanden |
|---|---|---|---|
| T1 | **Design-/stijlgids** | Een live stijlgids en een favicon-generatorpagina. Deze pagina's zijn publiek bereikbaar. | `app/design/` |
| T2 | **Analytics** | Vercel Analytics en Speed Insights | `app/layout.tsx` |
| T3 | **Brand assets** | Brand guide en logo's, buiten de app | `brand/` |

## Afhankelijkheden: wat breekt als je iets weghaalt
- **M16 Scenario** wordt gebruikt door M9, M11 (teaser) en M12. Haal je M16 weg, dan moeten die drie ook weg of worden aangepast. Het type `ScenarioData` wordt geïmporteerd uit de API-route.
- **M15 Gesprekskaart** wordt gebruikt door M7 en A5 (weergave), en is de input voor M16. M17 schrijft ook naar `works.gesprekskaart`.
- **M14 Bronnen** is de input voor M15 en M16, en wordt getoond op M11.
- **M5 Aanmelden** wordt gebruikt door M4, M8 en M7. Voor de toegang tot M9 is een aanmelding nodig.
- **M13 en A1** vormen samen de goedkeuringsflow voor leden. Zonder die flow valt de `approved`-check in M5, M9 en A0 weg of moet die anders.
- **M10 en A4** horen bij elkaar. A4 hangt via `createWork(…, nominationId)` aan A2 vast.
- **M6 en M11** delen de tabel `work_interests`.
- **Homepage (M1)** heeft vaste links naar `/on-request`, `/over` en `/#formats`. Het menu (K2) linkt naar M3, M8, M10 en M2. Pas die links aan als je modules verwijdert.

## Dode code en losse eindjes (kan waarschijnlijk zonder risico weg)
- Componenten die nergens worden geïmporteerd:
  - `app/admin/sessies/prepare-button.tsx`
  - `app/admin/works/gesprekskaart-button.tsx`
  - `app/admin/works/[id]/edit/scenario-button.tsx`
  - `app/admin/works/[id]/edit/book-questions-button.tsx`
- Tabel `user_book_ratings`: wordt nergens in de code gebruikt.
- `book_sessions.session_prep`: wordt wel geschreven, maar er is geen UI die het leest (alleen de scenario-generator gebruikt het).
- `nominations.voorstel_actief`: is verplaatst naar `works`, dus de oude kolom is waarschijnlijk overbodig.
- De homepage linkt naar `/leesclubs`, en die route bestaat niet. De knop "Meld je aan" linkt naar `#`.
- De map `data/` is leeg.
