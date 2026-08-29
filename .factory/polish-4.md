# Polish round 4 — cumulative finding closure

**Verdict: PASS.** Release candidate `cb88464898b5559c8ee9b5cf54872b6d9cb4bb47`
was repaired in implementation commit `27253f5822d6ad8dc636eb5e5ed5a15624abc65d`.
Azure Static Web Apps deployment `8f3528d9-9b04-44db-922e-e19ac9d1a4b3`
is live at <https://reader-setting-transfer.sociobot.in/>.

Every exact command in `.factory/claims.json` passed independently on its
first invocation from clean clone `/tmp/rst-polish4-clean-jDrjLh` (22/22).
The full browser suite passed 35/35. Live route, privacy, offline, reflow,
focus, link, header, and Axe evidence is in
`.factory/evidence/polish-4/live-routes/live-browser.json`.
Every shorter evidence path below is relative to `.factory/evidence/polish-4/`.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The complete sample heading and first paragraph begin in the first demo viewport on phone and desktop. | `@claim:demo-first-screen`; `live-demo/screenshot-mobile.png`, `live-demo/screenshot-desktop.png`; live `/?demo=1`: heading bottom 713.19/803.66 px and paragraph top 738.38/844.91 px. |
| F-1-2 | The responsive claim operates the landing action and every demo control with a keyboard at 390 px. | `@claim:responsive-keyboard`; `local-demo/screenshot-mobile.png`; live `/demo/` has 0 px overflow. |
| F-1-3 | Preview and reader copy names only the four values they show. | `@claim:reading-settings`, `@claim:extension-open-article`; `live-root/screenshot-desktop.png`; live `/`. |
| F-1-4 | Removed the speed promise and kept the tested return to the source article. | `@claim:per-site-off-return`; `live-root/screenshot-desktop.png`; live `/#how-it-works`. |
| F-1-5 | Removed the untested click count from installation copy. | `npm run lint`; `live-root/screenshot-desktop.png`; live `/#install`. |
| F-1-6 | Registered and tested the packaged extension download. | `@claim:extension-download`; `live-root/screenshot-mobile.png`; live ZIP SHA-256 `1ab39761…666ea`. |
| F-1-7 | Removed public cache-duration promises. | `npm run lint`; live headers remain release evidence in `live-browser.json`. |
| F-1-8 | Removed public security-header promises while retaining deployment checks. | `tests/deployment.test.ts`; live CSP and security headers in `live-browser.json`. |
| F-1-9 | Registered the user-activation boundary and tests passive browsing first. | `@claim:activation-boundary`; `live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-1-10 | Registered and tested the absence of background page reading or storage. | `@claim:no-background-monitoring`; `live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-1-11 | README links to claim tests without making a completeness claim. | `npm run lint` reports 22 claims with one tag each; clean-clone 22/22. |
| F-1-12 | Internal forward, primary demo, and Back navigation focus and announce the destination H1. | Route-focus browser test; `live-routes/live-browser.json`; live `/` → `/demo/` → Back. |
| F-1-13 | A realistic reading-card article preview appears directly after the first screen. | `@claim:reading-settings`; `live-root/screenshot-mobile.png`; live `/`. |
| F-1-14 | Every header action says “Download extension.” | Five-route browser tests; route screenshots under `live-*`; live all public routes. |
| F-1-15 | The strip names export, simplified reading, and device storage results. | `npm run lint`; `live-root/screenshot-mobile.png`; live `/`. |
| F-1-16 | The caption directly describes settings applied to supported articles. | Caption contrast test; `live-root/screenshot-desktop.png`; live `/`. |
| F-1-17 | The section label is “How the extension works.” | Copy audit; `live-root/screenshot-mobile.png`; live `/#how-it-works`. |
| F-1-18 | The heading directly says one reading card applies to supported articles. | Copy audit; `live-root/screenshot-mobile.png`; live `/#how-it-works`. |
| F-1-19 | Step three names adjustment and turning the reader off. | `@claim:per-site-off-return`; `live-root/screenshot-desktop.png`; live `/#how-it-works`. |
| F-1-20 | The section label names reading-card export and import. | `@claim:extension-reading-card-transfer`; `live-root/screenshot-mobile.png`; live `/`. |
| F-1-21 | The heading says “Review every saved reading setting.” | Copy audit; `live-root/screenshot-mobile.png`; live `/`. |
| F-1-22 | Copy explains the text-file result before naming JSON. | `@claim:extension-reading-card-transfer`; `live-root/screenshot-desktop.png`; live `/`. |
| F-1-23 | Per-site copy says to turn the reader off if an article looks wrong. | `@claim:per-site-off-return`; `live-root/screenshot-desktop.png`; live `/`. |
| F-1-24 | The privacy label says “What stays on your device.” | Copy audit; `live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-1-25 | The privacy heading directly says reading history is not sent. | `@claim:extension-no-remote-requests`; `live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-1-26 | Replaced analytics jargon with the tested no-remote-request statement. | `@claim:extension-no-remote-requests`; `live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-1-27 | The demo exit says “Download the extension.” | `@claim:responsive-keyboard`; `live-demo/screenshot-mobile.png`; live `/demo/`. |
| F-1-28 | The designed error page says “Error 404” and “Page not found.” | Unknown-route browser test; `live-404/screenshot-mobile.png`; live unknown path returns HTTP 404. |
| F-1-29 | Public copy consistently uses “reading card” and “text size.” | Content lint and copy audit; `live-root/screenshot-desktop.png`; live `/`. |
| F-1-30 | README sentences remain within the 22-word cap. | `.factory/copy-audit.md`; `npm run lint`; repository README at repair commit. |
| F-1-31 | README says “article headings and text.” | `@claim:article-structure`; repository README at repair commit. |
| F-1-32 | README says “saved reading card.” | `@claim:extension-reading-settings`; repository README at repair commit. |
| F-1-33 | MV3 appears only in developer documentation. | `npm run lint`; `live-root/screenshot-desktop.png`; live `/`. |
| F-1-34 | Every footer uses the same factual product description. | Five-route browser tests; route screenshots under `live-*`; live all routes. |
| F-1-35 | All five pages retain one shared header and footer structure. | Five-route browser tests; route screenshots under `live-*`; live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`. |
| F-1-36 | Every source link visibly says “(external).” | Five-route browser tests; `live-root/screenshot-mobile.png`; all 13 live links return 200. |
| F-1-37 | README explains the text-file result before JSON format. | `npm run lint`; repository README at repair commit. |
| F-1-38 | README says “Build the production files with” without a reproducibility promise. | `npm run lint`; clean-clone `npm run build`. |
| F-1-39 | Broad service language was replaced by the registered no-remote-request claim. | `@claim:extension-no-remote-requests`; live same-origin/no-cookie record in `live-browser.json`. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Large headings and responsive geometry reflow at 200% text on every public route. | Reflow browser test; route screenshots under `live-*`; `live-browser.json` records 0 px overflow on five routes. |
| F-2-2 | Copy limits operation to supported public articles. | `@claim:access-boundaries`; `live-root/screenshot-desktop.png`; live `/`. |
| F-2-3 | No cross-browser promise remains; transfer uses two clean sessions. | `@claim:reading-card-json-transfer`; `live-demo/screenshot-desktop.png`; live `/demo/`. |
| F-2-4 | A packaged-extension test saves and asserts every reading setting. | `@claim:extension-reading-settings`; clean-clone first invocation passed. |
| F-2-5 | Compatibility copy names tested Chromium rather than Chrome generally. | `@claim:extension-reading-settings`; `live-root/screenshot-mobile.png`; live `/`. |
| F-2-6 | Privacy separates extension data from possible infrastructure logs. | Five-route Axe/browser test; `live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-2-7 | The action explanation and all three facts fit the first desktop viewport. | First-screen browser test; `live-root/screenshot-desktop.png`; live facts end at 678.53 px. |
| F-2-8 | README describes the demo as a separate temporary browser session. | `@claim:demo-isolation`; repository README at repair commit. |
| F-2-9 | Removed the unmeasured speed adjective from preview copy. | Copy audit and `npm run lint`; live `/`. |
| F-2-10 | The privacy point is named “Delete local data.” | Copy audit; `live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-2-11 | The privacy point is named “No article upload.” | `@claim:extension-no-remote-requests`; `live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-2-12 | Installation copy says “Install the Chromium extension.” | Copy audit; `live-root/screenshot-mobile.png`; live `/#install`. |
| F-2-13 | README accurately separates content lint and TypeScript checks. | Clean-clone `npm run check`; repository README at repair commit. |
| F-2-14 | The current locked dependency tree reports zero vulnerabilities. | Clean-clone `npm ci`, `npm audit`, and `npm audit --omit=dev`. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | The core claim now drives one clean packaged popup handler with a real pointer event, observes its background message, and waits 15 seconds with popup diagnostics. | `@claim:extension-open-article` passed five stress runs, the full suite, and the clean-clone first invocation; reader assertions cover text, link, site, card, styles, and storage. |
| F-3-2 | The hero caption remains on an opaque paper strip with 15.64:1 token contrast. | Caption contrast browser test; `live-root/screenshot-desktop.png`; live `/`. |
| F-3-3 | Preview copy promises only type, spacing, and contrast changes. | `@claim:extension-reading-settings`; `live-root/screenshot-desktop.png`; packaged options copy review. |
| F-3-4 | Packaged extension export/import has a two-profile claim test. | `@claim:extension-reading-card-transfer`; clean-clone first invocation passed. |
| F-3-5 | The real workflow asserts the exact active hostname. | `@claim:extension-open-article`; live explanatory copy at `/#how-it-works`. |
| F-3-6 | The offline banner claims only that the cached page works. | `@claim:offline-landing`; `live-root/screenshot-mobile.png`; live offline reload passed. |
| F-3-7 | Demo, How it works, Privacy, and Download remain visible and operable at 390 px. | Mobile-header browser test; route mobile screenshots under `live-*`; 0 px live overflow. |
| F-3-8 | Added the missing site `.sr-only` rule; the polite route status remains 1×1, clipped, and outside layout. | Route-focus browser test; `live-routes/live-browser.json`; live route status text updates with width/height 1 px. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Privacy and settings now say how to turn the reader back on. A new claim removes the disabled choice and opens its stored article. | `@claim:site-choice-reenable`; `live-privacy/screenshot-desktop.png`; live `/privacy/` contains the direct recovery sentence. |
| F-4-2 | Replaced “leaves with it” with “Removing the extension deletes its local data.” | Copy audit and `@claim:extension-uninstall-data`; `live-root/screenshot-mobile.png`; live `/#privacy`. |

## Whole-product evidence

- `npm run check`: 11/11 unit tests, lint, typecheck, and production build pass.
- `npm run test:e2e`: 35/35 browser and packaged-extension tests pass.
- `npm run test:package`: deterministic ZIP SHA-256 `1ab39761b25a4cf65d011ea5e3f9a689bf10f51d147d9f583c1a49720bf666ea`.
- Clean clone: all 22 exact registered claim commands passed on first invocation.
- Local and live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.5/1.4 s, CLS 0.04, TBT 0 ms.
- Live: zero serious/critical Axe findings on five routes, zero console errors, same-origin requests only, zero cookies, 13/13 links healthy, offline demo reload, and designed HTTP 404.
- Local/live landing and ZIP hashes match: `81a2f00e…cb1` and `1ab39761…666ea`.
- Known gaps: none.
