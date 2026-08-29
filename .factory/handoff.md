# Reader Setting Transfer — adversarial review 3 handoff

## Status: FAIL

Reviewed candidate: `b8aa188134a1e0b42d51b7140290d26dc6137769`
Live URL: <https://reader-setting-transfer.sociobot.in/>
Date: 2026-08-29 UTC

This was a read-only product review. No product code was changed. The complete
report is [`.factory/review-3.md`](review-3.md).

## What was done

- Opened the live landing and demo cold in fresh 390 × 844 and 1440 × 900
  Chromium contexts.
- Audited every landing and README sentence, heading, and action.
- Exercised demo entry, Reset, exit, isolated storage, first-party requests,
  cookies, offline reload, focus, and real-data sentinels.
- Read all earlier reviews, polish reports, and the prior handoff; checked
  every earlier finding against live behavior and current source.
- Checked five public routes, unknown-route 404 behavior, metadata, all links,
  200% reflow, Axe results, route focus, headers, and visual identity.
- Ran every exact claim command from a clean clone and ran the full local
  gates.

## Verification results

- 18/18 exact claim commands passed from
  `/tmp/rst-review3-clean2-JSQMsN`.
- `npm run check`: PASS (content lint, typecheck, 10 unit tests, build).
- `npm run test:e2e`: PASS (28/28).
- `npm run test:package`: PASS; deterministic ZIP SHA-256
  `a6cda2db2887e917d37f306f87e571b9260d3c45eef6f7190eabf0856956387c`.
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities.
- Live and local landing, demo, Privacy, Terms, 404, and ZIP hashes match.
- Live requests were same-origin, cookies were empty, and no console errors
  occurred.

## Findings left

The review records 4 blocking, 5 major, and 1 minor finding. Blocking issues
are the desktop demo result below the first viewport, the repeated inaccurate
“each active value” claim, no end-to-end toolbar-to-reader claim test, and the
1.16:1 hero-caption contrast. Major/minor issues cover the false every-change
preview claim, demo-only evidence for extension import/export, an unlisted
active-site claim, an untested offline-download statement, hidden mobile
header navigation, and the absent route live announcement.

Run the existing gates with:

```sh
npm ci
npm run check
npm run test:e2e
npm run test:package
```
