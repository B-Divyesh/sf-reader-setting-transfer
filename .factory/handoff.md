# Reader Setting Transfer — polish round 2 handoff

## Status: PASS

All findings in `.factory/review-1.md` and `.factory/review-2.md` are closed.
The product repair is commit `251be18`, pushed to `main` and deployed at
<https://reader-setting-transfer.sociobot.in/> on 2026-08-29 UTC. Azure Static
Web Apps deployment ID: `1c01aba6-89df-4743-b899-a453c6dacf59`.

## What changed

- Rewrote the first screen around the supported-article job and kept its action
  explanation plus three facts inside a 1440 × 900 viewport.
- Preserved the one-click `/?demo=1` sandbox, persistent banner, reset, isolated
  session storage, offline reload, and immediate sample article on phones.
- Preserved route focus through the query redirect and verified Back behavior.
- Added one shared header and footer to Home, Demo, Privacy, Terms, and 404,
  including the wordmark, legal links, external source cue, and version.
- Added 200% text reflow safeguards across all public routes.
- Removed universal article, cross-browser, speed, reproducibility, and
  aggregate service wording that exceeded the evidence.
- Added complete packaged-extension coverage for all reading settings and a
  no-remote-request claim covering manifest, dependencies, network, cookies,
  permissions, and storage.
- Strengthened JSON transfer to export from one clean browser context and
  import into another.
- Expanded keyboard coverage to the landing action and every named demo
  control, including the native file chooser.
- Updated WXT to 0.21.4 and esbuild to 0.28.2. Full `npm audit` now reports zero
  vulnerabilities.
- Updated `.factory/claims.json`, `.factory/copy-audit.md`, demo-facing docs,
  the catalog description, and the complete finding ledger in
  `.factory/polish-2.md`.

The risograph collage, warm paper, ultramarine and persimmon inks, Atkinson
Hyperlegible type, offset borders, and reduced-motion policy remain intact.

## Verification

Clean clone: `/tmp/rst-polish2-clean-ELUG4F`.

- 18/18 exact commands from `.factory/claims.json`: PASS independently.
- `npm run check`: PASS — lint, typecheck, 10/10 unit tests, and production
  build.
- `npm run test:package`: PASS — deterministic extension ZIP.
- `npm run test:e2e`: PASS — 28/28 site and real MV3 Chromium tests.
- `npm audit`: PASS — zero vulnerabilities.
- `npm audit --omit=dev`: PASS — zero vulnerabilities.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.5 s, CLS 0.043, TBT 0 ms.
- Live Lighthouse: 100/100/100/100; LCP 1.4 s, CLS 0.042, TBT 0 ms.
- Live Playwright/Axe audit: all five routes have correct titles, one H1, one
  main landmark, shared chrome, and zero serious or critical violations.
- Live privacy audit: one request origin, no cookies, no console errors.
- Live reflow audit: 0 px horizontal overflow at 200% text on all five routes.
- Live demo: H1 receives focus; heading bottom 729.64 px and first paragraph
  starts at 759.33 px in a 390 × 844 viewport; Reset and offline reload pass.
- Unknown route returns HTTP 404 with the designed page.
- Every public link returns below 400; the extension ZIP returns 200.
- Live and local HTML/ZIP hashes match exactly. ZIP SHA-256:
  `a6cda2db2887e917d37f306f87e571b9260d3c45eef6f7190eabf0856956387c`.

Evidence is under `.factory/evidence/polish-2/`. The machine-readable live
summary is `.factory/evidence/polish-2/live-browser.json`.

## Run and verify

```sh
npm ci
npm run check
npm run test:package
npm run test:e2e
npm audit
VERIFY_EVIDENCE=.factory/evidence/polish-2 node scripts/verify-live.mjs
```

Build output is `dist/site/`; the packaged extension is
`dist/site/downloads/reader-setting-transfer-chrome.zip`.

## Known gaps and next steps

None. No finding or deferred item remains.
