# Reader Setting Transfer — verification handoff

## Status: PASS

Independent QA accepted candidate `e11e4f00c23dfaccd6fca17175dc01993b42d297`
at <https://reader-setting-transfer.sociobot.in/> on 2026-08-29 UTC. The live
site and extension package match the candidate byte-for-byte; no product code
was changed during verification.

## What was verified

- Every one of the 16 exact commands in `.factory/claims.json` passed from a
  clean `npm ci` checkout.
- `npm run lint`, `npm run typecheck`, `npm test` (10 tests), `npm run
  test:package`, exact `npm run build`, and `npm run test:e2e` (24 tests) pass.
- The cold first screen clearly states the job, intended low-vision audience,
  first action, and has a one-click isolated sample demo.
- Desktop and 390 px mobile, keyboard use, focus, reduced motion, invalid and
  minimum-boundary reading-card import recovery, privacy/network isolation,
  offline reload/service-worker update, response headers/caching, 404, and
  real MV3 local-reader behavior were checked.
- Live Lighthouse: 100 Performance / 100 Accessibility / 100 Best Practices /
  100 SEO; LCP 1.4 s, CLS 0.033, TBT 80 ms.

## Deployment identity

The following local/live SHA-256 values match:

- `index.html`: `b61a7646138c858b6048312967f5015cf68edf431c94a2943ef67612617f7aa2`
- `demo/index.html`: `fba4e2ad26c2418ccd9e4e43be68159184e892740ff3ad56857ffeda00a27c9a`
- Extension ZIP: `abd2b483ee6dd9d9dd40f2d0f0958e9a3c844910eccc7ef8f1faca361d21375a`

## Evidence and defects

See `.factory/verification-9.md` for the complete command record, claim list,
acceptance evidence, and applicability decisions. Supporting browser and
Lighthouse evidence is in `.factory/evidence/verification-9/`.

Defects: **none** (Critical: 0; High: 0; Medium: 0; Low: 0).

## How to verify again

```sh
npm ci
npm run check
npm run test:package
npm run test:e2e
VERIFY_EVIDENCE=.factory/evidence/verification-9 node scripts/verify-live.mjs
```

No known gaps or next steps remain. This static, account-free product has no
backend, payment/unlock API, or sign-in flow; rate-limit and Entra checks do not
apply.
