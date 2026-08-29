# Adversarial first-read review 1 — Reader Setting Transfer

**Verdict: FAIL**

Reviewed commit `f010b53ee7aa2ce10c684e6e7f519bb7458c71aa` and the live site at
<https://reader-setting-transfer.sociobot.in/> on 2026-08-29 UTC. The review
found 1 blocking issue, 12 major issues, and 26 minor issues. A pass requires
zero findings and no untested claim.

## Cold first screen

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 before any
scrolling.

- What it does: carries a reader's text size, spacing, contrast, and motion
  choices into a simplified article view.
- For whom: low-vision readers who repeatedly adjust those choices on sites.
- What to click first: **Try it with sample data**.

The first screen passes this check. The exact copy that supplied the answers
was “Carry your reading settings into clean articles,” “For low-vision readers
tired of resetting text size, spacing, contrast, and motion on every site,”
and “Try it with sample data.” All three were visible without scrolling at
both sizes. Mobile horizontal overflow was 0 px.

## Findings

### Blocking

#### F-1-1 — The mobile demo does not show the sample article in its first screen

Location: `/demo/`, fresh 390 × 844 context after selecting **Try it with
sample data**. The viewport shows “Try your settings on a real article,” the
introductory sentence, and the beginning of the settings form. The article
heading “The city changes when you notice its trees” is below the fold.

Why this fails: the demo rule requires the first screen after one click to
show the product already being used with realistic sample data. A phone visitor
sees setup controls, not the promised reading result.

Concrete fix: put a compact, already-styled excerpt and its active sample-card
label above the controls on mobile, or use a split/preview layout that keeps
the first article heading and a paragraph within 844 px. Add a 390 × 844 claim
assertion that the sample article heading's bounding box is inside the initial
viewport.

### Major

#### F-1-2 — The dedicated responsive/keyboard claim test omits half its claim

Location: `.factory/claims.json`, `responsive-keyboard`; test
`e2e/site.spec.ts` tagged `@claim:responsive-keyboard`.

Exact claim: “The landing page and demo support keyboard use and a 390 px
viewport without page overflow.” The tagged test checks only `/`. A differently
tagged test happens to exercise part of `/demo/`, but running the declared
claim command does not prove the full declared claim.

Concrete fix: make the tagged test visit both `/` and `/demo/`, operate the
demo controls by keyboard, and assert no overflow on both routes; or split the
claim into two entries with one exact tagged test each.

#### F-1-3 — The landing page makes an unlisted general claim about other reader modes

Location: landing “How it works” introduction.

Exact quote: “Reader modes usually start from their defaults. This one starts
from yours—and tells you exactly what it changed.” No claim entry tests the
comparison with other reader modes or the completeness implied by “exactly.”

Concrete fix: replace it with “Your saved reading card sets the article view
and lists each active value,” then cover that observable result in
`reading-settings`.

#### F-1-4 — “Return instantly” is an unlisted speed claim

Location: landing step 03.

Exact quote: “See which profile is active, make quick adjustments, or turn the
reader off for that site and return instantly.” `per-site-off-return` confirms
navigation but has no time threshold.

Concrete fix: use “See the active reading card, adjust it, or turn the reader
off for that site and return to the original page.”

#### F-1-5 — “One click per article” is an unlisted quantitative claim

Location: landing install heading.

Exact quote: “Four steps, then one click per article.” No claim test counts the
clicks in the installed extension.

Concrete fix: change the heading to “Install the extension, then open it on
each article,” or add a clean MV3 test and claim entry that proves the click
count.

#### F-1-6 — The README makes an unlisted download-serving claim

Location: README introduction.

Exact quote: “The companion site serves the packaged extension from
`dist/site/downloads/`.” A browser test fetches the ZIP incidentally, but no
claim entry names this promise.

Concrete fix: list “The site provides the packaged extension ZIP” with a test
that checks the download response and archive, or label the path only as a
local build output.

#### F-1-7 — The README makes unlisted cache-duration claims in a 32-word sentence

