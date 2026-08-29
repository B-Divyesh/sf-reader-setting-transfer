# Adversarial first-read review 4 — Reader Setting Transfer

**Verdict: FAIL**

Reviewed repository commit `52f2184563cc0ef8798439402044de19c0017f75`
and <https://reader-setting-transfer.sociobot.in/> on 2026-08-29 UTC.
The live landing HTML and extension ZIP match the clean local build exactly.

This round has two blocking reopened findings, one major finding, and one
minor finding. One of 21 registered claim commands failed on its first clean
run. A retry passed, which identifies nondeterminism rather than clearing the
required first-run failure. A pass requires zero findings and no untested
claim.

## Cold first screen

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 before any
scrolling.

- What it does: applies a saved set of reading settings to supported web
  articles.
- For whom: low-vision readers who want consistent text size, spacing,
  contrast, and motion.
- What to click first: **Try it with sample data**.

All three answers are available in the first screen at both sizes. The exact
copy is “Apply your reading card to web articles,” “For low-vision readers who
want consistent text size, spacing, contrast, and motion on supported public
articles,” and “Try it with sample data.” The action explanation and all three
facts also finish inside each first viewport. Mobile horizontal overflow is
0 px.

Evidence:

- `.factory/evidence/review-4-cold-mobile.png`
- `.factory/evidence/review-4-cold-desktop.png`

## Findings

### Blocking

#### F-3-1 (reopened) — the core article-to-reader claim is not reproducibly green

Location: `.factory/claims.json`, claim `extension-open-article`, and
`e2e/extension.spec.ts:356`–`481`.

Exact first-run result from clean clone `/tmp/rst-review4-clean-MWKrgg`:

> `Timeout 5000ms exceeded while waiting on the predicate`

The timeout occurred at `e2e/extension.spec.ts:467`. The test had already
opened the packaged popup and dispatched the pointer action, but neither a
stored `currentArticle` nor an opened `reader.html` page appeared before the
poll expired. The registered command exited 1. The same exact command passed
on one immediate retry.

Why this blocks: the claim is the product's real job-to-be-done. The claims
contract says any failing listed test is blocking. A passing retry does not
make a clean verifier run dependable, and it can conceal either a popup race
or a real intermittent reader-opening failure.

Concrete fix: remove the popup/CDP race from the claim test while retaining
the real packaged popup and pointer path. Use an isolated debugging endpoint,
wait for an observed button event and background message, record the popup
status when opening fails, and give the post-click state a deliberate timeout.
Run the exact command repeatedly from separate clean profiles and require all
runs to pass.

#### F-3-8 (reopened) — the route announcement is visible page content

Location: live `/` → **Try it with sample data** → `/demo/`; `site/main.ts:24`;
`site/style.css`.

Exact visible text at the top of the destination page:

> “Opened Try your settings on a sample article.”

At 390 × 844 it occupies y=0–26 px above the demo banner. The element has
`class="sr-only"`, but the public-site stylesheet has no `.sr-only` rule.
That rule exists only in `styles/shared.css`, which is imported by extension
surfaces and not by the site. The same visible announcement appears after
other internal route changes and Back navigation.

Why this blocks: round 3 required an assistive announcement, not a new visible
line of implementation text. The attempted fix is only half complete and has
regressed the destination layout. History rules make a half-fixed earlier
finding blocking again under its original ID.

Concrete fix: add the standard visually-hidden rule to `site/style.css` or
share it with the site bundle. Keep the live-region text available to
assistive technology. Extend the route-focus test to assert the announcement
updates while its box remains clipped to 1 × 1 px and does not alter layout.

### Major

#### F-4-1 — site-choice recovery is an unlisted and unclear claim

Location: live `/privacy/`, **Control and deletion**; packaged options page,
**Site choices**.

Exact public quote:

> “You can also replace site choices in the extension settings.”

The packaged page adds:

> “Sites you turn off appear here. Re-enable them at any time.”

No `.factory/claims.json` entry names this recovery behavior. The existing
`per-site-off-return` test verifies only that a site becomes disabled and the
original page opens; no test selects **Use reader again**, confirms the stored
override is removed, and confirms the reader can open on that site again.
“Replace site choices” also does not tell a reader what result to expect.

