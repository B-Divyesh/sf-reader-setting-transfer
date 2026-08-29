# Polish round 3 — finding closure map

Candidate repaired: `43932d56a06f24e5dbdd389063813e1d88a13ced`
Deployment: `f5d847a6-861e-42e1-966e-ba49cd51686a`
Live URL: <https://reader-setting-transfer.sociobot.in/>

All local claim commands were run independently from clean clone
`/tmp/rst-polish3-clean-p12Zan`. Live browser evidence is in
`.factory/evidence/polish-3/`.

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Reduced desktop demo intro space and tightened the reading surface so the shipped sample heading and first paragraph appear immediately at both required viewports. | `@claim:demo-first-screen`; `live-demo/desktop-first-screen.png` and `mobile-first-screen.png`; live `/?demo=1` check: heading bottom 823.22 px and paragraph top 862.81 px at 1440×900. |
| F-1-3 | Replaced the false “each active value” wording with the exact four values shown in the preview and reader. | `@claim:reading-settings`, `@claim:extension-open-article`; live `/` cold check. |
| F-3-1 | Added the production popup-to-background reader-opening message, `extension-open-article` claim, and an MV3 real-local-article extraction → stored article → new reader-tab test. | `@claim:extension-open-article`; live `/` wording check; reader test asserts heading, list, safe link, active site, saved card, and applied styles. |
| F-3-2 | Put the hero caption on an opaque paper strip using the ink token. | `hero caption uses an opaque high-contrast reading strip`; live contrast 15.64:1; `live-root/screenshot-desktop.png`. |
| F-3-3 | Rewrote preview copy to promise only type, spacing, and contrast changes; expanded the packaged-extension claim to assert those exact preview states. | `@claim:extension-reading-settings`; live `/`; options copy has no motion-preview promise. |
| F-3-4 | Added the separate packaged-extension export/import claim across two clean MV3 profiles. | `@claim:extension-reading-card-transfer`; all exported fields, extension storage, and reader styles asserted. |
| F-3-5 | Added exact active-site assertion to the new real article-to-reader claim. | `@claim:extension-open-article` asserts `Applied on 127.0.0.1`; live `/` copy check. |
| F-3-6 | Removed the untested offline-download statement. | `@claim:offline-landing`; live offline banner now says only “You’re offline. This page still works.” |
| F-3-7 | Kept Demo, How it works, Privacy, and Download extension in the 390 px header as a two-column, keyboard-focusable grid. | `mobile header keeps every product destination visible and keyboard-operable`; live check reports all five routes and 0 px overflow. |
| F-3-8 | Added a shared polite live region and update it whenever internal navigation moves focus to the destination H1. | `internal route changes move focus…`; live forward/back checks assert focus and announced heading text. |

