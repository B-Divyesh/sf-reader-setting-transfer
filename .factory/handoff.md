# Reader Setting Transfer — verification 8 handoff

## Status: PASS

Verified candidate `e96a391edfaebf73b61ebe24b18e304bb7740371` against <https://reader-setting-transfer.sociobot.in/> on 2026-08-29 UTC.

All 13 mandatory claim commands, local quality gates, full 21-test browser suite, production build, deterministic package check, live accessibility/browser checks, offline service-worker reload, privacy/request/header checks, and candidate-to-live SHA-256 comparison passed. Every one of 27 deployable files matches live. No critical, high, medium, or low release defect was found.

Read the authoritative independent report in `.factory/verification-8.md`. Evidence, including live route screenshots and Lighthouse JSON, is under `.factory/evidence/verification-8/`.

---


# Reader Setting Transfer — repair 7 handoff

## Status: repaired, deployed, and verified live

- Work order: `reader-setting-transfer-repair-7`
- Repaired candidate base: `79fbab36d7bc2e6ffcf446f78512373135d7b38f`
- Artifact and deployment class: MV3 browser extension plus static site
- Deploy target: <https://reader-setting-transfer.sociobot.in/>

## Repairs

1. The demo now gives **Reduce interface motion** real behavior. When it is
   off, the sample article has a 220 ms settle animation and 180 ms article
   transitions. When it is on, both computed animation and transition values
   are `none` / `0s`. OS reduced-motion still overrides all demo movement.
   The `@claim:reading-settings` browser test now asserts those computed
   values instead of only reading a data attribute.
2. A fresh or failing extension reader now exposes its visible empty-state
   title as the one accessible H1, sends its skip link to a focusable visible
   `main` landmark, and hides **Return to original** until a stored article
   supplies an original URL. The fresh-reader MV3 regression exercises the
   keyboard path and the storage-error state.
3. Added listed, clean-context claims for landing-page offline reload and the
   public no-tracking/no-cookie promise. The privacy test traverses every
   public route and asserts first-party-only requests, no `Set-Cookie`, and an
   empty cookie jar.
4. Corrected demo documentation: reset replaces the session key with the
   shipped sample card; it does not leave the key absent.

## How to run and verify

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run test:package
npm run check
```

The reproducible production build command remains exactly `npm run build`.

## Evidence

- `npm ci`: installed 489 packages. It reports 10 transitive development-only
  advisories; `npm audit --omit=dev --audit-level=low` passes with 0 production
  vulnerabilities.
- `npm run lint`: passed for 5 public routes and 13 claims.
- `npm run typecheck`: passed.
- `npm test`: 3 files / 10 tests passed.
- Every exact command from `.factory/claims.json`: passed. This includes all
  13 claims, with the new computed-motion, landing-offline, and whole-site
  no-cookie/request tests.
- `npm run test:e2e`: 21/21 passed. It covers real MV3 installation,
  fresh-reader keyboard behavior, 390 px layouts, offline reload, import and
  export, privacy, and Axe serious/critical scans of public routes and reader
  contrast states.
- `npm run build`: passed and produced `.output/chrome-mv3` and `dist/site`.
  Initial site JS is 1.60 kB raw / 0.76 kB gzip; demo JS is 4.69 kB raw /
  1.71 kB gzip; site CSS is 16.64 kB raw / 4.31 kB gzip.
- `npm run test:package`: passed; deterministic package SHA-256:
  `2d5c1423e1daa4a3433999bae7ac2514c24464590d1e0a79780320a5445c0d2b`.
- `npm run check`: passed.
- `/opt/fleet/lib/verify-url.sh` passed locally for `/`, `/demo/`,
  `/privacy/`, and `/terms/`: titles, `lang`, one H1, `main`, image alt text,
  and zero console/page errors. Standalone `@axe-core/cli` could not discover
  Chrome in this container; the equivalent in-repository Playwright Axe scans
  passed as part of the 21-test browser suite.

## Deployment and live checks

- Source repair commit: `cbf4fc6` (`fix: repair motion and fresh reader states`),
  pushed to `origin/main` before deployment.
- Deployed with `/opt/fleet/lib/deploy-static.sh reader-setting-transfer
  dist/site` to the existing Standard Static Web App in `centralus`.
- Live identity passed: local and downloaded live `index.html` both SHA-256
  `44946533db65d3fbe41167ed7c52cf9139a0e66fa470590ccbd00f4f8bed193a`;
  local and live extension ZIP both SHA-256
  `2d5c1423e1daa4a3433999bae7ac2514c24464590d1e0a79780320a5445c0d2b`.
- `/opt/fleet/lib/verify-url.sh` passed live for `/`, `/demo/`, `/privacy/`,
  and `/terms/` at desktop and 390 px. Every route had one H1, `lang=en`, a
  main landmark, complete image alt text, and no console/page errors.
- Live Playwright/Axe checks over `/`, `/demo/`, `/privacy/`, `/terms/`, and
  `/404.html` found no serious or critical violations. The same run confirmed
  no console errors, only the product origin requested, no `Set-Cookie`, and
  an empty browser cookie jar.
- Live repaired motion behavior: with OS motion set to `no-preference`, an
  unchecked control computed `demo-reader-settle`, `0.22s`, and `0.18s`;
  checked motion reduction computed `none`, `0s`, and `0s`.
- Live mobile/keyboard/offline check: 390 px overflow was `0`; Arrow Right
  scrolled the keyboard-focusable promise strip; after service-worker control
  and update, an offline landing reload rendered both the H1 and offline
  notice.

## Known gaps / next steps

None known. The product remains local-first, account-free, and uses no
analytics or remote runtime services.
