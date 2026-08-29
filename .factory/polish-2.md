# Polish round 2 — complete finding closure

**Verdict: PASS.** Every finding from `.factory/review-1.md` and
`.factory/review-2.md` is resolved at commit `251be18`. Deployment
`1c01aba6-89df-4743-b899-a453c6dacf59` is live at
<https://reader-setting-transfer.sociobot.in/>.

Shared live evidence is in `.factory/evidence/polish-2/live-browser.json`.
It records all five route titles, zero serious or critical Axe violations,
zero console errors, same-origin requests only, zero cookies, working offline
reload, HTTP 404 behavior, primary-route focus, and 0 px overflow at 200% text.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the sample reader before its controls on phones and compacted the demo chrome. | `@claim:responsive-keyboard`; live heading bottom 729.64 px and paragraph top 759.33 px; `.factory/evidence/polish-2/live-demo-first-screen.png`; live `/?demo=1`. |
| F-1-2 | The claim test now tabs to and operates the landing action, Reset, both ranges, both selects, checkbox, export, and file import. | `@claim:responsive-keyboard`; `.factory/evidence/polish-2/local/mobile-demo-first-screen.png`; live `/demo/`. |
| F-1-3 | Kept the factual saved-card description and its active values. | `@claim:reading-settings`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-1-4 | Kept the speed claim removed; copy promises only the tested return. | `@claim:per-site-off-return`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/#how-it-works`. |
| F-1-5 | Kept the untested click-count wording removed. | `npm run lint`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/#install`. |
| F-1-6 | Kept the ZIP claim registered and validate its response and required MV3 entries. | `@claim:extension-download`; live ZIP SHA-256 `a6cda2db…6387c`; live `/downloads/reader-setting-transfer-chrome.zip`. |
| F-1-7 | Kept the unregistered cache-duration marketing copy removed. | `npm run lint`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-1-8 | Kept the unregistered security-header marketing copy removed while verifying the headers as release evidence. | `tests/deployment.test.ts`; `live-browser.json`; live `/`. |
| F-1-9 | Kept the activation boundary as a registered MV3 claim. | `@claim:activation-boundary`; `.factory/evidence/polish-2/live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-1-10 | Kept passive browsing covered by its own storage, request, and DOM test. | `@claim:no-background-monitoring`; `.factory/evidence/polish-2/live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-1-11 | README now says only where the claim tests are listed. | `npm run lint` reports 18 registered claims with one tag each; live `/`. |
| F-1-12 | The `/?demo=1` redirect carries its focus intent to `/demo/`; Back and other internal routes focus their H1. | Route-focus browser test and live verifier; `.factory/evidence/polish-2/live-demo-first-screen.png`; live `/?demo=1`. |
| F-1-13 | Kept the realistic reading-card preview directly after the hero. | `@claim:reading-settings`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/`. |
| F-1-14 | Header actions consistently say “Download extension.” | Five-route metadata/chrome test; live route screenshots; live `/`. |
| F-1-15 | Kept the three concrete promise-strip labels. | `npm run lint`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/`. |
| F-1-16 | The caption now limits application to supported public articles. | `@claim:extension-reading-settings`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-1-17 | Kept “How the extension works.” | Copy audit and `npm run lint`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#how-it-works`. |
| F-1-18 | Replaced the remaining universal wording with “Apply one reading card to supported articles.” | `@claim:extension-reading-settings`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#how-it-works`. |
| F-1-19 | Kept “Adjust or turn off the reader.” | `@claim:per-site-off-return`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#how-it-works`. |
| F-1-20 | Kept the export/import section label. | `@claim:reading-card-json-transfer`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/`. |
| F-1-21 | Kept “Review every saved reading setting.” | Copy audit and `npm run lint`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/`. |
| F-1-22 | Leads with the text-file result; JSON appears in the next sentence. | `@claim:reading-card-json-transfer`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/`. |
| F-1-23 | Kept the plain per-site off wording. | `@claim:per-site-off-return`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-1-24 | Kept “What stays on your device.” | Copy audit; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-1-25 | Kept the direct reading-history statement. | `@claim:extension-local-reader`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-1-26 | Replaced the aggregate list with the narrower tested sentence “The extension makes no remote requests.” | `@claim:extension-no-remote-requests`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-1-27 | Demo exit action remains “Download the extension.” | Focus-contrast test; `.factory/evidence/polish-2/live-demo/screenshot-mobile.png`; live `/demo/`. |
| F-1-28 | Kept “Error 404” and “Page not found.” | Unknown-route browser test; `.factory/evidence/polish-2/live-404/screenshot-mobile.png`; live `/not-a-real-route` returns 404. |
| F-1-29 | “Reading card” and “text size” remain the consistent public terms. | Retired-phrase lint and copy audit; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/`. |
| F-1-30 | README introduction remains split into short sentences. | `.factory/copy-audit.md` and `npm run lint`; live `/`. |
| F-1-31 | README keeps the concrete “article headings and text” wording. | `@claim:article-structure`; live `/`. |
| F-1-32 | README and extension use “saved reading card.” | `@claim:extension-local-reader`; live `/`. |
| F-1-33 | Manifest V3 remains developer-only, not landing copy. | `npm run lint`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-1-34 | Every footer keeps the same factual product sentence. | Five-route chrome test; live screenshots for root, demo, privacy, terms, and 404. |
| F-1-35 | Added the missing Terms header and one complete header/footer structure to all five routes. | Five-route chrome test; `.factory/evidence/polish-2/live-terms/screenshot-desktop.png`; live `/terms/`. |
| F-1-36 | Every footer source link now visibly says “(external).” | Five-route chrome test; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/`. |
| F-1-37 | README and extension settings lead with “text file”; JSON is a later technical detail. | `npm run lint`; live `/`. |
| F-1-38 | Replaced “reproducible production command” with “Build the production files with.” | `npm run lint`; live `/`. |
| F-1-39 | Replaced the aggregate service list with a registered no-remote-request claim. | `@claim:extension-no-remote-requests` checks manifest, dependencies, requests, cookies, permissions, and storage; live `/#privacy`. |
| F-2-1 | Added resilient wrapping, mobile geometry, and a 200% text test on every public route. | “every public route reflows…”; `live-browser.json` records 0 px overflow for all five routes; `.factory/evidence/polish-2/live-privacy/screenshot-mobile.png`; live `/privacy/`. |
| F-2-2 | Replaced “each/every article” with “supported public article” throughout landing, install, README, and settings. | `npm run lint` and `@claim:access-boundaries`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-2-3 | Removed the cross-browser promise and strengthened transfer evidence to two clean browser contexts. | `@claim:reading-card-json-transfer`; `.factory/evidence/polish-2/live-demo/screenshot-desktop.png`; live `/demo/`. |
| F-2-4 | Added a packaged-extension claim that saves and asserts every profile field and both motion states. | `@claim:extension-reading-settings`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-2-5 | Public compatibility wording now names only tested Chromium; the packaged extension runs in that claim test. | `@claim:extension-reading-settings`; `.factory/evidence/polish-2/live-root/screenshot-desktop.png`; live `/`. |
| F-2-6 | Privacy now distinguishes extension data from website infrastructure logs, including child visits. | Five-route accessibility test; `.factory/evidence/polish-2/live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-2-7 | Widened and tightened the desktop hero so the action note and all three facts finish above 900 px. | “complete first-screen guidance…”; `.factory/evidence/polish-2/local/desktop-first-screen.png`; live `/`. |
| F-2-8 | README says the demo keeps temporary changes in its own browser session. | `npm run lint`; live `/?demo=1`. |
| F-2-9 | README now says it previews changes and lets readers adjust text size and contrast. | `npm run lint`; live `/demo/`. |
| F-2-10 | Renamed the heading to “Delete local data.” | Copy audit; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-2-11 | Renamed the heading to “No article upload” and paired it with the exact remote-request claim. | `@claim:extension-no-remote-requests`; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#privacy`. |
| F-2-12 | Renamed the install label to “Install the Chromium extension.” | Copy audit; `.factory/evidence/polish-2/live-root/screenshot-mobile.png`; live `/#install`. |
| F-2-13 | README now describes lint as content and claim-tag checks and lists typecheck separately. | Clean-clone `npm run check`; live repository at commit `251be18`. |
| F-2-14 | Updated WXT to 0.21.4, Node to 22+, and overrode esbuild to 0.28.2. | Clean-clone `npm audit` and `npm audit --omit=dev`: zero vulnerabilities; deterministic build passed. |

## Whole-product evidence

- Clean clone: `/tmp/rst-polish2-clean-ELUG4F`.
- Claim commands: 18/18 passed independently.
- Full gates: 10/10 unit tests; 28/28 Playwright tests; typecheck, lint,
  production build, and deterministic ZIP all passed.
- Dependency audit: zero vulnerabilities, including development tools.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.5 s, CLS 0.043, TBT 0 ms.
- Live Lighthouse: 100/100/100/100; LCP 1.4 s, CLS 0.042, TBT 0 ms.
- Live/local HTML and ZIP SHA-256 values match. The ZIP is
  `a6cda2db2887e917d37f306f87e571b9260d3c45eef6f7190eabf0856956387c`.
- Deployment ID: `1c01aba6-89df-4743-b899-a453c6dacf59`.
- Known gaps: none.
