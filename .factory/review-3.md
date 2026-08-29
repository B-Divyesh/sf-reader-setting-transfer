# Adversarial first-read review 3 — Reader Setting Transfer

**Verdict: FAIL**

Reviewed repository commit `b8aa188134a1e0b42d51b7140290d26dc6137769`
and the live site at <https://reader-setting-transfer.sociobot.in/> on
2026-08-29 UTC. The local production build and live HTML/ZIP artifacts match
byte-for-byte.

This round has 4 blocking findings, 5 major findings, and 1 minor finding.
All 18 registered claim commands pass from a clean clone, but public claims
remain unlisted or extend beyond what those commands prove. A pass requires
zero findings and no untested claim.

## Cold first screen

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 before any
scrolling.

- What it does: applies one saved reading card to supported web articles.
- For whom: low-vision readers who want consistent text size, spacing,
  contrast, and motion.
- What to click first: **Try it with sample data**.

All three answers are clear at both sizes. The exact text was “Apply your
reading card to web articles,” “For low-vision readers who want consistent
text size, spacing, contrast, and motion on supported public articles,” and
“Try it with sample data.” The action note and all three facts are also in the
first viewport. Mobile horizontal overflow is 0 px.

## Findings

### Blocking

#### F-1-1 (reopened) — the desktop demo still hides the readable sample below the first screen

Location: live `/demo/` after selecting **Try it with sample data**, fresh
1440 × 900 context.

The sample article heading “The city changes when you notice its trees” starts
at 883.61 px and ends at 994.45 px. Its first paragraph starts at 1034.05 px.
The first screen shows the large demo introduction, controls, the card rail,
and “FIELD NOTE · URBAN TREES,” but no readable sample article content.

Why this blocks: the one-click demo must immediately show the product being
used with realistic sample data. The earlier mobile-only defect was only
half-fixed; the same result remains below the fold on desktop.

Concrete fix: compact the desktop demo introduction or place the already
styled reader before it. Add a 1440 × 900 assertion requiring the complete
sample heading and the start of its first paragraph inside the initial
viewport, alongside the existing 390 × 844 assertion.

#### F-1-3 (reopened) — “each active value” remains an unlisted and inaccurate completeness claim

Location: landing **Product preview** and **How the extension works**.

Exact quote: “Your saved reading card sets the article view and lists each
active value.”

The landing preview lists the card name, text size, line spacing, and
contrast. It omits line length, paragraph spacing, letter spacing, letter
shapes, and reduced motion. The installed reader lists the card name, site,
text size, and contrast, so it also does not list each value. No claim entry
tests a complete list.

Why this blocks: round 1 identified an unlisted completeness claim. Its
replacement retained the same unsupported completeness word, so the earlier
finding was not fully resolved.

Concrete rewrite: use “The preview shows the card name, text size, line
spacing, and contrast” in the preview. Use “The reader shows the card name,
active site, text size, and contrast” in How it works. Alternatively, display
and test every saved value.

#### F-3-1 — no claim test proves the real article-to-reader workflow end to end

Locations: landing step 02 and README introduction / **What v1 does**.

Exact quotes include “Select the extension on a supported public article” and
“Choose the extension on a supported public article. The reader applies every
saved setting and shows the active site.”

The registered tests prove separate pieces: `activation-boundary` proves no
read occurs before activation, `article-structure` calls the extractor in
jsdom, and the reader tests inject `currentArticle` directly into extension
storage. No test opens the packaged extension on a real article, selects
**Read this article**, confirms extraction and storage, and observes the new
reader tab.

Why this blocks: that chain is the product’s actual job-to-be-done. Green
component tests do not verify that a reader can complete it.

Concrete fix: add a registered `extension-open-article` claim and MV3 test.
Grant the action on a real local article, open the popup, select **Read this
article**, then assert the extracted heading/list/link, active site, saved
article, applied reading card, and opened reader tab.

#### F-3-2 — the hero caption has approximately 1.16:1 contrast

Location: landing desktop hero caption, “The extension applies your text and
contrast settings to supported public articles.”

