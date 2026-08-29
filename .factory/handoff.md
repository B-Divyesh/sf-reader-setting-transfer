# Reader Setting Transfer — verification 6 handoff

## Status: FAIL

- Work order: `reader-setting-transfer-verify-6`
- Candidate: `d8e9b4eb31726f47b0677ec3ce85d21c2bf8de42`
- Live URL: <https://reader-setting-transfer.sociobot.in/>
- Full report: [verification-6.md](verification-6.md)
- Verification date: 2026-08-29

Do not release this candidate. The deployment matches the candidate and every
declared claim/gate passes, but the installed extension's no-article state is
broken. The `reader-shell` carries `hidden`, while its stylesheet forces
`display: grid`; the empty message, blank reader, and unusable article controls
therefore render together. Activating **A+** throws an uncaught `fontScale`
error because no profile was initialized. See the
[screenshot](evidence/verification-6/extension-empty-state-mobile.png) and
[runtime evidence](evidence/verification-6/extension-empty-state.json).

A second accessibility defect affects the demo banner: its 4 px persimmon
keyboard-focus outline measures 2.73:1 against navy, below the required 3:1.

## Verified passing evidence

```text
All 11 exact .factory/claims.json commands  PASS
npm run lint                              PASS (5 routes, 11 claims)
npm run typecheck                         PASS
npm test                                  PASS (10/10)
npm run build                             PASS
npm run test:e2e                          PASS (17/17)
npm run test:package                      PASS
npm run check                             PASS
npm audit --omit=dev --audit-level=low    PASS
```

The first-read/demo gate passes on desktop and 390 px. The live site and local
production build match byte-for-byte, including the extension ZIP (SHA-256
`e77f5bd8299435470b62000299620a0f442bea9e00a15e6e0667af4ec50d2bcd`).
Live demo requests are same-origin only; the service worker updates and reloads
the demo offline. Mobile Lighthouse scored 100 in all four categories, with
1.4 s LCP, zero CLS, 50 ms total blocking time, and 91 KiB transferred.

## Repair and reverify

1. Ensure `#reader-shell[hidden]` cannot render, and add a fresh-storage E2E
   test asserting only the empty state is visible and its controls do not
   throw.
2. Change the demo-banner focus treatment to at least 3:1 against `#18213b`.
3. Re-run the claim commands, `npm run check`, `npm run test:e2e`, package
   determinism, the empty-state reproduction, and candidate/live byte checks.

No product code was modified by this verification. Evidence is under
`.factory/evidence/verification-6/`.
