# Adversarial first-read review 5 — Reader Setting Transfer

**Verdict: PASS.** No blocking, major, or minor findings remain.

Reviewed 2026-08-29 against the deployed site at
<https://reader-setting-transfer.sociobot.in> and clean clone
`/tmp/rst-review5-clean-L1q3zb` at `1f602d8146d24dd3f5aff9611ac7d4141b7eb08f`.
This review made no product-code changes.

## Cold first screen

At 390 × 844, before scrolling, the page says: “Apply your reading card to
web articles.” It says this is for “low-vision readers” who want consistent
text size, spacing, contrast, and motion on supported public articles. The
first action is **Try it with sample data**; adjacent copy says it opens a
styled sample article and keeps changes separate from extension data.

In my words: this is a Chromium browser extension for a low-vision reader who
wants one saved set of reading preferences applied to public articles. I
should first try the realistic sample, or download the extension to use it on
my own articles. The same answer is available on the 1440 × 900 cold view.
The phone screen has no horizontal overflow and presents the primary action
before any scroll. This passes the five-second comprehension check.

## Findings

None. No `F-5-k` finding was created.

## Complete copy audit

Counts use whitespace-separated words and treat hyphenated terms as one word.
The audit includes sentences and standalone statements; headings, labels, and
actions follow in their own table. Landing prose has 37 statements, maximum
20 words. README prose has 39 statements, maximum 16 words. No sentence
exceeds 22 words. No banned marketing adjective, unexplained reader-facing
jargon, inconsistent term, empty mood heading, or non-result-naming button
was found. Therefore there are no proposed rewrites.

### Landing-page sentences and standalone statements

| Words | Sentence or statement | Flag |
| ---: | --- | --- |
| 2 | You’re offline. | — |
| 4 | This page still works. | — |
| 7 | Apply your reading card to web articles. | — |
| 16 | For low-vision readers who want consistent text size, spacing, contrast, and motion on supported public articles. | — |
| 5 | Opens a styled sample article. | — |
| 7 | Its changes stay separate from extension data. | — |
| 4 | Free and open source. | — |
| 7 | Your reading card stays on this device. | — |
| 8 | The demo works offline after your first visit. | — |
| 12 | The extension applies your text and contrast settings to supported public articles. | — |
| 7 | See your reading card on an article. | — |
| 12 | The preview shows the card name, text size, line spacing, and contrast. | — |
| 9 | At dusk, street trees stop blending into the buildings. | — |
| 14 | Their shadows stretch across brick walls, and each leaf catches the last blue light. | — |
| 7 | Apply one reading card to supported articles. | — |
| 12 | The reader shows the card name, active site, text size, and contrast. | — |
| 12 | Choose text size, line length, spacing, letter shapes, contrast, and reduced motion. | — |
| 10 | Preview type, spacing, and contrast changes as you adjust them. | — |
| 8 | Select the extension on a supported public article. | — |
| 11 | It keeps headings, lists, quotes, tables, and links—without the surrounding clutter. | — |
| 21 | See the active reading card, adjust it, or turn the reader off for that site and return to the original page. | — |
| 5 | Review every saved reading setting. | — |
| 13 | Export your reading card as a text file, then import it when needed. | — |
| 10 | The file uses JSON and contains settings, not browsing history. | — |
| 9 | The extension does not send us your reading history. | — |
| 13 | Your reading card, site choices, and current article stay in browser extension storage. | — |
| 6 | The extension makes no remote requests. | — |
| 7 | Removing the extension deletes its local data. | — |
| 8 | Install the extension, then open a supported article. | — |
| 6 | Download and unzip the extension package. | — |
| 6 | Open `chrome://extensions` in Chrome or Chromium. | — |
| 12 | Turn on Developer mode, choose “Load unpacked”, and select the unzipped folder. | — |
| 12 | Pin Reader Setting Transfer and open it on a supported public article. | — |
| 7 | Version 1.0 · Free and open source. | — |
| 10 | Refuses clearly marked paywalls and does not restyle source pages. | — |
| 8 | Apply one reading card to simplified web articles. | — |
| 10 | Original hero artwork was generated with the factory image model. | — |

### Landing headings, labels, and actions

