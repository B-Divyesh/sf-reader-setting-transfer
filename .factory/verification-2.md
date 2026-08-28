# Independent verification report — FAIL

Work order: `reader-setting-transfer-verify-2`  
Candidate: `8944802997492d62261853de78bc2066dfd9bee9` (`8944802`)  
Live URL: <https://reader-setting-transfer.sociobot.in/>  
Verified: 2026-08-28

## Verdict

**FAIL — do not release.** The deployment itself is healthy and matches the
candidate byte-for-byte, but this browser extension fails the mandatory claims
and demo-sandbox acceptance contract. It also has a serious accessibility
violation when the user selects the dark preview option.

## Required first checks

### Claims: FAIL (release blocking)

The clean candidate has no `.factory/claims.json`. Therefore there were no
declared claim tests to execute from a demo entry point, and no observable
tests for visitor-facing claims such as local-only storage, no tracking,
profile import/export, or offline reload. The claims contract explicitly makes
a missing file release-blocking.

`README.md` and the live landing page make reliance-worthy claims including
“No account. No tracking. Your reading stays on your device,” “Sent nowhere,”
and profile export/import, but none can be mapped to a required tagged claim
test because the manifest is absent.

### Cold first read and demo: FAIL (release blocking)

A fresh live Chromium visit shows:

- **What it does:** carries text size, spacing, contrast, and motion settings
  into clean articles.
- **For whom:** the first screen does not say low-vision readers, or name the
  reader situation in plain words.
- **What to click first:** the only primary action is **Download extension**.
  It is an installation download, not an immediately usable trial.

There is no visible **“Try it with sample data”** action, no persistent
`Demo — sample data, nothing is saved` banner, no reset/start-for-real
controls, no `.factory/demo.md`, and no demonstrated separate demo storage
namespace. Both `/?demo=1` and `/demo` render the regular landing page; the
latter is a 200 navigation-fallback response, not a demo. This directly fails
the first-screen and demo-sandbox requirements.

## Blocking defect

### High — dark reading-card preview fails contrast

In an independently installed copy of the exact built extension, choose
**Page contrast → Dark page** on the options screen, then run axe 4.10. The
result contains:

```text
color-contrast (serious)
target: .preview__source
```

The small red preview source label (`#b8371e`) is rendered on the dark preview
background (`#121722`). This is an actionable setting in a product for
low-vision readers, so the serious WCAG contrast failure is release-blocking.
The default/light and high-contrast preview selections were clean; the reader
screen itself was clean in the exercised dark profile.

## Other defects

### Medium — required routes and metadata are incomplete

- A nonexistent live URL, `/this-route-does-not-exist`, returns the normal
  landing page with HTTP 200. There is no designed 404 route.
- `/demo` is neither a demo page nor listed in `sitemap.xml`.
- The landing, privacy, and terms documents have no canonical link, Open
  Graph/Twitter card metadata, or apple-touch icon. The project has no
  `.factory/copy-audit.md` required by the plain-words acceptance check.

## Fresh local quality evidence

From this clean checkout at the candidate commit:

```text
npm ci                         PASS (490 packages installed)
npm test                       PASS (3 files, 7 tests)
npm run typecheck              PASS
npm run test:e2e               PASS (6 authored Playwright tests)
npm run test:package           PASS (two deterministic builds; ZIP integrity)
npm run build                  PASS; produces dist/site and .output/chrome-mv3
npm audit --omit=dev           PASS (0 production vulnerabilities)
```

There is no lint script. The exact production build's site payload is within
the static budget: JavaScript 1.52 KB raw / 0.72 KB gzip, CSS 11.41 KB raw /
3.21 KB gzip, and mobile hero WebP 48,954 B. The deterministic ZIP SHA-256 is
`aab4e1dd7b3388c2aa7e005d66527e7bc9ccec32c17ac1c3a74511e743981412`.

## Independent product exercise

I launched the built MV3 extension in a fresh Chromium profile and exercised:

- defaults plus representative boundary settings (1.80 scale, 40 characters,
  2.20 line spacing, 2.5 paragraph spacing, 0.08 letter spacing), then saved
  them;
- malformed JSON import error and subsequent valid profile import recovery;
- JSON export, parsed and compared with the imported profile;
- a stored representative article with paragraph, heading, list, and safe
  source link; the reader applied the imported 140% dark/dyslexia profile;
- quick text-size and contrast changes, which persisted locally.

Those normal, boundary, invalid-input, and recovery flows worked. Options and
reader produced no console/page errors. Axe had no serious/critical findings
on the reader; the options dark-preview contrast defect above was the sole
serious finding. The manifest contains only `storage`, `activeTab`, and
`scripting`; source inspection and the exercised reader flow use local
extension storage and no remote service.

## Live deployment evidence

The prior deployment-only failures are repaired. A fresh production build
matches the deployed candidate exactly:

```text
SHA-256 dist/site/index.html                         45644adbb4346218…5825f0e50
SHA-256 live /                                      45644adbb4346218…5825f0e50
SHA-256 dist/site/downloads/reader-setting-transfer-chrome.zip  aab4e1dd…743981412
SHA-256 live download ZIP                            aab4e1dd…743981412
```

Independent live Chromium checks at desktop and `390 × 844` found one h1,
`lang=en`, main landmark, meaningful image alt, visible skip-link focus
(`rgb(184, 55, 30)` 4 px outline), no document horizontal overflow, no
console/page errors, and no serious/critical axe findings. The named product
promise strip is keyboard focusable and scrolls from 0 to 257 px after Arrow
Right (after its 300 ms smooth-scroll interval).

The live site registered a service worker, completed `registration.update()`,
and reloaded the cached landing shell successfully while offline. First-load
request capture contained only `https://reader-setting-transfer.sociobot.in`;
there were no third-party scripts, fonts, analytics, or calls from the landing
page. Privacy/terms, README, MIT license, robots, sitemap, and live internal
links all returned successfully.

Live headers are appropriate for the static app: self-only CSP,
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict referrer
policy, restrictive permissions policy, HSTS, HTML revalidation, one-year
immutable caching for hashed JS and ZIP, and `no-cache` for `sw.js`.

There are no server-side product/API endpoints, product-unlock calls, or
sign-in flows in this static site + MV3 extension. Rate-limit and Sociobot
Entra tenant checks are not applicable.

## Required remediation before a new candidate

1. Add a truthful `.factory/claims.json`; add and run one tagged, observable
   demo-entry test for every visitor claim.
2. Ship `/demo` (and `?demo=1` if advertised) as a one-click realistic sample
   reader sandbox with the required persistent banner, reset/start-real
   controls, separate demo storage, and `.factory/demo.md`. Put the exact
   “Try it with sample data” control on the first screen and name the
   low-vision reader situation in plain words.
3. Fix `.preview__source` contrast for Dark page and rerun axe across every
   selectable profile state.
4. Add a real 404 and complete route/metadata/copy-audit requirements.

No product code was changed during this verification.
