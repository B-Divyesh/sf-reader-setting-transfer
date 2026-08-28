# Verification report — FAIL

Work order: `reader-setting-transfer-verify-1`  
Verified candidate: `6a586c33376f613136b17d5ffd9df1beae4d3c48` (`6a586c3`, `build: make site command package extension`)  
Live URL: <https://reader-setting-transfer.sociobot.in/>  
Date: 2026-08-28

## Verdict

**FAIL.** The candidate does not meet the factory definition of done. A fresh
`npm test` cannot run from a clean install, the declared extension E2E suite
fails reproducibly, and the live 390 px homepage has one serious axe violation
that prevents keyboard access to a horizontal scroll region.

## Blocking defects

### High — clean-checkout unit-test command is broken

Fresh evidence:

```sh
git status --short --branch              # clean; HEAD 6a586c33376f613136b17d5ffd9df1beae4d3c48
npm ci
npm test
```

`npm test` failed before collecting any tests with:

```text
TSConfckParseError: failed to resolve "extends":"./.wxt/tsconfig.json"
Cannot find module './.wxt/tsconfig.json'
```

`tsconfig.json` requires WXT-generated files, but `test` does not run `wxt
prepare`. Running `npm run typecheck` first generated the file; only then did
the six unit tests pass. The documented standalone test command therefore does
not work from a clean checkout.

### High — declared extension E2E suite fails reproducibly

After a successful production build, both `npm run test:e2e` and a focused,
single-worker rerun failed:

```sh
npx playwright test e2e/extension.spec.ts --workers=1 --retries=0
```

The failure is deterministic at `e2e/extension.spec.ts:19`:

```text
page.goto: Navigation to "chrome-extension://…/options.html" is interrupted
by another navigation to "chrome-extension://…/options.html"
```

The installer opens the options page while the test is navigating to it. Four
site E2E tests passed; the one extension E2E test failed. Consequently the
repository's declared E2E quality gate is red.

### High — live mobile page has a serious keyboard accessibility violation

Independent live Chrome + axe 4.10 check at viewport `390 × 844` found:

```text
scrollable-region-focusable (serious)
target: .promise-strip
```

At the mobile breakpoint `site/style.css:123` makes `.promise-strip`
`overflow-x: auto`, but the `<section>` has neither a focus target nor
focusable content. Keyboard-only readers cannot scroll its clipped product
promise text. This violates WCAG 2.1.1 / 2.1.3 and is especially material for
the low-vision audience. Desktop axe was clean; mobile had this one serious
finding.

## Other defects and risks

### Medium — live cache policy misses the immutable hashed-asset requirement

The live HTML, service worker, hashed JS/CSS, and ZIP all return:

```text
Cache-Control: public, must-revalidate, max-age=30
```

Hashed assets should be long-lived and immutable. The 30-second policy wastes
repeat visits and does not meet the stated static-product caching guidance.

### Medium — deployed extension package cannot be byte-verified as the candidate artifact

The live landing HTML matches the candidate build exactly:

```text
b5e889ad97345b3530a9937db58230a39e3fe1dafbc695c7adc5645018bf4340
```

The live download ZIP differs from the ZIP created by the exact production
build:

```text
live:  b1957044236adbc83c8cd24f2e2951dc5b87895d8cc671bdb78e5ff928af6f13
local: 983254feeb3ebf772f2056ebfc533459d73930d637c8182d05bba6edb01d601b
```

Manifest and all JavaScript chunks are identical. The difference is the
non-deterministic assignment of duplicated font bytes to `shared*.woff*` names
and the corresponding CSS references. A second local extension build produced
a third font-name mapping. Behaviour appears equivalent, but an exact deployed
candidate artifact cannot be established and the build is not reproducible.

### Low — live response hardening is incomplete

The live origin has HSTS, `nosniff`, and `strict-origin-when-cross-origin`, but
does not send `Content-Security-Policy`, `Permissions-Policy`, or
`X-Frame-Options` / `frame-ancestors`. Record this as hardening work for a
public static download site.

## Checks that passed

- `npm ci` completed. `npm run typecheck` passed.
- Exact production command `npm run build` passed and created
  `.output/chrome-mv3`, `dist/site`, and the ZIP.
- After `wxt prepare`, `npm test` passed: 2 files, 6 tests.
- Independent Chromium extension checks passed: minimum and maximum profile
  bounds, bad JSON import error and successful import recovery, saved article
  render, heading/list/link rendering, text-size upper-bound clamp and recovery,
  visible keyboard focus, and reduced-motion CSS. Options and reader each had
  zero serious/critical axe findings and no console errors.
- Repository site tests: the four static-site Playwright tests passed. The
  extension test was the sole failure described above.
- Live desktop axe: zero serious/critical findings. Live 390 px page: zero
  horizontal document overflow, visible keyboard focus, one serious finding
  described above, and no console/page errors.
- Live PWA: service worker registered and became controller after reload;
  `registration.update()` completed; an offline reload displayed the homepage.
- Live first-load request capture contained no third-party requests or tracking.
  Source inspection found no remote API, analytics, CDN font, sign-in, or paid
  service. Manifest permissions are only `storage`, `activeTab`, and
  `scripting`; storage is local extension storage.
- `npm audit --omit=dev --audit-level=low`: 0 production vulnerabilities.
  (`npm ci` reported 10 development-tree advisories.)
- Static build budgets: initial JS 1,064 B; CSS 11,412 B; mobile hero WebP
  48,954 B; desktop WebP 162,128 B; all within the stated size budgets.
- Privacy, terms, README, MIT license, local-only storage disclosures, semantic
  landmarks, titles, language attributes, and self-hosted fonts are present.

## Scope notes

There are no server-side application/API endpoints in this static site + MV3
extension, no product-unlock call, and no sign-in. API burst/rate-limit and
Entra-tenant checks are therefore not applicable. The extension popup's actual
toolbar chrome is not controllable in headless Chromium; its extraction
function is unit-tested and the independently exercised reader/storage flow
works, but the failing authored E2E must still be fixed before release.

No product code was changed during verification.
