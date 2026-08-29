# Independent verification 9 — PASS

**Candidate:** `e11e4f00c23dfaccd6fca17175dc01993b42d297`  
**Live URL:** <https://reader-setting-transfer.sociobot.in/>  
**Date:** 2026-08-29 UTC  
**Verdict:** **PASS**

## Acceptance decision

This is a usable local-first Chrome/Chromium extension for low-vision readers.
It stores a reading card, applies its text size, measure, spacing, contrast,
letter-shape, and motion settings to a separately rendered public article, and
allows a per-site off switch and JSON transfer. It does not claim to alter the
source page or bypass access controls.

The live deployment is exactly this candidate: SHA-256 matches for `index.html`,
`demo/index.html`, both live JS bundles, the shared CSS bundle, and the download
ZIP. The ZIP is `abd2b483ee6dd9d9dd40f2d0f0958e9a3c844910eccc7ef8f1faca361d21375a`.

## First-read and demo gate

In a fresh cold Chromium context, the first screen says, “Apply your reading
settings to web articles.” It names “low-vision readers,” says the settings that
carry across public articles, and presents **Try it with sample data** with the
nearby explanation that it opens a styled article in separate temporary storage.
It also gives the free, local-data, and offline facts. The one-click action opens
`/demo/`, immediately shows the city-trees sample article, and retains the
**Demo — sample data, nothing is saved** banner with Reset demo and Start for
real/download actions. This passes the plain-words and demo-sandbox gates.

## Required claim commands from the clean checkout

`.factory/claims.json` exists and has 16 claim IDs. After `npm ci`, I ran every
listed command exactly, independently, against the product's built demo entry
point or MV3 build. All passed:

| Claims | Result |
| --- | --- |
| `reading-settings`, `reading-card-json-transfer`, `demo-isolation` | PASS |
| `offline-reload`, `offline-landing`, `site-no-tracking` | PASS |
| `extension-local-reader`, `per-site-off-return`, `extension-uninstall-data` | PASS |
| `article-structure`, `free-open-source`, `access-boundaries` | PASS |
| `responsive-keyboard`, `extension-download` | PASS |
| `activation-boundary`, `no-background-monitoring` | PASS |

## Local candidate quality gates

| Command | Evidence |
| --- | --- |
| `npm run lint` | PASS — content lint: 5 routes, 16 claims |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 3 files, 10 tests |
| `npm run test:package` | PASS — deterministic, valid ZIP |
| `npm run build` | PASS — `dist/site/` and `.output/chrome-mv3/` produced |
| `npm run test:e2e` | PASS — 24/24 Playwright/MV3/Axe tests |
| `npm audit --omit=dev --audit-level=low` | PASS — 0 production vulnerabilities |

The built initial landing JS is 2,365 bytes raw (1.08 kB gzip); shared CSS is
19,014 bytes raw (4.67 kB gzip); the mobile hero is 48,954 bytes. These are
within the stated static-product budgets.

## Independent product, accessibility, privacy, and deployment checks

- Live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each have the
  expected title, one visible H1, a main landmark, and zero serious/critical Axe
  findings. There were no console or page errors.
- At 390 x 844, demo overflow was 0 px; the sample H1 ended at 683.30 px and
  its first paragraph started at 712.98 px. Keyboard range adjustment and Reset
  restored the sample's 120% setting. Visible focus and 44 px controls are
  covered in the passing tests.
- On the live demo, maximum UI settings visibly changed typography; malformed
  JSON produced “This file is not valid JSON. Check the file, then try again.”
  A valid minimum-boundary reading card imported successfully (`85%`, `40ch`,
  `1.20×`, dark, hyperlegible, motion off). Reduced-motion computed to `0.01ms`.
- An independent fresh MV3 profile rendered a realistic public article in the
  reader, retained headings/list/quote content, changed text to 105%, wrote only
  `currentArticle` and `readerProfile` to extension local storage, left the
  source DOM byte-for-byte unchanged, and made no external HTTP request.
- The live request log across the public routes and demo contained only
  `https://reader-setting-transfer.sociobot.in`; no response set a cookie and
  the browser cookie jar was empty. The demo preserved seeded real storage and
  used only the `demo:reader-profile` session key.
- The MV3 manifest has only `storage`, `activeTab`, and `scripting`; it has no
  host permission or automatic content script. The claim suite passed activation,
  passive-browsing, paywall refusal, per-site return, and uninstall-data paths.
- Live headers include self-only CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, X-Frame-Options DENY, strict-origin referrer policy, and a
  restrictive permissions policy. HTML revalidates; hashed assets and ZIP are
  immutable for one year; `sw.js` is `no-cache`; unknown paths return designed
  HTTP 404.
- Service worker `reader-setting-transfer-site-v3` registered and updated. After
  a controlled online reload, `/demo/` reloaded offline successfully.
- Fresh live Lighthouse scored Performance 100, Accessibility 100, Best
  Practices 100, SEO 100: FCP 1.1 s, LCP 1.4 s, TBT 80 ms, CLS 0.033. Lighthouse
  emitted a post-audit browser-tab-crash warning while gathering an artifact;
  the completed scored JSON is retained below and the independent browser checks
  were clean.

Evidence: `.factory/evidence/verification-9/live-browser.json`,
`.factory/evidence/verification-9/live-demo-first-screen.png`, and
`.factory/evidence/verification-9/lighthouse-live.json`.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

There is no product backend, account system, payment/unlock endpoint, or sign-in
flow. Rate-limit/429 and Sociobot Entra tenant checks are not applicable.
