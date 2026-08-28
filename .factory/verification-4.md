# Independent verification report — FAIL

Work order: `reader-setting-transfer-verify-4`  
Candidate: `1f6203901d6e5735eabeb8dedb9d4fd8f9534c2f` (`1f62039`)  
Live URL: <https://reader-setting-transfer.sociobot.in/>  
Verified: 2026-08-28

## Verdict

**FAIL — do not release this candidate.** The deployed product and its core
demo are healthy, and the previously reported deployment mismatch is not
present. However, the repository's normal full browser test command fails
reproducibly in this clean checkout. A red declared E2E quality gate is a
release blocker.

No product code was changed during this verification.

## Required first checks

### Claims: PASS

From a clean checkout at the candidate, I ran `npm ci` first, then ran every
exact command in `.factory/claims.json`. Each command starts its own built
demo prerequisite and passed:

| Claim | Exact command result |
|---|---|
| `reading-settings` | `npm run test:e2e -- --grep @claim:reading-settings` — PASS |
| `profile-json-transfer` | `npm run test:e2e -- --grep @claim:profile-json-transfer` — PASS |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` — PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` — PASS |
| `extension-local-reader` | `npm run test:e2e -- --grep @claim:extension-local-reader` — PASS |
| `per-site-off-return` | `npm run test:e2e -- --grep @claim:per-site-off-return` — PASS |
| `article-structure` | `npm test -- --testNamePattern @claim:article-structure` — PASS |
| `free-open-source` | `npm test -- --testNamePattern @claim:free-open-source` — PASS |
| `responsive-keyboard` | `npm run test:e2e -- --grep @claim:responsive-keyboard` — PASS |

### Cold first read: PASS

I opened the live root in a fresh Chromium context at 1440 × 900 before any
interaction. The first screen says:

- **What it does:** “Carry your reading settings into clean articles.”
- **For whom:** “For low-vision readers tired of resetting text size, spacing,
  contrast, and motion on every site.”
- **What to click first:** **Try it with sample data**, which opens the ready
  sample article and says that nothing is saved to real data.

The action reaches `/demo/` in one click. Its persistent banner reads “Demo —
sample data, nothing is saved” and provides **Reset demo** and **Start for
real**. This satisfies the plain-words and demo-sandbox first-screen contract.

## Release-blocking defect

### High — the normal full E2E suite times out

The documented full browser command is not reliable in its configured
two-worker mode. Three fresh default runs of `npm run test:e2e` ended with the
same result: **15 passed, 1 failed**. The failure is consistently:

```text
e2e/extension.spec.ts:22
@claim:extension-local-reader the built extension stores a profile locally
and renders a clean article

Test timeout of 30000ms exceeded.
```

The final rerun took 50.3 seconds overall and produced Playwright's retained
trace at:

```text
test-results/extension--claim-extension-46c46-and-renders-a-clean-article/trace.zip
```

The same focused claim passes in about 22 seconds with one worker, so this is
a timing/concurrency defect in the suite rather than evidence that the feature
never works. It is still release-blocking: the factory definition of done
requires the available quality gates to pass locally. Make the test reliably
fit its timeout under the configured parallel workload (or adjust the justified
test timeout/configuration), then rerun the full command cleanly.

## Quality and product evidence that passed

### Local build and tests

```text
npm ci                  PASS (489 packages installed)
npm run lint            PASS (5 routes, 9 claims)
npm run typecheck       PASS
npm test                PASS (3 files, 9 tests)
npm run build           PASS; produced dist/site and .output/chrome-mv3
npm run check           PASS
npm run test:package    PASS; ZIP integrity and deterministic rebuild
npm audit --omit=dev --audit-level=low  PASS (0 production vulnerabilities)
```

`npm ci` reports 10 advisories in development dependencies (1 low, 2
moderate, 4 high, 3 critical); the production dependency audit is clean.

The production package is deterministic and has SHA-256:

```text
c7e36c0eb4e65134eeda796671a4d961a23014a74fd4f03b709447aed71ca060
```

### Independent demo and accessibility exercise

On the live site, at both desktop and `390 × 844`, `/`, `/demo/`, `/privacy/`,
and `/terms/` each returned 200 with `lang=en`, one `h1`, one main landmark,
zero document horizontal overflow, no console/page errors, and zero axe
serious/critical findings. The demo was also axe-clean in Paper, High
contrast, and Dark states.

Keyboard-only checks found the skip link and the demo range input both show a
designed `4px solid rgb(184, 55, 30)` focus ring. Arrow Right changes the text
size. The 390 px demo has no overflow. The demo stored its changed reading
card only under `sessionStorage["demo:reader-profile"]`; `localStorage` was
empty. Its request log contained only
`https://reader-setting-transfer.sociobot.in`.

The supplied `verify-url.sh` is not present in this checkout, so I performed
its relevant title/lang/main/alt/button/console checks directly with
Playwright and axe.

The live service worker acquired control after its first reload, completed
`registration.update()`, and then reloaded `/demo/` offline with the sample
article and demo banner intact. All same-origin site links plus the source
repository link returned 200; an unknown live route returned a designed HTTP
404.

The exact production asset budgets pass: landing JS is 1,600 B raw / 778 B
gzip, landing CSS is 16,061 B raw / 4,203 B gzip, the mobile WebP hero is
48,954 B, and the combined loaded Latin WOFF2 files are 34.7 KB.

### Privacy, headers, and deployment identity

During the demo flow no third-party request, analytics request, remote font,
or API request was observed. The extension manifest has only `storage`,
`activeTab`, and `scripting`; there is no sign-in, payment, remote API, or
server-side product endpoint. Therefore rate-limit/`Retry-After` and Sociobot
Entra tenant checks are not applicable.

The live response headers include a self-only CSP, HSTS, `X-Frame-Options:
DENY`, `X-Content-Type-Options: nosniff`, strict referrer policy, and a
restrictive permissions policy. HTML revalidates, `sw.js` is `no-cache`, and
fingerprinted assets plus the ZIP are one-year immutable.

Fresh local production artifacts match the live deployment byte-for-byte:

```text
dist/site/index.html                                95702bf0e6c4…a85803f41bc
live /                                              95702bf0e6c4…a85803f41bc
dist/site/downloads/reader-setting-transfer-chrome.zip c7e36c0eb4e…aed71ca060
live downloadable ZIP                               c7e36c0eb4e…aed71ca060
```

This rules out the earlier reported deployment-only mismatch for this
candidate.

## Required remediation

1. Repair the full Playwright run so `npm run test:e2e` passes consistently
   using the repository's configured worker count; do not rely on running the
   one focused claim in isolation.
2. Submit a new candidate and rerun the complete suite from a clean checkout.
