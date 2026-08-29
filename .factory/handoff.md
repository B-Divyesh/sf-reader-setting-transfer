# Reader Setting Transfer — polish round 3 handoff

## Status: PASS

Repair commit: `43932d56a06f24e5dbdd389063813e1d88a13ced`
Base reviewed: `cc2f685484e3ba22c9752f601334069cbb927f4e`
Live URL: <https://reader-setting-transfer.sociobot.in/>
Static deployment: `f5d847a6-861e-42e1-966e-ba49cd51686a` on 2026-08-29 UTC.

## What changed

- Made the one-click demo immediately show its realistic sample heading and
  first paragraph on both phone and desktop, while keeping its separate
  `demo:reader-profile` session namespace, banner, and Reset demo control.
- Removed unsupported completeness, motion-preview, and offline-download
  language; the remaining preview copy names precisely what users can see.
- Added production reader-opening messaging plus registered MV3 claim tests
  for real article extraction/reader rendering and packaged card transfer.
- Added readable hero-caption framing, full mobile navigation, and announced
  route changes alongside the existing H1 focus behavior.
- Preserved the risograph paper/ink visual system, all routes, legal links,
  metadata, 404 behavior, privacy model, and extension artifact class.

## Verification

- Clean clone: `/tmp/rst-polish3-clean-p12Zan`; `npm ci` completed with 0
  vulnerabilities.
- Every exact command in the 21-entry `.factory/claims.json` ran separately
  and passed from that clone.
- `npm run check`: PASS — 21-claim lint, typecheck, 10 unit tests, and build.
- `npm run test:e2e`: PASS — 33 Playwright tests including Axe integration,
  offline reload, privacy request/cookie checks, 200% reflow, keyboard,
  mobile, metadata, route, 404, and packaged MV3 tests.
- `npm run test:package`: PASS; deterministic ZIP SHA-256
  `c574dbb356d994b59b3e814c2af398962d04583bb9ef2f2f6e5e628dcec735d1`.
- `npm audit` and `npm audit --omit=dev`: PASS, 0 vulnerabilities.
- Live cold verification: `verify-url.sh` passed with 0 console errors,
  title/lang/main/alt checks passed, and Playwright Axe found 0 serious or
  critical violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- Live privacy/offline checks: only the product origin was requested, cookies
  were empty, demo reloaded offline, and every public route had 0 px overflow
  at 200% text. Evidence: `.factory/evidence/polish-3/live-routes/`.
- Live desktop demo check: heading bottom 823.22 px; first paragraph top
  862.81 px in a 1440×900 viewport. Live hero-caption contrast: 15.64:1.
  Screenshots and reports: `.factory/evidence/polish-3/`.

## Run locally

```sh
npm ci
npm run check
npm run test:e2e
npm run test:package
```

## Known gaps

None.
