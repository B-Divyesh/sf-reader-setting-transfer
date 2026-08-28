# Reader Setting Transfer — visual thesis

## Direction

**Risograph tactile collage: a reading recipe carried from page to page.** Reader Setting Transfer is not another sterile accessibility panel. It should feel like a well-used reading card tucked into a book: personal, inspectable, and dependable. Offset ink layers, clipped paper shapes, crop marks, and a small registration-cross motif make “transfer” visible while the actual reading surface remains calm.

Clarity leads: controls are named in ordinary language, their current values are always printed, and the active site rule appears beside the reading profile. Decoration is confined to the landing hero, small stamps, and section dividers; the extracted article itself is deferential and quiet.

## Palette

The palette comes from library ephemera and two-pass risograph ink:

| Token | Light | Dark | Role |
|---|---:|---:|---|
| Paper / background | `#F3EBD8` | `#161B24` | warm stock / night desk |
| Sheet / surface | `#FFFDF6` | `#202735` | reading sheet |
| Ink / text | `#18213B` | `#F7F0DE` | navy key plate |
| Muted ink | `#5A6071` | `#BEC5D3` | supporting copy |
| Riso blue / accent | `#1557D5` | `#77A7FF` | actions and focus |
| Persimmon | `#B8371E` | `#FF8062` | second ink, warnings |
| Leaf | `#246B4B` | `#73C99E` | success |
| Danger | `#A32118` | `#FF8F82` | destructive/error |
| Rule | `#B8AE99` | `#515B6D` | boundaries |

All body-copy pairs meet WCAG AA. Contrast modes in the reader are literal surfaces: warm paper, bright white/black high contrast, and dark navy. State is always paired with text or iconography, never color alone.

## Typography

- Interface: `Atkinson Hyperlegible`, self-hosted in 400 and 700 Latin WOFF2 subsets, chosen for differentiated glyph shapes and generous apertures.
- Reading: profile-selectable system serif (`Georgia`), Atkinson Hyperlegible, or a dyslexia-friendly stack (`Verdana`, `Atkinson Hyperlegible`, sans-serif). System faces keep the package small and avoid third-party requests.
- Scale: 14, 16, 18, 22, 30, and clamp(42–72) px. Reading copy defaults to 20 px / 1.65 and 66 characters. Values use tabular numerals.

## Spacing and shape

An 8 px base rhythm with 4 px for tight label/value relationships. Page sections use 64–112 px; control groups use 24–32 px. Corners are modest (4, 8, 16 px), with intentionally imperfect-looking doubled ink borders and 4 px offset shadows. Touch targets are at least 44 px. At 390 px, secondary illustration notes disappear, control pairs stack, and reading margins compress without reducing type.

## Interaction grammar

- Primary actions resemble blue ink labels with a 3 px navy key-line and offset shadow; pressing them removes the offset.
- Profile changes preview immediately. Every range input prints its exact value.
- A site override is a visible paper tab in the reader rail, never a hidden preference.
- Extraction progresses through explicit “collecting → ready/error” copy in a polite live region.
- Import validates a versioned JSON profile before replacing settings; export is a transparent text file.
- “Turn off for this site” is reversible from the reader or popup and returns to the original page immediately.

## Motion policy

UI transitions last 160–220 ms and affect only transform/opacity. The hero’s two ink plates settle once from a 6 px offset, evoking registration. Nothing loops. Under `prefers-reduced-motion: reduce` all transforms, smooth scrolling, and transitions become instant; the composition remains understandable through layering and outlines.

## Asset plan and provenance

The hero illustration is an original AI-assisted risograph still life: a large-type article sheet passing through a compact hand-operated print/transfer device, with two offset ink plates, reading glasses, and tactile paper scraps. It explains portability without pretending to be an extension screenshot. It will ship as responsive AVIF/WebP/fallback files with explicit dimensions; the mobile source is ≤300 KB.

**Prompt sheet**

- Subject: an accessible large-type article card being transferred between two browser-window-shaped paper frames, reading glasses nearby
- World/materials: tactile cut paper, fibrous cream stock, two-color risograph, visible halftone dots, imperfect ink registration, editorial still life
- Light/lens: flatbed studio light, shallow physical depth, straight-on 50 mm editorial composition
- Palette words: warm oat paper, ultramarine blue, persimmon red, deep navy, tiny leaf green accent
- Negative list: no gradients, no glossy 3D, no photoreal people, no hands, no brands, no logos, no readable text, no watermark, no UI labels

Generated with the factory Azure OpenAI image deployment (`factory-image`) on 2026-08-28. Original for this product; no source brands or copyrighted characters. Prompt sidecar is stored beside the source in `assets/src/`. The registration-cross and profile-card icons are hand-authored SVG/CSS and MIT-licensed with the repository.

The 1200×630 social card is a centre crop of that same generated hero source,
not a separate stock asset. The Apple touch icon is a 180 px raster export of
the hand-authored extension mark. Both derivatives were produced locally on
2026-08-28.
