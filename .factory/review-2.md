# Adversarial first-read review 2 — Reader Setting Transfer

**Verdict: FAIL**

Reviewed repository commit `a194fce97f77fdcec628fded0c344988dc023593`
and the live site at <https://reader-setting-transfer.sociobot.in/> on
2026-08-29 UTC. The local landing page, demo page, and extension ZIP match the
live deployment byte-for-byte.

This round has 7 reopened blocking findings, 6 new major findings, and 8 new
minor findings. All 16 registered claim commands pass, but one registered test
does not perform the keyboard coverage its sandbox requires, and several live
claims are absent from the registry or extend beyond their registered test.

Reopened findings retain their original `F-1-*` IDs as required by the history
check. New findings use `F-2-*` IDs.

## Cold first screen

Fresh Chromium contexts were opened without prior site data at 390 × 844 and
1440 × 900. Before scrolling, the answers were:

- What it does: applies chosen reading display settings to simplified web
  articles.
- For whom: low-vision readers who want the same settings on public articles.
- What to click first: **Try it with sample data**.

The required three questions are answerable at both sizes. The exact text was
“Apply your reading settings to web articles,” “For low-vision readers who want
the same text size, spacing, contrast, and motion across public articles,” and
“Try it with sample data.” Mobile horizontal overflow was 0 px at the default
text size.

The desktop first screen still does not contain the complete mandatory support
copy: the action explanation begins at 897 px and the three facts begin at
966 px in a 900 px viewport. This is F-2-7 below.

## Findings

### Blocking — earlier findings not actually closed

#### F-1-2 (reopened) — the keyboard claim test still does not perform its declared coverage

Location: `.factory/claims.json`, `responsive-keyboard`, and
`e2e/site.spec.ts`.

Exact sandbox requirement: “operate each by keyboard.” The exact registered
command passes, but its tagged test uses the landing promise strip and one demo
text-size range. It does not activate the landing action, Reset, export,
import, either select, or the reduced-motion checkbox by keyboard.

Why this blocks: the command's green result does not prove the full registered
claim. This is the same incomplete-claim problem reported in round 1, only
partly expanded to include `/demo/`.

Concrete fix: in the single `@claim:responsive-keyboard` test, tab through and
operate every landing and demo control with the keyboard. Assert the expected
result and focus after each action, or narrow and split the claim.

#### F-1-12 (reopened) — the primary demo route still leaves focus on the body

Location: live `/` → **Try it with sample data** → `/demo/`; `site/main.ts`.

Observed result: after the primary action finishes its `/?demo=1` redirect,
`document.activeElement` is `<body>`, not the demo H1. The header's direct
**Demo** link does focus the H1, and Back focuses the landing H1.

Why this blocks: the most important route transition is the one route-focus
implementation misses. The stored destination is `/?demo=1`, but the final
route is `/demo/`.

Concrete fix: link the primary action directly to `/demo/`, or preserve the
focus intent through the redirect. Add this exact primary-action path to the
route-focus test.

#### F-1-35 (reopened) — header and footer structure is still inconsistent

