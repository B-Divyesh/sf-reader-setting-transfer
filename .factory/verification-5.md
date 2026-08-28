# Independent verification report — FAIL

Work order: `reader-setting-transfer-verify-5`  
Candidate: `885da27e3d8926b5d2e7a79fa6011c573be0839e`  
Live URL: <https://reader-setting-transfer.sociobot.in/>  
Verified: 2026-08-28

## Verdict

**FAIL — do not release this candidate.** The earlier deployment-only concern is
not reproducible: fresh local production artifacts match the live site
byte-for-byte, and all declared tests pass. The release is nevertheless
blocked by the claims contract: the live landing page contains public claims
without a matching claim entry and observable demo-sandbox test.

No product code was changed during verification.

## Required first checks

### Claims: PASS

From the clean candidate checkout I ran `npm ci` (489 packages installed),
then every exact command in `.factory/claims.json`. All used the product's
configured demo/browser entry point and passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `reading-settings` | `npm run test:e2e -- --grep @claim:reading-settings` | PASS |
| `profile-json-transfer` | `npm run test:e2e -- --grep @claim:profile-json-transfer` | PASS |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `extension-local-reader` | `npm run test:e2e -- --grep @claim:extension-local-reader` | PASS |
| `per-site-off-return` | `npm run test:e2e -- --grep @claim:per-site-off-return` | PASS |
| `article-structure` | `npm test -- --testNamePattern @claim:article-structure` | PASS |
| `free-open-source` | `npm test -- --testNamePattern @claim:free-open-source` | PASS |
| `responsive-keyboard` | `npm run test:e2e -- --grep @claim:responsive-keyboard` | PASS |

### Cold first read: PASS

I opened the live root in a fresh Chromium context at 1440 x 900 before any
interaction. The first viewport plainly answers all required questions:

- **What it does:** “Carry your reading settings into clean articles.”
- **For whom:** “For low-vision readers tired of resetting text size, spacing,
  contrast, and motion on every site.”
- **What to do first:** **Try it with sample data**, with the adjacent plain
  explanation “Opens a ready sample article. Nothing is saved to your real
  data.”

The action reaches `/demo/` in one click. Its persistent banner says “Demo —
sample data, nothing is saved” and has **Reset demo** and **Start for real**.

## Release-blocking defect

### High — unlisted public claims

The claims skill requires every visitor-reliant statement on the landing page
and README to have one `claims.json` entry with one observable test. The live
landing page makes at least these claims without such an entry or test:

1. `site/index.html` says **“Remove the extension and its local data leaves
   with it.”**  None of the nine claim IDs tests extension uninstall/removal or
   names that promise. `extension-local-reader` verifies storage use and no
   HTTP requests in a running extension; it is not an uninstall test.
2. `site/index.html` says **“Does not bypass paywalls or restyle web apps.”**
   Neither outcome is an entry in `.factory/claims.json` or asserted by a
   tagged test.

This violates the supplied `claims` acceptance contract even though the
declared claims themselves all pass. Add isolated, observable claim tests and
entries, or remove these sentences, then submit a new candidate.

## Local quality gates: PASS

```text
npm run lint          PASS (5 routes, 9 claims)
npm run typecheck     PASS
npm test              PASS (3 files, 9 tests)
npm run build         PASS (MV3 extension + dist/site + package ZIP)
npm run test:package  PASS (valid deterministic ZIP)
npm run test:e2e      PASS (16 tests using 2 workers)
npm run check         PASS
npm audit --omit=dev --audit-level=low  PASS (0 production vulnerabilities)
```

`npm ci` reports ten advisories in development-only transitive dependencies
(one low, two moderate, four high, three critical); the production audit is
clean. The full E2E suite includes the real MV3 installation, extension local
storage/reader flow, settings boundaries, malformed-import recovery, desktop,
390 px mobile, keyboard, and axe checks. The repaired configured two-worker
run passed; the previous timeout is not present.

Build output budgets are within the static-product limits: landing JavaScript
is 1,600 B raw / 760 B gzip, CSS 16,061 B raw / 4,203 B gzip, and the mobile
hero WebP is 48,954 B. The extension output totals 151.94 kB.

## Live functional, accessibility, and privacy evidence: PASS

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. The designed unknown
  route returns HTTP 404. All public internal links, downloadable ZIP, icons,
  `robots.txt`, `sitemap.xml`, and the source repository link returned 200.
- On desktop and 390 x 844, the checked pages have `lang=en`, one `h1`, one
  `main`, no horizontal overflow, no page/console errors, and zero axe
  serious/critical findings. The live demo was likewise axe-clean.
- Keyboard-only on the 390 px demo moved the text-size value from 120% to
  125% with Arrow Right. The visible focus outline is `4px solid rgb(184, 55,
  30)` and the page has zero overflow.
- The fresh demo request log contained only
  `https://reader-setting-transfer.sociobot.in`; it used no `localStorage` and
  stored only `sessionStorage["demo:reader-profile"]`.
- After service-worker registration became active, a controlled reload and
  offline reload of live `/demo/` kept the demo banner and sample article
  visible, with no console/page errors.
- There is no sign-in, payment, runtime API, or server-side product endpoint.
  Therefore the Entra authority and per-client 429/`Retry-After` checks are not
  applicable.

Live response headers include HSTS, a self-only CSP, `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, strict referrer policy, and restrictive
permissions policy. HTML revalidates; `/sw.js` is `no-cache`; fingerprinted
assets and the downloadable ZIP are one-year immutable.

## Deployment identity: PASS

Fresh exact production build and deployment are identical:

```text
dist/site/index.html                                  95702bf0e6c4b6c211eb5971d090d66c94da98971b41b2c4b6ab0a85803f41bc
live /                                                95702bf0e6c4b6c211eb5971d090d66c94da98971b41b2c4b6ab0a85803f41bc
dist/site/downloads/reader-setting-transfer-chrome.zip c7e36c0eb4e65134eeda796671a4d961a23014a74fd4f03b709447aed71ca060
live downloadable ZIP                                 c7e36c0eb4e65134eeda796671a4d961a23014a74fd4f03b709447aed71ca060
```

## Required remediation

1. For each public claim above, either remove the sentence or add one exact
   `.factory/claims.json` entry and one tagged, observable test that runs from
   the isolated demo/test harness.
2. Submit a new commit and rerun the complete independent verification.
