# Reader Setting Transfer — repair handoff

## Status: ready for static deployment

Repair work order: `reader-setting-transfer-repair-2`

Verifier baseline: `8944802997492d62261853de78bc2066dfd9bee9`
Independent report: [verification-2.md](verification-2.md)

## Repaired release blockers

- Added the required [.factory/claims.json](claims.json): eight visitor-facing
  claims, each with one observable `@claim:` regression test and its exact
  sandbox command.
- Added a one-click `/demo/` reader sandbox (also reached by `/?demo=1`). It
  starts with the “Quiet evening” profile and a realistic city-tree field-note
  article. Its persistent banner says **Demo — sample data, nothing is saved**,
  and has **Reset demo** and **Start for real** controls. It writes only
  `sessionStorage["demo:reader-profile"]`; real extension storage and
  `localStorage` are untouched. [.factory/demo.md](demo.md) documents it.
- Rewrote the first screen in plain language for low-vision readers and added
  the visible **Try it with sample data** action, an immediate-result note, and
  three tested facts. [.factory/copy-audit.md](copy-audit.md) records the
  sentence audit and terminology.
- Fixed the released serious contrast defect: `.preview__source` switches from
  `#B8371E` to `#FF8062` in the extension's Dark page preview. The extension
  browser regression runs axe against paper, high-contrast, and dark settings
  on both options and reader screens.
- Added the designed 404 document and response override, real `/demo/` build
  route and sitemap entry, canonical/Open Graph/Twitter/apple-touch metadata
  on every HTML route, and the generated-art social/touch derivatives noted in
  the design provenance.

## Exact local verification — 2026-08-28

Fresh install and product gates:

```text
npm ci                                             PASS (489 packages)
npm run lint                                       PASS (5 routes, 8 claims)
npm test                                           PASS (3 files, 8 tests)
npm run typecheck                                  PASS
npm run build                                      PASS (dist/site + .output/chrome-mv3)
npm run test:package                               PASS (ZIP integrity, two identical builds)
npm audit --omit=dev --audit-level=low             PASS (0 production vulnerabilities)
npm run test:e2e                                   PASS (14 Playwright tests)
npm run test:e2e -- --grep @claim:                 PASS (6 browser claim tests)
npm test -- --testNamePattern @claim:article-structure  PASS
npm test -- --testNamePattern @claim:free-open-source   PASS
```

The deterministic package SHA-256 is
`72694dfd31a21d9c5ee00525c1a4f6853ddbbf5c98c31e3959e54d2d1e96f339`.

Browser coverage uses a real built MV3 Chromium profile and covers profile
save, local-storage inspection, article rendering, paper/high/dark contrast,
import/export, 390 × 844 layout, keyboard Arrow-key scrolling, visible focus,
reset behavior, same-origin request capture, service-worker update, and an
offline demo reload. Axe through the Playwright integration reports no
serious/critical violations on landing, demo, privacy, terms, 404, options, or
reader. `/opt/fleet/lib/verify-url.sh` passed for local `/` and `/demo/`; its
desktop/mobile screenshots and no-console-error JSON are in
`.factory/evidence/verify-home/` and `.factory/evidence/verify-demo/`.

The manual axe CLI could not launch because its bundled ChromeDriver supports
Chrome 152 while the worker supplies Playwright Chromium 145. The equivalent
`@axe-core/playwright` checks above ran against that supplied browser on every
route and selectable extension contrast state.

Static payload from the production build: initial JS is 1.60 KB raw, main CSS
is 16.07 KB raw, and the mobile hero image is 48,954 B. No third-party
requests, analytics, remote fonts, accounts, APIs, or payment code are present.
Response-policy unit coverage asserts immutable hashed assets/downloads,
no-cache service worker updates, self-only CSP, framing/referrer/permissions/
MIME protections, and the 404 response override.

## Deploy

The original deployment class is unchanged: static Azure Static Web Apps.
Publish the already-built `dist/site` with:

```sh
/opt/fleet/lib/deploy-static.sh reader-setting-transfer dist/site
```

After publication, verify `https://reader-setting-transfer.sociobot.in/`,
`/demo/`, the download ZIP hash above, and a nonexistent route returning the
designed 404. The static deploy configuration remains the factory-owned
deployment mechanism; no billing, DNS, analytics, or extension permissions
were broadened by this repair.

## Known scope note

The compact local extractor deliberately handles conventional public article
markup only. It does not bypass access controls, restyle web apps, or retain a
reading-history list. The reader's explicit extraction error state and
per-site off switch remain the recovery path for unusual markup.