Location: live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`; matching
files under `site/`.

Observed result: `/terms/` has no header at all. Only `/` has the footer
wordmark. `/demo/` has a GitHub source link, while `/privacy/`, `/terms/`, and
the 404 do not. Footer navigation alternates between two different link sets.

Why this blocks: a visitor loses the standard navigation and product identity
on a required route. The previous fix claimed consistency but did not provide
it.

Concrete fix: use one shared header and one shared footer on every route. Keep
the wordmark, product sentence, Privacy, Terms, external source attribution,
and version on every page; mark only the current item differently.

#### F-1-36 (reopened) — the external source link still lacks an external cue

Location: landing and demo footers.

Exact text: “Source on GitHub.” There is no visible external indicator and no
accessible text that says the link leaves the site.

Why this blocks: the round-1 fix was not made, and the structure contract says
external links must say so.

Concrete fix: use “Source on GitHub (external)” or add an equivalent visible
and accessible external-link cue.

#### F-1-37 (reopened) — README still leads with JSON jargon

Location: README introduction.

Exact quote: “Export the card as readable JSON and import it in another
browser.”

Why this blocks: replacing “inspectable JSON” with “readable JSON” does not
resolve the earlier jargon finding. A reader needs the result before the file
format.

Concrete rewrite: “Export the reading card as a text file and import it in
another browser.” Put “The file uses JSON” in a later technical note.

#### F-1-38 (reopened) — the unlisted reproducible-build assertion remains verbatim

Location: README, **Run locally**.

Exact quote: “The reproducible production command is exactly:” followed by
`npm run build`.

Why this blocks: `claims.json` has no reproducible-build entry. The package
test proves only the extension ZIP is deterministic, not that the whole
production output is reproducible.

Concrete fix: write “Build the production files with `npm run build`,” or add
a claim that compares every production artifact from two clean builds.

#### F-1-39 (reopened) — the aggregate no-service claim is still unlisted

Locations: landing privacy section and README **Privacy and permissions**.

Exact quotes: “No account, tracking, remote fonts, or server upload” and “The
extension has no analytics, account, remote API, or broad host permission.”

Why this blocks: `site-no-tracking` covers the static site, while
`extension-local-reader`, `activation-boundary`, and
`no-background-monitoring` cover different subsets of extension behavior. No
single registry entry states and tests the public aggregate promise.

Concrete fix: add an `extension-no-remote-services` claim with manifest,
dependency, request, cookie, and storage assertions, or replace the lists with
the narrower tested statement “The extension makes no remote requests.”

### Major — new findings

#### F-2-1 — 200% text causes horizontal page overflow

Location: live `/` and `/privacy/` at 390 × 844 with the root text size set to
200%.

Observed result: the landing document is 402 px wide for a 390 px viewport;
the privacy page is 440 px wide. On Privacy, the H1 alone has 416 px of scroll
width inside a 342 px box.

Why this matters: the product is for low-vision readers, but enlarged text
requires horizontal page movement and can clip the word “language.” The
default-size responsive test does not cover this accessibility requirement.

Concrete fix: add resilient wrapping to large headings, remove transformed
decorations from document overflow at enlarged text sizes, and add 200% text
reflow assertions for every public route.

#### F-2-2 — the landing page promises every article despite documented exclusions

Location: landing hero caption, **How the extension works** heading, and
install heading.

Exact quotes: “The extension applies the same text and contrast settings to
each article,” “Apply one reading card to every article,” and “Install the
extension, then open it on each article.”

Why this matters: the product explicitly refuses clearly marked paywalls and
the Terms say extraction may fail. No claim promises universal article
support, so “each” and “every” overstate compatibility.

Concrete rewrite: “The extension applies the same text and contrast settings
to supported public articles” and “Apply one reading card when you open a
supported article.”

#### F-2-3 — cross-browser import is claimed but not tested

Locations: landing reading-card section and README introduction.

Exact quotes: “Export your reading card as a text file and import it in another
browser” and “Export the card as readable JSON and import it in another
browser.”

Why this matters: `reading-card-json-transfer` exports and imports within one
page and browser context. It does not transfer the file into a second clean
browser, so “another browser” is outside the registered evidence.

Concrete fix: make the claim test export from one clean context and import
into another, then assert all values; otherwise remove “in another browser.”

#### F-2-4 — full extension setting application is not a registered, complete claim

Locations: landing first-screen sentence, landing step 01, and README
introduction.

Exact quotes include “For low-vision readers who want the same text size,
spacing, contrast, and motion across public articles” and “Make one reading
card for text size, line length, spacing, contrast, letter shapes, and reduced
motion.” The landing step also says to choose all six setting groups.

Why this matters: `reading-settings` is explicitly a sample-demo claim and
does not name line length. The built-extension claim changes and asserts text
size and contrast, but not line length, spacing, letter shapes, or reduced
motion. The extension-wide promise therefore has no matching complete claim
test.

Concrete fix: add one extension claim and MV3 test that saves every setting and
asserts every resulting reader style, including the reduced-motion behavior.

#### F-2-5 — Chrome compatibility is advertised without a matching claim

Locations: landing eyebrow and README first sentence.

Exact quotes: “Free browser extension · Chrome” and “Chrome/Chromium
extension.”

Why this matters: all extension automation launches Playwright's bundled
Chromium. No claim entry names branded Chrome compatibility.

Concrete fix: register a Chrome/Chromium compatibility claim and run the
packaged extension in both supported browser channels, or name only the tested
browser family.

#### F-2-6 — the privacy page contradicts itself about personal information

Location: `/privacy/`, **What this website collects** and **Children and
sensitive data**.

Exact quotes: “Infrastructure logs may briefly record an IP address, browser
details, requested URL, and time” and “The service is a general reading tool
and does not knowingly collect personal information, including from
children.”

Why this matters: IP addresses and browser details can be personal
information. The second sentence is also an unlisted privacy claim and does
not distinguish extension data from website infrastructure logs.

Concrete rewrite: “The extension does not collect account or article data.
The website may process the limited infrastructure logs described above,
including when a child visits it.” Confirm the final policy wording against
the actual host configuration.

### Minor — new findings

#### F-2-7 — the complete first-screen action explanation and facts are below the desktop fold

Location: live landing page at 1440 × 900.

Observed result: the action explanation begins at 897 px and the three facts
begin at 966 px. The button itself is visible, so the three cold-read questions
pass, but the required “what happens” note and privacy/offline/price facts do
not.

Concrete fix: reduce the desktop hero's top padding/type scale or compact the
copy so the action note and all three facts end above 900 px. Add a desktop
first-viewport assertion.

#### F-2-8 — README uses storage implementation jargon

Location: README demo paragraph.

Exact quote: “It uses a separate `demo:` session namespace and does not read
extension data.”

Why this matters: “session namespace” describes implementation, not the
visitor-visible safety result.

Concrete rewrite: “The demo keeps temporary changes in its own browser session
and does not read extension data.”

#### F-2-9 — README uses an unmeasured speed adjective

Location: README **What v1 does**.

Exact quote: “Provides live settings preview and quick reader text-size/contrast
changes.”

Why this matters: “quick” is a marketing speed claim with no number or test.

Concrete rewrite: “Previews changes and lets you adjust text size and contrast
in the reader.”

#### F-2-10 — “Easy to clear” is a subjective heading

Location: landing privacy points.

Exact heading: “Easy to clear.”

Why this matters: the heading does not name the action and claims ease without
evidence.

Concrete rewrite: “Delete local data.”

#### F-2-11 — “Sent nowhere” is an absolute heading without a subject

Location: landing privacy points.

Exact heading: “Sent nowhere.”

Why this matters: heard out of context, it does not say what is not sent. Its
absolute scope also contributes to F-1-39.

Concrete rewrite: “No article upload.”

#### F-2-12 — “Install the v1 package” uses release jargon

Location: landing install eyebrow.

Exact heading: “Install the v1 package.”

Why this matters: a first-time reader expects to install an extension, not a
“v1 package.”

Concrete rewrite: “Install the Chrome extension.”

#### F-2-13 — README misdescribes the lint command

Location: README command block.

Exact text: `npm run lint # static TypeScript and repository checks`.

