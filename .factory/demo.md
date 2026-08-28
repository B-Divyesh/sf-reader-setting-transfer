# Demo sandbox

Open `/demo/` locally or <https://reader-setting-transfer.sociobot.in/demo/>
after deployment. The landing page links to it with **Try it with sample
data**. `/?demo=1` redirects to the same route.

The demo opens a complete sample reading card named “Quiet evening” beside a
field-note article about noticing city trees. It includes headings, paragraphs,
a list, and a quotation. Visitors can change text size, line spacing, letter
shapes, page contrast, and reduced motion. They can also export or import a
versioned JSON reading card.

Demo changes use only the `demo:reader-profile` key in `sessionStorage`. The
demo never reads or writes extension storage, `localStorage`, or real browsing
data. Closing the tab discards the session. **Reset demo** removes the key and
restores the shipped sample. **Start for real** removes the key and downloads
the extension package.

The service worker precaches `/demo/`, so the route reloads offline after one
online visit. Claim tests start with a fresh browser context and use only the
shipped sample data.
