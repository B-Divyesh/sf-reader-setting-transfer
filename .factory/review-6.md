# Apply reading settings to web articles — review 6

**Verdict: PASS.** Finding count: **0**. Untested claim count: **0**.

Reviewed on 2026-09-06 at
<https://reader-setting-transfer.sociobot.in>.

- Implementation reviewed: `200302166add95c82a4a8d8c90f5450fa7f4c989`.
- Documentation baseline: `2afb85bedbaa30d249f15d6c9db0fdddb30dbe9c`.
- The three commits after the implementation change only reports, handoff
  text, and review evidence. They do not change the product.
- Clean checkout: `/tmp/rst-review6-clean-UJ2bFN`.
- Product code was not changed during this review.

## First screen

I opened the live page in separate fresh Chromium contexts at 390 × 844 and
1440 × 900. Neither context had scrolled.

- Job: apply one saved reading card to supported web articles.
- Audience: low-vision readers who want the same text size, spacing, contrast,
  and motion choices on each article.
- First action: **Try it with sample data**.

The exact heading was “Apply your reading card to web articles.” The audience
sentence and first action were visible in both viewports. The action note said
that the sample opens as a styled article and stays separate from extension
data. The page used plain words and gave three facts about price, local
storage, and offline use before scrolling.

## Findings

None. There are no critical, high, medium, low, or minor findings.

## Sample and recovery paths

The first-screen action opened `/demo/` in one click. The initial screen
already contained the named “Quiet evening” reading card, the city-trees
article heading, its first paragraph, controls, and the persistent label
“Demo — sample data, nothing is saved.” The label remained visible at the top
after scrolling. It included **Reset demo** and **Download the extension**.

A real-data sentinel placed in `localStorage` remained unchanged throughout
the sample flow. A changed sample used only
`sessionStorage["demo:reader-profile"]`. Invalid JSON produced “This file is
not valid JSON. Check the file, then try again.” A valid boundary card then
recovered successfully with 180% text, 40-character measure, 2.2 line
spacing, 2.5 paragraph spacing, 0.08 letter spacing, dark contrast, spacious
letter shapes, and motion enabled. Reset restored the complete shipped sample
card and its 120% text setting without changing the sentinel.

The complete browser suite also covered empty extension state, inactive
controls, lower and upper values, malformed imports, import recovery, public
article extraction, safe links, visible and CSS-hidden access markers, long
code, per-site disable and re-enable, uninstall cleanup, and passive browsing.

## Declared claims

After `npm ci`, every exact `test` command in `.factory/claims.json` was run
separately from the clean checkout. Every command passed on its first measured
invocation.

| Claim | Result |
| --- | --- |
| `reading-settings` | PASS |
| `reading-card-json-transfer` | PASS |
| `demo-isolation` | PASS |
| `offline-reload` | PASS |
| `offline-landing` | PASS |
| `site-no-tracking` | PASS |
| `extension-local-reader` | PASS |
| `per-site-off-return` | PASS |
| `article-structure` | PASS |
| `code-preservation` | PASS |
| `free-open-source` | PASS |
| `responsive-keyboard` | PASS |
| `demo-first-screen` | PASS |
| `extension-uninstall-data` | PASS |
| `access-boundaries` | PASS |
| `extension-download` | PASS |
| `activation-boundary` | PASS |
| `no-background-monitoring` | PASS |
| `extension-reading-settings` | PASS |
| `extension-open-article` | PASS |
| `extension-reading-card-transfer` | PASS |
| `extension-no-remote-requests` | PASS |
| `site-choice-reenable` | PASS |

`npm run lint` confirmed five routes, 23 registered claims, and one matching
test tag for each claim. I also read the current landing, legal, demo, and
README copy. No reliance-worthy public claim is missing from the registry and
no registered claim is incomplete or untested. The existing copy audit still
matches the unchanged product copy: no sentence exceeds 22 words and no
banned marketing word, metaphor heading, or inconsistent product term is
present.