Why this matters: a reader can rely on the privacy page to recover from a
site-level choice, but that recovery is outside the claim registry and its
copy is ambiguous.

Concrete fix: rewrite the sentence as “You can turn the reader back on for a
site in extension settings.” Add a `site-choice-reenable` claim and packaged
MV3 test that disables a site, selects **Use reader again**, verifies the
override is removed, and opens the reader on that site again.

### Minor

#### F-4-2 — the local-data sentence uses a metaphor instead of naming deletion

Location: landing page, **Delete local data**.

Exact quote:

> “Remove the extension and its local data leaves with it.”

Why this matters: “leaves with it” is figurative and less exact than the
tested browser behavior. The plain-words rule requires direct, usable copy.

Concrete rewrite:

> “Removing the extension deletes its local data.”

## Complete copy audit

Counts use whitespace-separated words and treat hyphenated terms as one word.
Landing prose has 37 sentences/statements, averages 9.2 words, and has a
maximum of 20. README prose has 38 sentences/statements, averages 9.1 words,
and has a maximum of 16. Nothing exceeds 22 words and no banned marketing word
appears.

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
| 11 | The reader shows the card name, active site, text size, and contrast. | — |
| 13 | Choose text size, line length, spacing, letter shapes, contrast, and reduced motion. | — |
| 10 | Preview type, spacing, and contrast changes as you adjust them. | — |
| 9 | Select the extension on a supported public article. | F-3-1 |
| 12 | It keeps headings, lists, quotes, tables, and links—without the surrounding clutter. | F-3-1 |
| 20 | See the active reading card, adjust it, or turn the reader off for that site and return to the original page. | — |
| 5 | Review every saved reading setting. | — |
| 13 | Export your reading card as a text file, then import it when needed. | — |
| 10 | The file uses JSON and contains settings, not browsing history. | — |
| 10 | The extension does not send us your reading history. | — |
| 12 | Your reading card, site choices, and current article stay in browser extension storage. | — |
| 6 | The extension makes no remote requests. | — |
| 10 | Remove the extension and its local data leaves with it. | F-4-2 |
| 8 | Install the extension, then open a supported article. | — |
| 6 | Download and unzip the extension package. | — |
| 7 | Open `chrome://extensions` in Chrome or Chromium. | — |
| 12 | Turn on Developer mode, choose “Load unpacked”, and select the unzipped folder. | — |
| 12 | Pin Reader Setting Transfer and open it on a supported public article. | — |
| 6 | Version 1.0 · Free and open source. | — |
| 11 | Refuses clearly marked paywalls and does not restyle source pages. | — |
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

The headings make sense outside their surrounding paragraphs. Every action
uses a result-naming verb; **Try it with sample data** is the mandated sample
action. Terminology is consistent: the saved object is a “reading card,” the
content surface is a “reader” or “simplified article,” and supported input is
a “supported public article.”

### README sentences and standalone statements

| Words | Sentence or statement | Flag |
| ---: | --- | --- |
| 12 | Reader Setting Transfer is a free, open-source Chromium extension for low-vision readers. | — |
| 16 | Make one reading card for text size, line length, spacing, contrast, letter shapes, and reduced motion. | — |
| 7 | The preview and reader apply those settings. | — |
| 13 | Open the extension on a supported public article, then select **Read this article**. | F-3-1 |
| 12 | The reader opens with its text, links, active site, and saved card. | F-3-1 |
| 13 | Export the reading card as a text file, then import it when needed. | — |
| 4 | The file uses JSON. | — |
| 6 | Try the isolated sample at `https://reader-setting-transfer.sociobot.in/?demo=1`. | — |
| 16 | The demo keeps temporary changes in its own browser session and does not read extension data. | — |
| 8 | The demo reloads offline after your first visit. | — |
| 9 | The production build places the extension ZIP in `dist/site/downloads/`. | — |
| 11 | Extracts article headings and text after you select **Read this article** | F-3-1 |
| 10 | Preserves headings, paragraphs, lists, quotes, code, tables, and safe links | — |
| 9 | Applies your saved reading card only inside the reader | — |
| 12 | Previews type, spacing, and contrast changes while you adjust the reading card | — |
| 10 | Stores the current article, reading card, and site choices locally | — |
| 12 | Turns the reader off per site and returns to the original page | — |
| 13 | Supports keyboard use and 390 px layouts on the landing page and demo | — |
| 9 | Provides the packaged extension ZIP from the product site | — |
| 15 | It refuses clearly marked paywalls and opens a separate reader without changing the source page. | — |
| 5 | Requirements: Node.js 22+ and `zip`. | — |
| 5 | Build the production files with: | — |
| 4 | Run `npm run build`. | — |
| 2 | Open `chrome://extensions`. | — |
| 3 | Enable Developer mode. | — |
| 6 | Choose **Load unpacked** and select `.output/chrome-mv3`. | — |
| 14 | Pin Reader Setting Transfer, open a supported public article, and select **Read this article**. | F-3-1 |
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
(3), and “Project notes” (2). “Outputs” (1) is a developer label. These labels
name their sections. Developer terms such as JSON, MV3, and `chrome://` appear
only where their exact format or installation step is useful.

