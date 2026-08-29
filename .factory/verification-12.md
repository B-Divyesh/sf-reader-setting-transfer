# Independent verification 12

## Verdict: PASS

Tested candidate commit: `cb88464898b5559c8ee9b5cf54872b6d9cb4bb47` (`docs: record repair verification`), checked out on `main`.

Live target: <https://reader-setting-transfer.sociobot.in/>. Verification ran on 2026-08-29 UTC from a clean dependency install. The deployed extension ZIP is byte-for-byte identical to this candidate's production package:

```
2778986c152e992301539f3b2fbdf7f735110927a4f0af66bc4c3be57eeba171
```

## Cold first read

The first live screen says **“Apply your reading card to web articles.”** It says it is **for low-vision readers** seeking consistent text size, spacing, contrast, and motion on supported public articles. The first primary control is **“Try it with sample data”**, with the plain result **“Opens a styled sample article.”** The three facts state that it is free/open source, local to the device, and works offline after the first visit. This satisfies the first-read and one-click isolated-demo contract.

Evidence: `.factory/evidence/verification-12/root/screenshot-desktop.png` and `root/screenshot-mobile.png`.

## Clean-install and claim verification

`npm ci` completed successfully (269 packages, audit: 0 vulnerabilities). `.factory/claims.json` exists and contains 21 claims. I invoked every declared command separately, from the clean checkout, through its stated demo/extension sandbox. All passed:

- PASS — `reading-settings`, `reading-card-json-transfer`, `demo-isolation`, `offline-reload`, `offline-landing`, `site-no-tracking`
- PASS — `extension-local-reader`, `per-site-off-return`, `article-structure`, `free-open-source`, `responsive-keyboard`, `demo-first-screen`
- PASS — `extension-uninstall-data`, `access-boundaries`, `extension-download`, `activation-boundary`, `no-background-monitoring`
- PASS — `extension-reading-settings`, `extension-open-article`, `extension-reading-card-transfer`, `extension-no-remote-requests`

The independent full quality run also passed:

| Command | Result |
| --- | --- |
| `npm run lint` | PASS — five routes and 21 registered claims |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 11 tests |
| `npm run build` | PASS — extension, `dist/site/`, and ZIP produced |
| `npm run test:e2e` | PASS — 34 Chromium tests in 1.6 minutes |
| `npm run test:package` | PASS — deterministic ZIP and archive integrity |

The full Chromium suite includes the real packaged-extension flows, empty state, extraction boundary, reader off/return, import errors, uninstall storage removal, package download, update/offline behavior, 390 px layout, keyboard flow, and 200% text reflow.

## Independent functional checks

- Live `/demo/`: changed text scale from 120% to 180%, line spacing from 1.75 to 2.2, letter shapes to spacious sans serif, and contrast to dark. The rendered article changed from `24px / 42px` transparent to `36px / 79.2px` with dark `rgb(18, 23, 34)` surface.
- Invalid JSON import showed the actionable message: “This file is not valid JSON. Check the file, then try again.” Reset restored the shipped default values and demo-only `sessionStorage` key.
- Demo storage was exactly `demo:reader-profile`; `localStorage` and cookies were empty.
- Keyboard: the seventh Tab stop reached the primary demo link with a visible `4px` focus outline; Enter opened `/demo/` and its sample heading.
- At 390 × 844, `scrollWidth` equalled 390. The sample heading and beginning of the first paragraph appeared in the initial viewport. The suite also passed all public routes at 200% text size.
- Under reduced-motion emulation, action controls had a `0.00001s` transition duration.
- A live service worker registration was active with cache `reader-setting-transfer-site-v4`; after the online visit, a fully offline reload of `/demo/` returned HTTP 200 from cache with both the demo banner and sample article present.

## Live security, privacy, accessibility, and performance checks

`/opt/fleet/lib/verify-url.sh` passed on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`. Each returned 200, had an appropriate route title, `lang=en`, exactly one `<h1>`, a `<main>`, no images missing `alt`, no unlabeled buttons, and no console errors. Evidence is committed in `.factory/evidence/verification-12/`.

Independent Playwright request logging and axe scans across those five routes found:

- zero serious or critical axe findings;
- zero page or console errors;
- zero cookies and only `https://reader-setting-transfer.sociobot.in` requests;
- no third-party fonts, scripts, analytics, advertising, or tracking requests.

Live responses supply HSTS, `nosniff`, `DENY` framing protection, strict-origin referrer policy, restrictive permissions policy, and a self-only CSP including `frame-ancestors 'none'`. HTML is revalidated (`max-age=0, must-revalidate`); hashed JS/CSS are immutable for one year; `sw.js` is `no-cache` for update discovery.

The initial landing JS is 2.57 kB (1.14 kB gzip) and CSS 19.79 kB (4.85 kB gzip), both well within budget. The hero WebP is 162,128 bytes desktop and 48,954 bytes mobile. The live primary JS hash (`main-CcvvfX7A.js`) and the downloaded ZIP match the locally built candidate.

This is a static browser-extension product: it exposes no product server-side API or product-unlock endpoint, and has no sign-in. Therefore a rate-limit allowance / 429 check and Entra-tenant check are not applicable.

## Defects by severity

None found.

## Reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run test:package
```

Then run `/opt/fleet/lib/verify-url.sh` for the public URL routes and compare `dist/site/downloads/reader-setting-transfer-chrome.zip` with the live download SHA-256 above.
