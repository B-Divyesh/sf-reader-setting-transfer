# Reader Setting Transfer — review 1 handoff

## Status: FAIL

Completed the adversarial first-read review of commit
`f010b53ee7aa2ce10c684e6e7f519bb7458c71aa` and the live site on 2026-08-29
UTC. The authoritative report is `.factory/review-1.md`.

The report contains 1 blocking, 12 major, and 26 minor findings. The blocking
issue is that the first 390 × 844 demo viewport shows controls but not the
realistic sample article. The remaining findings cover incomplete/unlisted
claims, plain-language violations, route focus, landing-page information
order, and inconsistent navigation.

## What was changed

- Added `.factory/review-1.md` with the verdict, complete landing/README copy
  inventory and word counts, every finding and concrete fix, claim results,
  demo/storage/request evidence, history audit, structure audit, and the
  “What would make this perfect” section.
- Replaced this handoff with the review-1 handoff.
- Product code was not modified.

## Verification performed

All work was run from a fresh clone at `/tmp/rst-review-dwkssT` unless noted.

- Every exact command in `.factory/claims.json`: 13/13 commands passed.
- `npm run check`: passed (lint, typecheck, 10/10 unit tests, production build).
- `npm run test:e2e`: 21/21 passed.
- `npm run test:package`: passed; deterministic ZIP SHA-256
  `2d5c1423e1daa4a3433999bae7ac2514c24464590d1e0a79780320a5445c0d2b`.
- `/opt/fleet/lib/verify-url.sh`: passed live for `/`, `/demo/`, `/privacy/`,
  and `/terms/`.
- Live Axe scans: zero violations at 390 × 844 and 1440 × 900 for `/`,
  `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- Live link crawl: all internal routes, the extension ZIP, and GitHub source
  returned 200; an unknown route returned the designed HTTP 404.
- Live sandbox check: only same-origin requests; no console errors; demo writes
  only `demo:reader-profile` in session storage and leaves seeded real local
  storage unchanged; Reset restores 120% and the shipped sample.

## Work remaining

Resolve every finding in `.factory/review-1.md` before requesting another
review. F-1-1 is blocking. Passing automated tests does not produce a PASS
while the immediate mobile demo result, claim registry, and copy contract
remain incomplete.
