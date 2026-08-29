# Reader Setting Transfer — polish round 4 handoff

## Status: PASS

Release candidate `cb88464898b5559c8ee9b5cf54872b6d9cb4bb47` was repaired
in implementation commit `27253f5822d6ad8dc636eb5e5ed5a15624abc65d` and pushed to
`main`. Deployment `8f3528d9-9b04-44db-922e-e19ac9d1a4b3` is live at
<https://reader-setting-transfer.sociobot.in/>.

The four round-4 defects are closed: the article-opening claim is stable, the
route announcement is visually hidden, site choices can be restored through a
registered claim, and the remaining deletion metaphor is direct copy. Every
earlier finding was rechecked. The complete finding map is
`.factory/polish-4.md`.

## Verification

- Clean clone `/tmp/rst-polish4-clean-jDrjLh`: `npm ci` found zero
  vulnerabilities and every one of 22 claim commands passed independently on
  its first invocation.
- Final pushed-tree clone `/tmp/rst-polish4-final-TNxBf4`: `npm run check`,
  `npm run test:package`, `npm run test:e2e`, and both audits passed.
- `extension-open-article`: five consecutive stress runs passed, followed by
  passes in the full suite and clean-clone claim run.
- `npm run check`: lint, typecheck, 11 unit tests, and the production build
  passed.
- `npm run test:e2e`: 35/35 browser and packaged-extension tests passed.
- `npm run test:package`: deterministic ZIP
  `1ab39761b25a4cf65d011ea5e3f9a689bf10f51d147d9f583c1a49720bf666ea`.
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.5 s, CLS 0.04, TBT 0 ms.
- Live Lighthouse: 100/100/100/100; LCP 1.4 s, CLS 0.04, TBT 0 ms.
- Five live routes: correct titles and metadata, one H1/main, shared legal
  links, zero serious/critical Axe findings, and zero console errors.
- Live route focus: primary, forward, and Back focus the H1. The announcement
  updates while remaining clipped to 1×1 px and outside layout.
- Live demo: sample heading/paragraph start inside 390×844 and 1440×900,
  isolated `demo:reader-profile` session storage, Reset, exit clearing, and
  offline reload all pass.
- Live privacy: only the product origin was requested; no cookies were set.
- Live routing: all 13 links returned success; unknown routes return the
  designed HTTP 404; every route has 0 px overflow at 200% text.
- Local/live SHA-256 matches: landing HTML
  `81a2f00ef2c7c32f03280231247d4170ae21fbc63cf3111450529ca989857cb1`;
  extension ZIP
  `1ab39761b25a4cf65d011ea5e3f9a689bf10f51d147d9f583c1a49720bf666ea`.

## Run and verify

```sh
npm ci
npm run check
npm run test:package
npm run test:e2e
npm audit
```

Open the isolated sample at <https://reader-setting-transfer.sociobot.in/?demo=1>.
Live evidence and screenshots are under `.factory/evidence/polish-4/`.

## Known gaps and next steps

None.