Location: README “Run locally.”

Exact quote: “The static deploy root includes Azure Static Web Apps and
portable `_headers` policies: fingerprinted site assets and the downloadable
ZIP are immutable for one year, while HTML and the service worker revalidate.”

Why this fails: it exceeds 22 words, uses deployment jargon, and the live
cache-duration behavior has no claims entry.

Concrete fix: “Static assets and the ZIP use a one-year cache. HTML and the
service worker revalidate.” Add a claim test that checks the exact live or
production-server `Cache-Control` values.

#### F-1-8 — The README makes unlisted security-header claims

Location: README “Run locally.”

Exact quote: “They also set a self-only CSP and standard framing, referrer,
permissions, and MIME-sniffing protections.” The current checks observe some
headers, but `.factory/claims.json` has no matching entry.

Concrete fix: either remove this product-facing assertion or add a named claim
whose production-server test checks every promised header and directive.

#### F-1-9 — The activation-only permission claim is unlisted

Locations: README “Privacy and permissions” and `/privacy/` “Permissions.”

Exact quotes: “`activeTab` and `scripting` allow extraction from the page only
when the toolbar action is invoked” and “Active-tab access begins only when you
choose the extension on the current page.” Existing tests inspect manifest
permissions and extraction, but no claim entry proves the activation boundary.

Concrete fix: add an `activation-boundary` claim and an MV3 test showing that
no page data is read before the user invokes the extension, or narrow the copy
to the manifest permissions it can prove.

#### F-1-10 — Background-monitoring copy is an unlisted privacy claim

Location: `/privacy/`, “Permissions.”

Exact quote: “The extension does not monitor browsing in the background.” The
request test does not establish that no browsing data is observed or stored.

Concrete fix: add a clean-profile MV3 test that visits pages without invoking
the extension and asserts extension storage remains empty, then list the claim.

#### F-1-11 — The README's claim-completeness statement is false

Location: README “Privacy and permissions.”

Exact quote: “Every public product claim and its observable command is listed
in `.factory/claims.json`.” Findings F-1-3 through F-1-10 identify exceptions.

Concrete fix: remove this meta-claim. Keep the link as “Claim tests are listed
in `.factory/claims.json`” after the missing claims are registered or removed.

#### F-1-12 — Full-page route changes leave focus on `<body>`

Location: navigation from `/` to `/demo/`, `/privacy/`, and other routes.

Observed result: the destination loads at scroll position 0, but
`document.activeElement` is `<body>`, not the new H1. Browser Back correctly
restores the prior scroll position.

Concrete fix: on internal route arrival, focus a `tabindex="-1"` H1 when the
navigation originated inside the site, while preserving normal direct-load
behavior. Add a forward/back focus test.

#### F-1-13 — The landing-page skeleton does not show the product or a live preview after the hero

Location: landing page immediately after the first screen.

Observed result: a slogan strip and “How it works” copy appear before a static
reading-card illustration. The actual adjustable reader exists only on
`/demo/`.

Concrete fix: place an interactive sample preview, or a faithful read-only
reader preview with active values and realistic article text, directly after
the hero. Keep the three-step explanation after that preview.

### Minor

#### F-1-14 — The header action “Download” does not name its result

Location: header on `/`, `/demo/`, and other applicable routes.

Concrete fix: use “Download extension.”

#### F-1-15 — The promise strip uses decorative, inconsistent slogans

Location: landing strip.

Exact quotes: “Portable profile,” “Clean article view,” and “Local by
default.” “Profile” conflicts with “reading card,” and “local by default” does
not say what stays local.

Concrete fix: use “Export your reading card,” “Read a simplified article,” and
“Keep article data on this device.”

#### F-1-16 — The hero caption repeats a slogan instead of adding usable information

Location: landing hero figure.

Exact quote: “One reading card, carried into clean articles.”

Concrete fix: replace it with “The extension applies the same text and
contrast settings to each article,” or remove the caption.