Why this matters: the script runs `scripts/lint-content.mjs`; TypeScript is
checked by the separate `typecheck` script. A contributor is told that a check
ran when it did not.

Concrete rewrite: `npm run lint # content and claim-tag checks`, and list
`npm run typecheck` separately.

#### F-2-14 — a clean install reports high and critical development dependency vulnerabilities

Location: locked dependency graph, reached through direct dev dependency
`wxt`.

Observed result: `npm audit` reports 10 issues: 1 low, 2 moderate, 4 high, and
3 critical. The critical chain includes `wxt` → `web-ext-run` → `fx-runner` →
`shell-quote`. `npm audit --omit=dev` reports zero production issues.

Why this matters: the shipped static product is not exposed by this graph, but
contributors and the release pipeline execute it.

Concrete fix: update or override the WXT/web-ext toolchain to versions without
the reported advisories, then rerun the clean build and extension tests.

## Complete copy audit

Counts use whitespace-separated visible words and treat hyphenated terms as
one word. The landing-page average is 9.3 words across 37 sentences; its
maximum is 20. The README prose average is 9.0 words across 36 sentences; its
maximum is 16. No sentence exceeds 22 words and no banned plain-words term
appears.

### Landing-page sentences

| Words | Sentence | Flag |
| ---: | --- | --- |
| 2 | You’re offline. | — |
| 10 | The page still works; the extension download needs a connection. | — |
| 7 | Apply your reading settings to web articles. | — |
| 16 | For low-vision readers who want the same text size, spacing, contrast, and motion across public articles. | F-2-4 |
| 4 | Opens a styled article. | — |
| 6 | Demo changes use separate temporary storage. | — |
| 4 | Free and open source. | — |
| 7 | Your reading card stays on this device. | — |
| 8 | The demo works offline after your first visit. | — |
| 11 | The extension applies the same text and contrast settings to each article. | F-2-2 |
| 7 | See your reading card on an article. | — |
| 12 | Your saved reading card sets the article view and lists each active value. | — |
| 9 | At dusk, street trees stop blending into the buildings. | — |
| 14 | Their shadows stretch across brick walls, and each leaf catches the last blue light. | — |
| 7 | Apply one reading card to every article. | F-2-2 |
| 12 | Your saved reading card sets the article view and lists each active value. | — |
| 13 | Choose text size, line length, spacing, letter shapes, contrast, and reduced motion. | F-2-4 |
| 8 | See every change in a live preview. | F-2-4 |
| 8 | Select the extension on a public article. | — |
| 12 | It keeps headings, lists, quotes, tables, and links—without the surrounding clutter. | — |
| 20 | See the active reading card, adjust it, or turn the reader off for that site and return to the original page. | — |
| 5 | Review every saved reading setting. | — |
| 13 | Export your reading card as a text file and import it in another browser. | F-2-3 |
| 10 | The file uses JSON and contains settings, not browsing history. | — |
| 10 | The extension does not send us your reading history. | — |
| 12 | Your reading card, site choices, and current article stay in browser extension storage. | — |
| 8 | No account, tracking, remote fonts, or server upload. | F-1-39 |
| 10 | Remove the extension and its local data leaves with it. | — |
| 9 | Install the extension, then open it on each article. | F-2-2 |
| 6 | Download and unzip the extension package. | — |
| 7 | Open `chrome://extensions` in Chrome or Chromium. | — |
| 12 | Turn on Developer mode, choose “Load unpacked”, and select the unzipped folder. | — |
| 11 | Pin Reader Setting Transfer and open it on a public article. | — |
| 6 | Version 1.0 · Free and open source. | — |
| 11 | Refuses clearly marked paywalls and does not restyle source pages. | — |
| 8 | Apply one reading card to simplified web articles. | — |
| 10 | Original hero artwork was generated with the factory image model. | — |

