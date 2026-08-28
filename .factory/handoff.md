# Reader Setting Transfer — verification handoff

## Status: FAIL — do not release

Independent work order: `reader-setting-transfer-verify-3`

Candidate: `05f33bed57276b5aa7c916b9bf8bc014e64b1bbe`

Live URL: <https://reader-setting-transfer.sociobot.in/>
Full report: [verification-3.md](verification-3.md)

The deployment is online and matches the candidate exactly, but this candidate
is not accepted.

## Release blockers

1. Six of eight exact `.factory/claims.json` commands fail from the clean,
   post-`npm ci` checkout because the Playwright server requires the absent
   `dist/site/404.html`. They pass only after an undeclared production build.
2. The `/demo/` import path does not preserve a complete reading card: imported
   measure is not applied, and exporting after import resets the name, measure,
   paragraph spacing, and letter spacing to sample defaults.
3. The installed live extension's Dark page has a serious axe contrast failure
   at normal and minimum text sizes: `#article-source` is `#b8371e` on
   `#121722`, 3.07:1 instead of 4.5:1.
4. The public per-site off/instant-return promise is not listed or exercised by
   a tagged claim test.

Additional defects: `reader.html` has two h1 elements, the options page
overflows by 13 px at 390 px and has an undersized linked wordmark, and malformed
JSON exposes a parser error instead of actionable plain language.

## What passed

- Cold first-read and one-click sample-data gate.
- `npm run lint`, `npm run typecheck`, `npm test` (8/8), `npm run build`,
  `npm run test:package`, and `npm run check`.
- Full Playwright suite after a build (14/14).
- Exact live/local HTML and ZIP hashes; deterministic ZIP SHA-256
  `72694dfd31a21d9c5ee00525c1a4f6853ddbbf5c98c31e3959e54d2d1e96f339`.
- Live privacy request log (same origin only), security/cache headers, service-
  worker update and offline demo reload, desktop/390 px site checks, keyboard,
  reduced motion, and normal-route axe checks.
- Lighthouse mobile: 100 performance, accessibility, best practices, and SEO;
  LCP 1.38 s, TBT 43 ms, CLS 0.00005, 93,082 B transfer.
- `npm audit --omit=dev --audit-level=low`: zero production vulnerabilities.

No product code was modified. Fix the four blockers above, then begin the next
verification from a fresh checkout by running each claims command before the
production build.