The preliminary live helper invocation before installing dependencies failed
with a missing `@playwright/test` package. No claim command was run at that
point. After the documented `npm ci`, every claim command and runtime command
above passed. This is not a clean-setup claim failure.

## Earlier review findings

Every earlier `review-*.md`, `verification*.md`, and `polish-*.md` was read.
The current product source is unchanged since the repair that closed the last
implementation findings. The following checks prove the current disposition
of each adversarial-review finding.

| Earlier finding | Current disposition and evidence |
| --- | --- |
| F-1-1 | Closed. The article heading and first paragraph begin in both required demo viewports. |
| F-1-2 | Closed. The 390 px keyboard test operates landing and demo controls. |
| F-1-3 | Closed. Preview copy names only displayed values. |
| F-1-4 | Closed. No speed promise remains; the return path is tested. |
| F-1-5 | Closed. No untested click-count promise remains. |
| F-1-6 | Closed. The ZIP download is registered and validated. |
| F-1-7 | Closed. No cache-duration marketing claim remains. |
| F-1-8 | Closed. No security-header marketing claim remains. |
| F-1-9 | Closed. Activation-only reading is registered and tested. |
| F-1-10 | Closed. Passive browsing leaves extension storage empty. |
| F-1-11 | Closed. README links to the claim registry without overstating it. |
| F-1-12 | Closed. Primary, forward, and Back navigation focus and announce the destination H1. |
| F-1-13 | Closed. The product preview appears before “How it works.” |
| F-1-14 | Closed. Download actions name the extension. |
| F-1-15 | Closed. The facts strip names concrete results. |
| F-1-16 | Closed. The caption is factual and has at least 4.5:1 contrast. |
| F-1-17 | Closed. The section names the product function. |
| F-1-18 | Closed. The setup slogan is absent. |
| F-1-19 | Closed. Step three says to adjust or turn off the reader. |
| F-1-20 | Closed. The export and import section names its job. |
| F-1-21 | Closed. The black-box metaphor is absent. |
| F-1-22 | Closed. The file result is explained before JSON. |
| F-1-23 | Closed. Per-site copy uses reader-facing words. |
| F-1-24 | Closed. The privacy heading names device storage. |
| F-1-25 | Closed. Reading-history behavior is explicit. |
| F-1-26 | Closed. Analytics-SDK jargon is absent. |
| F-1-27 | Closed. The demo exit names the extension download. |
| F-1-28 | Closed. The designed 404 says “Error 404” and “Page not found.” |
| F-1-29 | Closed. The saved object is consistently called a reading card. |
| F-1-30 | Closed. README has no sentence over 22 words. |
| F-1-31 | Closed. README names article headings and text. |
| F-1-32 | Closed. README uses “saved reading card.” |
| F-1-33 | Closed. MV3 jargon is absent from public marketing. |
| F-1-34 | Closed. Every footer has the same factual one-line description. |
| F-1-35 | Closed. All five routes share the header and footer. |
| F-1-36 | Closed. The GitHub link visibly says “external.” |
| F-1-37 | Closed. README explains the text file before JSON. |
| F-1-38 | Closed. No unlisted reproducible-build claim remains. |
| F-1-39 | Closed. Broad service copy was replaced by specific tested privacy claims. |
| F-2-1 | Closed. Every public route has 0 px overflow at 200% text. |
| F-2-2 | Closed. Copy limits use to supported public articles. |
| F-2-3 | Closed. No cross-browser promise remains; transfer uses clean Chromium sessions. |
| F-2-4 | Closed. Every reading-card field is asserted in the packaged reader. |
| F-2-5 | Closed. Compatibility language is Chromium-specific. |
| F-2-6 | Closed. Privacy copy distinguishes local data from infrastructure logs. |
| F-2-7 | Closed. The action note and all three facts fit the desktop first screen. |
| F-2-8 | Closed. README says temporary browser session. |
| F-2-9 | Closed. Unmeasured speed wording is absent. |
| F-2-10 | Closed. “Delete local data” names the result. |
| F-2-11 | Closed. “No article upload” names the boundary. |
| F-2-12 | Closed. Install copy says Chromium extension. |
| F-2-13 | Closed. README describes lint and typecheck correctly. |
| F-2-14 | Closed. Both current dependency audits report zero vulnerabilities. |
| F-3-1 | Closed. The first clean run opened a local public article through the packaged popup and reader. |
| F-3-2 | Closed. The caption uses an opaque high-contrast surface. |
| F-3-3 | Closed. Preview copy is limited to type, spacing, and contrast. |
| F-3-4 | Closed. Two clean packaged-extension profiles prove card transfer. |
| F-3-5 | Closed. The article flow asserts the active site. |
| F-3-6 | Closed. Offline copy promises only cached-page behavior. |
| F-3-7 | Closed. Every mobile navigation destination remains visible and keyboard-operable. |
| F-3-8 | Closed. A clipped polite live region announces route changes without entering layout. |
| F-4-1 | Closed. Settings explain and test re-enabling a disabled site. |
| F-4-2 | Closed. Local-data copy names deletion directly. |