## Demo and sandbox verification

- One-click path: pass. The landing action and direct `/?demo=1` entry reach
  `/demo/`.
- Immediate sample: pass. At 390 × 844 the sample heading ends at 739.53 px
  and the first paragraph starts at 764.72 px. At 1440 × 900 both begin inside
  the first viewport.
- Banner and exit: pass. The persistent banner says “Demo — sample data,
  nothing is saved” and provides **Reset demo** and **Download the extension**.
- Reset: pass. A changed value returns to the 120% sample, the status announces
  the reset, and focus moves to the article.
- Isolation: pass. A seeded real-data local-storage sentinel remains unchanged.
  The demo writes only `demo:reader-profile` in session storage, and the exit
  action clears that key.
- Privacy: pass. The full live flow makes requests only to
  `https://reader-setting-transfer.sociobot.in` and sets no cookies.
- Offline: pass. After the first controlled visit, the sample and banner reload
  with the browser context offline.
- Layout: pass apart from F-3-8. There is 0 px horizontal overflow at 390 px,
  including every public route at 200% text.

Screenshots are in `.factory/evidence/review-4-demo-mobile.png` and
`.factory/evidence/review-4-demo-desktop.png`.

## Registered claim results

Every exact command in `.factory/claims.json` was invoked separately after
`npm ci` in clean clone `/tmp/rst-review4-clean-MWKrgg`.

| Claim | First clean run | Evidence |
| --- | --- | --- |
| `reading-settings` | PASS | All exposed settings changed the article; Reset restored the sample. |
| `reading-card-json-transfer` | PASS | A complete JSON card transferred between two clean demo contexts. |
| `demo-isolation` | PASS | Only the demo session key changed; requests stayed first-party. |
| `offline-reload` | PASS | The controlled demo reloaded offline. |
| `offline-landing` | PASS | The controlled landing page reloaded offline. |
| `site-no-tracking` | PASS | Five routes stayed same-origin and set no cookies. |
| `extension-local-reader` | PASS | Packaged local storage and reader rendering worked without HTTP requests. |
| `per-site-off-return` | PASS | Turning the reader off stored the disabled override and returned to the source. |
| `article-structure` | PASS | Required structure survived; code and clutter were removed. |
| `free-open-source` | PASS | MIT text exists and no payment SDK is present. |
| `responsive-keyboard` | PASS | Landing and demo controls operated at 390 px with keyboard and no serious Axe result. |
| `demo-first-screen` | PASS | Sample heading and paragraph began in both required first viewports. |
| `extension-uninstall-data` | PASS | Reinstalling into the same browser profile returned empty extension storage. |
| `access-boundaries` | PASS | Visible paywalls were refused; hidden remnants and source DOM were handled correctly. |
| `extension-download` | PASS | Download returned a valid ZIP with required MV3 files. |
| `activation-boundary` | PASS | Passive browsing did not populate extension storage. |
| `no-background-monitoring` | PASS | Passive browsing made no extension request or injected change. |
| `extension-reading-settings` | PASS | Every reading-card field and both motion states applied in the packaged reader. |
| `extension-open-article` | **FAIL** | Timed out after the popup action; neither stored article nor reader page appeared. One retry passed. See F-3-1. |
| `extension-reading-card-transfer` | PASS | A complete card transferred between clean packaged-extension profiles. |
| `extension-no-remote-requests` | PASS | Packaged use made no HTTP request and had no remote permission or cookie. |

