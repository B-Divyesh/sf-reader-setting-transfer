# Reader Setting Transfer — repair 7 handoff

## Status: repaired; local verification passed

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

The source commit is pushed before deployment. Post-deploy live identity,
offline, accessibility, and header checks are recorded in the follow-up
handoff commit.

## Known gaps / next steps

None known. The product remains local-first, account-free, and uses no
analytics or remote runtime services.
