# Independent verification report — FAIL

Work order: `reader-setting-transfer-verify-6`

Candidate: `d8e9b4eb31726f47b0677ec3ce85d21c2bf8de42` (`d8e9b4e`)

Live URL: <https://reader-setting-transfer.sociobot.in/>

Verified: 2026-08-29

## Verdict

**FAIL — do not release this candidate.** The deployment is healthy and is an
exact byte match for the candidate. Every declared claim test and repository
quality gate passes. Independent testing nevertheless found a broken first-run
reader state: when no article is stored, the extension renders both its empty
message and the supposedly hidden reader controls. Activating one of those
controls throws an uncaught error. This violates the work order's required
empty/error-state behavior and no-console-error baseline.

No product code was changed during verification.

## Release-blocking defect

### High — the empty reader exposes unusable controls and throws

Reproduction against a fresh installation of the exact built MV3 package:

1. Start Chromium with the packaged extension in a fresh profile.
2. Confirm `chrome.storage.local` is empty.
3. Open `chrome-extension://<id>/reader.html` at 390 x 844.
4. Observe the page or activate **Make text larger (A+)**.

Expected: only the designed “Open an article, then choose the extension” empty
state is available.

Actual:

- The empty state and the complete blank reader shell are both visible.
- Seven controls from both states are exposed, including text size, contrast,
  site disable, and return actions.
- The article sheet contains a visible empty `<h1>`; axe reports the related
  `empty-heading` violation (minor).
- Activating **A+** throws
  `TypeError: Cannot read properties of undefined (reading 'fontScale')`.