The live landing and README claims map to registered entries, subject to the
failing core-flow evidence above. F-4-1 records the additional unlisted claim
found on the live privacy route.

## History audit

Every earlier `review-*.md`, `polish-*.md`, and the handoff was read. Each
unique prior finding was rechecked against live behavior and current source.

### Review 1 findings

| ID | Current verification |
| --- | --- |
| F-1-1 | Fixed: the sample heading and first paragraph begin in both required first viewports. |
| F-1-2 | Fixed: the registered keyboard test operates landing and demo controls. |
| F-1-3 | Fixed: copy names the exact values displayed instead of claiming every active value. |
| F-1-4 | Fixed: no speed promise remains; the return behavior is tested. |
| F-1-5 | Fixed: the untested click-count copy is absent. |
| F-1-6 | Fixed: the ZIP claim is registered and its download passes. |
| F-1-7 | Fixed: cache-duration marketing copy is absent. |
| F-1-8 | Fixed: security-header marketing copy is absent; headers were checked separately. |
| F-1-9 | Fixed: activation has a registered negative-boundary test. |
| F-1-10 | Fixed: passive browsing has a registered storage/request test. |
| F-1-11 | Fixed: README links to the registry without claiming completeness. |
| F-1-12 | Fixed: primary, forward, and Back navigation focus the destination H1. |
| F-1-13 | Fixed: the product preview precedes How it works. |
| F-1-14 | Fixed: every header action says “Download extension.” |
| F-1-15 | Fixed: the strip names export, reading, and local storage results. |
| F-1-16 | Fixed: the caption states the supported-article behavior directly. |
| F-1-17 | Fixed: the label is “How the extension works.” |
| F-1-18 | Fixed: the setup-ritual slogan is absent. |
| F-1-19 | Fixed: step three names adjusting or turning off. |
| F-1-20 | Fixed: the section label names export and import. |
| F-1-21 | Fixed: the black-box metaphor is absent. |
| F-1-22 | Fixed: the text-file result precedes JSON detail. |
| F-1-23 | Fixed: the per-site copy uses ordinary reader-facing language. |
| F-1-24 | Fixed: the privacy label says what stays on the device. |
| F-1-25 | Fixed: the privacy heading states the reading-history behavior directly. |
| F-1-26 | Fixed: “analytics SDK” is absent. |
| F-1-27 | Fixed: the demo exit names its result, “Download the extension.” |
| F-1-28 | Fixed: the designed 404 says “Error 404” and “Page not found.” |
| F-1-29 | Fixed: public copy consistently uses “reading card” and “text size.” |
| F-1-30 | Fixed: no README sentence exceeds 22 words. |
| F-1-31 | Fixed: README says “article headings and text.” |
| F-1-32 | Fixed: README says “saved reading card.” |
| F-1-33 | Fixed: MV3 appears only in developer context. |
| F-1-34 | Fixed: every footer uses the same factual one-line description. |
| F-1-35 | Fixed: all five routes share header and footer structure. |
| F-1-36 | Fixed: the source link visibly says “(external).” |
| F-1-37 | Fixed: text-file purpose precedes JSON format. |
| F-1-38 | Fixed: README says “Build the production files with.” |
| F-1-39 | Fixed: the broad service list was replaced by the tested no-remote-request statement. |

### Review 2 findings

