# Independent verification report — FAIL

Work order: `reader-setting-transfer-verify-7`

Candidate: `79fbab36d7bc2e6ffcf446f78512373135d7b38f` (`79fbab3`)

Live URL: <https://reader-setting-transfer.sociobot.in/>

Verified: 2026-08-29

## Verdict

**FAIL — do not release this candidate.** The deployment is healthy and every
deployable file byte-matches the candidate. All 11 listed claim commands and
all repository gates pass. Independent testing nevertheless found two
release-blocking product defects:

1. The demo's reduced-motion control has no observable effect, while a claim
   says that the demo applies it. The claim test only checks an unused data
   attribute.
2. The fresh reader's empty/error state has no visible level-one heading, its
   skip link targets the hidden article, and it leaves an enabled but inert
   **Return to original** action visible.

The claim inventory also omits two public site claims that the contract says
must have sandbox tests. No product code was changed during verification.

## Release-blocking defects

### High — the demo does not apply its reduced-motion setting

The first claim promises that the sample applies reduced-motion settings to a
clean article. On the live `/demo/` route at 390 x 844 with the operating-system
motion preference set to `no-preference`:

1. The shipped sample starts with **Reduce interface motion** checked and
   `data-reduce-motion="true"`.
2. No element in the sample reader has an animation or transition.
3. Unchecking the control changes only the attribute to `false`; the computed
   animation/transition set remains empty.

The demo stylesheet contains no selector for `data-reduce-motion`. The authored
claim test at `e2e/site.spec.ts` verifies only that the attribute changed, not
that motion behavior changed. This conflicts with the claims rule that tests
must assert the promised observable outcome. It also means the required
one-click sample cannot demonstrate one of the brief's six core settings.

Evidence: [computed styles before and after](evidence/verification-7/live-demo-motion.json)
and [the passing but insufficient claim log](evidence/verification-7/claims/reading-settings.log).

### High — the fresh reader has a broken heading and keyboard path

I downloaded the live extension ZIP, installed it in a new Chromium profile,
cleared extension storage, and opened `reader.html` at 390 x 844. The exact live
ZIP SHA-256 was
`7c4831b7ef0d76c8f75914acf2ff711b0b7c5c37cd0a6d5b8e9c66fdfe27967c`.

Observed in the empty state:

- The visible primary heading, “Open an article, then choose the extension,”
  is an `h2`. The only `h1` is blank inside the hidden reader shell, so it is
  absent from the accessibility tree. Axe reports `page-has-heading-one`
  (moderate).
- The first Tab stop is **Skip to article**, whose `#article` target is inside
  that hidden shell. Enter changes the hash, leaves focus on `body`, and skips
  nowhere.
- **Return to original** remains visible and enabled even though `articleUrl`
  is empty. Activating it leaves the URL and state unchanged.

This violates the required one-visible-`h1` hierarchy, functional skip link,
keyboard behavior, and first-class empty/error state. The regression test
currently codifies the problem by expecting zero accessible level-one headings
in this state.

Evidence: [live ZIP state and interaction trace](evidence/verification-7/live-extension-empty.json)
and [390 px screenshot](evidence/verification-7/live-extension-empty-mobile.png).

### Medium — public claims are missing from `claims.json`

The claims inventory does not cover these statements:

- `/privacy/`: “This static website includes no analytics, advertising,
  tracking pixels, cookies, account system, or remote fonts.” The only
  website request/storage claim test is scoped to `/demo/`; no listed test
  checks cookies or every public route.
- `/`: the offline banner says “The page still works,” but the listed offline
  claim and its test cover only `/demo/`.

Fresh observation supports both statements: all checked routes made only
same-origin requests, response headers set no cookies, browser cookie storage
was empty, and the service worker caches the landing shell. That does not
replace the mandatory listed sandbox tests. Under the supplied claims
contract, an unlisted public claim is release-blocking.