Computed text color is `#555B6D`. The caption sits over the `#B8371E`
risograph plate created by `.hero__art::before`, producing about 1.16:1
contrast instead of the required 4.5:1. The text is visibly difficult to read.
The automated Axe scan misses the pseudo-element background.

Why this blocks: the product is specifically for low-vision readers and the
repository contract makes 4.5:1 text contrast mandatory.

Concrete fix: keep the caption on an opaque paper-colored strip, move it clear
of the red plate, or use a text/background pair with at least 4.5:1 contrast.
Add a pixel-aware or explicit token-pair contrast assertion for the caption.

### Major

#### F-3-3 — “See every change in a live preview” is false for reduced motion

Locations: landing step 01 and the packaged options page.

Exact landing quote: “See every change in a live preview.” The options page
also says “Contrast, letter shapes, and motion settings also appear in this
sample” and “The preview uses every saved reading setting.”

In a fresh packaged extension, toggling **Reduce interface motion** leaves the
preview’s HTML, inline style, data attributes, `animation-name`, and
`transition-duration` unchanged. The preview has no motion to reduce. The
`extension-reading-settings` claim checks the final reader, not this live
preview promise.

Concrete fix: either give the preview a brief, non-looping motion whose state
changes visibly and test both checkbox states, or rewrite the landing sentence
to “Preview type and contrast changes as you adjust them” and remove the two
options-page motion claims.

#### F-3-4 — extension import/export is advertised, but the registered transfer test covers only the demo

Locations: landing **Export and import your reading card** and README
introduction.

Exact quotes: “Export your reading card as a text file, then import it when
needed” and “Export the reading card as a text file, then import it when
needed.”

`reading-card-json-transfer` explicitly exports and imports between two clean
`/demo/` browser contexts. It never operates the packaged extension’s
**Export my card** or **Import a card** controls. The public product claim is
therefore broader than the listed evidence.

Concrete fix: add an `extension-reading-card-transfer` claim. Export from one
fresh MV3 profile, import the file into a second fresh profile, and assert all
fields, local storage, and rendered reader styles. Keep the demo claim as a
separate sandbox check.

#### F-3-5 — “shows the active site” is an unlisted README claim

Location: README introduction.

Exact quote: “The reader applies every saved setting and shows the active
site.”

`extension-reading-settings` asserts the card name and rendered styles but
does not assert `#site-rule`. No other claim names or tests the active-site
display.

Concrete fix: extend a registered extension claim to assert the exact hostname
shown after opening an article, or rewrite the sentence as “The reader applies
every saved setting.”

#### F-3-6 — the offline banner makes an unlisted download-connectivity claim

Location: landing offline banner.

Exact quote: “The page still works; the extension download needs a
connection.”

`offline-landing` proves the cached landing heading and notice reload offline.
It does not attempt the ZIP download or prove that it is unavailable offline.

Concrete fix: either test the offline download result in the registered claim,
or rewrite the banner as “You’re offline. This page still works.”

#### F-3-7 — the mobile header removes all navigation except the download

Location: every live route at 390 px; `site/style.css` under
`@media (max-width: 900px)`.

Exact code behavior: `.site-header nav a:not(.nav-download) { display: none; }`.
**Demo**, **How it works**, and **Privacy** are absent from the rendered mobile
header. A phone visitor must reach the footer to find Privacy or move between
product sections.

Concrete fix: retain those links in a wrapping second row or an accessible
menu. Test that each required header destination is visible and keyboard
operable at 390 px on every route.

### Minor

#### F-3-8 — route changes focus the H1 but do not announce it through a live region

Location: all public routes and `site/main.ts`.

Forward navigation, the primary demo transition, and Back correctly focus the
destination H1. However, `/`, `/privacy/`, `/terms/`, and `/404.html` contain
no `aria-live` region, and the route script only calls `focus()`.

Concrete fix: add a visually hidden `aria-live="polite"` route-status region
to the shared page chrome, update it with the destination heading after an
internal navigation, and test its announced text on forward and Back
navigation.

## Complete copy audit