| ID | Current verification |
| --- | --- |
| F-2-1 | Fixed: all public routes have 0 px overflow at 200% text. |
| F-2-2 | Fixed: copy consistently limits operation to supported public articles. |
| F-2-3 | Fixed: the demo transfer uses two clean browser contexts and no cross-browser promise remains. |
| F-2-4 | Fixed: the packaged-extension claim applies and asserts every reading-card field. |
| F-2-5 | Fixed: public compatibility names Chromium, which the packaged tests run. |
| F-2-6 | Fixed: Privacy distinguishes extension data from possible infrastructure logs. |
| F-2-7 | Fixed: the desktop action note and facts end at 571.09 px and 678.53 px. |
| F-2-8 | Fixed: README describes a temporary browser session in user-facing words. |
| F-2-9 | Fixed: the unmeasured “quick” claim is absent. |
| F-2-10 | Fixed: the point heading is “Delete local data.” |
| F-2-11 | Fixed: the point heading is “No article upload.” |
| F-2-12 | Fixed: the label is “Install the Chromium extension.” |
| F-2-13 | Fixed: README accurately separates lint and type-check commands. |
| F-2-14 | Fixed: `npm audit` and `npm audit --omit=dev` both report zero vulnerabilities. |

### Review 3 findings

| ID | Current verification |
| --- | --- |
| F-3-1 | **Reopened:** the registered real popup-to-reader command failed on its first clean run. |
| F-3-2 | Fixed: caption text/background contrast is explicitly tested at or above 4.5:1. |
| F-3-3 | Fixed: preview copy names only type, spacing, and contrast changes. |
| F-3-4 | Fixed: packaged import/export has its own two-profile claim test. |
| F-3-5 | Fixed: the real-flow test asserts the active site when it completes. |
| F-3-6 | Fixed: the offline banner no longer claims download connectivity. |
| F-3-7 | Fixed: Demo, How it works, Privacy, and Download remain visible at 390 px. |
| F-3-8 | **Reopened:** the announcement updates, but `.sr-only` has no site CSS and is visibly rendered. |

## Structure, accessibility, and live integrity

- Titles pass the route pattern and remain under 60 characters: home, Demo,
  Privacy, Terms, and Page not found each have their own title.
- Every route has `lang="en"`, one H1, one main landmark, a description,
  canonical URL, Open Graph/Twitter metadata, SVG favicon, and Apple touch
  icon.
- `robots.txt` and `sitemap.xml` list the public routes. The unknown-route
  response is HTTP 404 and uses the designed risograph 404 page.
- Primary, forward, and Back navigation focus the new H1. The intended polite
  announcement works semantically but is visibly exposed; see F-3-8.
- All 13 unique links found across the five routes returned 200, including the
  GitHub source and extension ZIP.
- Shared header/footer structure, Privacy, Terms, source attribution, and
  version are present on every route.
- Axe found zero serious or critical issues on the five public routes. No
  console or page errors were recorded. Focus styles, reduced motion, 390 px
  layout, and 200% text reflow pass.
- The tactile risograph palette, offset borders, registration mark, generated
  product-specific art, and calm reader surface are distinct from a generic
  SaaS template and match `.factory/design.md`.
- The local and live landing HTML share SHA-256
  `01947fcb7da5041001a29a4c5a7dff82736a07e99c2df9966d42192bc57970ff`.
  The local and live ZIP share SHA-256
  `2778986c152e992301539f3b2fbdf7f735110927a4f0af66bc4c3be57eeba171`.

## Quality gates

From the clean clone:

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 269 packages, 0 vulnerabilities |
| `npm run lint` | PASS — 5 routes and 21 claim tags |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 11 tests |
| `npm run build` | PASS — `dist/site/` and the extension ZIP were produced |
| `npm run test:package` | PASS — deterministic ZIP |
| `npm audit` and `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| 21 exact claim commands | **FAIL — 20 passed, `extension-open-article` failed once** |

## Missed leverage

No AI feature is justified. Reading preferences and deterministic article
cleanup do not need model inference, and adding it would weaken the local-only
privacy model. The brief-implied transfer feature already exists through JSON
export/import. Cloud sync would contradict the local-first scope unless added
as a separate, explicit opt-in. The only missing leverage is the tested
site-choice recovery already described in F-4-1.

## What would make this perfect

1. Make `extension-open-article` pass reliably on every clean first run.
2. Hide the route live region visually while preserving its announcement.
3. Register and test turning the reader back on for a disabled site, with
   direct copy.
4. Replace the remaining “data leaves with it” metaphor.
5. Rerun all 21 claim commands from a new clean clone and require 21/21 on the
   first invocation, then repeat the live first-read, demo, route, link,
   accessibility, privacy, and offline checks.
