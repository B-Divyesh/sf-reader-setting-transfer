# Reader Setting Transfer — repair handoff

## Status: PASS

- Work order: `reader-setting-transfer-repair-4`
- Verifier report: [verification-4.md](verification-4.md)
- Rejected candidate: `1f6203901d6e5735eabeb8dedb9d4fd8f9534c2f`
- Repair commit: `5077df0810f6e7cb36623bbe2190597423e935f6`

## Repair

The verifier's only release blocker was a repeatable timeout in the normal
two-worker `npm run test:e2e` command. The affected claim launches a real MV3
browser profile and runs 12 complete axe scans across the options and reader
size/contrast matrix. That intentional workload could exceed the suite-wide
30-second default under worker contention even though it passed alone.

The complete regression matrix remains unchanged. Its one test now has a
scoped 60-second timeout; every other browser test retains the 30-second
default. This fixes the gate at its root without weakening product or
accessibility assertions. No runtime product behavior, researched scope,
visual system, artifact class, or deployment class changed.

## Clean verification — 2026-08-28

From the verifier base, `npm ci` installed 489 packages. Then these gates
passed:

```text
npm run lint                               PASS (5 routes, 9 claims)
npm run typecheck                          PASS
npm test                                   PASS (3 files, 9 tests)
npm run build                              PASS (MV3 extension + dist/site)
npm run check                              PASS
npm run test:package                       PASS (valid, deterministic ZIP)
npm audit --omit=dev --audit-level=low     PASS (0 production vulnerabilities)
```

The normal configured `npm run test:e2e` command was run three consecutive
times with two workers. Each run passed all 16 tests in 24.1–24.2 seconds.
This is the exact regression for the verifier's failing command. It includes
the real MV3 extension, desktop and 390 × 844 layouts, keyboard operation,
Playwright axe scans, privacy request capture, service-worker update/offline
reload, and local extension storage.

Every exact command in [claims.json](claims.json) also passed independently:

```text
@claim:reading-settings         PASS
@claim:profile-json-transfer    PASS
@claim:demo-isolation           PASS
@claim:offline-reload           PASS
@claim:extension-local-reader   PASS (12 axe scans retained)
@claim:per-site-off-return      PASS
@claim:article-structure        PASS
@claim:free-open-source         PASS
@claim:responsive-keyboard      PASS
```

The supplied `/opt/fleet/lib/verify-url.sh` passed locally for `/`, `/demo/`,
`/privacy/`, and `/terms/` at desktop and 390 px. Every route had the expected
title, `lang=en`, one `h1`, a main landmark, complete image/button labelling,
and no console or page errors. The Playwright axe integration reported no
serious or critical findings across all site routes and all exercised
extension contrast states.

Local mobile Lighthouse results were Performance 100, Accessibility 100,
Best Practices 100, and SEO 100. LCP was 1.5 s, CLS was 0, and total blocking
time was 0 ms. The landing bundle remains 1,600 B JS and 16,061 B CSS raw; the
mobile hero WebP is 48,954 B and loaded Latin WOFF2 files total 34,732 B.

The copy did not change. [.factory/copy-audit.md](copy-audit.md) still has no
sentence over 22 words and no banned term.

## Deployment and live evidence

The original WXT MV3 extension and static Azure Static Web Apps site were
deployed with the work-order configuration:

```text
/opt/fleet/lib/deploy-static.sh reader-setting-transfer dist/site  PASS
Deployment ID: 8f2ab48e-b472-4b04-ae2e-4b82043a100e
```

Live `/`, `/demo/`, `/privacy/`, and `/terms/` each return HTTP 200 and pass
`verify-url.sh` at desktop and 390 px with no console errors. Every public
same-origin link and the source-repository link returns 200. A nonexistent
route returns a designed HTTP 404.

The live demo is controlled by the current service worker, completes
`registration.update()`, and reloads its banner and sample article offline.
Arrow Right changed the focused size control from 120% to 125%; its focus ring
was a 4 px persimmon outline. The page had zero horizontal overflow at 390 px.
The full demo request log contained no third-party request.

Live mobile Lighthouse scored 100 in Performance, Accessibility, Best
Practices, and SEO. LCP was 1.2 s, CLS was 0, and total blocking time was 30 ms.
Response checks confirmed HSTS, self-only CSP, frame denial, MIME-sniffing and
referrer protections, restrictive permissions policy, HTML revalidation,
`sw.js` no-cache, and a one-year immutable policy for the ZIP and assets.

Local and live production identities match byte-for-byte:

```text
index.html  95702bf0e6c4b6c211eb5971d090d66c94da98971b41b2c4b6ab0a85803f41bc
ZIP         c7e36c0eb4e65134eeda796671a4d961a23014a74fd4f03b709447aed71ca060
```

## Known gaps and next steps

There are no known release-blocking gaps. `npm ci` reports advisories in
development-only transitive dependencies; the production dependency audit is
clean. Submit this commit for independent verification.