Counts use lexical words, treat hyphenated terms as one word, and ignore
punctuation-only separators. Landing prose averages 9.2 words across 38
sentences/statements; the maximum is 21. README prose averages 8.5 words
across 41 sentences/statements; the maximum is 16. No item exceeds 22 words,
and no banned plain-words adjective appears.

### Landing-page sentences and standalone statements

| Words | Sentence or statement | Flag |
| ---: | --- | --- |
| 2 | You’re offline. | — |
| 10 | The page still works; the extension download needs a connection. | F-3-6 |
| 7 | Apply your reading card to web articles. | — |
| 16 | For low-vision readers who want consistent text size, spacing, contrast, and motion on supported public articles. | — |
| 5 | Opens a styled sample article. | — |
| 7 | Its changes stay separate from extension data. | — |
| 4 | Free and open source. | — |
| 7 | Your reading card stays on this device. | — |
| 8 | The demo works offline after your first visit. | — |
| 12 | The extension applies your text and contrast settings to supported public articles. | — |
| 7 | See your reading card on an article. | — |
| 13 | Your saved reading card sets the article view and lists each active value. | F-1-3 |
| 9 | At dusk, street trees stop blending into the buildings. | — |
| 14 | Their shadows stretch across brick walls, and each leaf catches the last blue light. | — |
| 7 | Apply one reading card to supported articles. | — |
| 13 | Your saved reading card sets the article view and lists each active value. | F-1-3 |
| 12 | Choose text size, line length, spacing, letter shapes, contrast, and reduced motion. | — |
| 7 | See every change in a live preview. | F-3-3 |
| 8 | Select the extension on a supported public article. | F-3-1 |
| 12 | It keeps headings, lists, quotes, tables, and links—without the surrounding clutter. | — |
| 21 | See the active reading card, adjust it, or turn the reader off for that site and return to the original page. | — |
| 5 | Review every saved reading setting. | — |
| 13 | Export your reading card as a text file, then import it when needed. | F-3-4 |
| 10 | The file uses JSON and contains settings, not browsing history. | — |
| 9 | The extension does not send us your reading history. | — |
| 13 | Your reading card, site choices, and current article stay in browser extension storage. | — |
| 6 | The extension makes no remote requests. | — |
| 10 | Remove the extension and its local data leaves with it. | — |
| 8 | Install the extension, then open a supported article. | — |
| 6 | Download and unzip the extension package. | — |
| 6 | Open `chrome://extensions` in Chrome or Chromium. | — |
| 12 | Turn on Developer mode, choose “Load unpacked”, and select the unzipped folder. | — |
| 12 | Pin Reader Setting Transfer and open it on a supported public article. | — |
| 6 | Version 1.0 · Free and open source. | — |
| 10 | Refuses clearly marked paywalls and does not restyle source pages. | — |
| 8 | Apply one reading card to simplified web articles. | — |
| 6 | Built by Param Factory · Version 1.0. | — |
| 10 | Original hero artwork was generated with the factory image model. | — |

### Landing headings, labels, and actions

| Words | Copy | Kind | Flag |
| ---: | --- | --- | --- |
| 3 | Reader Setting Transfer | Wordmark | — |
| 1 | Demo | Navigation | F-3-7 (hidden on mobile) |
| 3 | How it works | Navigation | F-3-7 (hidden on mobile) |
| 1 | Privacy | Navigation | F-3-7 (hidden on mobile) |
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
| 4 | Source on GitHub (external) | External link | — |

The unflagged headings name their sections out of context. Every unflagged
action starts with a result-naming verb. “JSON,” “Chromium,” `chrome://`, and
MV3 appear only where the file format, supported browser, or developer output
requires them. “Reading card” is used consistently for the saved settings.

### README sentences and standalone statements

