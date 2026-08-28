# Reader Setting Transfer — repair handoff

## Verification status: **PASS (local repair verification)**

Repair work order: `reader-setting-transfer-repair-1`
Verifier baseline: `6a586c33376f613136b17d5ffd9df1beae4d3c48`
Original independent findings: [.factory/verification.md](verification.md)

### Repaired findings

- `npm test` now runs `wxt prepare` itself, so a clean `npm ci && npm test`
  succeeds without a generated `.wxt/tsconfig.json` prerequisite.
- The extension E2E waits for the first-install options tab opened by the
  product before it ever creates a fallback tab. This preserves the intended
  first-install behavior and eliminates the same-URL navigation race.
- At 390 px, the horizontal product-promise strip is a named, tabbable region.
  Arrow Left/Right and Home/End scroll it; axe no longer reports
  `scrollable-region-focusable`.
- Shared extension CSS moved out of WXT's `entrypoints/` discovery path. This
  removes the duplicated, non-deterministically named font copies. Packaging
  now sorts entries, normalizes ZIP timestamps, strips variable metadata, and
  has a two-build SHA-256 regression check.
- `site/public/_headers` provides the static deployment policy: immutable
  one-year cache lifetime for `/assets/*` and `/downloads/*`, no-cache service
  worker updates, shell revalidation, and self-only CSP/framing/referrer/
  permissions/MIME protections.

### Exact local evidence — 2026-08-28

    npm ci && npm test                 # 3 files, 7 tests passed
    npm run typecheck                  # passed
    npm run build                      # passed; dist/site/ and MV3 output produced
    npm run test:e2e                   # 6/6 passed
    npm run test:package               # ZIP integrity passed; two build hashes matched
    npm audit --omit=dev --audit-level=low  # 0 production vulnerabilities

Browser coverage in the six Playwright checks includes the shipped MV3
extension's profile save/article reader flow, desktop axe, 390 × 844 axe and
keyboard scroll operation, no horizontal page overflow, no console errors,
first-party-only site requests, service-worker `update()`, and an offline
cached-shell reload. The options and reader extension screens have no
serious/critical axe violations.

The deterministic package SHA-256 is
`aab4e1dd7b3388c2aa7e005d66527e7bc9ccec32c17ac1c3a74511e743981412`.

Lighthouse 13.4.1 on the built local preview (mobile preset) measured:

| Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- |
| 100 | 100 | 100 | 100 | 1.7 s | 0.03 |

Initial site JS is 1.52 KB raw and site CSS is 11.41 KB raw; the mobile hero
remains 48 KB. The static output contains `_headers` for the deployment
platform to apply the cache and response policy.

### Remaining scope notes

- The deployment is still the original static-site class; its hosted response
  headers and downloaded artifact must be checked once the main-branch
  publication triggered by this repair completes.
- `npm ci` reports 10 development-only advisories inherited from the locked
  toolchain. The production dependency audit is clean; no dependency upgrades
  were made because they are outside this repair's product behavior scope.

---

# Original build handoff

Work order: `reader-setting-transfer-build-1`

Completed: 2026-08-28

## What was built

- A WXT + TypeScript Manifest V3 Chrome/Chromium extension with a toolbar popup, settings page, background installer, and dedicated article reader.
- A versioned portable reading card for font scale, line measure, line/paragraph spacing, letter spacing, contrast, font choice, and reduce-motion preference.
- Strict JSON profile import validation and inspectable export. Files contain only the profile fields shown in settings.
- On-demand article extraction using only `activeTab` + `scripting`: semantic headings, paragraphs, lists, quotes, code, tables, and safe HTTP(S) links are retained; scripts, forms, navigation, ads, share widgets, inline attributes, and empty nodes are removed.
- Local-only persistence for the profile, current article, and site overrides. There is no reading-history list, remote service, analytics, account, or broad host permission.
- Reader quick controls, active profile/site label, empty and extraction-error paths, and a reversible “Turn off for this site” action that returns to the source URL.
- A responsive static product site with installation instructions, privacy and terms pages, offline status/service-worker shell, a packaged extension download, and original generated risograph artwork.
- A product-specific risograph visual system and complete asset provenance in `.factory/design.md`. The delivered hero WebP is 159 KB desktop and 48 KB mobile.

## Build and verification

Use Node.js 20+:

```sh
npm install
npm run check
npm run test:e2e
```

The exact production build command is `npm run build`. It produces:

- `.output/chrome-mv3/` — unpacked extension
- `dist/site/index.html` — deploy root
- `dist/site/downloads/reader-setting-transfer-chrome.zip` — packaged extension

Results from the final tree:

- `npm run typecheck`: pass
- `npm test`: 6/6 pass (profile validation/merge and semantic extraction/sanitization)
- `npm run build`: pass
- Playwright 1.58.2 + axe: 5/5 pass
  - home, privacy, and terms: exactly one h1, main landmark, zero serious/critical axe findings, zero console errors
  - 390 × 844 layout: no horizontal overflow; meaningful image alt present; packaged ZIP returns successfully
  - built MV3 extension: profile save and live preview, local article render, quick text change, zero serious/critical axe findings, zero console errors
- Production dependency audit: 0 known vulnerabilities (`npm audit --omit=dev`)
- Lighthouse 12.8.2 mobile, local production preview:
  - Performance: 100
  - Accessibility: 100
  - Best practices: 100
  - SEO: 100
  - LCP: 1.7 s
  - FCP: 1.2 s
  - CLS: 0.03
  - Total blocking time: 0 ms
- Initial site JavaScript: 1.06 KB raw; site CSS: 11.41 KB raw. Extension functional JavaScript is approximately 14 KB across entry points. Browser-selected Latin WOFF2 fonts total about 35 KB. All are within the contract budgets.

## Known gaps and next steps

- Extraction intentionally uses a compact semantic heuristic rather than a remote parser. It works for conventional public articles but unusual markup can still produce incomplete results; the explicit error state and per-site off switch are the v1 recovery path.
- Article media is omitted from the clean reader in v1 so the extension can remain without broad host permissions and avoid loading third-party resources from the reader page. Captions remain when semantically present.
- The downloadable ZIP is an unpacked developer-mode package. Factory/store signing and distribution are deployment concerns outside this repository.
- The pilot success measure (same profile on five sites and fewer manual adjustments for at least 70% of readers) requires post-release user research; no analytics were added to approximate it.