The cause is direct: [`reader-shell` has `hidden`](../entrypoints/reader/index.html#L25),
but [`.reader-shell { display: grid; }`](../entrypoints/reader/style.css#L10)
overrides the browser's `[hidden] { display: none }`. The initialization path
sets `shell.hidden = true` and returns before assigning `profile`; the leaked
button handler then reads `profile.fontScale`.

Evidence:

- [Empty-state screenshot](evidence/verification-6/extension-empty-state-mobile.png)
- [DOM state and uncaught error](evidence/verification-6/extension-empty-state.json)

The authored extension E2E happy path seeds `currentArticle` before opening the
reader, so it does not exercise this state.

## Additional defect

### Medium — demo-banner keyboard focus is below the required contrast

Keyboard focus is present and 4 px wide, but **Reset demo** and **Start for
real** use the global persimmon outline (`#b8371e`) against the banner's navy
background (`#18213b`). Their measured contrast is **2.73:1**, below the
required 3:1 focus-indicator contrast. This reproduces at desktop and 390 px,
including with reduced motion enabled.

Evidence: [focus measurement](evidence/verification-6/demo-focus-contrast.json)
and [focused mobile screenshot](evidence/verification-6/demo-focus-reset-mobile.png).

## Mandatory first checks

### Claims: PASS

From the clean candidate checkout, after `npm ci`, I ran every exact `test`
entry in `.factory/claims.json` before the general suite. All 11 passed:

| Claim | Exact command result |
| --- | --- |
| `reading-settings` | `npm run test:e2e -- --grep @claim:reading-settings` — PASS |
| `profile-json-transfer` | `npm run test:e2e -- --grep @claim:profile-json-transfer` — PASS |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` — PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` — PASS |
| `extension-local-reader` | `npm run test:e2e -- --grep @claim:extension-local-reader` — PASS |
| `per-site-off-return` | `npm run test:e2e -- --grep @claim:per-site-off-return` — PASS |
| `article-structure` | `npm test -- --testNamePattern @claim:article-structure` — PASS |
| `free-open-source` | `npm test -- --testNamePattern @claim:free-open-source` — PASS |
| `responsive-keyboard` | `npm run test:e2e -- --grep @claim:responsive-keyboard` — PASS |
| `extension-uninstall-data` | `npm run test:e2e -- --grep @claim:extension-uninstall-data` — PASS |
| `access-boundaries` | `npm test -- --testNamePattern @claim:access-boundaries` — PASS |

The manifest has one test tag per claim. A manual landing-page and README
cross-check found no additional material product claim outside these entries.

### Cold first read: PASS

A fresh live Chromium context, with no prior storage or cookies, showed all
three required answers in the first viewport on desktop and at 390 x 844:

- What: “Carry your reading settings into clean articles.”
- For whom: “For low-vision readers tired of resetting text size, spacing,
  contrast, and motion on every site.”
- First action: **Try it with sample data**, beside an explanation that it
  opens a ready article without saving to real data.

One click opened `/demo/`, immediately showing a realistic city-tree article,
the active reading card, controls, and the persistent “Demo — sample data,
nothing is saved” banner with **Reset demo** and **Start for real**.

Evidence: [desktop first screen](evidence/verification-6/live-first-read-desktop.png),
[mobile first screen](evidence/verification-6/verify-url-root/screenshot-mobile.png),
and [one-click demo](evidence/verification-6/live-demo-after-one-click.png).

## Local gates and package

```text
npm ci                                  PASS (489 packages)
npm run lint                            PASS (5 routes, 11 claims)
npm run typecheck                       PASS
npm test                                PASS (3 files, 10 tests)
npm run build                           PASS; dist/site and MV3 output produced
npm run test:e2e                        PASS (17/17, two workers, 47.6 s)
npm run test:package                    PASS; ZIP valid and deterministic
npm run check                           PASS
npm audit --omit=dev --audit-level=low  PASS (0 production vulnerabilities)
```

The full audit reports 10 development-only advisories (1 low, 2 moderate, 4
high, 3 critical), principally through WXT's Firefox development toolchain.
They are not shipped in the static site or extension. The live ZIP installs in
a fresh Chromium profile and exposes the expected MV3 options page with empty
local storage.

## Independent product exercise

The live demo passed normal, boundary, invalid-input, and recovery checks:

- A complete boundary card (`180%`, `40ch`, `2.20x`, `2.5em`, `0.08em`, dark,
  spacious letter shapes, motion on/off) rendered every field and exported
  back as the same JSON.
- Invalid JSON, an unsupported version, an out-of-range text size, and a file
  over 20 KB each produced a specific live-region error. A valid import worked
  immediately afterward.
- **Reset demo** restored the shipped 120% sample. **Start for real** removed
  the demo namespace and downloaded the extension ZIP.
- The installed extension accepted and persisted the full boundary profile.
  Text-size clamping held at 180%; semantic headings, lists, quotations,
  tables, and safe links rendered in its local reader.
- Options and populated reader screens had no serious/critical axe findings
  across paper, high-contrast, and dark states. Both fit at 390 px with no page
  overflow, and keyboard focus was visible.

Evidence: [live browser exercise](evidence/verification-6/live-browser-qa.json),
[extension exercise](evidence/verification-6/extension-independent-qa.json), and
[profile persistence](evidence/verification-6/extension-profile-persistence.json),
and [live package install](evidence/verification-6/live-package-install.json).

## Live deployment, privacy, security, and offline behavior

- The local build and live deployment match byte-for-byte for `/`, `/demo/`,
  `/privacy/`, `/terms/`, `/404.html`, metadata files, service worker, hashed
  JavaScript/CSS, responsive hero images, and the downloadable ZIP.
- Local/live ZIP SHA-256:
  `e77f5bd8299435470b62000299620a0f442bea9e00a15e6e0667af4ec50d2bcd`.
- An unknown live route returns the exact designed 404 body with HTTP 404.
- A complete live demo flow issued only six GETs, all to
  `reader-setting-transfer.sociobot.in`. `localStorage` stayed empty; only the
  documented `demo:reader-profile` session key was used, and **Start for real**
  removed it. Installed extension screens issued no HTTP(S) requests.
- HTML revalidates; fingerprinted assets and the ZIP return
  `max-age=31536000, immutable`; `sw.js` returns `no-cache`.
- CSP is self-only and blocks framing; HSTS, nosniff, referrer, permissions,
  and frame-denial headers are present.
- A fresh live service worker reached `activated`, updated successfully, and
  reloaded `/demo/` offline with the article, demo banner, and offline notice.
- Every one of the 13 unique links crawled from the public routes returned 2xx.
- This static, account-free product has no server-side API, unlock endpoint, or
  sign-in flow, so request-rate enforcement and Entra authority checks are not
  applicable.

Deployment comparison and response evidence are in
[the candidate comparison](evidence/verification-6/live-candidate-compare.log),
[headers](evidence/verification-6/live-headers.log), and
[live browser results](evidence/verification-6/live-browser-qa.json).

## Accessibility and performance

- `verify-url.sh` passed `/`, `/demo/`, `/privacy/`, and `/terms/` live at
  desktop and 390 px: correct title/lang/main/one-h1/alt labeling and no
  console or page errors.
- Independent axe scans covered five public routes at desktop and 390 px, with
  normal and reduced-motion preferences: no serious or critical findings.
- Reduced motion removed all meaningful animation/transition durations.
- At 200% text sizing, content and controls remained available; no interactive
  element was clipped. Normal 390 px layouts had no page overflow.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.4 s, CLS 0, total blocking time 50 ms, 91 KiB transferred.
- Landing JS is 1,600 B raw / 778 B gzip; demo JS is 4,688 B / 1,729 B gzip;
  CSS is 16,061 B / 4,203 B gzip; mobile hero is 48,954 B. All are within the
  supplied budgets. The MV3 extension totals 152.36 kB.

The Lighthouse JSON and route screenshots are under
[`evidence/verification-6`](evidence/verification-6/).

## Required next steps

1. Make `[hidden]` authoritative for the reader shell (and regression-test the
   no-article and initialization-error paths, including that leaked controls
   cannot be focused or activated).
2. Give focus indicators on the navy demo banner at least 3:1 contrast against
   adjacent colors and add an automated contrast assertion.
3. Rerun every claim command, the complete gate set, the fresh-package empty
   state, and the live deployment comparison.
