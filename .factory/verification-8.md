# Independent verification 8 — PASS

**Candidate:** `e96a391edfaebf73b61ebe24b18e304bb7740371`  
**Live:** <https://reader-setting-transfer.sociobot.in/>  
**Date:** 2026-08-29 UTC  
**Verdict:** **PASS**

## First read and demo gate

A fresh Chromium context opened the live landing page cold. The first screen says **“Carry your reading settings into clean articles.”** It says this is for **“low-vision readers tired of resetting text size, spacing, contrast, and motion on every site.”** The primary action is **“Try it with sample data,”** with the adjacent explanation **“Opens a ready sample article. Nothing is saved to your real data.”** It also states the free/local/offline facts.

This meets the plain-words first-read requirement. Clicking the action opened `/demo/` directly with the city-tree sample article and the persistent **“Demo — sample data, nothing is saved”** banner, plus Reset demo and Start for real. Screenshots are in `.factory/evidence/verification-8/verify-url-root/`.

## Mandatory claims from a clean checkout

`.factory/claims.json` exists and declares 13 claims. After fresh `npm ci`, I ran every listed command exactly; all passed:

| Claim | Result |
| --- | --- |
| `reading-settings` | PASS — `npm run test:e2e -- --grep @claim:reading-settings` |
| `profile-json-transfer` | PASS — `npm run test:e2e -- --grep @claim:profile-json-transfer` |
| `demo-isolation` | PASS — `npm run test:e2e -- --grep @claim:demo-isolation` |
| `offline-reload` | PASS — `npm run test:e2e -- --grep @claim:offline-reload` |
| `offline-landing` | PASS — `npm run test:e2e -- --grep @claim:offline-landing` |
| `site-no-tracking` | PASS — `npm run test:e2e -- --grep @claim:site-no-tracking` |
| `extension-local-reader` | PASS — `npm run test:e2e -- --grep @claim:extension-local-reader` |
| `per-site-off-return` | PASS — `npm run test:e2e -- --grep @claim:per-site-off-return` |
| `article-structure` | PASS — `npm test -- --testNamePattern @claim:article-structure` |
| `free-open-source` | PASS — `npm test -- --testNamePattern @claim:free-open-source` |
| `responsive-keyboard` | PASS — `npm run test:e2e -- --grep @claim:responsive-keyboard` |
| `extension-uninstall-data` | PASS — `npm run test:e2e -- --grep @claim:extension-uninstall-data` |
| `access-boundaries` | PASS — `npm test -- --testNamePattern @claim:access-boundaries` |

## Local candidate gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 489 packages installed |
| `npm run lint` | PASS; 5 routes and 13 claims |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 3 files, 10 tests |
| `npm run test:e2e` | PASS; 21/21 (`test-results/.last-run.json`) |
| `npm run build` | PASS; `dist/site` and `.output/chrome-mv3` produced |
| `npm run test:package` | PASS; valid deterministic ZIP |
| `npm run check` | PASS |
| `npm audit --omit=dev --audit-level=low` | PASS; 0 production vulnerabilities |

The full npm audit reported 10 transitive development-only advisories (1 low, 2 moderate, 4 high, 3 critical); they are not production dependencies and are not part of the deployed extension/site.

## Independent functional, privacy, and deployment checks

- On live `/demo/`, I changed size and line spacing to their maximum controls, changed contrast, enabled reduced motion, imported malformed JSON (specific recovery message), then imported a valid boundary card. Reset restored the 120% shipped profile and focused the article.
- At 390 x 844 there was zero document overflow. The initial Tab focus was the visible skip link with a 4 px solid focus outline. The full local browser suite also exercised the MV3 empty/error reader, local profile storage, extraction semantics, paywall refusal, per-site return, and uninstall cleanup.
- Direct Axe scans of `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 found no serious/critical violations at desktop and 390 px. Each normal public route had one H1 and no page or console errors. The browser reports the expected failed-resource event while loading an HTTP 404 document.
- The entire live demo request log contained only the product origin; the cookie jar was empty and no response carried `Set-Cookie`. Live response headers provide HSTS, self-only CSP with `frame-ancestors 'none'`, `nosniff`, X-Frame-Options DENY, strict referrer policy, and a restrictive permissions policy. The built MV3 manifest has only `storage`, `activeTab`, and `scripting`; source inspection found no remote fetch path.
- After an online visit, `navigator.serviceWorker.ready` returned an active registration after `update()`. With the context offline, `/demo/` reloaded to the sample H1, demo banner, and visible offline notice. Reduced motion computed to `0.01ms` animation and transition durations.
- Every one of 27 deployable files in the local candidate build had the same SHA-256 as its live URL. The candidate therefore is what is deployed. HTML uses `max-age=0, must-revalidate`; `sw.js` uses `no-cache`; hashed assets and the ZIP use `max-age=31536000, immutable`. All six unique public links returned 200 and a nonexistent path returned the designed HTTP 404.

## Performance

The production build reports 1.60 kB raw / 0.76 kB gzip initial landing JS, 4.69 kB / 1.71 kB demo JS, and 16.64 kB / 4.31 kB CSS. The MV3 package is 152.5 kB unpacked. Live Lighthouse recorded Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.3 s, LCP 0.5 s, CLS 0.049, and TBT 0 ms. The output JSON is `.factory/evidence/verification-8/lighthouse-live.json`. Lighthouse emitted a post-audit `TARGET_CRASHED` screenshot-gatherer warning, so that screenshot artifact is unavailable; the scored audit data and independent Playwright checks completed successfully.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

This is a static, local-first, account-free product with no backend endpoint, product-unlock API, payment, AI runtime, or sign-in flow. Rate allowance, 429/Retry-After, and Sociobot Entra tenant checks are therefore not applicable.
