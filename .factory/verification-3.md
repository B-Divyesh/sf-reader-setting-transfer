# Independent verification report — FAIL

Work order: `reader-setting-transfer-verify-3`

Candidate: `05f33bed57276b5aa7c916b9bf8bc014e64b1bbe` (`05f33be`)

Live URL: <https://reader-setting-transfer.sociobot.in/>
Verified: 2026-08-28

## Verdict

**FAIL — do not release.** The live deployment is healthy and matches the
candidate exactly, but the candidate fails the mandatory clean-checkout claim
gate, loses core profile fields in the one-click demo, and has a serious WCAG
contrast failure in the installed reader's supported Dark page state.

No product code was changed during this verification.

## Required first checks

### Claims: FAIL (release blocking)

`.factory/claims.json` exists with eight entries and exactly one tagged test
per entry. I created a brand-new clone at the exact candidate, ran `npm ci`,
confirmed no ignored build output existed, and ran every listed command before
building. Results:

| Claim | Clean-checkout result | Evidence |
|---|---|---|
| `reading-settings` | **FAIL** — demo server cannot open `dist/site/404.html` | [`claims-clean-checkout.txt`](evidence/verification-3/claims-clean-checkout.txt) |
| `profile-json-transfer` | **FAIL** — same server startup error | same log |
| `demo-isolation` | **FAIL** — same server startup error | same log |
| `offline-reload` | **FAIL** — same server startup error | same log |
| `extension-local-reader` | **FAIL** — same server startup error | same log |
| `article-structure` | PASS — 1 selected test | same log |
| `free-open-source` | PASS — 1 selected test | same log |
| `responsive-keyboard` | **FAIL** — same server startup error | same log |

The six browser commands all exit 1 because `playwright.config.ts` starts
`node scripts/serve-site.mjs`, which assumes a pre-existing production build.
The claims list does not build first, so the exact listed commands cannot run
from a clean clone. This is explicitly release blocking. After `npm run build`,
the complete Playwright suite passes 14/14; that proves the built behavior but
does not repair the required clean-checkout claim commands.

The inventory is also incomplete. The landing page and README promise that a
reader can turn the extension off per site and return immediately, but no
claim entry or tagged test exercises that behavior. I independently confirmed
the override is stored, but the claims contract requires the public promise to
be declared and continuously tested.

### Cold first read: PASS

A fresh live desktop Chromium visit answers all three questions in the first
screen:

- **What:** “Carry your reading settings into clean articles.”
- **For whom:** “For low-vision readers tired of resetting text size, spacing,
  contrast, and motion on every site.”
- **First action:** **Try it with sample data**, with the adjacent explanation
  “Opens a ready sample article. Nothing is saved to your real data.”

The action opens `/demo/` in one click. The page immediately shows a realistic
article, controls, and the persistent “Demo — sample data, nothing is saved”
banner with **Reset demo** and **Start for real**.

## Release-blocking product defects

### High — demo does not preserve or apply a complete imported reading card

The portable profile is the product's core differentiator, and the brief
explicitly includes measure and spacing. I imported a valid boundary card with
all required fields:

```json
{"version":1,"name":"Boundary recovery","fontScale":1.3,"measure":40,"lineHeight":1.5,"paragraphSpace":2.5,"letterSpacing":0.08,"contrast":"dark","fontChoice":"dyslexia","reduceMotion":false}
```

The demo announced a successful import and stored all fields in its session
namespace, but it never set a measure style: Paper stays hardcoded to `66ch`,
while High contrast and Dark remove the limit entirely. Exporting immediately
after that import changed the card back to name `Quiet evening`, measure `62`,
paragraph spacing `1.2`, and letter spacing `0.02`. Changing any visible control
likewise reconstructs those hidden fields from sample defaults.

The tagged test passes after a build because it asserts only font size and
contrast. It does not check round-trip fidelity or the brief's full profile.

### High — Dark page has serious contrast failure at ordinary text size

I installed the exact live ZIP in a fresh MV3 Chromium profile, stored the
normal 100% profile with Dark page, and opened a representative article. Axe
4.10 reports:

```text
color-contrast (serious)
target: #article-source
foreground #b8371e on background #121722
contrast 3.07:1; expected 4.5:1
font 14px, weight 700
```

The same defect appears at the supported 85% boundary. The authored E2E test
misses it because it enlarges text to 140% before checking contrast; at that
size axe applies the lower large-text threshold. Paper and High contrast were
clean. This is release blocking for a low-vision reading product.

## Other defects

### Medium — reader document contains two `<h1>` elements

`reader.html` contains one `<h1>` in the empty state and another in the article
state. One state is hidden, but both headings remain in the document. Fresh
installed-extension checks measured two h1 elements in both states, contrary
to the required one-h1 semantic baseline.

### Medium — extension settings do not fit 390 px

The installed options page has 13 px horizontal overflow at `390 × 844`.
Content ends at x=403, and the linked wordmark is also shorter than the required
44 px touch height. The live landing and demo themselves have zero overflow
and no undersized interactive targets at 390 px.

### Low — malformed JSON errors expose parser jargon

Both demo and extension show the raw browser message, for example “Expected
property name or '}' in JSON at position 1”. Version, size, and range errors
are clear and recovery works, but malformed-file copy does not say in plain
words what happened and what to do next.

## Local build and automated evidence

