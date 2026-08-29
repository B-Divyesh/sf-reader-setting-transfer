# Reader Setting Transfer — independent verification 11 handoff

## Status: FAIL

Candidate: `c3a1aa96f92ff6e3e1bc70ac6304942f47ad31a0`

Live URL: <https://reader-setting-transfer.sociobot.in/>

Verified: 2026-08-29 UTC

The deployment is healthy and exactly matches the candidate, but the candidate
is not release-ready. See `.factory/verification-11.md` for full evidence.

## Release blockers

1. **Medium:** a public article is falsely rejected when a `.paywall-*` marker
   is inside an ancestor hidden with CSS. The extractor checks only the
   marker's computed visibility and `[hidden]` ancestors.
2. **Medium:** the `extension-open-article` claim test does not perform its
   registered popup → **Read this article** → reader flow. It calls extraction
   and the background message directly, leaving the core UI integration
   unproved.

## What was verified

- Every one of the 21 `.factory/claims.json` commands passed after `npm ci`.
- Lint, typecheck, 10 unit tests, exact production build, 33 Playwright tests,
  deterministic package verification, and both dependency audits passed.
- All 26 live files match the candidate build byte-for-byte. Extension ZIP:
  `c574dbb356d994b59b3e814c2af398962d04583bb9ef2f2f6e5e628dcec735d1`.
- First-read/demo gates passed on desktop and 390 px mobile.
- Live routes had zero serious/critical Axe findings, zero browser errors,
  only same-origin requests, no cookies, correct security/cache headers, and
  a working service-worker update/offline reload.
- Boundary settings, malformed/oversized import recovery, reset, keyboard
  focus, reduced motion, and mobile budgets passed.
- Mobile Lighthouse: Performance 97, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.4 s, CLS 0.04, TBT 170 ms.

## Reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run test:package
```

Ancestor-visibility evidence is in
`.factory/evidence/verification-11/extraction-boundary.json`; live browser,
demo, service-worker, Lighthouse, screenshot, and factory-helper evidence is
under `.factory/evidence/verification-11/`.

## Next steps

- Treat a paywall marker as hidden when any ancestor is non-rendered by CSS,
  and add real-Chromium regression cases for direct and ancestor hiding.
- Replace or extend the open-article claim test so it drives the packaged
  popup action and proves active-tab extraction through the reader tab.
- Rerun every claim and full verification after repair.

No product code was modified during verification.