### Landing headings, labels, and actions

| Words | Copy | Kind | Flag |
| ---: | --- | --- | --- |
| 5 | Free browser extension · Chrome | Eyebrow | F-2-5 |
| 5 | Try it with sample data | Primary action | — |
| 2 | Download extension | Header/install action | — |
| 4 | Download the extension package | Secondary action | — |
| 2 | Product preview | Section label | — |
| 4 | Adjust this sample article | Action | — |
| 4 | Export your reading card | Promise label | — |
| 4 | Read a simplified article | Promise label | — |
| 6 | Keep article data on this device | Promise label | — |
| 4 | How the extension works | Section label | — |
| 4 | Make your reading card | Step heading | — |
| 4 | Open a public article | Step heading | — |
| 6 | Adjust or turn off the reader | Step heading | — |
| 6 | Export and import your reading card | Section label | — |
| 5 | Visible values, not vague presets | List item | — |
| 4 | Import on another browser | List item | F-2-3 |
| 12 | Turn off the reader on a site if an article looks wrong | List item | — |
| 5 | What stays on your device | Section label | — |
| 2 | Stored locally | Point heading | — |
| 2 | Sent nowhere | Point heading | F-2-11 |
| 3 | Easy to clear | Point heading | F-2-10 |
| 4 | Install the v1 package | Section label | F-2-12 |
| 3 | Source on GitHub | External link | F-1-36 |

All landing buttons and action links use verbs that name their result. No
button-label finding is added.

### README sentences and standalone statements

