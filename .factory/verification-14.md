# Independent verification 14 — PASS

**Candidate:** `671544d647823ea26a835d940e85d2d0b5639566`

**Live URL:** <https://reader-setting-transfer.sociobot.in>
**Verified:** 2026-08-29 from a fresh checkout and locked dependency install.

## Verdict

**PASS.** No release-blocking defects were found. The live static deployment is byte-for-byte the freshly built candidate for every published HTML file and the extension ZIP. Product code was not changed during this verification.

## Cold first read

At 1440 × 900, a cold visit says, “Apply your reading card to web articles.” It names low-vision readers and the settings that carry across supported public articles. The first clear action is **Try it with sample data**, with adjacent copy that it opens a styled sample article and keeps changes separate from extension data. The first screen answers what it does, who it is for, and what to click first in plain words. Desktop and 390px captures confirm this.

## Required claim tests

`.factory/claims.json` exists and contains 23 registered claims. Every manifest `test` command was invoked individually from this clean checkout, using the configured demo/MV3 test entry point. A clean follow-up full regression also passed **37/37 Playwright tests** with no failed IDs, re-verifying all claim tags below.

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

The completed run records `{"status":"passed","failedTests":[]}` in `test-results/.last-run.json`.

## Local build and package checks

- `npm ci` — pass; audit reported 0 vulnerabilities.
- `npm run lint` — pass; 5 routes and 23 claims checked.
- `npm run typecheck` — pass.
- `npm test` — pass; 12/12 Vitest tests.
- `npm run test:e2e` — pass; 37/37 Playwright tests. This covers demo isolation, 390px keyboard flow, extraction, invalid import recovery, boundaries, packaged MV3 extension, local storage, site override, uninstall, passive monitoring, offline reload/update, privacy, and axe.
- `npm run build` — pass; creates `.output/chrome-mv3/` and `dist/site/`.
- `npm run test:package` — pass; ZIP is valid and deterministic: `6397759ce375d71b80bd87927acb1dbc50d9f496dd9ab0acd68fb252c24c2fbd`.
- `npm audit --omit=dev` — 0 vulnerabilities.

Landing JS is 2,567 B raw / 1.14 KiB gzip; landing CSS is 20,544 B raw / 5.07 KiB gzip. Both satisfy the static-product budget. The responsive 720px hero is 48,954 B.

## Live verification

`node scripts/verify-live.mjs` passed against the custom domain:

- 0 serious or critical axe findings on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- Correct title, `lang=en`, exactly one H1 and main, route metadata, legal links, and 13 checked links with no failures.
- No console/page errors, only same-origin requests, and no cookies.
- 0px horizontal overflow at 390px and at 200% text across all five routes.
- Correct primary, forward, and Back H1 focus restoration.
- The sample heading and first paragraph fit in the initial mobile and desktop demo viewports; desktop action note and facts fit too.
- Demo offline reload works after service-worker control.

`/opt/fleet/lib/verify-url.sh` passed for all five public routes: HTTPS 200, title/lang/main/H1/alt checks, no unlabeled buttons, and no browser console errors. Live demo testing showed the malformed JSON error “This file is not valid JSON. Check the file, then try again.” A subsequent maximum-boundary import recovered successfully (`36px`, `40ch`, `2.2`, dark, dyslexia, motion false), with 0px overflow and no cross-origin request.

Live headers include response-header CSP with `frame-ancestors 'none'`, Permissions-Policy, Referrer-Policy, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and HSTS. Shell and stable ZIP are `public, max-age=0, must-revalidate`; hashed JS/CSS/font assets are `public, max-age=31536000, immutable`; `/sw.js` is no-cache. An unknown URL returns HTTP 404 and the designed 404 page. No server-side/product-unlock endpoint or sign-in flow exists, so rate-limit and Entra checks are not applicable.

## Candidate-to-live identity

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `7c563096a0ba317d2d3c92e38c1cb3851685aa05477b4745b3f2e58c480b7fe8` |
| `demo/index.html` | `404737681287cc4f2ff38a21d5744b2bf42b23d905220f2a53803efc41c7dcab` |
| `privacy/index.html` | `9e5419cbf2b204c7e819f4dd973fc6d6546d787d436d3bbfb567c21fc7fdbbb7` |
| `terms/index.html` | `fc43559896fd13c2ed6e27c50aca5e8ca92e77ce0ef46fdab9029e2ad11eb947` |
| `404.html` | `c43decd34db30a0cec7f8ec35e2e8d11d28a7add8fc0d68f403453266846687d` |
| `downloads/reader-setting-transfer-chrome.zip` | `6397759ce375d71b80bd87927acb1dbc50d9f496dd9ab0acd68fb252c24c2fbd` |

## Evidence

- `.factory/evidence/verification-14-live-cold-desktop.png`
- `.factory/evidence/verification-14-live/live-browser.json`
- `.factory/evidence/verification-14-live/live-demo-first-screen.png`
- `.factory/evidence/verification-14-verify-url/`
- `test-results/.last-run.json`

## Defects by severity

No critical, high, medium, or low defects observed.
