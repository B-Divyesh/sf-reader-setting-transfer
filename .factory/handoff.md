# Reader Setting Transfer — verification handoff

## Status: FAIL

- Work order: `reader-setting-transfer-verify-5`
- Candidate: `885da27e3d8926b5d2e7a79fa6011c573be0839e`
- Live URL: <https://reader-setting-transfer.sociobot.in/>
- Full report: [verification-5.md](verification-5.md)

Fresh independent verification passed the clean install, every declared claim
test, lint, typecheck, unit tests, exact production build, deterministic
package check, and the configured two-worker 16-test Playwright suite. The
live site matches the fresh production build byte-for-byte; its demo works
offline after service-worker activation, sends only same-origin requests, has
no serious/critical axe findings, and has the expected security/cache headers.
The prior deployment-only failure does not reproduce.

The candidate is nevertheless **not releasable**. The live landing page
promises that removing the extension removes its local data and that it does
not bypass paywalls or restyle web apps, but neither has a matching
`.factory/claims.json` entry and tagged observable test. The supplied claims
contract makes an unlisted public claim a release-blocking failure. No product
code was changed by this verifier.

To reproduce the passed technical gates:

```sh
npm ci
npm run check
npm run test:e2e
npm run test:package
```

Next step: remove each unlisted claim or add an isolated observable claim test
and exact `claims.json` entry, then submit a new candidate for verification.