| Words | Sentence or statement | Flag |
| ---: | --- | --- |
| 12 | Reader Setting Transfer is a free, open-source Chrome/Chromium extension for low-vision readers. | F-2-5 |
| 16 | Make one reading card for text size, line length, spacing, contrast, letter shapes, and reduced motion. | F-2-4 |
| 7 | Choose the extension on a public article. | — |
| 10 | The reader applies your card and shows the active site. | — |
| 12 | Export the card as readable JSON and import it in another browser. | F-1-37, F-2-3 |
| 6 | Try the isolated sample at `https://reader-setting-transfer.sociobot.in/?demo=1`. | — |
| 13 | It uses a separate `demo:` session namespace and does not read extension data. | F-2-8 |
| 8 | The demo reloads offline after your first visit. | — |
| 9 | The production build places the extension ZIP in `dist/site/downloads/`. | — |
| 11 | Extracts article headings and text after you select **Read this article**. | — |
| 10 | Preserves headings, paragraphs, lists, quotes, code, tables, and safe links. | — |
| 9 | Applies your saved reading card only inside the reader. | — |
| 9 | Provides live settings preview and quick reader text-size/contrast changes. | F-2-9 |
| 10 | Stores the current article, reading card, and site choices locally. | — |
| 12 | Turns the reader off per site and returns to the original page. | — |
| 13 | Supports keyboard use and 390 px layouts on the landing page and demo. | F-1-2 |
| 9 | Provides the packaged extension ZIP from the product site. | — |
| 15 | It refuses clearly marked paywalls and opens a separate reader without changing the source page. | — |
| 5 | Requirements: Node.js 20+ and `zip`. | — |
| 6 | The reproducible production command is exactly: | F-1-38 |
| 4 | Run `npm run build`. | — |
| 2 | Open `chrome://extensions`. | F-2-5 |
| 3 | Enable Developer mode. | — |
| 6 | Choose **Load unpacked** and select `.output/chrome-mv3`. | — |
| 12 | Pin Reader Setting Transfer, open a public article, and choose the extension. | — |
| 12 | The extension has no analytics, account, remote API, or broad host permission. | F-1-39 |
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

README headings and output labels are all below the cap: “Reader Setting
Transfer” (3), “What v1 does” (3), “Run locally” (2), “Outputs” (1), “Install
the development build” (4), “Privacy and permissions” (3), and “Project notes”
(2). Developer-only terms such as “MV3” and “static deploy root” occur only in
the build-output list and are appropriate there. The command comment flagged
in F-2-13 is not a sentence, but it is still incorrect copy.

## Demo and sandbox verification

- One-click entry: pass from the landing primary action and direct
  `/?demo=1`; both reach `/demo/`.
- Immediate sample: pass. At 390 × 844 the article heading ended at 683 px and
  its first paragraph began at 713 px. At 1440 × 900 the controls, active card
  rail, and sample article beginning were visible.
- Banner: pass. The sticky banner says “Demo — sample data, nothing is saved”
  and provides **Reset demo** and **Download the extension**.
- Reset: pass. A change to 150% returned to 120%, announced “Demo reset to the
  sample reading card,” and focused the article.
- Isolation: pass. A seeded `real:sentinel=keep` local-storage value remained
  unchanged. Edits used only `demo:reader-profile` in session storage. The
  download action cleared that temporary key.
- Network/privacy: pass. The live landing-to-demo request log contained only
  `https://reader-setting-transfer.sociobot.in`; no cookies or console errors
  were observed.
- Offline: pass after the first controlled visit and reload.

The demo itself is not a blocking finding this round.

## Claim-test results

Every exact command was run independently from clean clone
`/tmp/rst-review2-clean-6Rox3z` after `npm ci`.