## Earlier verification findings

| Earlier report | Findings checked | Current proof |
| --- | --- | --- |
| Verification 1 | Broken clean `npm test`; extension navigation race; inaccessible mobile scroll region; short asset cache; non-deterministic ZIP; missing response headers. | Clean tests and 37 browser tests pass; mobile Axe is clean; hashed assets are immutable; the package is deterministic; required headers are live. |
| Verification 2 | Missing claims and demo; audience absent; dark-preview contrast; missing 404 and metadata. | The 23-claim registry passes; both first screens name the audience and sample; dark-treatment test passes; all route metadata and designed 404 checks pass. |
| Verification 3 | Claim commands required a prior build; incomplete card transfer; dark reader contrast; two H1s; 390 px overflow and touch target; parser jargon; unlisted site-off claim. | Every claim command starts clean; the full boundary card round-trips; dark Axe is clean; the reader empty-state test, 390 px tests, plain invalid-file message, and registered site-off test pass. |
| Verification 4 | Default parallel E2E timeout. | The normal two-worker command passed 37/37 in 49.4 seconds. |
| Verification 5 | Unlisted uninstall and access-boundary claims. | Both claims are registered and passed. |
| Verification 6 | Empty reader leaked controls and threw; demo-banner focus contrast was 2.73:1. | The fresh-reader empty-state test keeps controls inert with no error; the focused banner controls pass the 3:1 test. |
| Verification 7 | Demo reduced-motion setting had no effect; empty reader heading, skip, and return paths failed; site privacy and landing offline claims were unlisted; reset documentation was false. | Motion on/off computed-style assertions pass; the empty reader has a usable H1 and inert article controls; both public claims pass; reset leaves the documented sample value in the demo namespace. |
| Verification 11 | CSS-hidden paywall ancestors blocked public pages; the article-open claim bypassed the popup. | Real Chromium accepts direct and inherited hidden remnants; the tagged claim opens the packaged popup, clicks **Read this article**, and reaches the reader. |
| Verification 13 | Hidden-marker order missed a visible paywall; long code broke the 390 px reader and Axe; code preservation was unlisted; stable ZIP cached immutable; documented dark treatment absent. | Both marker orders are tested; the code claim proves local keyboard scrolling, no page overflow, and clean Axe; the claim is registered; ZIP revalidates; dark treatment and contrast tests pass. |
| Verifications 8, 9, 10, 12, and 14 | No findings were reported. | The current full run and live artifact comparison independently remain green. |

## Accessibility, routes, privacy, and offline behavior

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each have `lang=en`,
  one H1, one main landmark, a route title, description, canonical link,
  social metadata, alt text, skip link, shared navigation, and legal links.
