---
name: apple
description: Apple HIG look for polished-artifacts, with no glass or translucency. Load after polished-artifacts:core when the user picks the Apple look. Spacious, grouped, content-first.
---

# Apple look (no glass)

Paste `tokens.css` (this folder) at the top of the page's `<style>`. Use only its `--pa-*` tokens.

## Never
No `backdrop-filter`, no blur, no translucent or frosted panels, no vibrancy. Surfaces are opaque. Alpha appears only in text and separator colours.

## Type
- Font: Satoshi when the owner's opt-in is present (see Fonts). Otherwise `--pa-font-sans`, the system stack.
- HIG scale: large title 34/41 bold, title 28/34 · 22/28 · 20/25 semibold, headline 17/22 semibold, body 17/22, callout 16/21, subhead 15/20, footnote 13/18, caption 12/16.
- Colours are HIG's increased-contrast variants (values from the HIG colour table, 2026-09-26). The default system blue and secondary label fail WCAG on white. Link text uses `#1b64e0`, a slightly darker blue than HIG's increased-contrast `#1e6ef4`, because that one reaches only 4.1:1 on the grouped background.

## Layout
- 8pt grid; spacing only from `--pa-space-*`.
- One centred column, 680px max, with 16px side padding on phones and 32px from 768px up.
- Fewer items per screen than Carbon: a short list plus "Show all" over a dense table.

## Surfaces
- The page sits on `--pa-bg` (the grouped background). Content groups sit on `--pa-surface` with `--pa-radius` (12px) corners, like an inset grouped list.
- One raised level (`--pa-shadow`) for content that floats above the page, such as a sticky summary. Never nest raised surfaces.
- Separators inside a group: 1px `--pa-border`, inset 16px from the leading edge.

## Components
- "Show all": `<summary>` as a plain text button in `--pa-interactive`, with a "›" chevron. No border.
- Key figure: the number at 34px bold, a 13px footnote label in `--pa-text-2` below.
- Lists: grouped inset style, one item per row, the trailing value right-aligned with tabular numerals.

## Charts
Recharts with `--pa-cat-1…5`, 4px rounded bar ends, axis text 12px `--pa-text-2`, gridlines 1px `--pa-border`, and direct `<LabelList>` labels.

## Diagrams
Mermaid init values for this look (hex, because the artifact renderer can't read CSS variables), plus `"themeCSS": ".node rect { rx: 8px; ry: 8px; }"` for rounded nodes:

| Variable | Light | Dark |
|---|---|---|
| `primaryColor` | `#ffffff` | `#1c1c1e` |
| `primaryTextColor` | `#000000` | `#ffffff` |
| `primaryBorderColor` | `#d1d1d6` | `#38383a` |
| `lineColor` | `#3c3c43` | `#ebebf5` |
| `background` | `#f2f2f7` | `#000000` |
| `fontFamily` | `-apple-system, system-ui, sans-serif` | same |

Write each diagram twice, a `mermaid-light` block with the light values and a `mermaid-dark` block with the dark values, toggled by theme as in core's libraries.md.

## References
Check these before inventing a pattern the look doesn't cover:
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Color](https://developer.apple.com/design/human-interface-guidelines/color) (system and increased-contrast values)
- [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) (text styles and sizes)
- [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Charts](https://developer.apple.com/design/human-interface-guidelines/charts) and [Charting data](https://developer.apple.com/design/human-interface-guidelines/charting-data)
- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

## Fonts
Satoshi is an owner-only opt-in, on when `~/.local/share/fonts/Satoshi/Satoshi-Variable.woff2` exists.
- Local HTML: `@font-face { font-family: Satoshi; src: url("file://$HOME/.local/share/fonts/Satoshi/Satoshi-Variable.woff2") format("woff2"); font-weight: 300 900; }` with `$HOME` written out, then `--pa-font-sans: Satoshi, -apple-system, system-ui, sans-serif;`.
- Published artifacts: follow `fonts.md` in this folder if it exists; otherwise use the system stack.