| Claim ID | Exact command | Result | Observable evidence |
| --- | --- | --- | --- |
| `reading-settings` | `npm run test:e2e -- --grep @claim:reading-settings` | PASS | Demo styles changed for each exposed control; Reset restored defaults. |
| `reading-card-json-transfer` | `npm run test:e2e -- --grep @claim:reading-card-json-transfer` | PASS | JSON exported, parsed, imported, and changed all imported fields. |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS | Only the demo session key changed; requests were same-origin. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS | Demo reloaded with the context offline. |
| `offline-landing` | `npm run test:e2e -- --grep @claim:offline-landing` | PASS | Landing reloaded offline and showed its notice. |
| `site-no-tracking` | `npm run test:e2e -- --grep @claim:site-no-tracking` | PASS | Public routes had one origin, no `Set-Cookie`, and an empty cookie jar. |
| `extension-local-reader` | `npm run test:e2e -- --grep @claim:extension-local-reader` | PASS | MV3 local storage and reader rendering worked without HTTP requests. |
| `per-site-off-return` | `npm run test:e2e -- --grep @claim:per-site-off-return` | PASS | Site override was disabled and the original URL opened. |
| `article-structure` | `npm test -- --testNamePattern @claim:article-structure` | PASS | Tested structure survived; active code and clutter did not. |
| `free-open-source` | `npm test -- --testNamePattern @claim:free-open-source` | PASS | MIT text exists and no payment SDK is installed. |
| `responsive-keyboard` | `npm run test:e2e -- --grep @claim:responsive-keyboard` | PASS command; incomplete evidence | Default 390 px layout, one landing widget, and one demo range passed; see F-1-2. |
| `extension-uninstall-data` | `npm run test:e2e -- --grep @claim:extension-uninstall-data` | PASS | Reinstalling into the same profile produced empty extension storage. |
| `access-boundaries` | `npm test -- --testNamePattern @claim:access-boundaries` | PASS | Marked paywalls were refused and source DOM stayed unchanged. |
| `extension-download` | `npm run test:e2e -- --grep @claim:extension-download` | PASS | Download had a ZIP signature and required MV3 entries. |
| `activation-boundary` | `npm run test:e2e -- --grep @claim:activation-boundary` | PASS | Passive visits left storage empty with no content script or host permission. |
| `no-background-monitoring` | `npm run test:e2e -- --grep @claim:no-background-monitoring` | PASS | Passive visits produced no extension request, injected element, or stored page. |

No registered command failed and no command was skipped. F-1-2 is a test-scope
failure rather than a command failure. Unlisted or over-broad public claims are
identified in F-1-38, F-1-39, and F-2-2 through F-2-5.

## History audit

`.factory/review-1.md`, `.factory/polish-1.md`, and the current handoff were
read in full. The polish table says all findings are resolved but stops at
F-1-34; it contains no closure rows for F-1-35 through F-1-39.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 | Fixed: the mobile demo heading and first paragraph start are in the first viewport. |
| F-1-2 | **Reopened:** the exact claim test does not operate each control by keyboard. |
| F-1-3 | Fixed: the unsupported reader-mode comparison is gone. |
| F-1-4 | Fixed: “instantly” is gone. |
| F-1-5 | Fixed: the click-count claim is gone. |
| F-1-6 | Fixed: `extension-download` is registered and passes. |
| F-1-7 | Fixed: the README cache-duration sentence is gone. |
| F-1-8 | Fixed: the README security-header sales claim is gone. |
| F-1-9 | Fixed: `activation-boundary` is registered and its negative boundary test passes. |
| F-1-10 | Fixed: `no-background-monitoring` is registered and passes. |
| F-1-11 | Fixed: README now says only where claim tests are listed. |
| F-1-12 | **Reopened:** direct nav works, but the primary `?demo=1` path leaves focus on `<body>`. |
| F-1-13 | Fixed: the product preview precedes How it works in live DOM and source. |
| F-1-14 | Fixed: header actions say “Download extension.” |
| F-1-15 | Fixed: the promise strip uses concrete reading-card/article/device copy. |
| F-1-16 | Fixed as written: the prior slogan is gone; its replacement has the separate overreach in F-2-2. |
| F-1-17 | Fixed: the section label says “How the extension works.” |
| F-1-18 | Fixed as metaphor: the prior ritual slogan is gone; universal wording is F-2-2. |
| F-1-19 | Fixed: step 03 names adjustment and turning off. |
| F-1-20 | Fixed: the section label names export and import. |
| F-1-21 | Fixed: the black-box metaphor is gone. |
| F-1-22 | Fixed: the result comes before the JSON detail. |
| F-1-23 | Fixed: the per-site sentence is in plain words. |
| F-1-24 | Fixed: the section label says what stays on the device. |
| F-1-25 | Fixed: the heading directly states the reading-history behavior. |
| F-1-26 | Fixed as jargon: “analytics SDK” is gone; claim completeness remains F-1-39. |
| F-1-27 | Fixed: the demo action says “Download the extension.” |
| F-1-28 | Fixed: the 404 uses “Error 404” and “Page not found.” |
| F-1-29 | Fixed: public copy consistently uses “reading card” for the saved object and “text size” for the control. |
| F-1-30 | Fixed: the long README sentence is split. |
| F-1-31 | Fixed: README names article headings and text. |
| F-1-32 | Fixed: README names the saved reading card and reader. |
| F-1-33 | Fixed: Manifest V3 is absent from landing copy and retained only in developer output. |
| F-1-34 | Fixed: every public footer uses the same one-line product description. |
| F-1-35 | **Reopened:** Terms has no header and footer structure still varies. |
| F-1-36 | **Reopened:** “Source on GitHub” still has no external cue. |
| F-1-37 | **Reopened:** “readable JSON” retains the same file-format-first jargon. |
| F-1-38 | **Reopened:** the reproducible-build wording remains unchanged and unregistered. |
| F-1-39 | **Reopened:** the aggregate extension no-service claim remains unregistered. |