### Low — reset documentation contradicts final storage state

`.factory/demo.md` says **Reset demo** removes `demo:reader-profile`. The handler
removes it and then calls the normal persistent render path, which immediately
recreates the key with sample defaults. The live result is safe and isolated,
but the documented final state is inaccurate.

## Mandatory first checks

### Claims commands: all command-level PASS

After `npm ci`, every exact `test` value in `.factory/claims.json` ran
independently from this clean candidate checkout:

| Claim | Result |
| --- | --- |
| `reading-settings` | PASS; 1 Playwright test |
| `profile-json-transfer` | PASS; 1 Playwright test |
| `demo-isolation` | PASS; 1 Playwright test |
| `offline-reload` | PASS; 1 Playwright test |
| `extension-local-reader` | PASS; 1 Playwright test |
| `per-site-off-return` | PASS; 1 Playwright test |
| `article-structure` | PASS; 1 Vitest test |
| `free-open-source` | PASS; 1 Vitest test |
| `responsive-keyboard` | PASS; 1 Playwright test |
| `extension-uninstall-data` | PASS; 1 Playwright test |
| `access-boundaries` | PASS; 1 Vitest test |

Individual logs are in [the claims evidence directory](evidence/verification-7/claims/).
The command-level pass does not cure the behavioral defect in
`reading-settings` described above.

### Cold first read: PASS

A fresh live Chromium context at 1440 x 900 showed, in the first viewport:

- What it does: “Carry your reading settings into clean articles.”
- For whom: “For low-vision readers tired of resetting text size, spacing,
  contrast, and motion on every site.”
- What to do: **Try it with sample data**, with nearby copy saying it opens a
  ready sample article without saving to real data.

One click opened `/demo/` with a realistic city-tree article, controls, and the
persistent “Demo — sample data, nothing is saved” banner. The gate passes at
desktop and 390 px.

Evidence: [desktop first screen](evidence/verification-7/verify-url-root/screenshot-desktop.png)
and [mobile first screen](evidence/verification-7/verify-url-root/screenshot-mobile.png).

## Clean local gates

```text
npm ci                                  PASS (489 packages)
npm run lint                            PASS (5 routes, 11 claims)
npm run typecheck                       PASS
npm test                                PASS (3 files, 10 tests)
npm run test:e2e                        PASS (19/19)
npm run build                           PASS; dist/site + MV3 package produced
npm run test:package                    PASS; ZIP valid and deterministic
npm run check                           PASS
npm audit --omit=dev --audit-level=low  PASS (0 production vulnerabilities)
```

The full development audit reports 10 transitive advisories: 1 low, 2
moderate, 4 high, and 3 critical. They are not in production dependencies.
Gate logs are in [verification-7 evidence](evidence/verification-7/).

## Independent functional exercise

The live demo passed its other representative paths:

- A boundary profile applied 180% text, 40-character measure, 2.20 line
  spacing, 2.5 paragraph spacing, 0.08 letter spacing, dark contrast, and the
  spacious sans-serif stack.
- Malformed JSON, version 2, text scale 99, and a file over 20 KB each produced
  specific live-region errors. A valid 85% profile imported immediately after
  the errors.
- **Reset demo** restored the 120% sample and focused the article.
- **Start for real** downloaded `reader-setting-transfer-chrome.zip` and
  cleared the demo session key.
- The full MV3 suite saved and rendered a local article, exercised all contrast
  modes and text-size boundaries, preserved semantic content, refused visible
  paywalls, returned to an original URL with a per-site override, recovered
  from malformed profile input, and verified uninstall cleanup.

The demo used only `demo:reader-profile` in `sessionStorage`; `localStorage`
remained empty. Its complete flow requested only
`https://reader-setting-transfer.sociobot.in`. The installed extension made no
HTTP(S) requests in its options/reader flows.