| Words | Sentence or statement | Flag |
| ---: | --- | --- |
| 12 | Reader Setting Transfer is a free, open-source Chromium extension for low-vision readers. | — |
| 16 | Make one reading card for text size, line length, spacing, contrast, letter shapes, and reduced motion. | — |
| 8 | Choose the extension on a supported public article. | F-3-1 |
| 11 | The reader applies every saved setting and shows the active site. | F-3-1, F-3-5 |
| 13 | Export the reading card as a text file, then import it when needed. | F-3-4 |
| 4 | The file uses JSON. | — |
| 8 | Try the isolated sample at `https://reader-setting-transfer.sociobot.in/?demo=1`. | — |
| 16 | The demo keeps temporary changes in its own browser session and does not read extension data. | — |
| 8 | The demo reloads offline after your first visit. | — |
| 9 | The production build places the extension ZIP in `dist/site/downloads/`. | — |
| 11 | Extracts article headings and text after you select **Read this article** | F-3-1 |
| 10 | Preserves headings, paragraphs, lists, quotes, code, tables, and safe links | — |
| 9 | Applies your saved reading card only inside the reader | — |
| 13 | Previews changes and lets you adjust text size and contrast in the reader | — |
| 10 | Stores the current article, reading card, and site choices locally | — |
| 12 | Turns the reader off per site and returns to the original page | — |
| 13 | Supports keyboard use and 390 px layouts on the landing page and demo | — |
| 9 | Provides the packaged extension ZIP from the product site | — |
| 15 | It refuses clearly marked paywalls and opens a separate reader without changing the source page. | — |
| 5 | Requirements: Node.js 22+ and `zip`. | — |
| 5 | Build the production files with: | — |
| 1 | Outputs: | — |
| 4 | `.output/chrome-mv3/` — unpacked MV3 extension | — |
| 4 | `dist/site/index.html` — static deploy root | — |
| 3 | `dist/site/downloads/reader-setting-transfer-chrome.zip` — packaged extension | — |
| 4 | Run `npm run build`. | — |
| 2 | Open `chrome://extensions`. | — |
| 3 | Enable Developer mode. | — |
| 6 | Choose **Load unpacked** and select `.output/chrome-mv3`. | — |
| 13 | Pin Reader Setting Transfer, open a supported public article, and choose the extension. | F-3-1 |
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

README headings are “Reader Setting Transfer” (3), “What v1 does” (3), “Run
locally” (2), “Install the development build” (4), “Privacy and permissions”
(3), and “Project notes” (2). Each identifies its section. No README action
uses a vague button label.

## Demo and sandbox verification

- One-click entry: pass. The landing primary action reaches `/demo/`, and
  `/?demo=1` redirects there.
- Immediate sample at 390 × 844: pass. The sample heading ends at 729.64 px
  and the first paragraph starts at 759.33 px.
- Immediate sample at 1440 × 900: **fail; F-1-1**. The heading starts at
  883.61 px and its paragraph starts below 1034 px.
- Banner: pass. “Demo — sample data, nothing is saved,” **Reset demo**, and
  **Download the extension** remain visible.
- Reset: pass. Changing text size to 155% and resetting restores 120%, reports
  “Demo reset to the sample reading card,” and focuses the article.
- Isolation: pass. Seeded `localStorage` and non-demo `sessionStorage` values
  remain unchanged. Changes use only `demo:reader-profile`; the download exit
  removes that key.
- Network/privacy: pass. The landing-to-demo request log contains only
  `https://reader-setting-transfer.sociobot.in`; no cookies, console errors, or
  page errors were observed.
- Offline: pass after the first controlled visit and reload.

## Claim-test results

