# Reader Setting Transfer — repair 6 handoff

## Status: PASS

- Work order: `reader-setting-transfer-repair-6`
- Verifier report: [verification-6.md](verification-6.md)
- Rejected candidate: `d8e9b4eb31726f47b0677ec3ce85d21c2bf8de42`
- Report commit: `9a061100644c8eab5e5dc6652e663d59133af15a`
- Artifact: WXT + TypeScript Manifest V3 browser extension
- Deployment: static site from `dist/site`
- Live URL: <https://reader-setting-transfer.sociobot.in/>

## Repairs

The verifier's two findings are repaired at their root causes.

1. The reader stylesheet now gives `#reader-shell[hidden]` an explicit
   `display: none`. A fresh installation shows only the designed empty state;
   the blank article heading and controls are absent from the accessibility
   tree and keyboard order. The reader also starts from a safe default profile,
   and one helper handles both no-article and storage-initialization errors.
   This prevents synthetic activation from recreating the former uncaught
   `fontScale` error.
2. Demo-banner controls now use the warm-paper focus outline against the navy
   banner. The 4 px outline measures 13.40:1 against its adjacent background,
   including at 390 px with reduced motion.

The new packaged-extension regression starts with empty
`chrome.storage.local`, checks the visible state at 390 x 844, proves hidden
article controls are not exposed or focusable, directly activates the hidden
text-size control, checks for runtime errors, and injects a storage read failure
to cover initialization recovery. The site regression calculates the WCAG
contrast ratio for both demo-banner actions and requires at least 3:1.

No previously passing settings, extraction, profile transfer, demo isolation,
offline, per-site, privacy, visual, packaging, or deployment behavior changed.
The researched brief, risograph visual thesis, browser-extension artifact
class, and static deployment class are preserved.

## Clean local verification — 2026-08-29

`npm ci` installed 489 packages from the lockfile. The release gates passed:

```text
npm run lint                            PASS (5 routes, 11 claims)
npm run typecheck                       PASS
npm test                                PASS (3 files, 10 tests)
npm run build                           PASS (MV3 extension + dist/site)
npm run check                           PASS
npm run test:e2e                        PASS (19/19)
npm run test:package                    PASS (valid deterministic ZIP)
npm audit --omit=dev --audit-level=low  PASS (0 vulnerabilities)
```

Every exact command in [claims.json](claims.json) passed independently. The
browser suite covers the product at desktop and 390 x 844, keyboard operation,
touch targets, normal/dark/high-contrast reader states, malformed import
recovery, privacy, service-worker update, offline reload, and serious/critical
axe findings. The focused empty-reader regression also passed separately after
its final assertion was tightened.

The supplied `verify-url.sh` passed local `/`, `/demo/`, `/privacy/`, and
`/terms/` at desktop and 390 px. Each route has its expected title, `lang=en`,
one `h1`, a main landmark, labeled images and buttons, and no console or page
errors. Local mobile Lighthouse scored Performance 100, Accessibility 100,
Best Practices 100, and SEO 100. LCP was 1.5 s, CLS was 0, total blocking time
was 0 ms, and transferred content was 110 KiB.

Budgets remain within their limits:

```text
Landing JavaScript       1,600 B raw / 778 B gzip
Demo JavaScript          4,688 B raw / 1,727 B gzip
Landing CSS             16,151 B raw / 4,217 B gzip
Mobile hero WebP        48,954 B
MV3 extension total    152.40 kB
```

Local production artifact hashes before deployment:

```text
dist/site/index.html
  sha256 b67c0dbeff6b9ccda9c12f5ac31a887e89af47ae378965b664ddb48712c5a847
dist/site/downloads/reader-setting-transfer-chrome.zip
  sha256 7c4831b7ef0d76c8f75914acf2ff711b0b7c5c37cd0a6d5b8e9c66fdfe27967c
```

Evidence is under [evidence/repair-6](evidence/repair-6/), including gate logs,
claim runs, desktop/mobile route captures, the fresh-extension empty state,
measured focus contrast, production audit, and Lighthouse report.

## Run and verify

```sh
npm ci
npm run check
npm run test:e2e
npm run test:package
```

Serve `dist/site` for static verification. Load `.output/chrome-mv3` as an
unpacked extension for manual browser use.

## Deployment and live verification

Deployment and post-deploy identity evidence will be appended after the repair
commit is pushed and the work-order static deployment completes.

## Known gaps and next steps

`npm ci` reports ten development-only transitive advisories, principally in
WXT's Firefox development toolchain. The production dependency audit is clean.
There are no known release-blocking product gaps.
