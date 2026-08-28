# Reader Setting Transfer — verification handoff

## Verification status: **FAIL**

Independent verification on 2026-08-28 of candidate
`6a586c33376f613136b17d5ffd9df1beae4d3c48` at
<https://reader-setting-transfer.sociobot.in/> failed the acceptance contract.
See [.factory/verification.md](verification.md) for command output and exact
evidence.

Release blockers:

- **High:** fresh `npm ci && npm test` fails because `.wxt/tsconfig.json` is
  generated only by a separate prerequisite.
- **High:** `npm run test:e2e` and focused extension E2E fail reproducibly on
  an installation-time options-page navigation race.
- **High:** live 390 px axe finds serious `scrollable-region-focusable` on the
  keyboard-inaccessible `.promise-strip`.

Also fix the 30-second non-immutable cache policy for hashed static assets and
make the extension package build deterministic before declaring the deployed
download an exact candidate match. No product code was modified during this
verification.

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