#### F-1-17 — “A small tool for a real annoyance” is a mood label

Location: landing section eyebrow above “Tune once.”

Concrete fix: use “How the extension works.”

#### F-1-18 — “Tune once. Read without the setup ritual.” is a slogan and metaphor

Location: landing H2.

Concrete fix: use “Apply one reading card to every article.”

#### F-1-19 — “Stay in control” does not name the step

Location: landing step 03 heading.

Concrete fix: use “Adjust or turn off the reader.”

#### F-1-20 — “Open, inspectable, portable” is an adjective stack

Location: landing eyebrow above the reading-card section.

Concrete fix: use “Export and import your reading card.”

#### F-1-21 — “Your preferences aren’t a black box” is a metaphor

Location: landing reading-card H2.

Concrete fix: use “Review every saved reading setting.”

#### F-1-22 — The landing page introduces JSON jargon before explaining the result

Location: landing reading-card paragraph.

Exact quote: “The profile is a tiny JSON file you can export, read, and share.”

Concrete fix: use “Export your reading card as a text file and import it in
another browser.” Put “JSON” in a technical detail after the result.

#### F-1-23 — “Per-site off switch for imperfect extraction” uses implementation jargon

Location: landing reading-card list.

Concrete fix: use “Turn off the reader on a site if an article looks wrong.”

#### F-1-24 — “Privacy by construction” is an abstract slogan

Location: landing privacy eyebrow.

Concrete fix: use “What stays on your device.”

#### F-1-25 — The privacy heading uses a body-parts metaphor

Location: landing privacy H2.

Exact quote: “Reading history stays out of our hands.”

Concrete fix: use “The extension does not send us your reading history.”

#### F-1-26 — “Analytics SDK” is unexplained jargon for the intended reader

Location: landing privacy point.

Exact quote: “No account, analytics SDK, remote fonts, or article-processing
server.”

Concrete fix: use “No account, tracking, remote fonts, or server upload.”

#### F-1-27 — “Start for real” does not name the result

Location: persistent demo banner.

Observed behavior: the link downloads the extension ZIP.

Concrete fix: label it “Download the extension.”

#### F-1-28 — The 404 H1 and eyebrow are metaphors

Location: `/404.html` and unknown routes.

Exact quotes: “Misregistered page · 404” and “This page slipped out of frame.”

Concrete fix: use “Error 404” and “Page not found.” Keep the risograph visual
treatment in the art rather than the required heading.

#### F-1-29 — The same saved object has several names

Locations: landing and README.

Exact terms: “reading settings,” “reading card,” “profile,” “portable profile,”
and “versioned, portable accessibility profile.” The controls also alternate
between “text size” and “text scale.”

Concrete fix: call the saved object “reading card” everywhere and the control
“text size.” Reserve “profile” only for a documented schema name, if needed.

#### F-1-30 — A README sentence exceeds the 22-word cap

Location: README introduction; 24 words.

Exact quote: “Choose the extension on a public article to open a clean reader
that applies those settings and clearly shows the active profile and site.”

Concrete fix: “Choose the extension on a public article. The reader applies
your card and shows the active site.”

#### F-1-31 — “Semantic article text” is unexplained jargon

Location: README “What v1 does.”

Exact quote: “Extracts semantic article text only after the user chooses the
toolbar action.”

Concrete fix: use “Extracts article headings and text only after you select
the extension.”

#### F-1-32 — “Versioned, portable accessibility profile” is unexplained jargon

Location: README “What v1 does.”

Exact quote: “Applies a versioned, portable accessibility profile inside the
reader only.”

Concrete fix: use “Applies your saved reading card only inside the reader.”

#### F-1-33 — “Manifest V3” is unexplained landing-page jargon

Location: landing install note.

Exact quote: “Version 1.0 · Manifest V3 · Free and open source.”

Concrete fix: keep “Version 1.0 · Free and open source” on the landing page and
move Manifest V3 to the README's developer details.

#### F-1-34 — The footer one-liner uses subjective copy