Every exact command in `.factory/claims.json` was run independently after
`npm ci` in clean clone `/tmp/rst-review3-clean2-JSQMsN`.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `reading-settings` | PASS | Demo settings changed rendered article state; Reset restored defaults. |
| `reading-card-json-transfer` | PASS | The JSON file transferred every field between two clean demo contexts. |
| `demo-isolation` | PASS | Only the demo session key changed; requests remained same-origin. |
| `offline-reload` | PASS | The controlled demo reloaded offline with its sample and banner. |
| `offline-landing` | PASS | The controlled landing page reloaded offline and showed its notice. |
| `site-no-tracking` | PASS | Five routes used one origin, no `Set-Cookie`, and an empty cookie jar. |
| `extension-local-reader` | PASS | Local extension storage and reader rendering worked with no HTTP requests. |
| `per-site-off-return` | PASS | The site override was disabled and the original URL opened. |
| `article-structure` | PASS | Semantic fixture content survived; active code and clutter did not. |
| `free-open-source` | PASS | MIT text exists and no payment SDK is installed. |
| `responsive-keyboard` | PASS | Landing and demo controls operated by keyboard at 390 px with no overflow or serious Axe result. |
| `extension-uninstall-data` | PASS | Reinstalling in the same profile produced empty extension storage. |
| `access-boundaries` | PASS | Marked paywalls were refused and source DOM remained unchanged. |
| `extension-download` | PASS | The response is a ZIP with all required MV3 entries. |
| `activation-boundary` | PASS | Passive visits left storage empty before extension activation. |
| `no-background-monitoring` | PASS | Passive visits caused no extension request, injected element, or stored page. |
| `extension-reading-settings` | PASS | Every saved field changed the injected reader fixture and both motion states. |
| `extension-no-remote-requests` | PASS | Packaged use made no HTTP request and had no remote permission, cookie, or unexpected storage key. |

No registered command failed. Findings F-3-1 and F-3-3 through F-3-6 identify
public behavior that is absent from the registry or broader than the listed
test.

## History audit

`.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`,
`.factory/polish-2.md`, and the prior handoff were read in full. Each earlier
finding was checked on the live deployment and in current source; closure text
was not accepted as evidence.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 | **Reopened:** mobile is fixed, but the readable desktop sample remains below the initial 900 px viewport. |
| F-1-2 | Fixed: the exact claim now operates landing and demo controls by keyboard and passes. |
| F-1-3 | **Reopened:** the replacement still claims “each active value,” which neither preview lists. |
| F-1-4 | Fixed: “instantly” is absent and return behavior is tested. |
| F-1-5 | Fixed: the one-click-per-article count is absent. |
| F-1-6 | Fixed: `extension-download` is registered and passes. |
| F-1-7 | Fixed: cache-duration marketing copy is absent. |
| F-1-8 | Fixed: the README security-header marketing claim is absent. |
| F-1-9 | Fixed: `activation-boundary` is registered and its negative boundary passes. |
| F-1-10 | Fixed: `no-background-monitoring` is registered and passes. |
| F-1-11 | Fixed: README only links to the claim registry. |
| F-1-12 | Fixed: primary, forward, and Back navigation focus the destination H1. |
| F-1-13 | Fixed: the product preview precedes How it works in live DOM and source. |
| F-1-14 | Fixed: header actions say “Download extension.” |
| F-1-15 | Fixed: promise labels use reading-card, article, and device language. |
| F-1-16 | Fixed as copy: the old slogan is gone; caption contrast is separately F-3-2. |
| F-1-17 | Fixed: the label says “How the extension works.” |
| F-1-18 | Fixed: the setup-ritual metaphor is absent. |
| F-1-19 | Fixed: step 03 names adjustment and turning off. |
| F-1-20 | Fixed: the section names export and import. |
| F-1-21 | Fixed: the black-box metaphor is absent. |
| F-1-22 | Fixed: text-file outcome precedes JSON detail. |
| F-1-23 | Fixed: the site-off sentence uses plain language. |
| F-1-24 | Fixed: the section label says what stays on the device. |
| F-1-25 | Fixed: the heading directly states the history behavior. |
| F-1-26 | Fixed: “analytics SDK” is absent. |
| F-1-27 | Fixed: the demo exit says “Download the extension.” |
| F-1-28 | Fixed: the 404 uses “Error 404” and “Page not found.” |
| F-1-29 | Fixed: public copy uses “reading card” and “text size” consistently. |
| F-1-30 | Fixed: the README sentence is split and below the cap. |
| F-1-31 | Fixed: README says “article headings and text.” |
| F-1-32 | Fixed: README says “saved reading card.” |
| F-1-33 | Fixed: MV3 remains in developer output, not landing copy. |
| F-1-34 | Fixed: every footer has the same factual one-liner. |
| F-1-35 | Fixed: all five routes share the same header/footer structure; mobile visibility is separately F-3-7. |
| F-1-36 | Fixed: every source link visibly says “(external).” |
| F-1-37 | Fixed: README leads with “text file”; JSON follows. |
| F-1-38 | Fixed: README says “Build the production files with.” |
| F-1-39 | Fixed: the aggregate service list was replaced by the registered no-remote-request statement. |
| F-2-1 | Fixed: all five routes have 0 px overflow at 200% text in a 390 px viewport. |
| F-2-2 | Fixed: universal “each/every article” wording is absent; supported public articles are named. |
| F-2-3 | Fixed: the cross-browser promise is absent and the demo test uses two clean contexts. |
| F-2-4 | Fixed for final reader application: `extension-reading-settings` asserts every field; live-preview completeness is F-3-3. |
| F-2-5 | Fixed: public copy says Chromium, and the packaged Chromium test passes. |
| F-2-6 | Fixed: Privacy distinguishes extension data from possible infrastructure logs without contradicting itself. |
| F-2-7 | Fixed: desktop hero action note ends at 571.09 px and facts end at 678.53 px. |
| F-2-8 | Fixed: README describes a temporary browser session, not a namespace. |
| F-2-9 | Fixed: “quick” is absent. |
| F-2-10 | Fixed: the heading is “Delete local data.” |
| F-2-11 | Fixed: the heading is “No article upload.” |
| F-2-12 | Fixed: the label is “Install the Chromium extension.” |
| F-2-13 | Fixed: README separates content lint and typecheck accurately. |
| F-2-14 | Fixed: clean `npm audit` and `npm audit --omit=dev` report zero vulnerabilities. |

