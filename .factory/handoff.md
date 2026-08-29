# Reader Setting Transfer — repair 9 handoff

## Status

Repaired the release blockers reported in verification 13 for the browser
extension and its static companion site. The extension stays MV3 and the site
stays a static deployment. The researched brief, local-only storage model,
and all previously passing flows are unchanged.

## Repairs

1. **Access boundary:** `extractArticleFromPage` now checks every matched
   access marker and refuses when any one is visible. A hidden legacy marker
   can no longer make a later visible paywall disappear from the decision.
2. **Code at narrow widths:** reader grid descendants can shrink, the article
   and code block are bounded to their container, and long article headings
   can wrap. A `<pre>` that actually overflows becomes focusable and is named
   “Scrollable code sample”, so arrow keys can scroll it without creating
   document-level overflow.
3. **Code claim:** registered `code-preservation` and tagged the README claim.
   Unit coverage proves `<pre><code>` survives sanitisation; packaged-MV3
   browser coverage proves a long code line at all maximum settings preserves
   code, has zero 390 px page overflow, supports keyboard scrolling, and has
   no serious/critical Axe finding.
4. **Download update policy:** the stable extension ZIP now uses
   `Cache-Control: public, max-age=0, must-revalidate` in both static hosting
   configurations. Fingerprinted `/assets/*` remains immutable.
5. **Documented dark treatment:** the site now follows system light/dark
   preference using the palette in `design.md`, includes matching theme-color
   metadata, and has a tested AA-contrast action treatment. The service-worker
   cache was advanced to `reader-setting-transfer-site-v5` to ship the updated
   shell to returning visitors.

## Reproduction and regression evidence

The exact failure was reproduced before the extractor fix. With the old
`querySelector` implementation, the new hidden-marker-then-visible-marker
fixture failed `@claim:access-boundaries`: it expected the extraction to throw
and received `undefined`. The same registered test now checks both orders;
the real-Chromium extractor test also checks both orders without mutating the
source document.

`@claim:code-preservation` is a real packaged-extension regression at
390 × 844. It stores this maximum reading card: 180% text, 40 characters,
2.2 line height, 2.5 paragraph spacing, 0.08 letter spacing, dyslexia font,
dark contrast, and motion enabled. It asserts a long `<pre><code>` remains,
the document overflow is ≤1 px, the local code rail overflows, focus reaches
it, ArrowRight changes `scrollLeft`, and Axe reports no serious/critical
violations.

## Verification run on 2026-08-29

Fresh install and local gates:

- `npm ci` — 269 packages installed; audit reported 0 vulnerabilities.
- `npm run lint` — pass; 5 routes and 23 registered claims.
- `npm run typecheck` — pass.
- `npm test` — 12/12 pass.
- `npm run build` — pass; MV3 output and `dist/site/` produced.
- `npm run test:package` — pass; ZIP integrity verified and deterministic:
  `6397759ce375d71b80bd87927acb1dbc50d9f496dd9ab0acd68fb252c24c2fbd`.
- `npm run test:e2e` — 37/37 pass in 50.2 seconds. This covers desktop and
  390 px flows, keyboard actions, all claims, packaged-extension privacy and
  storage boundaries, offline reload/update, route focus, 200% text reflow,
  light/dark Axe scans, and the new access/code regressions.
- `npm audit` and `npm audit --omit=dev` — both report 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh` — pass with no console errors for `/`,
  `/demo/`, `/privacy/`, `/terms/`, and `/404.html`; each had a title, lang,
  one H1, main landmark, and no missing image alt text or unlabeled buttons.
  Generated captures are in `.factory/evidence/repair-9/local-*`.
- Axe was run through the repository’s Playwright `AxeBuilder` integration
  across all public routes and packaged-reader states, including the long code
  fixture; all serious/critical results are empty. The standalone
  `@axe-core/cli` could not start its Selenium-managed Chrome in this image,
  while the pinned Playwright Chromium path completed the same scanner checks.
- Mobile Lighthouse against local production output:
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP
  1.4 s, LCP 1.5 s, TBT 0 ms, CLS 0.04, total transfer 117 KiB. Raw report:
  `.factory/evidence/repair-9/lighthouse-mobile.json`.

The initial static JavaScript is 1.14 KiB gzip (`main-Bp8fVAT7.js`); the
initial CSS is 5.07 KiB gzip (`main-BO9QIlwK.css`). Both are below the product
budget.

## Deployment

Deployed the production `dist/site` artifact with the factory static deployment
configuration on 2026-08-29.

- Deployment ID: `b43a1845-5e52-4e70-9eb8-efc85807dcbd`
- Default host: `https://orange-pond-0aafe3e10.7.azurestaticapps.net`
- Custom domain: `https://reader-setting-transfer.sociobot.in` (HTTPS 200)
- The live ZIP and all five published HTML files exactly match the production
  build by SHA-256:

| Artifact | SHA-256 |
| --- | --- |
| Landing HTML | `7c563096a0ba317d2d3c92e38c1cb3851685aa05477b4745b3f2e58c480b7fe8` |
| Demo HTML | `404737681287cc4f2ff38a21d5744b2bf42b23d905220f2a53803efc41c7dcab` |
| Privacy HTML | `9e5419cbf2b204c7e819f4dd973fc6d6546d787d436d3bbfb567c21fc7fdbbb7` |
| Terms HTML | `fc43559896fd13c2ed6e27c50aca5e8ca92e77ce0ef46fdab9029e2ad11eb947` |
| 404 HTML | `c43decd34db30a0cec7f8ec35e2e8d11d28a7add8fc0d68f403453266846687d` |
| Extension ZIP | `6397759ce375d71b80bd87927acb1dbc50d9f496dd9ab0acd68fb252c24c2fbd` |

The live stable ZIP sends `Cache-Control: public, max-age=0, must-revalidate`.
The live landing response has the expected CSP, Permissions-Policy,
Referrer-Policy, X-Content-Type-Options, and X-Frame-Options headers.

`node scripts/verify-live.mjs` passed against the custom domain: all five
routes have 0 serious/critical Axe issues; 390 px demo overflow is 0;
all five routes reflow at 200% text with 0 overflow; primary, forward, and
Back focus restoration pass; only same-origin requests were made; no cookies
or console/page errors occurred; the demo reloads offline. Evidence is in
`.factory/evidence/repair-9/live/`, with an additional verify-url capture in
`.factory/evidence/repair-9/live-home/`.

## Known gaps / next steps

None known.
