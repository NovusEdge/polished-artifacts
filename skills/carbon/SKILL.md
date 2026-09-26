---
name: carbon
description: IBM Carbon look for polished-artifacts. Load after polished-artifacts:core when the user picks the Carbon look. Flat, dense, productive; IBM Plex.
---

# Carbon look

Paste `tokens.css` (this folder) at the top of the page's `<style>`. Use only its `--pa-*` tokens. Its `@import` is the Google Fonts stylesheet for IBM Plex, which the artifact CSP allows.

## Type
- IBM Plex Sans for everything except code, which uses IBM Plex Mono. Weights: 300 for h1, 400 for body, 600 for emphasis. No Plex Serif.
- Scale (Carbon productive): h1 42/50 light, h2 28/36, h3 20/28, body 16/24, labels and captions 12/16 at the smallest. Use `--pa-fs-*` and `--pa-lh-*`.

## Layout
- Side gutter: `body { padding-inline: var(--pa-space-3); }`, and 32px from 672px up.
- A 16-column grid on wide screens, 4 columns under 672px.
- Spacing only from `--pa-space-*` (4, 8, 16, 24, 32, 48, 64, 96).
- Prose runs in a 680px column. Data sections may span the full grid.

## Surfaces
- Flat. `--pa-radius` is 0: square corners everywhere.
- Two layers only: `--pa-bg` for the page, `--pa-surface` for a data region that needs grouping (a table, a chart area). Never a surface inside a surface.
- 1px `--pa-border` dividers only where two groups would otherwise merge. No shadows, no coloured borders.

## Components
- "Show all": a ghost button. `<summary>` text in `--pa-interactive`, no border, no background.
- Tables: header labels 12px or larger in `--pa-text-2`, sentence case; rows separated by 1px `--pa-border`; numbers right-aligned with tabular numerals.
- Key figure: the number at `--pa-fs-h2` weight 300, a label of 12px or larger below it in `--pa-text-2`. No box around it.
- No tags or chips. A category goes in a table column as text.

## Charts
- Carbon Charts with `theme: "white"` (light) or `"g100"` (dark), toolbar off, legend top-left, plus `vendor/carbon-charts.css` from core (published alongside the page).
- Series colours in `--pa-cat-1…5` order; the focal series takes `--pa-cat-1`.
- A chart that needs direct labels uses Recharts with the same tokens.
- Carbon Charts draws axis ticks at 10px. Raise them: `.chart svg text { font-size: 12px !important; }` (with the chart's container carrying `class="chart"`).
- Horizontal bar charts plot the first data item at the bottom. Pass the data reversed so the largest bar sits on top.
- A log-scale axis needs an explicit `domain` whose lower bound sits below the smallest value, or that bar draws with zero length.
- Without React, use `@carbon/charts` (the same library, vanilla): `new SimpleBarChart(el, { data, options })`.

## Diagrams
Mermaid init values for this look (hex, because the artifact renderer can't read CSS variables):

| Variable | Light | Dark |
|---|---|---|
| `primaryColor` | `#f4f4f4` | `#262626` |
| `primaryTextColor` | `#161616` | `#f4f4f4` |
| `primaryBorderColor` | `#e0e0e0` | `#393939` |
| `lineColor` | `#525252` | `#c6c6c6` |
| `fontFamily` | `IBM Plex Sans, system-ui, sans-serif` | same |

Use the light values unless the page is dark-only. Nodes stay plain rectangles.

## References
Check these before inventing a pattern the look doesn't cover:
- [Carbon Design System](https://carbondesignsystem.com/)
- [Color](https://carbondesignsystem.com/elements/color/overview/) and [color tokens](https://carbondesignsystem.com/elements/color/tokens/)
- [Typography](https://carbondesignsystem.com/elements/typography/overview/) and [type sets](https://carbondesignsystem.com/elements/typography/type-sets/)
- [2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/) and [spacing](https://carbondesignsystem.com/elements/spacing/overview/)
- [Data visualization](https://carbondesignsystem.com/data-visualization/getting-started/) and [color palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)
- [Carbon Charts](https://charts.carbondesignsystem.com/)
- [Accessibility](https://carbondesignsystem.com/guidelines/accessibility/overview/)