Location: every public route.

Exact quote: “Carry comfortable reading settings into clean articles.”

Concrete fix: use “Apply one reading card to simplified web articles.”

#### F-1-35 — Header and footer navigation is not consistent across routes

Location: all public routes.

Observed result: the landing header has Demo, How it works, Privacy, and
Download; the demo header has Product, Privacy, and Download; legal pages have
Product, Demo, and the opposite legal page. Privacy's footer omits Privacy;
Terms' footer omits Terms; legal and demo footers omit the footer wordmark.

Concrete fix: use one header set on every route and one footer containing the
wordmark, product one-liner, Privacy, Terms, source attribution, and version.

#### F-1-36 — The external Source link is not identified as external

Location: landing and demo footers.

Concrete fix: label it “Source on GitHub (external)” or add equivalent
accessible text and a visible external-link cue.

#### F-1-37 — The README repeats “inspectable JSON” jargon

Location: README introduction.

Exact quote: “Profiles can be exported as inspectable JSON and imported on
another browser.”

Concrete fix: use “Export a reading card as a text file and import it in
another browser.”

#### F-1-38 — The reproducible-build assertion is not in the claim registry

Location: README “Run locally.”

Exact quote: “The reproducible production command is exactly:” followed by
`npm run build`.

Concrete fix: either say “Build the production files with `npm run build`” or
register a reproducible-build claim that compares two clean build hashes.

#### F-1-39 — Absolute no-account/service copy lacks one matching extension claim

Locations: landing reading-card and privacy sections; README privacy section.

Exact quotes include “needs no cloud account,” “No account, analytics SDK,
remote fonts, or article-processing server,” and “The extension has no
analytics, account, remote API, or broad host permission.” Existing claims
separately cover local storage, requests, and the static site, but no single
extension claim names and tests all these absolutes.

Concrete fix: add an `extension-no-remote-services` entry with dependency,
manifest, request, cookie, and storage assertions, or narrow each sentence to
the already-tested “The extension makes no remote requests.”

## Complete copy audit

Counts use visible whitespace-separated words, treat hyphenated terms as one
word, and do not count punctuation-only symbols. “Flag” points to the finding
that contains the proposed rewrite.

### Landing-page sentences

| Words | Sentence | Flag |
| ---: | --- | --- |
| 2 | You’re offline. | — |
| 10 | The page still works; the extension download needs a connection. | — |
| 7 | Carry your reading settings into clean articles. | — |
| 15 | For low-vision readers tired of resetting text size, spacing, contrast, and motion on every site. | — |
| 6 | Opens a ready sample article. | — |
| 7 | Nothing is saved to your real data. | — |
| 4 | Free and open source. | — |
| 5 | Profiles stay on your device. | F-1-29 |
| 8 | The demo reloads offline after your first visit. | — |
| 7 | One reading card, carried into clean articles. | F-1-16 |
| 2 | Tune once. | F-1-18 |
| 5 | Read without the setup ritual. | F-1-18 |
| 7 | Reader modes usually start from their defaults. | F-1-3 |
| 12 | This one starts from yours—and tells you exactly what it changed. | F-1-3 |
| 16 | Choose text scale, line length, spacing, letter shapes, contrast, and reduced motion. | F-1-29 |
| 7 | See every change in a live preview. | — |
| 8 | Select the extension on a public article. | — |
| 12 | It keeps headings, lists, quotes, tables, and links—without the surrounding clutter. | — |
| 18 | See which profile is active, make quick adjustments, or turn the reader off for that site and return instantly. | F-1-4, F-1-29 |
| 6 | Your preferences aren’t a black box. | F-1-21 |
| 13 | The profile is a tiny JSON file you can export, read, and share. | F-1-22, F-1-29 |
| 11 | It contains settings—not browsing history—and needs no cloud account. | F-1-39 |
| 7 | Reading history stays out of our hands. | F-1-25 |
| 12 | Your profile, site overrides, and current article stay in browser extension storage. | F-1-29 |
| 9 | No account, analytics SDK, remote fonts, or article-processing server. | F-1-26, F-1-39 |
| 10 | Remove the extension and its local data leaves with it. | — |
| 7 | Four steps, then one click per article. | F-1-5 |
| 6 | Download and unzip the extension package. | — |
| 6 | Open `chrome://extensions` in Chrome or Chromium. | — |
| 12 | Turn on Developer mode, choose “Load unpacked”, and select the unzipped folder. | — |
| 11 | Pin Reader Setting Transfer and open it on a public article. | — |
| 4 | Free and open source. | — |
| 11 | Refuses clearly marked paywalls and does not restyle source pages. | — |
| 7 | Carry comfortable reading settings into clean articles. | F-1-34 |
| 6 | Built by Param Factory · Version 1.0. | — |
| 10 | Original hero artwork was generated with the factory image model. | — |

