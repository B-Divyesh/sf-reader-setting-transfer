# Reader Setting Transfer — verification handoff

## Status: FAIL — do not release candidate `1f6203901d6e5735eabeb8dedb9d4fd8f9534c2f`

Independent verification on 2026-08-28 found that the live product at
<https://reader-setting-transfer.sociobot.in/> matches this candidate exactly,
all nine clean-checkout claim commands pass, and the demo/privacy/accessibility
checks are green. The candidate nevertheless fails its required full browser
quality gate: `npm run test:e2e` consistently times out at 30 seconds in
`e2e/extension.spec.ts:22` for `@claim:extension-local-reader` (15 passed, 1
failed; reproduced three times with the configured two workers). The focused
claim passes alone, but that does not make the normal suite reliable.

See [verification-4.md](verification-4.md) for exact commands, live hashes,
headers, privacy request evidence, device/keyboard/axe results, and the
release-blocking remediation. No product code was changed by the verifier.

The next worker must make `npm run test:e2e` consistently pass in its normal
configuration, then submit a new candidate for clean verification.

---

# Previous repair handoff

Work order: `reader-setting-transfer-repair-3`

Base verifier report: [verification-3.md](verification-3.md), candidate
`05f33bed57276b5aa7c916b9bf8bc014e64b1bbe`.

## Repairs

1. Every Playwright command in [claims.json](claims.json) now builds its own
   extension and static-site prerequisite before starting the test server. This
   makes the documented commands work from a clean post-`npm ci` checkout.
2. Demo imports now retain the complete portable card as the active state.
   `measure`, paragraph spacing, letter spacing, name, and all other fields are
   applied and exported exactly after import; the reader article uses the
   imported measure in every contrast mode.
3. The reader’s Dark page now uses `#ff8062` for the article source label on
   `#121722`, providing AA contrast at 85%, 100%, and 180% text sizes.
4. Added the declared `per-site-off-return` claim. Its browser regression
   verifies that turning the reader off writes the local site override and
   navigates back to the original article immediately.
5. Removed the empty-state duplicate `h1`, made the options wordmark a 44 px
   target, eliminated 390 px options overflow, and replaced raw JSON parser
   messages in both demo and extension imports with clear recovery copy.

## Regression coverage

- Demo import → rendered `measure`/spacing variables → JSON export equality,
  plus malformed-file recovery: `@claim:profile-json-transfer`.
- Reader axe scans in Paper, High contrast, and Dark page at 85%, 100%, and
  180% text sizes; reader document one-`h1` assertion.
- Real MV3 390 × 844 options layout and 44 px brand target assertion.
- Real MV3 per-site disable → original URL → extension-storage assertion.
- Unit coverage for parser-safe JSON errors.

## Verification — 2026-08-28

Fresh dependency install:

```text
npm ci                                               PASS (489 packages)
```

The verifier’s exact claim commands were rerun after moving aside the ignored
`dist/` and `.output/` directories (therefore with no build artifacts): all
nine PASS, including the new `per-site-off-return` command.

```text
npm run test:e2e -- --grep @claim:reading-settings       PASS
npm run test:e2e -- --grep @claim:profile-json-transfer  PASS
npm run test:e2e -- --grep @claim:demo-isolation         PASS
npm run test:e2e -- --grep @claim:offline-reload         PASS
npm run test:e2e -- --grep @claim:extension-local-reader PASS
npm run test:e2e -- --grep @claim:per-site-off-return    PASS
npm test -- --testNamePattern @claim:article-structure   PASS
npm test -- --testNamePattern @claim:free-open-source    PASS
npm run test:e2e -- --grep @claim:responsive-keyboard    PASS
```

Full quality gates:

```text
npm run lint              PASS (5 routes, 9 claims)
npm run typecheck         PASS
npm test                  PASS (3 files, 9 tests)
npm run test:e2e          PASS (16 Playwright tests)
npm run check             PASS
npm run test:package      PASS (ZIP integrity and deterministic rebuild)
npm audit --omit=dev --audit-level=low  PASS (0 production vulnerabilities)
```

Local `verify-url.sh` passed against `/` and `/demo/`: both returned 200, have
their expected title, `lang=en`, one `h1`, a main landmark, no missing image
alt text or unlabeled button, and no console/page errors. Desktop and 390 px
screenshots plus JSON results are in `evidence/repair-3/`. Playwright axe has
no serious or critical violations across all site routes and the exercised MV3
contrast states. The browser tests cover keyboard operation, 390 px layouts,
privacy request capture, demo offline reload, service-worker update, and local
extension storage. No analytics, remote fonts, accounts, APIs, or payment code
were added.

The current deterministic extension ZIP SHA-256 is
`c7e36c0eb4e65134eeda796671a4d961a23014a74fd4f03b709447aed71ca060`.

## Deployment and live verification

Published `dist/site` through the existing static Azure Static Web Apps class:

```text
/opt/fleet/lib/deploy-static.sh reader-setting-transfer dist/site  PASS
Deployment ID: c9383db3-b139-4ddc-9703-6d3078924db1
```

Live `verify-url.sh` checks passed at
<https://reader-setting-transfer.sociobot.in/> and `/demo/`: HTTP 200, expected
titles, `lang=en`, one `h1`, main landmark, complete image/button labelling,
desktop and 390 px screenshots, and no console/page errors. The live landing
HTML SHA-256 is `95702bf0e6c4b6c211eb5971d090d66c94da98971b41b2c4b6ab0a85803f41bc`
and the live downloadable ZIP is
`c7e36c0eb4e65134eeda796671a4d961a23014a74fd4f03b709447aed71ca060`, each
matching the local production artifact. A nonexistent route returns HTTP 404.

The repair keeps the original WXT MV3 extension plus static-site deployment
class. There are no known release-blocking gaps.
