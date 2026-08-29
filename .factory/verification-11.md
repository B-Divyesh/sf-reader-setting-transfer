# Independent verification 11 — FAIL

**Candidate:** `c3a1aa96f92ff6e3e1bc70ac6304942f47ad31a0`

**Live URL:** <https://reader-setting-transfer.sociobot.in/>

**Verified:** 2026-08-29 UTC

**Verdict:** **FAIL**

The deployment is healthy and byte-for-byte matches the candidate, but one
core extraction boundary is broken and one required claim test does not
exercise the user path named in its sandbox. Both are release-blocking medium
findings.

## First-read and demo gate — PASS

Cold live visit, in plain words: this applies a saved reading card to web
articles; it is for low-vision readers who want consistent text size, spacing,
contrast, and motion; click **Try it with sample data** first. The first
viewport says that the action opens a styled sample and keeps demo changes
separate from extension data. It also states that the product is free/open
source, stores the card on-device, and reloads the demo offline.

The action opens `/demo/` in one click. At both 1440 × 900 and 390 × 844, the
realistic city-trees sample appears immediately with the persistent **Demo —
sample data, nothing is saved** banner, **Reset demo**, and the extension
download action. Evidence:
`.factory/evidence/live-first-read-desktop.png` and
`.factory/evidence/verification-11/live/live-demo-first-screen.png`.

## Required claim sweep — PASS after locked install

`.factory/claims.json` exists and contains 21 entries. The first literal
invocation from the dependency-free checkout reported that
`@playwright/test` was unavailable. After the required `npm ci`, I ran every
listed command separately and all 21 passed.

| Claims | Result |
| --- | --- |
| `reading-settings`, `reading-card-json-transfer`, `demo-isolation` | PASS |
| `offline-reload`, `offline-landing`, `site-no-tracking` | PASS |
| `extension-local-reader`, `per-site-off-return`, `article-structure` | PASS |
| `free-open-source`, `responsive-keyboard`, `demo-first-screen` | PASS |
| `extension-uninstall-data`, `access-boundaries`, `extension-download` | PASS |
| `activation-boundary`, `no-background-monitoring` | PASS |
| `extension-reading-settings`, `extension-open-article` | PASS |
| `extension-reading-card-transfer`, `extension-no-remote-requests` | PASS |

The passing status does not clear finding M2 below: the registered
`extension-open-article` test bypasses the popup interaction promised by its
sandbox.

## Local quality gates

| Command | Fresh result |
| --- | --- |
| `npm ci` | PASS — 270 packages, 0 vulnerabilities |
| `npm run lint` | PASS — 5 routes and 21 claims |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 10/10 tests |
| `npm run build` | PASS — `dist/site/`, MV3 output, and ZIP produced |
| `npm run test:e2e` | PASS — 33/33 Chromium tests |
| `npm run test:package` | PASS — deterministic valid ZIP |
| `npm audit` / `npm audit --omit=dev` | PASS — 0 vulnerabilities |

The extension ZIP SHA-256 is
`c574dbb356d994b59b3e814c2af398962d04583bb9ef2f2f6e5e628dcec735d1`.

## Independent live evidence

- All 26 deployed user-facing files matched the candidate build byte-for-byte,
  including every route, hashed JS/CSS/font/image, `sw.js`, and the extension
  ZIP. Candidate/live `index.html` SHA-256:
  `01947fcb7da5041001a29a4c5a7dff82736a07e99c2df9966d42192bc57970ff`.
- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each had the expected
  title, one H1, one main landmark, and zero serious/critical Axe violations.
  The factory `verify-url.sh` found `lang=en`, alt text on every image, and zero
  console/page errors.
- The request log across public routes contained only
  `https://reader-setting-transfer.sociobot.in`; no response set a cookie and
  the browser cookie jar stayed empty.
- Live demo lower and upper settings applied correctly: 17–36 px text, 40–85
  character measure through imported profiles, 1.2–2.2 line spacing, 0.5–2.5
  paragraph spacing, and 0–0.08 letter spacing. Dark/high contrast,
  hyperlegible/dyslexia choices, and motion preferences rendered correctly.
- Malformed JSON and a 20,001-byte file produced plain recovery messages; a
  valid follow-up import succeeded; Reset restored the 120% sample.
- At 390 px there was 0 px horizontal overflow. Keyboard Tab reached Reset
  demo with a 4 px visible focus outline. OS reduced motion reduced animation
  and transitions to 0.01 ms with no animation name.
- The service worker activated from `/sw.js`, `registration.update()`
  completed, cache `reader-setting-transfer-site-v4` existed, and the demo
  reloaded offline with its banner and article.
- Headers included HSTS, self-only CSP with `frame-ancestors 'none'`,
  `nosniff`, `DENY`, restrictive Permissions-Policy, and strict-origin
  referrer policy. HTML revalidates; hashed assets and the ZIP are one-year
  immutable; `sw.js` is `no-cache`; unknown routes return HTTP 404.
- Initial landing payloads are within budget: JS 2,567 bytes raw (1.14 kB
  gzip), CSS 19,792 bytes raw (4.85 kB gzip), two loaded WOFF2 files total
  34,732 bytes, and the mobile hero is 48,954 bytes.
- Mobile Lighthouse: Performance 97, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.1 s, LCP 1.4 s, CLS 0.04, TBT 170 ms, total transfer 92 KiB.
- The live ZIP installed as MV3 with only `storage`, `activeTab`, and
  `scripting`, no host permissions, no content script, and no remote
  extension requests. Options, reader, and popup empty states had no
  serious/critical Axe issues or console errors.

Evidence is under `.factory/evidence/verification-11/`.

This is a static site and local browser extension. It has no backend, account,
sign-in, payment/unlock call, or product API. Entra, persistence/concurrency,
and 429/`Retry-After` checks are not applicable.

## Defects by severity

### Critical

None.

### High

None.

### Medium — release blocking

**M1 — A CSS-hidden paywall remnant blocks a public article.**

In real Chromium, a public article with
`<div style="display:none"><div class="paywall-overlay">…</div></div>` is
rejected as restricted. The same article is accepted only when
`display:none` is on the marker itself. `extractArticleFromPage()` checks the
marker's computed style and `[hidden]` ancestors, but not whether a CSS-hidden
ancestor makes it non-rendered. Hidden paywall/modal remnants are common on
publisher pages, so this can prevent the core job on content the reader is
already allowed to read. The source DOM remains unchanged in all cases.

Evidence: `.factory/evidence/verification-11/extraction-boundary.json`.

**M2 — The `extension-open-article` claim test bypasses the registered user
flow.**

`.factory/claims.json` says the sandbox opens a public article, invokes the
packaged popup, and chooses **Read this article**. The sole tagged test instead
calls `extractArticleFromPage` directly in the source page, then calls
`chrome.runtime.sendMessage` directly from the options page. It never opens
the popup or clicks the named action, so it cannot detect a regression in the
popup's active-tab lookup, scripting call, loading/error handling, or button
wiring. This violates the required claim-test contract for the product's core
path.

### Low

None.

## Release decision

**FAIL.** Fix the ancestor-visibility check and add a faithful packaged
popup-to-reader claim test, then rerun all 21 claim commands, the complete
quality gates, and live verification. No product code was modified during this
verification.
