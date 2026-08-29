# Reader Setting Transfer

Reader Setting Transfer is a free, open-source Chrome/Chromium extension for low-vision readers.

Make one reading card for text size, line length, spacing, contrast, letter shapes, and reduced motion. Choose the extension on a public article. The reader applies your card and shows the active site. Export the card as readable JSON and import it in another browser.

Try the isolated sample at <https://reader-setting-transfer.sociobot.in/?demo=1>.
It uses a separate `demo:` session namespace and does not read extension data.
The demo reloads offline after your first visit.

The production build places the extension ZIP in `dist/site/downloads/`.

## What v1 does

- Extracts article headings and text after you select **Read this article**
- Preserves headings, paragraphs, lists, quotes, code, tables, and safe links
- Applies your saved reading card only inside the reader
- Provides live settings preview and quick reader text-size/contrast changes
- Stores the current article, reading card, and site choices locally
- Turns the reader off per site and returns to the original page
- Supports keyboard use and 390 px layouts on the landing page and demo
- Provides the packaged extension ZIP from the product site

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

Outputs:

- `.output/chrome-mv3/` — unpacked MV3 extension
- `dist/site/index.html` — static deploy root
- `dist/site/downloads/reader-setting-transfer-chrome.zip` — packaged extension

## Install the development build

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select `.output/chrome-mv3`.
5. Pin Reader Setting Transfer, open a public article, and choose the extension.

## Privacy and permissions

The extension has no analytics, account, remote API, or broad host permission.
<!-- claim:activation-boundary -->
It reads article text only after you open the extension and select **Read this article**.
<!-- claim:no-background-monitoring -->
It does not read or store pages while you browse without opening the extension.
The `storage` permission keeps the reading card, current article, and site choices on the device.
<!-- claim:extension-uninstall-data -->
Removing the extension removes that browser-managed data.

See the published [privacy policy](site/privacy/index.html) and [terms](site/terms/index.html).
Claim tests are listed in [.factory/claims.json](.factory/claims.json).
The sample sandbox design is in [.factory/demo.md](.factory/demo.md).

## Project notes

- Visual direction and generated-art provenance: [.factory/design.md](.factory/design.md)
- Build and verification handoff: [.factory/handoff.md](.factory/handoff.md)
- License: [MIT](LICENSE)
