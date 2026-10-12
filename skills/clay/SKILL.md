---
name: clay
description: Clay look for polished-artifacts, modelled on anthropic.com's palette and type. Load after polished-artifacts:core when the user picks the Clay look. Warm ivory, serif body, bold sans headings, clay accent.
---

# Clay look

Paste `tokens.css` (this folder) at the top of the page's `<style>`. Use only its `--pa-*` tokens. The palette comes from anthropic.com's published CSS variables (sampled 2026-10-12): the ivory and slate neutrals, with clay, sky, olive, fig and cloud as the five categories, each darkened or lightened just enough to reach 3:1.

## Never
No Anthropic logo, wordmark, product names in headings, or anything that would make the page look like it comes from Anthropic. The look borrows the palette and type pairing, not the identity. The site's typefaces are proprietary, so `tokens.css` substitutes open faces from Google Fonts.

## Type
- Body: Source Serif 4 (`--pa-font-sans`, which is the body face in this look despite its name). Headings: Instrument Sans (`--pa-font-display`), which `tokens.css` applies to h1–h3.
- Scale: h1 48/53 weight 700, h2 32/38 weight 600, h3 22/28 weight 600, body 17/27, captions 13/18.
- Labels, captions and table headers stay in the serif body face, per core.

## Layout
- Core's page grid (`layout.css`) with `--pa-col` 720px and `--pa-col-wide` 1000px. Key figures and meta lines go in the rail.
- Motion tokens come from anthropic.com's stylesheets (sampled 2026-10-12): CSS `ease` for state changes, its ease-out-quart and ease-in-quart variables to enter and exit, and 180, 250, 300 and 800ms durations.
- Spacing only from `--pa-space-*`. Generous: 64px between sections.
- Thin `--pa-border` rules separate list rows and the header area, as on the site's newsroom.

## Surfaces
- `--pa-bg` is the ivory page. `--pa-surface` holds a figure or a table, with `--pa-radius` (8px) corners. No shadows.
- Never a surface inside a surface.

## Components
- Buttons: solid `--pa-text` background with `--pa-bg` text, 8px radius. One per page at most.
- "Show all": `<summary>` in `--pa-interactive` (the dark clay), with a "›" chevron.
- Links: `--pa-link` (ink) with a 1px underline offset 3px. The clay is for controls and the focal mark, not running links.
- Key figure: the number at 48px Instrument Sans weight 700, a 13px serif label in `--pa-text-2` below.
- Meta line above a heading: category then date, 14px sans, the category in `--pa-text` and the date in `--pa-text-2`.

## Charts
Recharts with `--pa-cat-1…5`; the focal series takes `--pa-cat-1` (clay) and the rest may all use `--pa-cat-5` (cloud) when only one series matters. Square bar ends, axis text 13px `--pa-text-2`, direct `<LabelList>` labels.

## Diagrams
Paste core's `mermaid.css` after this look's tokens. Add `pre.mermaid svg .node rect { rx: 8px; ry: 8px; }` and mark the focal node with `class X focus`.

## References
- [anthropic.com](https://www.anthropic.com/news), the model for the palette and layout
- [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) and [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)
