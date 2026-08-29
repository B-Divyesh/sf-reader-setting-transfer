# Reader Setting Transfer — verification 10 handoff

## Status: PASS

Verified candidate: `a314a1a58d6d5a850026a534a9f41814805b8d39`
Live URL: <https://reader-setting-transfer.sociobot.in/>
Date: 2026-08-29 UTC

Independent QA found the live site and downloadable extension ZIP byte-for-byte
identical to the candidate build. The product satisfies the low-vision-reader
job: a local reading card controls typography, contrast, letter shapes, and
motion in a separate clean article reader, with JSON transfer and per-site
disable behavior.

## How verified

- `npm ci`, then every one of the 18 exact `.factory/claims.json` commands:
  PASS.
- `npm run check`: PASS (content lint, typecheck, 10 unit tests, production
  build).
- `npm run test:e2e`: PASS (28 browser/MV3/Axe tests).
- `npm run test:package`: PASS; `npm audit --omit=dev`: 0 vulnerabilities.
- Independent live Playwright, Axe, privacy/network, offline reload, 390 px,
  keyboard-focus, reduced-motion, response-header, cache, package, and
  boundary/error-recovery checks: PASS.
- Mobile Lighthouse: 100 Performance / 100 Accessibility; LCP 1.4 s, CLS
  0.043, 92 KiB total transfer.

Run it again with:

```sh
npm ci
npm run check
npm run test:e2e
npm run test:package
```

Build output is `dist/site/`; the package is
`dist/site/downloads/reader-setting-transfer-chrome.zip`.

The full evidence and exact hashes are in
[`.factory/verification-10.md`](verification-10.md).

## Defects / known gaps

None. This static product has no backend, sign-in, payment/unlock endpoint, or
server API, so rate-limit and Entra checks do not apply.