Evidence: [live input exercise](evidence/verification-7/live-demo-inputs.json),
[live browser exercise](evidence/verification-7/live-independent.json),
[full MV3/browser suite](evidence/verification-7/e2e-full.log), and
[unit extraction suite](evidence/verification-7/unit.log).

## Deployment, headers, caching, and privacy

- Every deployable local artifact checked against live matched byte-for-byte,
  including all HTML routes, hashed assets, fonts, images, metadata, service
  worker, and extension ZIP. Host-only `_headers` and
  `staticwebapp.config.json` were validated through observed behavior.
- HTML uses `max-age=0, must-revalidate`; `sw.js` uses `no-cache`; hashed
  assets and the ZIP use `max-age=31536000, immutable`. The ZIP has
  `Content-Disposition: attachment`.
- Live responses include a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, frame denial, strict referrer policy, and restrictive permissions
  policy. No `Set-Cookie` header was observed.
- The live service worker reached `activated`, updated successfully, and
  reloaded `/demo/` offline with its sample, demo banner, and offline notice.
- An unknown route returned the designed page with HTTP 404. All 13 unique
  links found across public routes resolved; the external GitHub link returned
  200.

Evidence: [candidate comparison](evidence/verification-7/live-candidate-compare.log),
[headers](evidence/verification-7/live-headers.log), and
[service-worker/browser results](evidence/verification-7/live-independent.json).
The [privacy capture](evidence/verification-7/live-privacy.json) records an
empty cookie jar and no `Set-Cookie` responses.

This is a static, account-free browser-extension product. It has no server API,
product-unlock endpoint, payment path, sign-in, or AI runtime. Rate-limit,
`Retry-After`, Sociobot billing, AI gateway, and Entra authority checks do not
apply.

## Accessibility, responsive behavior, and performance

- The supplied `verify-url.sh` passed `/`, `/demo/`, `/privacy/`, and `/terms/`
  live at desktop and 390 px: title, `lang`, one public-page `h1`, main
  landmark, image alt text, and no console/page errors.
- Independent axe scans of five public routes at desktop and 390 px, with
  reduced motion, found no serious or critical issues. Normal 390 px layouts
  had no overflow and no undersized interactive targets. All demo controls
  were reachable by keyboard with visible 4 px focus indicators.
- At 200% root text size, all headings and controls remained available; no
  interactive element was clipped. The landing and privacy pages required a
  small horizontal pan (40 px and 50 px respectively), without content loss.
- Reduced-motion media replaces motion with `0.01 ms` durations. There is no
  flashing or looping content.
- Live mobile Lighthouse scored Performance 100, Accessibility 100, Best
  Practices 100, and SEO 100. LCP was 1.4 s, CLS 0, total blocking time 0 ms,
  and total transfer 91 KiB. INP was not measured in the synthetic no-input run.
- Landing JS is 1,600 B raw / 778 B gzip; demo JS is 4,688 B / 1,727 B gzip;
  CSS is 16,151 B / 4,217 B gzip; initially requested WOFF2 fonts total 34,732
  B; the mobile hero is 48,954 B. All supplied budgets pass.

Evidence: [Lighthouse JSON](evidence/verification-7/lighthouse-mobile.json),
[200% text results](evidence/verification-7/live-text-200.json), and the
[route verification directories](evidence/verification-7/).

## Required repairs

1. Give the demo's reduced-motion setting a real, observable behavior and make
   `@claim:reading-settings` assert that behavior rather than a data attribute.
2. In empty/error reader states, promote the visible page heading to `h1`,
   point the skip link at a visible target, and hide or disable
   **Return to original** until an original article URL exists. Replace the
   regression expectation of zero accessible `h1` headings.
3. Add claim entries and clean-state tests for the whole-site no-tracking/
   no-cookie statement and landing-page offline behavior, or narrow/remove the
   public copy.
4. Align `.factory/demo.md` with the reset key's actual final state, or avoid
   recreating the key during reset.