| Words | Copy | Kind | Flag |
| ---: | --- | --- | --- |
| 3 | Reader Setting Transfer | Wordmark | — |
| 1 | Demo | Navigation | — |
| 3 | How it works | Navigation | — |
| 1 | Privacy | Navigation | — |
| 2 | Download extension | Action | — |
| 4 | Free browser extension · Chromium | Section label | — |
| 5 | Try it with sample data | Primary action | — |
| 4 | Download the extension package | Action | — |
| 2 | Product preview | Section label | — |
| 4 | Adjust this sample article | Action | — |
| 4 | Export your reading card | Promise label | — |
| 4 | Read a simplified article | Promise label | — |
| 6 | Keep article data on this device | Promise label | — |
| 4 | How the extension works | Section label | — |
| 4 | Make your reading card | Step heading | — |
| 5 | Open a supported public article | Step heading | — |
| 6 | Adjust or turn off the reader | Step heading | — |
| 6 | Export and import your reading card | Section label | — |
| 5 | Visible values, not vague presets | List item | — |
| 5 | Import a saved reading card | List item | — |
| 12 | Turn off the reader on a site if an article looks wrong | List item | — |
| 5 | What stays on your device | Section label | — |
| 2 | Stored locally | Point heading | — |
| 3 | No article upload | Point heading | — |
| 3 | Delete local data | Point heading | — |
| 4 | Install the Chromium extension | Section label | — |
| 2 | Download extension | Action | — |
| 4 | Source on GitHub (external) | External link | — |

### README sentences and standalone statements

| Words | Sentence or statement | Flag |
| ---: | --- | --- |
| 12 | Reader Setting Transfer is a free, open-source Chromium extension for low-vision readers. | — |
| 16 | Make one reading card for text size, line length, spacing, contrast, letter shapes, and reduced motion. | — |
| 7 | The preview and reader apply those settings. | — |
| 13 | Open the extension on a supported public article, then select **Read this article**. | — |
| 12 | The reader opens with its text, links, active site, and saved card. | — |
| 13 | Export the reading card as a text file, then import it when needed. | — |
| 4 | The file uses JSON. | — |
| 6 | Try the isolated sample at `https://reader-setting-transfer.sociobot.in/?demo=1`. | — |
| 16 | The demo keeps temporary changes in its own browser session and does not read extension data. | — |
| 8 | The demo reloads offline after your first visit. | — |
| 9 | The production build places the extension ZIP in `dist/site/downloads/`. | — |
| 11 | Extracts article headings and text after you select **Read this article**. | — |
| 10 | Preserves headings, paragraphs, lists, quotes, code, tables, and safe links. | — |
| 9 | Applies your saved reading card only inside the reader. | — |
| 12 | Previews type, spacing, and contrast changes while you adjust the reading card. | — |
| 10 | Stores the current article, reading card, and site choices locally. | — |
| 12 | Turns the reader off per site and returns to the original page. | — |
| 11 | Turns the reader back on for a site from extension settings. | — |
| 13 | Supports keyboard use and 390 px layouts on the landing page and demo. | — |
| 9 | Provides the packaged extension ZIP from the product site. | — |
| 15 | It refuses clearly marked paywalls and opens a separate reader without changing the source page. | — |
| 5 | Requirements: Node.js 22+ and `zip`. | — |
| 5 | Build the production files with: | — |
| 4 | Run `npm run build`. | — |
| 2 | Open `chrome://extensions`. | — |
| 3 | Enable Developer mode. | — |
| 6 | Choose **Load unpacked** and select `.output/chrome-mv3`. | — |
| 14 | Pin Reader Setting Transfer, open a supported public article, and select **Read this article**. | — |
| 6 | The extension makes no remote requests. | — |
| 15 | It reads article text only after you open the extension and select **Read this article**. | — |
| 14 | It does not read or store pages while you browse without opening the extension. | — |
| 15 | The `storage` permission keeps the reading card, current article, and site choices on the device. | — |
| 7 | Removing the extension removes that browser-managed data. | — |
| 7 | See the published privacy policy and terms. | — |
| 6 | Claim tests are listed in `.factory/claims.json`. | — |
| 7 | The sample sandbox design is in `.factory/demo.md`. | — |
| 6 | Visual direction and generated-art provenance: `.factory/design.md`. | — |
| 5 | Build and verification handoff: `.factory/handoff.md`. | — |
| 2 | License: MIT. | — |

