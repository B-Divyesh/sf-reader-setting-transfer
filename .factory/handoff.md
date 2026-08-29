# Reader Setting Transfer — review 2 handoff

## Status: FAIL

Completed adversarial review 2 against repository commit
`a194fce97f77fdcec628fded0c344988dc023593` and the matching live deployment
at <https://reader-setting-transfer.sociobot.in/> on 2026-08-29 UTC. No product
code was changed.

The complete review is in `.factory/review-2.md`. It records 7 reopened
blocking findings, 6 new major findings, and 8 new minor findings. The primary
blockers are incomplete keyboard-claim coverage, missing focus after the hero
demo redirect, inconsistent route chrome, an unlabeled external link, and
three earlier copy/claim findings that remain unresolved.

## Verification completed

- Opened the live site cold at 390 × 844 and 1440 × 900.
- Exercised the one-click demo, Reset, download/exit cleanup, keyboard input,
  local/session storage isolation, offline reload, request log, and cookies.
- Inspected all required routes, metadata, headings, canonical/OG/favicon
  assets, unknown-route status, Back behavior, route focus, and navigation.
- Crawled every public link; intended destinations and the extension ZIP
  returned 200.
- Ran live Axe checks with no serious or critical findings.
- Read every earlier review, polish record, and handoff; checked all 39 earlier
  findings against both live output and source.
- Ran all 16 exact `.factory/claims.json` commands independently from clean
  clone `/tmp/rst-review2-clean-6Rox3z`; every command passed.
- Ran `npm run check`, `npm run test:package`, and `npm run test:e2e` from that
  clone. Results: 10/10 unit tests and 24/24 browser tests passed; build and
  deterministic package passed.
- Confirmed the live landing page, demo page, and extension ZIP hashes match
  the clean build.
- Confirmed `npm audit --omit=dev` has zero findings. The full dependency audit
  reports 10 development-tool findings and is recorded as F-2-14.

## How to reproduce

From a clean clone, run every command in `.factory/claims.json`, followed by:

```sh
npm ci
npm run check
npm run test:package
npm run test:e2e
VERIFY_EVIDENCE=.factory/evidence/review-2 node scripts/verify-live.mjs
npm audit
npm audit --omit=dev
```

The browser checks that exposed review findings also need the hero's
**Try it with sample data** path, every keyboard-operable control, and 200%
root text at a 390 × 844 viewport; the current shared verifier does not cover
those three cases.

## What remains

Resolve every finding in `.factory/review-2.md`, with reopened `F-1-*` IDs
first. Then rerun the exact claim commands and all live checks, including the
hero demo focus path and 200% text reflow at 390 px. The next review must not
accept a passing command when its assertions cover less than the registered
claim.
