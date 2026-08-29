# Demo sandbox

Open `/?demo=1` locally or
<https://reader-setting-transfer.sociobot.in/?demo=1> after deployment. The
landing page links to the same isolated sample with **Try it with sample
data**. The query URL redirects to `/demo/` before the demo is used.

The demo opens a complete sample reading card named “Quiet evening” beside a
field-note article about noticing city trees. It includes headings, paragraphs,
a list, and a quotation. Visitors can change text size, line spacing, letter
shapes, page contrast, and reduced motion. They can also export or import a
versioned JSON reading card.

Demo changes use only the `demo:reader-profile` key in `sessionStorage`. The
demo never reads or writes extension storage, `localStorage`, or real browsing
data. Closing the tab discards the session. **Reset demo** replaces the key
with the shipped sample card, so the restored sample remains available for the
rest of that tab session. **Download the extension** removes the key and
downloads the extension package.

The service worker precaches `/demo/`, so the route reloads offline after one
online visit. Claim tests start with a fresh browser context and use only the
shipped sample data.
