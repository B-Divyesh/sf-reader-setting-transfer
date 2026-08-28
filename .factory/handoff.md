# Reader Setting Transfer — repair handoff

## Status: PASS

- Work order: `reader-setting-transfer-repair-5`
- Verifier report: [verification-5.md](verification-5.md)
- Rejected candidate: `885da27e3d8926b5d2e7a79fa6011c573be0839e`
- Report commit: `b5ad990451c8eb7878778b138de0adac635493a6`
- Repair commit: `a5a8ddc84e21d79de9127d597ce4ca89ac6dc02c`
- Artifact: WXT + TypeScript Manifest V3 browser extension
- Deployment: static site from `dist/site`
- Live URL: <https://reader-setting-transfer.sociobot.in/>

## Repairs

The verifier found two public statements without entries or observable tests in
the claims contract.

1. `extension-uninstall-data` now covers the statement that removing the
   extension removes its browser-managed local data. Its real Chromium test
   stores a sentinel in `chrome.storage.local`, removes the running extension
   through `chrome.management.uninstallSelf()`, reloads the same unpacked
   extension in the same browser profile, and proves storage is empty.
2. `access-boundaries` now covers the non-goals around paywalls and source-page
   restyling. Extraction refuses a visible, clearly marked access barrier with
   a useful error. The regression also proves that both refused and successful
   extraction leave the source DOM byte-for-byte unchanged and that stale
   hidden paywall markup does not block a public article.

The landing and README statements carry explicit claim references, and content
lint now rejects any such reference missing from `.factory/claims.json`. The
public wording was narrowed to exactly what the test proves. No existing
setting, demo, storage, import/export, offline, per-site, privacy, visual, or
packaging behavior changed. The researched brief, risograph visual thesis,
browser-extension artifact class, and static deployment class are preserved.

## Clean local verification — 2026-08-28

`npm ci` installed 489 packages from the lockfile. The complete gates passed:

```text
npm run lint                            PASS (5 routes, 11 claims)
npm run typecheck                       PASS
npm test                                PASS (3 files, 10 tests)
npm run build                           PASS (MV3 extension + dist/site)
npm run check                           PASS
npm run test:package                    PASS (valid deterministic ZIP)
npm run test:e2e                        PASS (17 tests, 2 workers, 24.8 s)
npm audit --omit=dev --audit-level=low  PASS (0 production vulnerabilities)
```

Every exact command in [claims.json](claims.json) also passed independently,
including the new commands:

```text
npm run test:e2e -- --grep @claim:extension-uninstall-data  PASS
npm test -- --testNamePattern @claim:access-boundaries      PASS
```

The full browser suite installs the real MV3 output and covers local extension
storage, uninstall/reinstall cleanup, reading settings, JSON transfer, per-site
return, malformed import recovery, desktop, 390 × 844 mobile, keyboard, touch
targets, serious/critical axe findings, same-origin privacy, service-worker
update, and offline reload. All 17 tests passed. The site and extension pages
reported no serious or critical axe findings in the exercised contrast and
size matrix.

The supplied `verify-url.sh` passed local `/`, `/demo/`, `/privacy/`, and
`/terms/` at desktop and 390 px. Each has the expected title, `lang=en`, one
`h1`, a main landmark, complete image/button labels, no overflow, and no
console or page errors. Evidence is under `.factory/evidence/repair-5/`.

Local mobile Lighthouse scored Performance 100, Accessibility 100, Best
Practices 100, and SEO 100. LCP was 1.5 s, CLS was 0, and total blocking time
was 0 ms. Output remains within budget:

```text
Landing JavaScript     1,600 B raw / 760 B gzip
Landing CSS           16,061 B raw / 4,203 B gzip
Mobile hero WebP      48,954 B
MV3 extension total  152.36 kB
```

The copy audit remains free of banned words and sentences over 22 words. The
production artifacts are:

```text
dist/site/index.html
  sha256 376cf57311939f4dc8327f31a671eca0b86500d1701fa123a9576b89b7b6ae00
dist/site/downloads/reader-setting-transfer-chrome.zip
  sha256 e77f5bd8299435470b62000299620a0f442bea9e00a15e6e0667af4ec50d2bcd
```

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

The verified static output was deployed through the work-order helper:

```text
/opt/fleet/lib/deploy-static.sh reader-setting-transfer dist/site  PASS
Deployment ID: d96e62ec-5093-4660-b993-5e1b76358a96
Region: centralus
Custom domain: Ready; HTTPS 200
```

The deployed site and downloadable browser extension are the exact local
artifacts verified above:

```text
index.html local/live  376cf57311939f4dc8327f31a671eca0b86500d1701fa123a9576b89b7b6ae00
ZIP local/live         e77f5bd8299435470b62000299620a0f442bea9e00a15e6e0667af4ec50d2bcd
```

Live `verify-url.sh` checks passed for `/`, `/demo/`, `/privacy/`, and
`/terms/` at desktop and 390 px with no console or page errors. All public
links, the source repository, and the downloadable ZIP returned 200. An
unknown route returned the designed HTTP 404.

The fresh live demo made requests only to its own origin, left `localStorage`
empty, and used only `sessionStorage["demo:reader-profile"]`. Arrow Right moved
the focused text-size control from 120% to 125%; the focus ring was a 4 px
persimmon outline, and horizontal overflow was zero. A Playwright axe scan had
zero serious/critical findings. After service-worker activation and update,
the sample banner and article reloaded offline with no console or page errors.

Live mobile Lighthouse scored Performance 100, Accessibility 100, Best
Practices 100, and SEO 100. LCP was 1.2 s, CLS was 0, and total blocking time
was 30 ms. Live headers provide HSTS, self-only CSP, frame denial, MIME-sniffing
protection, strict referrer policy, and a restrictive permissions policy. HTML
revalidates, `sw.js` uses `no-cache`, and fingerprinted assets and the ZIP use
one-year immutable caching. Evidence is under `.factory/evidence/repair-5/`.

There is no runtime AI, API, sign-in, payment, tenant, or server endpoint, so
AI gateway, Entra authority, per-client 429, and `Retry-After` checks do not
apply to this static browser-extension product.

## Known gaps and next steps

`npm ci` reports ten development-only transitive advisories; the production
dependency audit is clean. There are no known release-blocking gaps. Submit
this repair for independent verification.
