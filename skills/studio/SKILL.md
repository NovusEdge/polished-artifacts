---
name: studio
description: Studio look for polished-artifacts, modelled on OpenAI's blog. Load after polished-artifacts:core when the user picks the Studio look. Black and white, centred headline, large grotesque type, colour only in figures.
---

# Studio look

Paste `tokens.css` (this folder) at the top of the page's `<style>`. Use only its `--pa-*` tokens. The palette comes from openai.com's primitive colour variables (sampled 2026-10-12 from an archived article): the grey scale for neutrals, and blue, orange, green, purple and pink as the five categories (step 500 or 600 in light, 200 or 300 in dark).

## Never
No OpenAI logo, wordmark, product names in headings, or anything that would make the page look like it comes from OpenAI. The site's typeface is proprietary, so `tokens.css` substitutes Hanken Grotesk from Google Fonts.

## Type
- Hanken Grotesk for everything except code. Tight tracking: `tokens.css` sets -0.01em on body and -0.03em on h1.
- Scale: h1 64/64 weight 500, h2 28/34 weight 500, h3 20/28 weight 500, body 17/28, captions 14/20. Under 768px h1 drops to 40/44.
- Headings never go bold; weight 500 is the heaviest in the page.

## Layout
- The header block is centred: a meta line (date, then category in `--pa-text-2`), the h1, a two-line lede at body size, and at most one pill button. Everything after it is left-aligned.
- Core's page grid (`layout.css`) with `--pa-col` 680px and `--pa-col-wide` 1000px. Figures and image-led sections take `.pa-span`. Spacing only from `--pa-space-*`; 128px above the first section.
- Motion tokens come from OpenAI's stylesheets (sampled 2026-10-12): its primary curve `cubic-bezier(.17, .17, .3, 1)`, ease-out-quint reveals, an in-out sine to exit, and 200, 300, 400 and 700ms durations. Reveals are slow and large: the long duration, one element at a time.

## Surfaces
- `--pa-bg` is pure white or pure black. `--pa-surface` holds a note box, a table or a chart, with `--pa-radius` (8px) corners and 32px padding. No shadows, no borders on surfaces.
- Never a surface inside a surface.

## Components
- Buttons are pills (`border-radius: 999px`), 40px tall: `--pa-interactive` background with `--pa-bg` text. A secondary button is `--pa-surface` with `--pa-text` text.
- Links: `--pa-link` with a 1px underline in `--pa-text-2`, offset 4px.
- "Show all": `<summary>` as a secondary pill.
- Key figure: the number at 64px weight 500, a 14px label in `--pa-text-2` below. No container.

## Charts
Recharts with `--pa-cat-1…5`, 4px rounded bar ends, axis text 14px `--pa-text-2`, direct `<LabelList>` labels. Colour lives only in figures; the rest of the page stays black and white. Each chart sits in a `--pa-surface` panel.

## Diagrams
Paste core's `mermaid.css` after this look's tokens. Add `pre.mermaid svg .node rect { rx: 8px; ry: 8px; }`.

## References
- [OpenAI news](https://openai.com/news/), the model for the layout
- [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk)