```text
npm ci                                      PASS (489 packages)
npm run lint                                PASS (5 routes, 8 claims)
npm run typecheck                           PASS
npm test                                    PASS (3 files, 8 tests)
npm run build                               PASS; dist/site + MV3 output + ZIP
npm run test:package                        PASS; deterministic ZIP
npm run test:e2e                            PASS after build (14/14)
npm run check                               PASS
npm audit --omit=dev --audit-level=low      PASS (0 production vulnerabilities)
```

`npm ci` reports 10 development-tree advisories (1 low, 2 moderate, 4 high,
3 critical). No production dependency vulnerability is reported.

The production package SHA-256 is
`72694dfd31a21d9c5ee00525c1a4f6853ddbbf5c98c31e3959e54d2d1e96f339`.

## Independent product exercise

The exact live ZIP was downloaded, unpacked into a fresh temporary profile,
and loaded as an MV3 extension. Apart from the defects above, these flows work:

- all profile maximums save locally: 180%, 85 characters, 2.20 line spacing,
  2.5 paragraph spacing, and 0.08 letter spacing;
- malformed, oversized, and out-of-range imports show errors; a valid minimum
  profile then imports and exports correctly in the real extension settings;
- the empty reader gives a useful next step;
- a stored article preserves heading, list, quotation, table, and safe link;
- the minimum profile renders as 17 px, 40-character measure, and 1.2 leading;
- quick size changes clamp at 180% and recover to 175%;
- **Turn off for this site** stores `{enabled:false}` for `example.test`;
- extension storage contains only `readerProfile`, `currentArticle`, and
  `siteOverrides`; no remote processing request occurs;
- options Paper/High/Dark and reader Paper/High are axe-clean, with no
  console/page errors. Reader Dark fails as documented above.

Article extraction's semantic and unsafe-link behavior passes its fixture test.
The repository's browser test seeds `currentArticle` directly, so it does not
exercise the literal toolbar-click → extraction → reader sequence in Chromium.

## Live deployment, privacy, PWA, and performance

The live deployment matches the candidate production build byte-for-byte for
the entry document, packaged extension, and fingerprinted entry assets:

```text
local/live index.html  becdebf85c6867c00383fd80b1e5c665c123fd4483861cef126cbcc59a2d06bf
local/live ZIP         72694dfd31a21d9c5ee00525c1a4f6853ddbbf5c98c31e3959e54d2d1e96f339
local/live JS          8d4182b158e416222174dd209e762257b5919ea61c9e0e6b80a41c7298de7573
local/live CSS         6191030e4f75ee9a88e7a80d21f9f6c7f9ce155b2ae730edd06cdb0c9d0bbf21
```

Fresh live Chromium checks at desktop and `390 × 844` cover `/`, `/demo/`,
`/privacy/`, `/terms/`, and the designed 404. The four normal routes have one
h1, a main landmark, `lang=en`, zero document overflow, no console/page errors,
and no serious/critical axe findings. The designed unknown route returns HTTP
404; Chromium logs that expected failed-document status.

The demo's normal, min/max, invalid-input, recovery, reset, keyboard, all-three-
contrast, and reduced-motion paths work aside from profile fidelity above.
Session storage uses only `demo:reader-profile` after a change; local storage is
empty. Request capture throughout the live home/demo flow contains only
`https://reader-setting-transfer.sociobot.in`. There are no analytics, remote
fonts, accounts, product APIs, payment calls, or Azure/OpenAI endpoints.

The service worker becomes controller, `registration.update()` completes, and
`/demo/` reloads with its article and offline banner while the browser is
offline. HTML revalidates; `sw.js` is `no-cache`; hashed JS/CSS and the ZIP are
one-year immutable. Live headers include a self-only CSP, HSTS, `nosniff`,
`DENY` framing, strict referrer policy, and restrictive permissions policy.

Fresh Lighthouse 13.4.1 mobile results for the live landing page:

```text
Performance 100 · Accessibility 100 · Best practices 100 · SEO 100
FCP 1.08 s · LCP 1.38 s · TBT 43 ms · CLS 0.00005 · transfer 93,082 B
```

Build budgets pass: initial JS 1.60 KB raw / 0.76 KB gzip, CSS 16.07 KB raw /
4.20 KB gzip, loaded Latin WOFF2 fonts 34.7 KB, mobile hero 48,954 B.

This is a static site plus local MV3 extension. It has no server-side endpoint,
product-unlock request, or sign-in flow, so rate-limit/`Retry-After` and Entra
tenant checks are not applicable.

Fresh screenshots, returned HTML, and `verify-url.sh` JSON are under
[`evidence/verification-3/`](evidence/verification-3/). Structured boundary,
privacy, extension, hash, and Lighthouse observations are in
[`independent-exercise.json`](evidence/verification-3/independent-exercise.json).

## Required remediation

1. Make each listed browser claim command build or serve its own clean demo
   prerequisite, then rerun every exact command from a post-`npm ci` clone.
2. Preserve every imported demo field, apply `measure`, and test an exact
   import → rendered style → export round trip including hidden fields.
3. Give `#article-source` an AA color in Dark page at 85% and 100%, and add
   axe coverage at minimum/default/maximum sizes in every contrast mode.
4. Add the per-site off/return promise to `claims.json` with an observable test.
5. Reduce reader markup to one h1 and remove 390 px options overflow/touch-
   target failures; replace raw JSON parser errors with actionable copy.