### Landing headings, labels, and actions

| Words | Copy | Kind | Flag |
| ---: | --- | --- | --- |
| 5 | Free browser extension · Chrome | Eyebrow | — |
| 7 | Carry your reading settings into clean articles. | H1 | — |
| 5 | Try it with sample data | Primary action | — |
| 1 | Download | Header action | F-1-14 |
| 4 | Download the extension package | Link action | — |
| 2 | Portable profile | Promise label | F-1-15, F-1-29 |
| 3 | Clean article view | Promise label | F-1-15 |
| 3 | Local by default | Promise label | F-1-15 |
| 7 | A small tool for a real annoyance | Eyebrow | F-1-17 |
| 7 | Tune once. Read without the setup ritual. | H2 | F-1-18 |
| 4 | Make your reading card | H3 | — |
| 4 | Open a public article | H3 | — |
| 3 | Stay in control | H3 | F-1-19 |
| 3 | Open, inspectable, portable | Eyebrow | F-1-20 |
| 6 | Your preferences aren’t a black box. | H2 | F-1-21 |
| 3 | Privacy by construction | Eyebrow | F-1-24 |
| 7 | Reading history stays out of our hands. | H2 | F-1-25 |
| 2 | Stored locally | Point heading | — |
| 2 | Sent nowhere | Point heading | — |
| 3 | Easy to clear | Point heading | — |
| 4 | Install the v1 package | Eyebrow | — |
| 7 | Four steps, then one click per article. | H2 | F-1-5 |
| 2 | Download extension | Primary action | — |

The demo action **Start for real** (3 words) is separately flagged by F-1-27.
The 404 eyebrow and H1 are separately flagged by F-1-28.

### README copy

