# Reader Setting Transfer

Reader Setting Transfer is a free, open-source Chrome/Chromium extension for low-vision readers who want the same settings in clean articles.

Create one portable reading card for text size, line length, line and paragraph spacing, contrast, letter shapes, and reduced motion. Choose the extension on a public article to open a clean reader that applies those settings and clearly shows the active profile and site. Profiles can be exported as inspectable JSON and imported on another browser.

Try the shipped sample at <https://reader-setting-transfer.sociobot.in/demo/>.
It uses a separate `demo:` session namespace and never reads real browsing data.
After the first visit, the service worker can reload the demo offline.

The companion site serves the packaged extension from `dist/site/downloads/`.

## What v1 does

- Extracts semantic article text only after the user chooses the toolbar action
- Preserves headings, paragraphs, lists, quotes, code, tables, and safe links
- Applies a versioned, portable accessibility profile inside the reader only
- Provides live settings preview and quick reader text-size/contrast changes
- Stores the current article, profile, and per-site choices locally
- Turns the reader off per site and returns immediately to the original page
- Supports keyboard use and 390 px layouts on the landing page and demo

<!-- claim:access-boundaries -->
It refuses clearly marked paywalls and opens a separate reader without changing the source page.

## Run locally

Requirements: Node.js 20+ and `zip`.

```sh
npm install
npm run dev          # WXT extension development
npm run dev:site     # landing-site development
npm test             # unit tests
npm run test:package # verifies the download ZIP is deterministic and valid
npm run build        # extension + site + packaged ZIP
npm run test:e2e     # real Chromium and axe checks after build
npm run lint         # static TypeScript and repository checks
```

The reproducible production command is exactly:

```sh
npm run build
```

The static deploy root includes Azure Static Web Apps and portable `_headers`
policies: fingerprinted site assets and the downloadable ZIP are immutable for
one year, while HTML and the service worker revalidate. They also set a
self-only CSP and standard framing, referrer, permissions, and MIME-sniffing
protections.

Outputs:

- `.output/chrome-mv3/` — unpacked MV3 extension
- `dist/site/index.html` — static deploy root
- `dist/site/downloads/reader-setting-transfer-chrome.zip` — installable package

## Install the development build

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select `.output/chrome-mv3`.
5. Pin Reader Setting Transfer, open a public article, and choose the extension.

## Privacy and permissions

The extension has no analytics, account, remote API, or broad host permission. `activeTab` and `scripting` allow extraction from the page only when the toolbar action is invoked. `storage` keeps the reading card, current article, and site choices on the device.
<!-- claim:extension-uninstall-data -->
Removing the extension removes that browser-managed data.

See the published [privacy policy](site/privacy/index.html) and [terms](site/terms/index.html).
Every public product claim and its observable command is listed in
[.factory/claims.json](.factory/claims.json). The sample sandbox design is in
[.factory/demo.md](.factory/demo.md).

## Project notes

- Visual direction and generated-art provenance: [.factory/design.md](.factory/design.md)
- Build and verification handoff: [.factory/handoff.md](.factory/handoff.md)
- License: [MIT](LICENSE)
