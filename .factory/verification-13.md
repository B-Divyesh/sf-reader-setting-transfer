# Reader Setting Transfer — independent verification 13

## Verdict: FAIL

Candidate `ba6956cf7dd7896aa5c8137bb3945e19e3c34098` was tested on
2026-08-29 against <https://reader-setting-transfer.sociobot.in/>. The live
site is the candidate build, the mandatory first-read gate passes, and all 22
declared claim commands pass. The release still fails because broader
acceptance testing found two product defects, including an access-control
boundary failure, plus an unlisted claim.

No product code was changed during this verification.

## Release-blocking findings

### P1 — a visible paywall is missed when a hidden marker comes first

`lib/article.ts:27` uses `document.querySelector(...)`, then checks only that
one matched marker. On a page with an old hidden marker before a current
visible marker, the first marker is accepted as hidden and the visible access
barrier is never examined.

Fresh real-Chromium reproduction using the exact exported
`extractArticleFromPage` function:

| Fixture | Result | Source changed |
| --- | --- | --- |
| visible paywall only | refused with the intended access message | no |
| hidden paywall, then visible paywall | **extracted 982 characters** | no |
| visible paywall, then hidden paywall | refused with the intended access message | no |

This falsifies `@claim:access-boundaries` for a representative boundary case
and violates the brief's explicit non-goal, “Do not bypass access controls.”
The declared claim test passes only because it tests one visible marker and
one hidden marker in separate documents.

Required repair: inspect every matching access marker and refuse extraction
when any marker is visible. Add the mixed hidden/visible ordering cases to the
registered claim test.

### P1 — preserved code breaks the 390 px reader and creates a serious axe finding

The actual packaged ZIP was installed in a clean Chromium profile. At a
390×844 viewport, with the supported maximum card values (180% text, 40
characters, 2.2 line height, 2.5 paragraph spacing, 0.08 letter spacing), a
stored article containing one long `<pre>` line produced:

- document `clientWidth`: 390 px
- document `scrollWidth`: 989 px
- page-level horizontal overflow: **599 px**
- axe serious finding: `scrollable-region-focusable`

Control cases containing normal prose, one unbroken prose word, or a table
each produced 0 px overflow. The `<pre>` case alone expands the reader grid.
`entrypoints/reader/style.css:37` gives `<pre>` horizontal overflow, but the
grid items lack the minimum-width constraint needed to keep that scroll local.

This violates the mobile, text-resize, keyboard, and serious/critical axe
acceptance requirements for content the extension says it preserves.

Required repair: keep the reader rail/article grid items within the viewport
(for example with appropriate `min-width: 0` constraints), make the code
region keyboard-focusable when it scrolls, and add a 390 px maximum-settings
reader regression using a long code line.

### P1 contract gap — “preserves code” is an unlisted and unasserted claim

`README.md:23` says the extension preserves code. No entry in
`.factory/claims.json` names code preservation, and
`@claim:article-structure` does not put a `<pre>`/`<code>` fixture through the
reader or assert its result. The existing content lint checks tag occurrence,
not whether every claim-like sentence is listed and proved.

The claims contract makes any unlisted claim release-blocking. Register this
claim and test its observable desktop and narrow-reader result, or remove it.

## Other findings

### P2 — an unversioned extension download is cached immutable for one year

The public link is always
`/downloads/reader-setting-transfer-chrome.zip`, while
`site/public/staticwebapp.config.json:24` returns
`Cache-Control: public, max-age=31536000, immutable`. The live response confirms
that header. A returning browser may reuse an old extension for a year after a
new build is published at the same URL.

Use a versioned/content-hashed download URL, or require revalidation for the
stable filename. Immutable caching remains correct for fingerprinted assets.

### P3 — the public site omits the documented dark treatment

`.factory/design.md` specifies light and dark palette tokens, but
`site/style.css:2` fixes `color-scheme: light` and contains no dark treatment.
The extension surfaces do support system dark colors, and the light site has
passing contrast. Either implement the documented site treatment or explicitly
record a single-mode site thesis.

## Mandatory opening gates

### Claim tests

`.factory/claims.json` exists with 22 unique entries. After `npm ci`, every
listed command was invoked independently from this clean checkout. All passed:

| Claim | Exact result |
| --- | --- |
| `reading-settings` | 1 passed |
| `reading-card-json-transfer` | 1 passed |
| `demo-isolation` | 1 passed |
| `offline-reload` | 1 passed |
| `offline-landing` | 1 passed |
| `site-no-tracking` | 1 passed |
| `extension-local-reader` | 1 passed |
| `per-site-off-return` | 1 passed |
| `article-structure` | 1 passed; 10 skipped by name filter |
| `free-open-source` | 1 passed; 10 skipped by name filter |
| `responsive-keyboard` | 1 passed |
| `demo-first-screen` | 1 passed |
| `extension-uninstall-data` | 1 passed |
| `access-boundaries` | 1 passed; 10 skipped by name filter |
| `extension-download` | 1 passed |
| `activation-boundary` | 1 passed |
| `no-background-monitoring` | 1 passed |
| `extension-reading-settings` | 1 passed |
| `extension-open-article` | 1 passed |
| `extension-reading-card-transfer` | 1 passed |
| `extension-no-remote-requests` | 1 passed |
| `site-choice-reenable` | 1 passed |

The later P1 reproduction demonstrates that a green declared claim command is
not sufficient for the mixed-marker access boundary.

### Cold first-read

Fresh 1440×900 context, no stored data:

