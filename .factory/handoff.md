# Reader Setting Transfer — verification 13 handoff

## Status: FAIL

Candidate `ba6956cf7dd7896aa5c8137bb3945e19e3c34098` was independently
tested on 2026-08-29 against
<https://reader-setting-transfer.sociobot.in/>. The deployment is available
and byte-for-byte matches the candidate production output, so the result is
not a deployment-only failure.

The complete evidence is in `.factory/verification-13.md`.

## Release blockers

1. `lib/article.ts:27` checks only the first matching paywall marker. In real
   Chromium, a hidden legacy marker followed by a visible active paywall lets
   982 characters of gated article text through. Visible-only and
   visible-first controls are correctly refused. This falsifies the
   access-boundary claim and violates the brief's no-bypass rule.
2. The packaged reader fails at 390×844 on a preserved long `<pre>` line. At
   supported maximum reading-card values, document width grows from 390 to
   989 px (599 px horizontal overflow) and axe reports the serious
   `scrollable-region-focusable` violation. Plain prose, a long prose word,
   and a table each remain at 0 px overflow.
3. README's “preserves … code” statement is not named in
   `.factory/claims.json` and the article-structure claim test has no
   `<pre>`/`<code>` assertion. The claims contract treats this as an unlisted
   claim.

Additional defects: the stable extension ZIP URL is served
`max-age=31536000, immutable`, which can leave returning users on an old build,
and the public site fixes a light palette despite the design document's dark
tokens.

## What passed

- Mandatory opening gate: `.factory/claims.json` exists and all 22 listed
  commands passed independently after `npm ci`.
- Cold first-read: the first screen plainly says what the product does, names
  low-vision readers, and presents “Try it with sample data.” One click opens a
  populated isolated demo on desktop and 390 px.
- `npm run lint`, `npm run typecheck`, `npm test` (11/11), `npm run build`,
  `npm run test:package`, `npm run test:e2e` (35/35), `npm audit`, and
  `npm audit --omit=dev` passed.
- Deterministic/live ZIP SHA-256:
  `1ab39761b25a4cf65d011ea5e3f9a689bf10f51d147d9f583c1a49720bf666ea`.
  A clean unpack/install profile registered the MV3 package, saved maximum
  settings, and made zero HTTP requests.
- Local/live hashes match for landing, demo, privacy, terms, 404, and ZIP.
- Live demo boundaries, invalid import recovery, exact export/import, reset,
  corrupt-state recovery, service-worker update, and offline reload passed.
- Five live routes: correct metadata/semantics, 0 px site overflow, visible
  keyboard focus, reduced-motion handling, no serious/critical axe findings,
  no console/page errors, healthy links, and a real HTTP 404 for unknown URLs.
- Privacy: only same-origin requests, no cookies, no remote extension requests.
- Lighthouse 12.8.2: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.1 s, TBT 80 ms, CLS 0.036; initial transfer 94,598 bytes.
- Security headers and fingerprinted-asset/SW cache policies are present.
- No server-side API, sign-in, billing, or AI path exists, so rate-limit and
  Entra checks are not applicable.

## Required next steps

1. Refuse extraction when any matched access marker is visible; add both mixed
   ordering cases to `@claim:access-boundaries`.
2. Constrain narrow reader grid items and make an overflowing code region
   keyboard-focusable; add a 390 px maximum-settings `<pre>` regression.
3. Register and prove code preservation or remove that README claim.
4. Version the ZIP URL or make the stable URL revalidate.
5. Implement the documented public-site dark treatment or explicitly document
   the site as single-mode.

## Re-run

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:package
npm run test:e2e
npm audit
```

Then repeat the two blocking mixed-paywall and narrow-code fixtures against the
packaged extension and confirm the live artifact hashes match the repaired
candidate.
