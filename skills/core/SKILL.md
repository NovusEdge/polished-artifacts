---
name: core
description: Design language for Claude artifacts and standalone HTML pages (reports, market research, explainers, dashboards, explorables, 3D). Use before building or editing any artifact or HTML page. Loads with one look: carbon, apple, primer, editorial, material, clay or studio.
---

# polished-artifacts: core

Pages are for a person reading them, not an agent parsing them. Every rule serves one test: a reader states the main point after ten seconds.

## Load order

1. If the `artifact-design` skill is not loaded in this conversation, load it now. It owns the page contract (title, theme tokens, CDN allowlist, phone width, no skeleton tags in artifacts). Follow it on those.
2. This plugin overrides `artifact-design` on style, and replaces `artifact-diagramming`: never write SVG coordinates by hand. Diagrams come from Mermaid, React Flow or D3 (see Libraries).
3. Pick the look. If this conversation already chose one, reuse it unless the user names another. Otherwise ask once, naming the look from this table that fits the content as the recommended option, then load `polished-artifacts:<look>`. Every look defines the same `--pa-*` tokens; use only those for colour, type and space.

| Look | Suits |
|---|---|
| `carbon` | Dense data reports and dashboards |
| `apple` | Short, spacious explainers and summaries |
| `primer` | Engineering docs, RFCs, code-heavy pages |
| `editorial` | Long reports, research write-ups, scenario narratives |
| `material` | Product explainers and friendly dashboards |
| `clay` | Essays and announcements in a warm tone |
| `studio` | Launch posts and image-led explainers |

## Reading

- Open with the answer in one sentence (the `h1`) and one visual that shows it, both inside the first screen.
- Each section opens with its takeaway as a headline sentence. The figure below proves it.
- Order: answer, evidence, detail, sources.
- Lists show the top 5–7 items. The rest go in `<details><summary>Show all N</summary>…</details>` or an appendix table. Never render dozens of names as badges or chips.
- Body text uses the look's `--pa-fs-body`. Text runs the full width of its column: no `max-width` in `ch` or px on paragraphs, ledes, section heads, captions or list text. The owner found 60–75-character measures left most of a wide page empty. Width comes from the layout grid and the page's outer `max-width`.
- Labels are 12px or larger, sentence case, in the body face. No uppercase eyebrows. Monospace is for code only; numbers use `font-variant-numeric: tabular-nums`.
- Every figure sits in a `<figure>` with a one-line `<figcaption>` saying what to notice.
- Sources are numbered footnotes at the end. Nothing depends on hover.
- No raw filesystem paths (`~/…`, `/home/…`, `./notes/x.md`) in the page text. Link a copy published with the page (`[name](./file)`), show a preview of it, or leave it out.
- Hierarchy comes from type size, weight and space, not boxes: no card inside a card, no bordered box around every section.

## Encoding

- Colour encodes a data category, a state, or the one focal point. Nothing else: no tinted section backgrounds, no coloured side or top borders, no colour used to separate blocks.
- An HTML element that carries encoded colour (a bar built from a `div`, a status dot) gets `data-encodes="<what>"`, so readers of the code and `lint.js` know it means something.
- At most five categorical colours (`--pa-cat-1`…`--pa-cat-5`). More categories become small multiples or an "Other" group.
- Pick encodings by accuracy: position, then length, then angle or area. No pie beyond three slices. No 3D charts of 2D data.
- Label data directly. A legend only when labels don't fit, placed above the chart in series order.
- Diagrams: one accent colour, at most two focal elements, spacing in multiples of 8 (Mermaid `nodeSpacing`, `rankSpacing`, `padding`; ELK spacing).
- Diagram colours come from `mermaid.css` (this folder), pasted into the page's `<style>`. It restyles Mermaid's output with the `--pa-*` tokens, so one diagram block follows the theme; mark the focal node with `class X focus`. Never rely on `%%{init}%%` colours: the artifact viewer ignores them.
- Keep diagrams compact. A chain longer than three nodes wraps into rows: `flowchart TB` holding `subgraph` rows that each set `direction LR`. One centre with many related parts is a hub and spoke (star): the centre node linked to each part.
- A layered stack, where each layer supplies or runs on the one below, is drawn as HTML bands, not a flowchart: an `<ol>` of full-width rows, foundation at the bottom, each band holding the layer's name, what it does and its top examples, with a small "↑ supplies" connector between bands. The bands replace the separate table. Mermaid is for graphs that branch, merge or loop.