| Words | Sentence, heading, or list item | Flag |
| ---: | --- | --- |
| 3 | Reader Setting Transfer | — |
| 20 | Reader Setting Transfer is a free, open-source Chrome/Chromium extension for low-vision readers who want the same settings in clean articles. | F-1-29 |
| 20 | Create one portable reading card for text size, line length, line and paragraph spacing, contrast, letter shapes, and reduced motion. | — |
| 24 | Choose the extension on a public article to open a clean reader that applies those settings and clearly shows the active profile and site. | F-1-30 |
| 12 | Profiles can be exported as inspectable JSON and imported on another browser. | F-1-29, F-1-37 |
| 6 | Try the shipped sample at `https://reader-setting-transfer.sociobot.in/demo/`. | — |
| 13 | It uses a separate `demo:` session namespace and never reads real browsing data. | — |
| 12 | After the first visit, the service worker can reload the demo offline. | — |
| 9 | The companion site serves the packaged extension from `dist/site/downloads/`. | F-1-6 |
| 3 | What v1 does | — |
| 12 | Extracts semantic article text only after the user chooses the toolbar action | F-1-31 |
| 10 | Preserves headings, paragraphs, lists, quotes, code, tables, and safe links | — |
| 10 | Applies a versioned, portable accessibility profile inside the reader only | F-1-29, F-1-32 |
| 9 | Provides live settings preview and quick reader text-size/contrast changes | — |
| 9 | Stores the current article, profile, and per-site choices locally | F-1-29 |
| 13 | Turns the reader off per site and returns immediately to the original page | — |
| 13 | Supports keyboard use and 390 px layouts on the landing page and demo | F-1-2 |
| 15 | It refuses clearly marked paywalls and opens a separate reader without changing the source page. | — |
| 2 | Run locally | — |
| 5 | Requirements: Node.js 20+ and `zip`. | — |
| 6 | The reproducible production command is exactly: | F-1-38 |
| 32 | The static deploy root includes Azure Static Web Apps and portable `_headers` policies: fingerprinted site assets and the downloadable ZIP are immutable for one year, while HTML and the service worker revalidate. | F-1-7 |
| 14 | They also set a self-only CSP and standard framing, referrer, permissions, and MIME-sniffing protections. | F-1-8 |
| 1 | Outputs: | — |
| 5 | `.output/chrome-mv3/` — unpacked MV3 extension | — |
| 5 | `dist/site/index.html` — static deploy root | — |
| 4 | `dist/site/downloads/reader-setting-transfer-chrome.zip` — installable package | — |
| 4 | Install the development build | — |
| 4 | Run `npm run build`. | — |
| 2 | Open `chrome://extensions`. | — |
| 3 | Enable Developer mode. | — |
| 6 | Choose **Load unpacked** and select `.output/chrome-mv3`. | — |
| 12 | Pin Reader Setting Transfer, open a public article, and choose the extension. | — |
| 3 | Privacy and permissions | — |
| 12 | The extension has no analytics, account, remote API, or broad host permission. | F-1-39 |
| 15 | `activeTab` and `scripting` allow extraction from the page only when the toolbar action is invoked. | F-1-9 |
| 13 | `storage` keeps the reading card, current article, and site choices on the device. | — |
| 7 | Removing the extension removes that browser-managed data. | — |
| 7 | See the published privacy policy and terms. | — |
| 12 | Every public product claim and its observable command is listed in `.factory/claims.json`. | F-1-11 |
| 7 | The sample sandbox design is in `.factory/demo.md`. | — |
| 2 | Project notes | — |
| 6 | Visual direction and generated-art provenance: `.factory/design.md` | — |
| 5 | Build and verification handoff: `.factory/handoff.md` | — |
| 2 | License: MIT | — |

No banned plain-words term appears. The two hard-cap failures are the 24-word
introductory sentence and the 32-word deployment sentence.

## Demo and sandbox verification

- One-click entry from the hero: present and working.
- Direct `/demo/` and `/?demo=1`: present and working.
- Persistent banner: “Demo — sample data, nothing is saved,” with **Reset
  demo** and **Start for real**.
- Realistic sample: a “Quiet evening” reading card and a field-note article
  about city trees.
- Reset: changing text size to 155% and selecting **Reset demo** restored 120%,
  announced “Demo reset to the sample reading card,” and focused the article.
- Isolation: a pre-seeded `real:sentinel=keep-me` local-storage value remained
  unchanged. Demo changes wrote only `demo:reader-profile` in session storage.
- Requests: all requests during landing-to-demo use were to
  `reader-setting-transfer.sociobot.in`; no console or page errors occurred.
- Defect: F-1-1; the article itself is not visible in the initial mobile
  viewport.

## Claim-test results

