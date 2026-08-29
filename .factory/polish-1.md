# Polish round 1 — finding closure

**Verdict: all findings resolved.** The table maps every finding in
`.factory/review-1.md` to an implementation change and reproducible evidence.
The shared live audit is `node scripts/verify-live.mjs`; its result is
`.factory/evidence/polish-1/live-browser.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | On phones, the complete styled sample reader now precedes controls. The intro, rail, and article spacing were compacted without shrinking body type. | `@claim:responsive-keyboard` asserts the heading bottom and paragraph start inside 390 × 844. Live: heading 683.30 px, paragraph 712.98 px. Screenshot: `.factory/evidence/polish-1/live-demo-first-screen.png`; <https://reader-setting-transfer.sociobot.in/?demo=1>. |
| F-1-2 | The declared responsive claim now visits `/` and `/demo/`, operates both by keyboard, checks both for overflow, and scans both with Axe. | `@claim:responsive-keyboard`; live overflow 0 in `live-browser.json`; screenshots `local-root/screenshot-mobile.png` and `live-demo-first-screen.png`. |
| F-1-3 | Replaced the comparison with “Your saved reading card sets the article view and lists each active value.” | `@claim:reading-settings` asserts the landing values and live demo changes; `npm run lint`; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-4 | Removed “instantly” and the unsupported speed promise. | `@claim:per-site-off-return` asserts the actual return and site choice; retired-phrase lint; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-5 | Replaced the click-count heading with “Install the extension, then open it on each article.” | `npm run lint`; screenshot `live-root/screenshot-desktop.png`; live `/#install`. |
| F-1-6 | Registered `extension-download` and validate the response signature plus required MV3 ZIP entries. | `@claim:extension-download`; matching local/live ZIP hash; live download URL returned 200. |
| F-1-7 | Removed the README cache-duration promise and its 32-word deployment sentence. | `npm run lint`; README review in clean clone; live cache headers recorded separately in `live-browser.json`. |
| F-1-8 | Removed the README security-header marketing claim. Headers remain configured and are checked as release evidence. | `tests/deployment.test.ts`; live response headers in `live-browser.json`. |
| F-1-9 | Added the `activation-boundary` claim. A fresh MV3 profile proves passive page visits cannot populate extension storage and the manifest has no automatic content scripts or host access. | `@claim:activation-boundary`; privacy screenshot `live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-1-10 | Added the `no-background-monitoring` claim and checks for empty extension storage, unchanged page content, and zero extension requests during passive browsing. | `@claim:no-background-monitoring`; privacy screenshot `live-privacy/screenshot-desktop.png`; live `/privacy/`. |
| F-1-11 | Replaced the false completeness assertion with the factual link “Claim tests are listed in `.factory/claims.json`.” | `npm run lint` verifies all 16 IDs have exactly one tag; clean clone ran 16/16 exact commands. |
| F-1-12 | Internal navigation records the destination, focuses its H1 after arrival, and focuses the H1 again on Back/bfcache restoration. | Browser test “internal route changes move focus…” and `verify-live.mjs`; live `/` → `/demo/` → Back. |
| F-1-13 | Added a faithful reading-card and article preview immediately after the hero and before “How it works.” | `@claim:reading-settings`; lint checks DOM order; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-14 | Every header download action is now labeled “Download extension.” | Exact route browser checks; screenshots under `live-*`; all public routes live. |
| F-1-15 | Rewrote the strip as “Export your reading card,” “Read a simplified article,” and “Keep article data on this device.” | `npm run lint`; screenshot `live-root/screenshot-mobile.png`; live `/`. |
| F-1-16 | Replaced the hero slogan with a direct explanation of applying text and contrast settings. | Copy audit and `npm run lint`; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-17 | Replaced the mood eyebrow with “How the extension works.” | Copy audit and `npm run lint`; screenshot `live-root/screenshot-desktop.png`; live `/#how-it-works`. |
| F-1-18 | Replaced the metaphorical heading with “Apply one reading card to every article.” | Copy audit and `npm run lint`; screenshot `live-root/screenshot-mobile.png`; live `/#how-it-works`. |
| F-1-19 | Renamed step 03 to “Adjust or turn off the reader.” | Copy audit and `@claim:per-site-off-return`; screenshot `live-root/screenshot-desktop.png`; live `/#how-it-works`. |
| F-1-20 | Replaced the adjective stack with “Export and import your reading card.” | Copy audit and `@claim:reading-card-json-transfer`; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-21 | Replaced the metaphor with “Review every saved reading setting.” | Copy audit and `npm run lint`; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-22 | Leads with the export/import result; JSON appears only in the following technical sentence. | `@claim:reading-card-json-transfer`; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-23 | Replaced implementation jargon with “Turn off the reader on a site if an article looks wrong.” | Copy audit and `@claim:per-site-off-return`; screenshot `live-root/screenshot-desktop.png`; live `/`. |
| F-1-24 | Replaced the slogan with “What stays on your device.” | Copy audit; screenshot `live-root/screenshot-desktop.png`; live `/#privacy`. |
| F-1-25 | Replaced the metaphor with “The extension does not send us your reading history.” | `@claim:extension-local-reader`; screenshot `live-root/screenshot-desktop.png`; live `/#privacy`. |
| F-1-26 | Replaced “analytics SDK” with “No account, tracking, remote fonts, or server upload.” | `@claim:site-no-tracking` and `@claim:extension-local-reader`; live privacy requests/cookies in `live-browser.json`. |
| F-1-27 | Demo banner action now says “Download the extension.” | Focus-contrast browser test; screenshot `live-demo-first-screen.png`; live `/?demo=1`. |
| F-1-28 | The 404 eyebrow is “Error 404” and H1 is “Page not found.” The risograph frame remains visual. | Browser test “unknown routes return the designed 404 response”; screenshot `live-404/screenshot-mobile.png`; live unknown URL returned 404. |
| F-1-29 | Public site, README, settings screen, validation errors, and footer now call the saved object “reading card”; the control is “text size.” | Retired-phrase/content lint and full MV3 suite; screenshots `live-root/screenshot-desktop.png` and local options coverage. |
| F-1-30 | Split the README introduction into short sentences: select the extension, then see the applied card and active site. | Copy review plus `npm run lint`; clean-clone README audit. |
| F-1-31 | README now says “Extracts article headings and text after you select Read this article.” | `@claim:activation-boundary` and `@claim:article-structure`; clean-clone claim runs. |
| F-1-32 | README now says “Applies your saved reading card only inside the reader.” | `@claim:extension-local-reader`; clean-clone MV3 run. |
| F-1-33 | Removed “Manifest V3” from landing copy; it remains only in developer context. | `npm run lint`; screenshot `live-root/screenshot-desktop.png`; live `/#install`. |
| F-1-34 | Every public footer now says “Apply one reading card to simplified web articles.” | Exact five-route browser checks; all `live-*/screenshot-desktop.png`; live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`. |

## Whole-product evidence

- Clean clone: `/tmp/rst-polish-clean-AThIGW`.
- Claim commands: 16/16 passed independently.
- Full gates: 10/10 unit tests; 24/24 Playwright tests; deterministic package;
  production audit with zero vulnerabilities.
- Local Lighthouse: 100/100/100/100, LCP 1.5 s, CLS 0.033, TBT 0 ms.
- Live Lighthouse: 100/100/100/100, LCP 1.4 s, CLS 0.033, TBT 10 ms.
- Deployment: `8e62ead0-fb10-4b3f-9b08-89dfe3af8e2b`.
- Live/local HTML and ZIP hashes match exactly.