README headings—“What v1 does,” “Run locally,” “Install the development
build,” “Privacy and permissions,” and “Project notes”—name their sections.
Its technical terms occur only where they name a file format, browser route,
or developer installation step. Public terminology is consistent: “reading
card,” “reader” or “simplified article,” and “supported public article.”

## Demo and sandbox verification

- The first-screen **Try it with sample data** link and direct `/?demo=1`
  entry both reached `/demo/`.
- The first demo screen already showed the named sample article and first
  paragraph: heading bottom 713.19 px and paragraph top 738.38 px at
  390 × 844; heading bottom 803.66 px and paragraph top 844.91 px at
  1440 × 900.
- The persistent banner said “Demo — sample data, nothing is saved,” provided
  **Reset demo** and **Download the extension**, and Reset restored text size
  to the 120% sample value.
- A seeded real `localStorage` sentinel was unchanged. Demo state used only
  `sessionStorage` key `demo:reader-profile`; leaving via download clears it.
- The request log contained only the product origin and no cookies. After the
  first controlled visit, the demo reloaded offline with the sample and banner.

## Claims and clean-clone tests

Read `.factory/claims.json`: it contains 23 claims, each with one matching
tagged test. `npm run lint` confirmed that mapping. Every exact `test` command
was invoked separately after `npm ci` in the clean clone; all passed on its
first invocation. There are no untested claims and no unlisted product claim
in the landing or README copy.

| Registered claim IDs — all PASS |
| --- |
| `reading-settings`, `reading-card-json-transfer`, `demo-isolation`, `offline-reload`, `offline-landing`, `site-no-tracking`, `extension-local-reader`, `per-site-off-return`, `article-structure`, `code-preservation`, `free-open-source`, `responsive-keyboard`, `demo-first-screen`, `extension-uninstall-data`, `access-boundaries`, `extension-download`, `activation-boundary`, `no-background-monitoring`, `extension-reading-settings`, `extension-open-article`, `extension-reading-card-transfer`, `extension-no-remote-requests`, `site-choice-reenable` |

## Earlier-finding history audit