Every exact command in `.factory/claims.json` was run from clean clone
`/tmp/rst-review-dwkssT` after `npm ci`.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `reading-settings` | PASS | Settings changed rendered style and Reset restored defaults. |
| `profile-json-transfer` | PASS | Exported JSON parsed; imported values changed the article. |
| `demo-isolation` | PASS | Only `demo:` session storage and first-party requests. |
| `offline-reload` | PASS | Demo reloaded under offline browser context. |
| `offline-landing` | PASS | Landing reloaded offline and showed its notice. |
| `site-no-tracking` | PASS | Public routes used one origin, no `Set-Cookie`, empty cookie jar. |
| `extension-local-reader` | PASS | MV3 storage/rendering worked with no HTTP requests. |
| `per-site-off-return` | PASS | Site override was saved and original URL opened. |
| `article-structure` | PASS | Kept tested structures and removed active code. |
| `free-open-source` | PASS | MIT license and no payment SDK dependency. |
| `responsive-keyboard` | PASS command; incomplete claim | See F-1-2. |
| `extension-uninstall-data` | PASS | Reinstall in the same profile had empty extension storage. |
| `access-boundaries` | PASS | Marked paywalls refused; source DOM unchanged. |

Each ID appears exactly once as an `@claim:<id>` tag. No listed command failed.
Unlisted and incompletely scoped claims remain in F-1-2 through F-1-11,
F-1-38, and F-1-39.

## History audit

No earlier `.factory/review-*.md` or `.factory/polish-*.md` file exists. The
existing handoff records four repair areas; each was checked rather than
accepted from its status text.

| Earlier repair | Live/code confirmation |
| --- | --- |
| Reduced-motion control changes computed motion | Confirmed by `@claim:reading-settings`; full suite passes. |
| Fresh reader has one visible H1, focusable main, and inert unavailable controls | Confirmed by the fresh-reader MV3 test in the full suite. |
| Landing offline and public no-tracking claims have clean-context tests | Both exact claim commands pass; live request log is same-origin only. |
| Demo reset documentation matches storage behavior | Confirmed in `site/demo/main.ts`, `.factory/demo.md`, and the live reset/storage check. |

None of those earlier repairs regressed.

## Structure, links, accessibility, and identity

Verified on `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and an unknown
route:

- Titles follow the route patterns and remain under 60 characters.
- Each page has `lang="en"`, one H1, a main landmark, meta description,
  canonical URL, Open Graph/Twitter metadata, SVG favicon, and 180 px Apple
  icon.
- The social image is 1200 × 630. The unknown route returns HTTP 404 and the
  designed page. Deep links load directly.
- Browser Back restores the previous scroll position.
- Every crawled internal link, download, and GitHub source link returned 200.
- Live desktop and mobile Axe scans reported zero violations on all five
  public pages. The factory URL verifier reported no console errors, missing
  alt text, unlabeled buttons, title/lang/main defects, or duplicate H1s.
- The risograph palette, offset borders, typography, original collage, and
  registration marks are distinct and match `.factory/design.md`; this is not
  a generic SaaS template.
- Outstanding structure defects are F-1-12, F-1-13, F-1-28, F-1-35, and
  F-1-36.

## Missed leverage

No new AI feature is justified. The job is deterministic preference transfer;
AI would add privacy, cost, and reliability burdens without improving that
job. Import/export already exists, and automatic cloud sync would conflict
with the local-first brief. No missed-leverage finding is added.

## Quality-gate evidence

- `npm run check`: PASS — lint, typecheck, 10/10 unit tests, and production
  build.
- `npm run test:e2e`: PASS — 21/21.
- `npm run test:package`: PASS — deterministic ZIP SHA-256
  `2d5c1423e1daa4a3433999bae7ac2514c24464590d1e0a79780320a5445c0d2b`.
- Build output: site JS 1.60 kB + 4.69 kB raw; gzip 0.76 kB + 1.71 kB.
- Live URL verifier: PASS on `/`, `/demo/`, `/privacy/`, and `/terms/`.
- Live Axe: zero violations at 390 × 844 and 1440 × 900 on all public routes.

## What would make this perfect

Resolve every finding above, then repeat the review cold. The decisive change
is to make the realistic article result visible in the first mobile demo
viewport. After that, remove or register every untested claim, replace every
flagged slogan/metaphor/jargon phrase with the proposed plain copy, use one
term for the reading card, restore route focus, make navigation consistent,
and rerun the claim commands, full suite, request log, link crawl, Axe scan,
and both cold viewport checks. Nothing remains optional for a PASS.