## Earlier review findings, rechecked rather than trusted from prior closure text

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-1-2 | Keyboard claim operates landing and demo controls. | `@claim:responsive-keyboard` from clean clone. |
| F-1-4 | No speed promise remains; per-site return is exercised. | `@claim:per-site-off-return`; live `/`. |
| F-1-5 | No untested one-click count remains. | Copy audit and live `/`. |
| F-1-6 | Download promise is registered and checks the actual ZIP. | `@claim:extension-download`. |
| F-1-7 | Cache-duration marketing copy is absent. | `npm run lint`; live README source. |
| F-1-8 | Security-header marketing claim is absent; deployment headers are checked. | `verify-url.sh`; `live-routes/live-browser.json`. |
| F-1-9 | Activation boundary is named and tested. | `@claim:activation-boundary`. |
| F-1-10 | Passive browsing privacy boundary is named and tested. | `@claim:no-background-monitoring`. |
| F-1-11 | README links to the registry without falsely asserting completeness. | `npm run lint`; README review. |
| F-1-12 | Internal forward, primary-demo, and Back navigation focus the H1 and now announce it. | Route-focus test; live forward/back result. |
| F-1-13 | The real article preview remains before How it works. | Site DOM test; live `/`. |
| F-1-14 | Header action says “Download extension.” | Five-route chrome test; live routes. |
| F-1-15 | Promise labels use consistent reading-card, article, and device language. | Copy audit; live `/`. |
| F-1-16 | Caption is factual and now has a readable surface. | Caption contrast test; live desktop screenshot. |
| F-1-17 | The extension-work section has a factual heading. | Copy audit; live `/`. |
| F-1-18 | The setup-ritual slogan is absent. | `npm run lint`; live `/`. |
| F-1-19 | Step three names adjusting or turning off. | Copy audit; live `/`. |
| F-1-20 | Export/import section has a factual heading. | Copy audit; live `/`. |
| F-1-21 | Black-box wording is absent. | `npm run lint`; live `/`. |
| F-1-22 | Text-file result precedes the JSON technical detail. | Copy audit; live `/`. |
| F-1-23 | Per-site wording names an article that looks wrong. | Copy audit; live `/`. |
| F-1-24 | Privacy section names what stays on the device. | Copy audit; live `/`. |
| F-1-25 | Privacy heading states the reading-history behavior directly. | `@claim:extension-no-remote-requests`; live `/`. |
| F-1-26 | Unexplained analytics-SDK jargon is absent. | `npm run lint`; live `/`. |
| F-1-27 | Demo exit names the downloaded extension. | `@claim:responsive-keyboard`; live `/demo/`. |
| F-1-28 | The designed 404 uses Error 404 and Page not found. | Unknown-route test; live `/not-a-real-route` returns 404. |
| F-1-29 | Public terminology consistently uses reading card and text size. | Copy audit; `npm run lint`; live `/`. |
| F-1-30 | README sentences remain within the plain-language cap. | Copy audit and README review. |
| F-1-31 | README names article headings and text. | `@claim:extension-open-article`; README review. |
| F-1-32 | README uses saved reading card. | `@claim:extension-reading-settings`; README review. |
| F-1-33 | MV3 stays out of landing marketing copy. | `npm run lint`; live `/`. |
| F-1-34 | Every route footer has the same factual one-liner. | Five-route chrome test; live route screenshots. |
| F-1-35 | All five routes share header/footer structure. | Five-route chrome test; live `live-routes/live-browser.json`. |
| F-1-36 | GitHub source visibly identifies itself as external. | Five-route chrome test; live routes. |
| F-1-37 | README leads with text file before JSON. | Copy audit; README review. |
| F-1-38 | README says “Build the production files with.” | `npm run lint`; README review. |
| F-1-39 | The extension promise is the registered no-remote-requests claim. | `@claim:extension-no-remote-requests`. |
| F-2-1 | All public routes retain 0 px overflow at 200% text. | Reflow test; live `live-routes/live-browser.json`. |
| F-2-2 | Copy names supported public articles, not every article. | Copy audit; `@claim:access-boundaries`. |
| F-2-3 | Cross-browser promise remains absent; transfer uses clean sessions. | `@claim:reading-card-json-transfer`. |
| F-2-4 | Final reader still applies every card field; preview scope is now exact. | `@claim:extension-reading-settings`. |
| F-2-5 | Public support wording is Chromium-specific. | Packaged Chromium claim; live `/`. |
| F-2-6 | Privacy distinguishes extension storage from infrastructure logs. | Five-route accessibility test; live `/privacy/`. |
| F-2-7 | Complete landing action guidance remains in the 1440×900 first screen. | `the complete first-screen guidance fits…`; live result. |
| F-2-8 | README describes the demo as a temporary browser session. | `@claim:demo-isolation`; README review. |
| F-2-9 | Untested quick-preview wording is absent. | Copy audit; options/landing review. |
| F-2-10 | Privacy label says Delete local data. | Copy audit; live `/`. |
| F-2-11 | Privacy label says No article upload. | `@claim:extension-no-remote-requests`; live `/`. |
| F-2-12 | Install label says Install the Chromium extension. | Copy audit; live `/`. |
| F-2-13 | README accurately separates lint and typecheck. | Clean-clone `npm run check`; README review. |
| F-2-14 | Dependency audit remains clean. | Clean-clone `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities. |

No review finding remains open.
