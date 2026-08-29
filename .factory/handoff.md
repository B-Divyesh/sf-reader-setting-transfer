# Reader Setting Transfer — review 4 handoff

## Status: FAIL

Reviewed commit `52f2184563cc0ef8798439402044de19c0017f75` and the live
deployment on 2026-08-29 UTC. No product code was changed.

The full adversarial report is `.factory/review-4.md`. It records two blocking
reopened findings, one major finding, and one minor finding:

- `F-3-1`: the registered `extension-open-article` command failed on its first
  clean invocation and passed only on retry.
- `F-3-8`: the route live-region text is visibly rendered because the public
  site does not define `.sr-only`.
- `F-4-1`: turning the reader back on for a site is publicly claimed but is not
  registered or tested.
- `F-4-2`: “its local data leaves with it” is metaphorical copy.

## Verification performed

- Fresh live Chromium contexts at 390 × 844 and 1440 × 900.
- One-click demo, Reset, isolated storage, offline reload, and request log.
- Every exact command in `.factory/claims.json`, separately, after `npm ci` in
  `/tmp/rst-review4-clean-MWKrgg`: 20 passed and one failed on the first run.
  The failed command passed on one retry.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`,
  `npm run test:package`, and both dependency audits passed.
- Five-route metadata, Axe, console, 200% reflow, route focus, 404, headers,
  and same-origin/no-cookie checks.
- All 13 unique links across the public routes returned 200.
- Live and local landing HTML and extension ZIP hashes match.
- All earlier reviews, polish reports, and the prior handoff were rechecked.

## Evidence

- `.factory/evidence/review-4-cold-mobile.png`
- `.factory/evidence/review-4-cold-desktop.png`
- `.factory/evidence/review-4-demo-mobile.png`
- `.factory/evidence/review-4-demo-desktop.png`

## Next step

Repair the four findings, then rerun all 21 claim commands from a new clean
clone. Do not accept a retry as evidence for the core article-opening claim.
