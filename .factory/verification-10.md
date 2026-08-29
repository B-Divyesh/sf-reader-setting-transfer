# Independent verification 10 — PASS

**Candidate:** `a314a1a58d6d5a850026a534a9f41814805b8d39`
**Live URL:** <https://reader-setting-transfer.sociobot.in/>
**Verified:** 2026-08-29 UTC
**Verdict:** **PASS**

## First read and demo gate

Cold live visit, in plain words: this applies a saved reading card to web
articles; it is for low-vision readers who want consistent text size, spacing,
contrast, and motion; click **Try it with sample data** first. The nearby copy
explains that it opens a styled sample article and keeps its changes separate
from extension data. The three visible facts say it is free/open source, keeps
the reading card on-device, and works offline after the first visit.

The action redirected to `/demo/` in one click. It immediately displayed the
realistic city-trees article and the persistent **Demo — sample data, nothing
is saved** banner with **Reset demo** and the real-start/download action. This
passes the plain-words and isolated-demo requirements.

## Required claim sweep from clean install

`.factory/claims.json` exists and contains 18 claims. From the candidate
checkout, after `npm ci`, I ran every declared `test` command exactly. All
completed successfully; the final Playwright result was
`{"status":"passed","failedTests":[]}`.

| Claim IDs | Result |
| --- | --- |
| `reading-settings`, `reading-card-json-transfer`, `demo-isolation` | PASS |
| `offline-reload`, `offline-landing`, `site-no-tracking` | PASS |
| `extension-local-reader`, `per-site-off-return`, `article-structure` | PASS |
| `free-open-source`, `responsive-keyboard`, `extension-uninstall-data` | PASS |
| `access-boundaries`, `extension-download`, `activation-boundary` | PASS |
| `no-background-monitoring`, `extension-reading-settings`, `extension-no-remote-requests` | PASS |

## Local quality gates

| Command | Fresh result |
| --- | --- |
| `npm ci` | PASS — 270 packages installed; 0 audit vulnerabilities reported |
| `npm run check` | PASS — content lint (5 routes, 18 claims), typecheck, 10 unit tests, exact production build |
| `npm run test:e2e` | PASS — 28 Playwright/MV3/Axe tests |
| `npm run test:package` | PASS — deterministic valid extension ZIP |
| `npm audit --omit=dev --json` | PASS — 0 production vulnerabilities |

The exact build produced `dist/site/` and the Chrome MV3 package. Its initial
landing JS is 1,114 bytes gzip, demo JS 1,722 bytes gzip, and CSS 4,802 bytes
gzip: all well below the static-product budgets. The built extension is 152,370
bytes uncompressed.

## Independent live and extension exercise

- Live `index.html` SHA-256 exactly matched this candidate build:
  `a98a0a64078227255615147423f7b4d3d7392a0d0128b604bff8fae60a361168`.
  The downloaded ZIP also exactly matched:
  `a6cda2db2887e917d37f306f87e571b9260d3c45eef6f7190eabf0856956387c`.
- Fresh live Playwright checks of `/`, `/demo/`, `/privacy/`, `/terms/`, and
  `/404.html` found the expected titles, one accessible H1, one `main`, zero
  console/page errors, and zero Axe serious/critical findings.
- At 390 × 844, demo horizontal overflow was 0 px. Keyboard Tab produced a
  visible 4 px focus outline on Reset demo. Reduced motion rendered with no
  animation. The sample heading remained in the first viewport.
- The demo correctly applied lower-bound values, imported a max-boundary JSON
  profile, reset to 120%, and recovered from malformed JSON with: “This file
  is not valid JSON. Check the file, then try again.” It used only
  `sessionStorage["demo:reader-profile"]`, no local storage, and no cookies.
- After service-worker control and `registration.update()`, the live demo
  reloaded offline with its article and demo banner intact.
- A new locally installed MV3 profile saved every boundary setting; malformed
  import recovery worked; the reader rendered a heading, list, and table with
  `17px`, `40ch`, `2.2`, `0.08em`, high contrast, dyslexia font, and reduced
  motion; the reader-size control advanced to 90%. It had 0 px overflow, no
  console errors, and no HTTP requests. The tested package manifest has only
  `storage`, `activeTab`, and `scripting`, with no host permissions.
- A fresh live request log across landing, demo, legal pages, and 404 had only
  `https://reader-setting-transfer.sociobot.in` requests. No response set a
  cookie and the browser cookie jar stayed empty. This confirms the local-first
  privacy claims and absence of remote fonts/tracking.
- Live headers: HSTS, `nosniff`, `X-Frame-Options: DENY`, restrictive
  Permissions-Policy, strict-origin referrer policy, and self-only CSP with
  `frame-ancestors 'none'`. HTML revalidates, hashed assets and ZIP are
  one-year immutable, `sw.js` is `no-cache`, and an unknown route returns the
  designed HTTP 404.
- Mobile Lighthouse (fresh live run): Performance 100, Accessibility 100;
  FCP 1.1 s, LCP 1.4 s, CLS 0.043, total transfer 92 KiB.

This is a static site plus local MV3 extension. It has no product backend,
account/sign-in, payment/unlock call, or server-side API endpoint; Entra and
429/`Retry-After` checks are not applicable.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

No product code was modified during this verification.
