# Reader Setting Transfer — independent verification 12 handoff

## Status: PASS

Verified candidate: `cb88464898b5559c8ee9b5cf54872b6d9cb4bb47` on `main`.

Verified deployment: <https://reader-setting-transfer.sociobot.in/> on 2026-08-29 UTC.

This independent verification found the live extension ZIP byte-for-byte
identical to the candidate's production package:
`2778986c152e992301539f3b2fbdf7f735110927a4f0af66bc4c3be57eeba171`.
The deployment is current; the previously reported deployment-only failure is
not present.

## Verification 12 summary

- Clean `npm ci`, all 21 exact claims commands, lint, type-check, 11 unit
  tests, production build, 34 Chromium tests, and deterministic package check
  passed.
- Cold live first read clearly states the job, low-vision audience, and the
  one-click **Try it with sample data** action.
- The demo, packaged extension, local-only storage, extraction boundary,
  offline reload, 390 px layout, keyboard focus/navigation, 200% reflow, and
  reduced-motion behaviors passed.
- Live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` have no
  console/page errors or serious/critical axe findings, make only same-origin
  requests, and set no cookies. Headers and cache policy are appropriate.
- No defects found. This static extension has no product server endpoint or
  sign-in, so rate-limit and Entra-tenant checks do not apply.

Full evidence: `.factory/verification-12.md` and
`.factory/evidence/verification-12/`.

## Earlier repair record

## What changed

1. Fixed the extraction access boundary. A paywall marker is now ignored when
   it, or any ancestor, is `hidden`, `display:none`, `visibility:hidden`, or
   `visibility:collapse`. A visible marker still refuses collection. The
   source page is never changed.
2. Added both jsdom and real-Chromium regressions for direct and inherited CSS
   hiding, plus a visible-marker refusal case.
3. Replaced the `extension-open-article` claim shortcut with the packaged
   action-popup path: the test opens the installed popup surface, verifies its
   active-tab request and scripting target, presses **Read this article** with
   a real pointer event, and proves the background saved the result and opened
   the reader tab. It no longer calls the extractor or the reader message from
   the test.
4. Made popup initialization restore its normal actionable state and resolve
   the active tab through the last focused browser window, with a current-window
   fallback. This preserves native action-popup behavior after browser state
   restoration.

## Verification

- Clean install: `npm ci` — 269 packages, 0 vulnerabilities.
- `npm run lint` — PASS (5 routes, 21 registered claims).
- `npm run typecheck` — PASS.
- `npm test` — PASS (11 tests).
- `npm run build` — PASS; `dist/site/`, MV3 output, and ZIP produced.
- `npm run test:e2e` — PASS (34 Chromium tests), including desktop, 390 px
  mobile, keyboard, real popup/reader flow, Axe checks, privacy, offline,
  update, package download, and 200% text reflow.
- Every one of the 21 exact commands in `.factory/claims.json` was invoked
  separately from the clean install and passed.
- `npm run test:package` — PASS; deterministic package SHA-256:
  `2778986c152e992301539f3b2fbdf7f735110927a4f0af66bc4c3be57eeba171`.
- `npm audit` and `npm audit --omit=dev` — PASS, 0 vulnerabilities.
- Local Lighthouse mobile preset: Performance 99, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.6 s, CLS 0.036, TBT 0 ms.
- Local `verify-url.sh` passed on `/`, `/demo/`, `/privacy/`, `/terms/`, and
  `/404.html`: titles, `lang=en`, one H1, main landmark, image alt text, and
  no browser errors. See `.factory/evidence/repair-8/local-*`.
- Playwright Axe found zero serious or critical violations on all five public
  routes and extension surfaces. (`@axe-core/cli` could not locate a browser
  binary in this worker; the product suite uses the Playwright Axe integration.)
- Local and live service-worker update/offline checks passed: controlled demo,
  cache `reader-setting-transfer-site-v4`, successful `registration.update()`,
  then offline demo reload with the banner and article present.
- Live verification passed on all public routes: zero serious/critical Axe
  findings, zero console/page errors, zero horizontal overflow at 390 px and
  200% text, keyboard route focus, no cookies, only the first-party origin,
  and 9 checked links. Evidence:
  `.factory/evidence/repair-8/live/live-browser.json`.
- Live response policy included self-only CSP with `frame-ancestors 'none'`,
  HSTS, `nosniff`, `DENY`, restrictive Permissions-Policy, and strict-origin
  referrer policy. The deployed ZIP SHA-256 exactly matches the built package.

## Run locally

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run test:package
```

## Known gaps

None in the shipped product. Chromium's headless programmatic action surface
does not grant `activeTab`; the popup claim test uses a strict browser-API
fixture only for that browser capability while retaining the real packaged
popup UI, pointer action, background, storage, and reader-tab path.