## Structure, links, accessibility, and identity

Confirmed on live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and an
unknown route:

- Titles follow the required route pattern and are below 60 characters.
- Every route has `lang="en"`, one H1, one main landmark, a description,
  canonical link, Open Graph and Twitter metadata, SVG favicon, and 180 px
  Apple icon.
- The social card is 1200 × 630. An unknown path returns HTTP 404 and the
  designed 404 page.
- Every intended internal link, ZIP download, and GitHub source link returned
  200. The unknown page's self-referential skip-link URL correctly retains the
  page's 404 status.
- Live Axe scans found no serious or critical findings at 390 px. Focus rings,
  reduced motion, touch targets, default-size mobile reflow, and console state
  passed the automated checks.
- Route focus, shared navigation, external-link labeling, and 200% text reflow
  fail as described above.
- The risograph collage, offset borders, registration marks, warm paper,
  ultramarine/persimmon inks, and Atkinson typography match
  `.factory/design.md`. The site does not resemble a generic SaaS template.

## Missed leverage

No AI feature is justified. This job is deterministic preference transfer;
model use would add privacy, cost, and failure modes without improving it.
Reading-card import/export already exists. Automatic cloud sync would conflict
with the brief's local-first storage unless offered as an explicit optional
feature, so no missed-leverage finding is added.

## Quality-gate evidence

- Clean clone: `/tmp/rst-review2-clean-6Rox3z`.
- All 16 exact claim commands: PASS.
- `npm run check`: PASS — content lint, typecheck, 10/10 unit tests, and build.
- `npm run test:package`: PASS — deterministic ZIP SHA-256
  `abd2b483ee6dd9d9dd40f2d0f0958e9a3c844910eccc7ef8f1faca361d21375a`.
- `npm run test:e2e`: PASS — 24/24 tests.
- `npm audit --omit=dev`: zero production vulnerabilities; the full audit is
  F-2-14.
- Live/local SHA-256 matches: landing
  `b61a7646138c858b6048312967f5015cf68edf431c94a2943ef67612617f7aa2`,
  demo `fba4e2ad26c2418ccd9e4e43be68159184e892740ff3ad56857ffeda00a27c9a`,
  and ZIP
  `abd2b483ee6dd9d9dd40f2d0f0958e9a3c844910eccc7ef8f1faca361d21375a`.

## What would make this perfect

Close every finding above and repeat the review from a clean context. The
minimum complete result has one shared header/footer, a primary demo transition
that focuses the H1, an exact keyboard claim test, no unregistered absolutes or
cross-browser promises, plain file/storage/install wording, and zero horizontal
overflow at 200% text. Then rerun all 16 claim commands, full unit/e2e/package
gates, live link/request/cookie checks, route metadata/focus checks, and both
default and 200% mobile reflow checks. A PASS requires no remaining item,
including the build-tool dependency advisories.