- The supplied `verify-url.sh` passed all five published pages with no console
  or page errors. The Playwright Axe integration found zero serious or
  critical issues on every public route and the exercised extension states.
- Keyboard tests cover Tab, Enter, Space, arrow keys, focus indicators, skip
  links, sliders, select controls, file import, reset, route focus, and Back.
  Touch targets are at least 44 px. All routes reflow without horizontal
  scrolling at 200% text.
- The reduced-motion site treatment and the reading-card motion setting both
  have computed-style tests. The light and dark treatments have contrast
  tests.
- All 13 discovered links returned non-error responses. An unknown URL
  deliberately returned HTTP 404 with the designed “Page not found” page;
  this expected status is not a defect.
- Requests across the public routes stayed on the product origin. No cookie
  was set. The demo did not touch seeded real data. The privacy page explains
  local storage, infrastructure logs, deletion, and its contact path.
- The service worker completed its update check. The landing and demo both
  reloaded after their first visit while the browser context was offline.
- The extension is local and the companion site is static. There is no
  backend, account, tenant, server-side state, or product API, so SQLite,
  restart persistence, health, tenant-isolation, and 429/`Retry-After` checks
  do not apply.

## Built extension and live identity

The full suite loaded the built MV3 extension into clean Chromium profiles and
exercised its options, popup, reader, storage, import/export, page extraction,
site-choice, removal, and no-background-access paths. The downloaded ZIP is a
valid package and its bytes equal the clean build.

| Artifact | Clean build and live SHA-256 |
| --- | --- |
| `/index.html` | `7c563096a0ba317d2d3c92e38c1cb3851685aa05477b4745b3f2e58c480b7fe8` |
| `/demo/index.html` | `404737681287cc4f2ff38a21d5744b2bf42b23d905220f2a53803efc41c7dcab` |
| `/privacy/index.html` | `9e5419cbf2b204c7e819f4dd973fc6d6546d787d436d3bbfb567c21fc7fdbbb7` |
| `/terms/index.html` | `fc43559896fd13c2ed6e27c50aca5e8ca92e77ce0ef46fdab9029e2ad11eb947` |
| `/404.html` | `c43decd34db30a0cec7f8ec35e2e8d11d28a7add8fc0d68f403453266846687d` |
| Extension ZIP | `6397759ce375d71b80bd87927acb1dbc50d9f496dd9ab0acd68fb252c24c2fbd` |

HTML and the stable ZIP use `public, max-age=0, must-revalidate`; `/sw.js` uses
`no-cache`; fingerprinted assets use long immutable caching. Live response
headers include CSP with `frame-ancestors 'none'`, HSTS, Permissions-Policy,
Referrer-Policy, `nosniff`, and `DENY` framing.

## Quality and performance results

- `npm ci`: PASS; 269 packages installed and 0 vulnerabilities.
- `npm run check`: PASS; lint, typecheck, 12 unit tests, and production build.
- `npm run test:package`: PASS; valid deterministic ZIP.
- `npm run test:e2e`: PASS; 37/37 tests in 49.4 seconds.
- `npm audit --omit=dev`: PASS; 0 vulnerabilities.
- `npm audit`: PASS; 0 vulnerabilities.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.05 s, LCP 1.35 s, TBT 0 ms, CLS 0.040, total transfer
  94,873 bytes.
- Initial landing JS: 2,567 bytes raw and 1,164 bytes gzip. CSS: 20,544 bytes
  raw and 5,081 bytes gzip. Mobile hero WebP: 48,954 bytes.

## Missed feature check

No obvious missing feature remains. File export and import provide the useful
transfer step implied by the brief. A cloud-sync or AI path would add an
unneeded data path to a deterministic, local-first accessibility tool.

## Decision

**PASS.** The live product matches the reviewed implementation, all 23 public
claims are tested and pass, and no finding remains at any severity.