- What it does: “Apply your reading card to web articles.”
- For whom: “For low-vision readers who want consistent text size, spacing,
  contrast, and motion on supported public articles.”
- First action: “Try it with sample data.”
- One click opened `/demo/` with the “Quiet evening” card, the article heading
  “The city changes when you notice its trees,” and its opening paragraph.
- The first click made only same-origin requests and produced no console or
  page errors.

The first-read and one-click-demo gate passes on desktop and at 390×844.

## Clean-checkout and package results

| Check | Result |
| --- | --- |
| `npm ci` | pass; 269 packages; 0 vulnerabilities |
| `npm run lint` | pass; 5 routes and 22 registered claims |
| `npm run typecheck` | pass |
| `npm test` | pass; 11/11 |
| `npm run build` | pass; `dist/site/` and MV3 output produced |
| `npm run test:package` | pass; deterministic ZIP |
| `npm run test:e2e` | pass; 35/35 in 1.9 minutes |
| `npm audit` | pass; 0 vulnerabilities |
| `npm audit --omit=dev` | pass; 0 vulnerabilities |

The ZIP SHA-256 is
`1ab39761b25a4cf65d011ea5e3f9a689bf10f51d147d9f583c1a49720bf666ea`.
The ZIP was unpacked into a clean temporary directory and loaded directly in a
fresh Chromium profile. It registered as MV3 with only `storage`, `activeTab`,
and `scripting`, saved all maximum reading-card values, and made zero HTTP
requests.

## Live deployment and build identity

Local production output and live bytes have identical SHA-256 hashes:

| Artifact | SHA-256 |
| --- | --- |
| landing HTML | `81a2f00ef2c7c32f03280231247d4170ae21fbc63cf3111450529ca989857cb1` |
| demo HTML | `6ca5569b4f13c7c2ac15565f566d3bbd7821667bab29c3aec489a1b9dccc9e7f` |
| privacy HTML | `998f38b0705d46611cb4f73c8654f1729ac65cbc4ea55eab608123bdf7c23609` |
| terms HTML | `0ca0ea200e9b16597027f406fe1f00fe7deb31ebb8bd7f441b19c5c0c4a7cce2` |
| 404 HTML | `f4f2a7788a3209671289cdaa4070d294030ad3740ef997fd735319ccd16300f2` |
| extension ZIP | `1ab39761b25a4cf65d011ea5e3f9a689bf10f51d147d9f583c1a49720bf666ea` |

The earlier deployment-only concern is not present. The live site responds,
matches the candidate, and serves the expected package.

## Live functional, privacy, and resilience checks

- Demo normal and boundary values: 85–180% text and 1.2–2.2 line spacing;
  every font, contrast, and motion choice applied and persisted in
  `demo:reader-profile` session storage.
- Invalid recovery: malformed JSON, unsupported version, out-of-range values,
  and a 20,001-byte file each produced a specific live error; a subsequent
  valid boundary card imported exactly.
- Exported JSON matched every imported field. Reset restored the shipped
  120%/1.75× sample. Corrupt session JSON recovered to that sample.
- `registration.update()` completed with an activated same-origin service
  worker. The demo then reloaded offline with its heading, article, and offline
  notice visible.
- Live browsing across `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`
  made only same-origin requests, set no cookies, and produced no page errors.
- There are no analytics, remote fonts/scripts, account flow, payment flow, AI
  gateway, product API, or server-side endpoint. Rate-limit and Entra checks
  are therefore not applicable.

## Accessibility, routing, and metadata

- Desktop 1440×900 and phone 390×844 checked.
- All five published routes have `lang="en"`, a descriptive title, one site
  H1, one main landmark, ordered headings, valid image alt text, and 0 px
  horizontal overflow.
- Keyboard traversal showed a visible 4 px focus ring; skip links, route focus,
  demo sliders/selects/checkbox/import/export/reset, and Back navigation work.
- Reduced motion shortens the landing animation to 0.01 ms and disables demo
  reader motion.
- Independent axe scans found zero serious/critical issues on the five public
  routes. The packaged-reader `<pre>` boundary is the exception documented
  above.
- `/privacy/`, `/terms/`, the extension download, the external source link,
  robots, sitemap, canonical links, Open Graph/Twitter metadata, and all other
  discovered links returned success. An unknown route returns the designed
  page with HTTP 404.
- `/opt/fleet/lib/verify-url.sh` passed for all five published routes with no
  console errors, missing alt text, unlabeled buttons, or missing basics.

## Headers, caching, and performance

HTML uses revalidation. Fingerprinted assets use one-year immutable caching,
and `sw.js` uses `no-cache`; conditional asset requests return 304. Responses
include CSP, HSTS, Permissions-Policy, Referrer-Policy,
X-Content-Type-Options, and X-Frame-Options. The stable ZIP caching defect is
listed above.

Lighthouse 12.8.2 against the live landing page:

- Performance 100, Accessibility 100, Best Practices 100, SEO 100
- FCP 1.1 s, LCP 1.1 s, TBT 80 ms, CLS 0.036
- initial transfer 94,598 bytes across seven requests
- transferred JS 1,152 bytes; CSS 5,127 bytes; fonts 34,859 bytes; image 49,068 bytes
- no third-party requests; INP was not measured in the navigation audit

## Decision

**FAIL.** The live deployment is healthy and exactly matches the candidate,
but the candidate must not ship while a visible access barrier can be skipped
by marker order or preserved code can break the narrow reader. The unlisted
code claim must also be registered and proved. Re-run every claim plus both new
regressions after repair.
