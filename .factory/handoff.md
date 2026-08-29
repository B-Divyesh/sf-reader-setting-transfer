# Reader Setting Transfer — verification 7 handoff

## Status: FAIL

- Work order: `reader-setting-transfer-verify-7`
- Candidate: `79fbab36d7bc2e6ffcf446f78512373135d7b38f`
- Live URL: <https://reader-setting-transfer.sociobot.in/>
- Full report: [verification-7.md](verification-7.md)
- Verification date: 2026-08-29

Do not release this candidate. The live deployment exactly matches the
candidate and all listed commands pass, but independent product QA found two
release-blocking defects.

## Blocking findings

1. **High — reduced motion is not implemented in the demo.** Toggling
   **Reduce interface motion** changes only `data-reduce-motion`; computed
   animation and transition behavior is identical. The
   `@claim:reading-settings` test asserts that unused attribute instead of an
   observable result.
2. **High — fresh reader empty/error state is not keyboard-complete.** Its
   visible primary heading is `h2`; the only `h1` is blank and hidden. The
   **Skip to article** target is hidden, and **Return to original** remains
   enabled but does nothing without a stored article. Axe reports the moderate
   `page-has-heading-one` rule.
3. **Medium — the claims inventory is incomplete.** The site-wide
   no-analytics/no-cookies statement and landing-page offline statement have no
   matching clean-state tests in `.factory/claims.json`.
4. **Low — reset documentation is inaccurate.** Reset removes and then
   immediately recreates `demo:reader-profile` with defaults.

## What passed

- All 11 exact claim commands passed independently.
- `npm run lint`, `npm run typecheck`, `npm test` (10/10),
  `npm run test:e2e` (19/19), `npm run build`, `npm run test:package`, and
  `npm run check` passed.
- `npm audit --omit=dev --audit-level=low` found zero production
  vulnerabilities. The full development tree has 10 transitive advisories.
- Cold first read passed at desktop and 390 px, including the one-click sample
  action.
- Live demo boundary, invalid-input, recovery, reset, export/import, privacy,
  and offline paths otherwise worked.
- Public route axe scans found no serious/critical issues; keyboard focus,
  touch targets, responsive layouts, and reduced-motion media behavior passed.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.4 s, CLS 0, TBT 0 ms, 91 KiB transfer.
- Caching and security headers are correct. There are no runtime third-party
  requests or cookies in the tested flows.
- Every checked live file byte-matches the candidate. Extension ZIP SHA-256:
  `7c4831b7ef0d76c8f75914acf2ff711b0b7c5c37cd0a6d5b8e9c66fdfe27967c`.

## Reproduce

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

Primary evidence is in [evidence/verification-7](evidence/verification-7/),
especially `live-demo-motion.json`, `live-extension-empty.json`,
`live-candidate-compare.log`, and `lighthouse-mobile.json`.

No product code was modified. Only verification evidence and these handoff
documents were added or updated.