## Charts

- No gridlines. Keep the value axis only when the marks carry no labels, or when the scale needs showing (log). Recharts: omit `<CartesianGrid>`. Carbon Charts: turn the grid off (see carbon).
- Print the value on each bar or mark (`<LabelList>`), so nobody reads numbers off an axis.
- Bars are thick: the gap between bars is at most the bar's width.
- A second colour for "the rest" is a real neutral mark colour with a key above the chart, never the text colour.
- Never draw bars on a log axis: bar length then depends on where the axis starts. Use a line chart when the categories have an order (sizes by type, values over time), a dot plot otherwise.
- Fills come from CSS classes on the marks (`className` on `<Cell>`, `.recharts-line-curve` for lines) that read `--pa-*`, so a theme switch recolours the chart without re-rendering.
- Motion shows a real state change only: 300ms or less, `cubic-bezier(0.23, 1, 0.32, 1)`, off under `prefers-reduced-motion`.

## Libraries

Load a library only when the page uses it. Versions, recipes and the page-weight budget are in `libraries.md`.

| Job | Use |
|---|---|
| Structure and text | Plain HTML. Add React only for interactive components. |
| Diagrams | Artifacts: native `<pre class="mermaid">`. Local HTML: Mermaid ESM. React Flow + elkjs when the reader should drag or explore. |
| Graph layouts | d3-force, d3-hierarchy, d3-sankey inside a React component |
| Charts | Carbon look: Carbon Charts (Recharts when direct labels are needed). Every other look: Recharts. D3 for custom charts in any look. |
| Motion | CSS transitions; GSAP for timelines and scroll sequences; anime.js as the lighter option |
| Explorables | Range inputs driving state; p5.js for simulations |
| 3D | three.js, or react-three-fiber inside React |
| Animation video | `polished-artifacts:manim`, only when the user asks |

- Any page using React pastes the import map from `importmap.json` before its first module script. Without it, libraries load their own React copies and hooks break.
- Artifacts cannot fetch CSS from a CDN. Library stylesheets ship in this skill's `vendor/` folder: copy the one you need into the working or scratchpad directory, publish it with the page through the Artifact tool's `files` map, and link it with a relative `<link rel="stylesheet" href="./carbon-charts.css">`.

## Layout traps

- Every grid that holds a chart, table, share bar or diagram uses `grid-template-columns: minmax(0, 1fr)`. A plain `1fr` track grows to its widest child's content, and one `nowrap` element then widens the whole page.
- Footnote markers: `sup { font-size: 12px; line-height: 0; }`. The browser default renders them under 12px.
- Every table sits in `<div class="table-scroll">` with `.table-scroll { overflow-x: auto; }`, and diagram SVGs get `max-width: 100%`. At 375px a four-column table already overflows, and without its own container it scrolls the whole page.

## Accessibility and print

Follow `accessibility.md`: keyboard reach and focus rings, a caption and data `<table>` for every chart, `accTitle`/`accDescr` on every Mermaid diagram, reduced motion, and a print stylesheet.

## Before publishing

Run `checklist.md`. In Claude Code, also open the local file in chrome-devtools and run `lint.js` there with `evaluate_script`, passing the file's contents inside a function: `async () => { <contents of lint.js>; const r = await polishedLint(); return { pass: polishedLintPass(r), ...r }; }`. Check both themes (set `document.documentElement.dataset.theme`) at 375px and 1280px, and fix every failure before publishing.
