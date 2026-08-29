# Reader Setting Transfer — polish 1 handoff

## Status: complete, deployed, and verified live

- Work order: `reader-setting-transfer-polish-1`
- Reviewed release candidate: `e96a391edfaebf73b61ebe24b18e304bb7740371`
- Adversarial report: `8db0ab8251404bc375230f4a3974e34fd45bb754`
- Repair commits: `226a5db` and `73bb7c6`
- Artifact: WXT + TypeScript Manifest V3 extension with a static site
- Live URL: <https://reader-setting-transfer.sociobot.in/>

## What changed

Every finding in `.factory/review-1.md` is resolved. The mobile demo now places
the styled sample article before its controls. The landing page now shows the
product preview before its explanation. Public copy consistently uses
“reading card,” removes unsupported comparisons and speed/count promises, and
uses plain action labels.

The first-screen action opens the isolated `?demo=1` path. Its banner includes
**Reset demo** and **Download the extension**. Demo changes use only
`demo:reader-profile` in session storage and do not touch seeded real data.

The site now has exact route titles and metadata, a designed HTTP 404,
consistent legal links, and heading focus after internal navigation and Back.
The claim registry contains 16 claims with one tagged test each. New tests
cover activation boundaries, passive browsing, the downloadable ZIP, both
responsive routes, mobile sample visibility, route focus, metadata, and reset
isolation. `.factory/polish-1.md` maps every finding to its repair and evidence.

## Verification

All checks ran from the clean clone `/tmp/rst-polish-clean-AThIGW` after commit
`226a5db`, followed by the one-link adjustment and live verifier in `73bb7c6`.

- Every exact command in `.factory/claims.json`: 16/16 passed independently.
- `npm run check`: passed; lint, typecheck, 10/10 unit tests, and production build.
- `npm run test:e2e`: 24/24 passed across the site and real MV3 contexts.
- `npm run test:package`: passed; deterministic ZIP SHA-256
  `abd2b483ee6dd9d9dd40f2d0f0958e9a3c844910eccc7ef8f1faca361d21375a`.
- `npm audit --omit=dev --audit-level=low`: 0 production vulnerabilities.
- Local `verify-url.sh`: passed `/`, `/demo/`, `/privacy/`, `/terms/`, and
  `/404.html` with one H1, `lang=en`, a main landmark, image alt text, and no
  browser errors.
- Local Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.5 s, CLS 0.033, total blocking time 0 ms, 114 KiB.
- Build budgets: landing JS 2.37 kB raw, demo JS 4.70 kB raw, shared CSS
  19.01 kB raw, mobile hero 48.95 kB.

## Deployment and cold live check

The final artifact was deployed with
`/opt/fleet/lib/deploy-static.sh reader-setting-transfer dist/site`.
Deployment ID: `8e62ead0-fb10-4b3f-9b08-89dfe3af8e2b`; region: `centralus`.

- Local/live `index.html` SHA-256:
  `b61a7646138c858b6048312967f5015cf68edf431c94a2943ef67612617f7aa2`.
- Local/live ZIP SHA-256:
  `abd2b483ee6dd9d9dd40f2d0f0958e9a3c844910eccc7ef8f1faca361d21375a`.
- `node scripts/verify-live.mjs`: passed exact titles and Axe scans for all five
  routes; zero serious/critical findings and zero console errors.
- Cold 390 × 844 demo: article heading bottom 683.30 px; first paragraph top
  712.98 px; document overflow 0 px.
- Live demo retained the seeded real-data sentinel and used only
  `demo:reader-profile`; Reset restored 120%; Arrow Right changed it to 125%.
- Live offline reload passed. Requests stayed on the product origin and the
  product set no cookies. Nine links passed. Unknown paths returned HTTP 404.
- CSP, permissions, referrer, MIME-sniffing, and framing headers are present.
- Live Lighthouse 13.4.1: 100/100/100/100; LCP 1.4 s, CLS 0.033, total blocking
  time 10 ms, 92 KiB.

Evidence is in `.factory/evidence/polish-1/`, including local/live route
captures, the cold demo viewport, browser audit JSON, and Lighthouse reports.

## Known gaps / next steps

None known. No review finding remains open.