## Structure, links, accessibility, and identity

Confirmed on live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and an
unknown route:

- Titles follow the required route pattern and stay under 60 characters.
- Every route has `lang="en"`, one H1, one main landmark, a description,
  canonical link, Open Graph/Twitter metadata, SVG favicon, and 180 px Apple
  icon. The social card is 1200 × 630.
- Unknown routes return HTTP 404 with the designed page. Direct `/demo` and
  all deep links work. Forward and Back focus the destination H1.
- All 13 unique links found across the five pages return 200, including the
  ZIP and external GitHub source.
- Live browser checks found no console errors, cookies, third-party requests,
  serious/critical Axe findings, or horizontal overflow at default or 200%
  text. Axe’s pseudo-background blind spot is F-3-2.
- The risograph collage, offset ink plates, registration marks, warm paper,
  and Atkinson typography match `.factory/design.md` and are not a generic
  SaaS template.
- The missing mobile header links and route live announcement are F-3-7 and
  F-3-8.

## Missed leverage

No AI feature is justified. This is deterministic preference transfer; model
use would add privacy, cost, and failure modes. Reading-card import/export is
already implemented, though its real-extension claim needs the test in
F-3-4. Automatic cloud sync would conflict with the brief’s local-first
scope. No missed-feature finding is added.

## Quality-gate evidence

- Clean clone: `/tmp/rst-review3-clean2-JSQMsN`.
- All 18 exact claim commands: PASS.
- `npm run check`: PASS — content lint, typecheck, 10/10 unit tests, and build.
- `npm run test:e2e`: PASS — 28/28 tests.
- `npm run test:package`: PASS — deterministic ZIP SHA-256
  `a6cda2db2887e917d37f306f87e571b9260d3c45eef6f7190eabf0856956387c`.
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities.
- First-load site JavaScript is about 2.8 kB gzip in total.
- Live/local SHA-256 matches for landing, demo, Privacy, Terms, 404, and the
  extension ZIP.

## What would make this perfect

Put readable sample article content in the first desktop demo viewport. Remove
the “each/every” preview overclaims or make them true, and add registered MV3
tests for the real toolbar-to-reader flow, extension card transfer, and active
site label. Raise the hero caption to at least 4.5:1 contrast, retain the main
navigation on phones, add a route live announcement, and remove or test the
offline download statement. Then rerun all 18 claim commands, full gates, the
live request/link/metadata checks, both demo viewport checks, and the manual
pseudo-background contrast check. A PASS requires no remaining item.
