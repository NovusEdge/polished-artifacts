---
name: primer
description: GitHub Primer look for polished-artifacts. Load after polished-artifacts:core when the user picks the Primer look. Dense, bordered, engineer-familiar; system font.
---

# Primer look

Paste `tokens.css` (this folder) at the top of the page's `<style>`. Use only its `--pa-*` tokens. Colours are Primer's functional tokens from `@primer/primitives` (2026-10-12): the light and dark default themes, and the semantic foreground colours (accent, severe, success, done, sponsors) as the five categories, because Primer's data-vis emphasis colours fall under 3:1 on the dark canvas.

## Type
- The system font stack for text and the system monospace stack for code. No web font.
- Scale (Primer markdown): h1 32/40 semibold, h2 24/30 semibold, h3 20/25 semibold, body 16/24, captions and labels 12/18. h1 and h2 get a 1px `--pa-border` bottom rule with `padding-bottom: var(--pa-space-2)`, as on a GitHub README.
- Weights: 400 for body, 600 for headings and emphasis.

## Layout
- Core's page grid (`layout.css`) with `--pa-col` 1012px (GitHub's container-lg) and `--pa-col-wide` 1120px. Prose runs the full column. The rail suits a sticky contents list, as on a GitHub README.
- Motion tokens are Primer's base easings (easeInOut, easeOut, easeIn) and functional durations (micro 100, short 200, medium 300, long 500ms), from `@primer/primitives`.
- Spacing only from `--pa-space-*` (4, 8, 16, 24, 32, 40, 48, 64).
- Sections are separated by space and the heading rule, not by boxes.

## Surfaces
- `--pa-bg` for the page. A box (a table, a chart, a callout) gets a 1px `--pa-border` border, `--pa-radius` (6px) corners and a `--pa-surface` header row when it has a title. No shadows.
- Never a box inside a box.

## Components
- "Show all": `<summary>` styled as Primer's invisible button: `--pa-interactive` text, no border, `--pa-surface` background on hover.
- Tables: the GitHub markdown table. 1px `--pa-border` on every cell, header cells semibold on `--pa-surface`, numbers right-aligned with tabular numerals.
- Key figure: the number at 32px semibold, a 12px label in `--pa-text-2` below.
- Code blocks: `--pa-surface` background, `--pa-radius` corners, 16px padding, 13.6px monospace (85% of body, as GitHub sets it).
- A callout is Primer's markdown alert: a 4px left border in the state's colour (`--pa-cat-1` note, `--pa-cat-3` tip, `--pa-cat-2` warning) with the state name in that colour as its first line. This is the one coloured border core allows, because the colour encodes the alert's state; give it `data-encodes="alert state"`.

## Charts
Recharts with `--pa-cat-1…5`, 2px rounded bar ends, axis text 12px `--pa-text-2`, and direct `<LabelList>` labels. Wrap each chart in the bordered box from Surfaces, with its title in the box header.

## Diagrams
Paste core's `mermaid.css` after this look's tokens; it colours every diagram from `--pa-*` in both themes. For Primer's corners add `pre.mermaid svg .node rect { rx: 6px; ry: 6px; }`.

## References
Check these before inventing a pattern the look doesn't cover:
- [Primer](https://primer.style/)
- [Color](https://primer.style/foundations/color/overview) and [primitives](https://primer.style/foundations/primitives/color)
- [Typography](https://primer.style/foundations/typography)
- [Layout](https://primer.style/foundations/layout)
- [Data visualization](https://primer.style/product/ui-patterns/data-visualization/)
- [Accessibility](https://primer.style/accessibility/overview)