Every earlier `review-*.md`, `polish-*.md`, and handoff record was read. Each
finding below was rechecked on the live site and in current code; none is
unfixed, half-fixed, or regressed.

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | Fixed: the sample heading and first paragraph begin in both required first viewports. |
| F-1-2 | Fixed: keyboard operation is exercised at 390 px. |
| F-1-3 | Fixed: preview copy names only the values it displays. |
| F-1-4 | Fixed: no speed promise remains; the return flow is tested. |
| F-1-5 | Fixed: no untested click-count promise remains. |
| F-1-6 | Fixed: the ZIP download is registered and validated. |
| F-1-7 | Fixed: cache-duration marketing copy is absent. |
| F-1-8 | Fixed: security-header marketing copy is absent. |
| F-1-9 | Fixed: activation-only access is registered and tested. |
| F-1-10 | Fixed: passive browsing does not read or store pages. |
| F-1-11 | Fixed: README links to, rather than overclaims, the registry. |
| F-1-12 | Fixed: primary, forward, and Back navigation focus and announce the H1. |
| F-1-13 | Fixed: the product preview precedes How it works. |
| F-1-14 | Fixed: download actions name “extension.” |
| F-1-15 | Fixed: the strip names concrete results. |
| F-1-16 | Fixed: the caption is factual and high contrast. |
| F-1-17 | Fixed: the extension section names itself. |
| F-1-18 | Fixed: the setup-ritual slogan is absent. |
| F-1-19 | Fixed: step three names adjust or turn off. |
| F-1-20 | Fixed: export/import section is named. |
| F-1-21 | Fixed: black-box metaphor is absent. |
| F-1-22 | Fixed: the text-file outcome precedes JSON. |
| F-1-23 | Fixed: per-site copy is reader-facing. |
| F-1-24 | Fixed: privacy heading names device storage. |
| F-1-25 | Fixed: reading-history behavior is explicit. |
| F-1-26 | Fixed: analytics-SDK jargon is absent. |
| F-1-27 | Fixed: demo exit names the downloaded result. |
| F-1-28 | Fixed: designed 404 uses “Error 404” and “Page not found.” |
| F-1-29 | Fixed: public terminology remains consistent. |
| F-1-30 | Fixed: README has no sentence over 22 words. |
| F-1-31 | Fixed: README names article headings and text. |
| F-1-32 | Fixed: README uses “saved reading card.” |
| F-1-33 | Fixed: MV3 is absent from public marketing. |
| F-1-34 | Fixed: all footers have one factual one-liner. |
| F-1-35 | Fixed: all five routes share chrome. |
| F-1-36 | Fixed: GitHub visibly says “external.” |
| F-1-37 | Fixed: README explains the text file before JSON. |
| F-1-38 | Fixed: build wording makes no reproducibility claim. |
| F-1-39 | Fixed: broad service copy is replaced by a registered privacy claim. |
| F-2-1 | Fixed: all routes have 0 px overflow at 200% text. |
| F-2-2 | Fixed: copy limits operation to supported public articles. |
| F-2-3 | Fixed: no cross-browser promise remains; transfer uses clean sessions. |
| F-2-4 | Fixed: every reading-card field is asserted in the packaged reader. |
| F-2-5 | Fixed: compatibility language is Chromium-specific. |
| F-2-6 | Fixed: privacy distinguishes extension storage from infrastructure logs. |
| F-2-7 | Fixed: action note and facts fit the desktop first screen. |
| F-2-8 | Fixed: README says temporary browser session, not storage internals. |
| F-2-9 | Fixed: unmeasured speed wording is absent. |
| F-2-10 | Fixed: “Delete local data” names the action. |
| F-2-11 | Fixed: “No article upload” names the privacy boundary. |
| F-2-12 | Fixed: install language says Chromium extension. |
| F-2-13 | Fixed: README separates lint and typecheck correctly. |
| F-2-14 | Fixed: both dependency audits return zero vulnerabilities. |
| F-3-1 | Fixed: first clean run opened a real article in the packaged reader. |
| F-3-2 | Fixed: caption is on an opaque high-contrast surface. |
| F-3-3 | Fixed: preview scope is limited to type, spacing, and contrast. |
| F-3-4 | Fixed: packaged extension transfer has a two-profile test. |
| F-3-5 | Fixed: the real flow asserts the active site. |
| F-3-6 | Fixed: offline copy promises only cached-page behavior. |
| F-3-7 | Fixed: all mobile navigation remains visible and operable. |
| F-3-8 | Fixed: the live region is clipped 1 × 1 px and announces route changes. |
| F-4-1 | Fixed: extension settings explain and test re-enabling a site. |
| F-4-2 | Fixed: deletion copy now names deletion. |

## Structure, accessibility, and visual identity

- The five public routes have route-appropriate titles, one H1, `lang=en`,
  description, canonical, OG/Twitter data, favicon, Apple icon, shared
  header/footer, skip links, Privacy and Terms links, and valid 404 behavior.
- All 13 discovered links returned a non-error response. Deep links, forward
  navigation, and Back move focus to the new H1 and announce the destination.
- Axe reported zero serious or critical issues across all five routes; the live
  browser logged no console or page errors. Phone and 200% text reflow had
  zero overflow. The request log was same-origin only and cookie-free.
- The tactile risograph collage, registration marks, offset ink borders,
  paper palette, self-hosted accessible face, and quiet reader surface match
  `.factory/design.md` and are visibly product-specific rather than a generic
  SaaS template.

## Missed leverage

No missing obvious feature was found. The brief implies transferable reader
settings, which the product supplies through exported/imported reading-card
files. Cloud sync would conflict with the stated local-first privacy model.
An AI step would not improve this deterministic preference-transfer job and
would introduce an unnecessary data path; no decorative AI feature exists.

## Quality-gate evidence

From the clean clone: `npm ci`, `npm run check` (12 unit tests, lint,
typecheck, production build), `npm run test:package`, all 23 exact claim
commands, `npm audit --omit=dev`, and `npm audit` passed. The deterministic
package SHA-256 was `6397759ce375d71b80bd87927acb1dbc50d9f496dd9ab0acd68fb252c24c2fbd`.

Live `scripts/verify-live.mjs` passed at phone and desktop sizes: all five
routes, 13 links, metadata, headers, first-screen demo, reset, isolation,
offline reload, route focus, 200% reflow, 404, accessibility, and request-log
checks.

## What would make this perfect

Keep the current constraints intact as the extension evolves: retain the
sample sandbox and its storage boundary, add a registered observable test
before publishing each new visitor-facing claim, and preserve the direct
mobile first-screen explanation.
