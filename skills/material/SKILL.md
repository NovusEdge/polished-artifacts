---
name: material
description: Material 3 look for polished-artifacts. Load after polished-artifacts:core when the user picks the Material look. Tonal surfaces, rounded containers, Roboto Flex.
---

# Material 3 look

Paste `tokens.css` (this folder) at the top of the page's `<style>`. Use only its `--pa-*` tokens. Colours are the M3 baseline scheme (seed `#6750A4`): `--pa-bg` is `surface`, `--pa-surface` is `surface-container`, `--pa-text-2` is `on-surface-variant`, `--pa-border` is `outline-variant`. M3 has no categorical chart palette, so the five categories are tone 40 (light) and tone 80 (dark) of M3 tonal palettes at chroma 48, hues 293, 255, 190, 55 and 0, generated with `@material/material-color-utilities` 0.3.0.

## Type
- Roboto Flex for text, Roboto Mono for code, both from Google Fonts through `tokens.css`.
- M3 type scale: h1 is display small 36/44 weight 400, h2 headline medium 28/36 weight 400, h3 title large 22/28 weight 500, body large 16/24, labels and captions label medium 12/16 weight 500.

## Layout
- Core's page grid (`layout.css`) with `--pa-col` 840px (M3's expanded window class) and `--pa-col-wide` 1200px (its large class). Rail asides are `--pa-surface` containers.
- Motion tokens are M3's emphasized easings (emphasized, emphasized-decelerate to enter, emphasized-accelerate to exit) and short3, medium2, long2 and extra-long2 durations (150, 300, 500, 800ms), from `@material/web`.
- Spacing only from `--pa-space-*`.
- Group related content in containers instead of separating it with rules.

## Surfaces
- Tonal elevation: the page on `--pa-bg`, a group on `--pa-surface` with `--pa-radius` (12px, M3 medium shape). Depth comes from the tone change, not shadows.
- `--pa-shadow` (M3 level 1) is reserved for one element that floats over content, such as a sticky summary bar.
- Never a container inside a container.

## Components
- "Show all": `<summary>` as an M3 text button: `--pa-interactive` text, label large 14/20 weight 500, 40px tall, full-pill radius, a hover state layer of `--pa-interactive` at 8% via `color-mix(in srgb, var(--pa-interactive) 8%, transparent)`.
- Section shortcuts or filters: M3 assist chips, 32px tall, 8px radius, 1px `--pa-border` outline. Core's ban on badges still applies to data: a chip is a control, never a label for a category.
- Key figure: the number at display small 36/44, a label medium caption in `--pa-text-2` below, inside a `--pa-surface` container when it sits in a row of figures.
- Lists: M3 list items, 56px minimum row height, the trailing value right-aligned with tabular numerals, separated by space rather than dividers.

## Charts
Recharts with `--pa-cat-1…5`, bar ends rounded 4px, axis text 12px `--pa-text-2`, and direct `<LabelList>` labels. Each chart sits in a `--pa-surface` container with 16px padding.

## Diagrams
Paste core's `mermaid.css` after this look's tokens. For M3 shapes add `pre.mermaid svg .node rect { rx: 12px; ry: 12px; }`.

## References
Check these before inventing a pattern the look doesn't cover:
- [Material Design 3](https://m3.material.io/)
- [Color roles](https://m3.material.io/styles/color/roles) and [color system](https://m3.material.io/styles/color/system/overview)
- [Type scale](https://m3.material.io/styles/typography/type-scale-tokens)
- [Shape](https://m3.material.io/styles/shape/corner-radius-scale) and [elevation](https://m3.material.io/styles/elevation/overview)
- [Layout](https://m3.material.io/foundations/layout/applying-layout)
- [Accessibility](https://m3.material.io/foundations/designing/overview)
