---
name: core
description: Design language for Claude artifacts and standalone HTML pages (reports, market research, explainers, dashboards, explorables, 3D). Use before building or editing any artifact or HTML page. Loads with one look: carbon, apple, primer, editorial, material, clay or studio.
---

# polished-artifacts: core

Pages are for a person reading them, not an agent parsing them. Every rule serves one test: a reader states the main point after ten seconds.

## Load order

1. If the `artifact-design` skill is not loaded in this conversation, load it now. It owns the page contract (title, theme tokens, CDN allowlist, phone width, no skeleton tags in artifacts). Follow it on those.
2. This plugin overrides `artifact-design` on style, and replaces `artifact-diagramming`: never write SVG coordinates by hand. Diagrams come from Mermaid, React Flow or D3, and architecture diagrams from LikeC4 (see Libraries).
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
- Body text uses the look's `--pa-fs-body`. Text runs the full width of its column: no `max-width` in `ch` or px on paragraphs, ledes, section heads, captions or list text. The owner found 60–75-character measures left most of a wide page empty. Width comes from the page grid (Page width).
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
- Chart transitions follow Motion on the page: state-change tier, the look's tokens.

## Motion on the page

GSAP and anime.js run in the page itself. Motion explains: it shows a state change, an order of events, or a cause and its effect. Each look's `tokens.css` sets `--pa-ease`, `--pa-ease-enter`, `--pa-ease-exit` and `--pa-dur-fast|mid|slow|long` from its design system; use those, read in JS through `motion.js` (this folder), so motion carries the look like colour does.

| Tier | Duration | Tool | For |
|---|---|---|---|
| Feedback | `--pa-dur-fast` | CSS transitions | Hover, press, toggle, focus |
| State change | `--pa-dur-mid` to `--pa-dur-slow` | CSS, or anime.js `animate` | Filters, sorting, chart updates, tabs, a value changing |
| Choreography | up to `--pa-dur-long` per move | GSAP timelines and ScrollTrigger | One load sequence for the opening figure, a figure pinned while the text scrolls past, a diagram that builds in the order the text explains it, a key figure counting up |

- Before writing choreography, add a motion brief as a comment above the script: what each move explains, which element moves, from and to, duration and easing as numbers. Use `motion-lab:directing-motion`'s `references/numbers.md` for stagger, holds and hierarchy when it is installed.
- One hero move per section at a time; secondary moves start 100–200ms after it and travel less. Never fade-and-slide-up every block, never start everything at once, and never move text while it is being read.
- The page is complete at rest: everything is visible and correct before any script runs, so a move starts from the visible state or sets its start state in the same frame it begins. Never leave content at `opacity: 0` waiting for an observer.
- Full motion is the default. Every page with motion calls `paMotionInit()` from `motion.js`, which adds a floating "Reduce motion" button; when it is on, `paReduced()` is true, CSS motion stops, timelines jump to their end state, and scroll-linked figures show each step's state without tweening (`accessibility.md`). Print shows the end state.
- Recipes, import URLs and the scroll-pin pattern are in `libraries.md`.

## Libraries

Load a library only when the page uses it. Versions, recipes and the page-weight budget are in `libraries.md`.

| Job | Use |
|---|---|
| Structure and text | Plain HTML. Add React only for interactive components. |
| Diagrams | Artifacts: native `<pre class="mermaid">`. Local HTML: Mermaid ESM. React Flow + elkjs when the reader should drag or explore. |
| Architecture (system context, containers, flows) | `polished-artifacts:likec4`: one model, several views, built locally in the look's colours |
| Graph layouts | d3-force, d3-hierarchy, d3-sankey inside a React component |
| Charts | Carbon look: Carbon Charts (Recharts when direct labels are needed). Every other look: Recharts. D3 for custom charts in any look. |
| Motion | CSS for feedback, anime.js for state changes, GSAP with ScrollTrigger for choreography (see Motion on the page) |
| Explorables | Range inputs driving state; p5.js for simulations |
| 3D | three.js, or react-three-fiber inside React |
| Rendered clips (loops, launch videos, GIFs) | `motion-lab:directing-motion` when installed (see Clips) |
| Math animation video | `polished-artifacts:manim`, only when the user asks |

- Any page using React pastes the import map from `importmap.json` before its first module script. Without it, libraries load their own React copies and hooks break.
- Artifacts cannot fetch CSS from a CDN. Library stylesheets ship in this skill's `vendor/` folder: copy the one you need into the working or scratchpad directory, publish it with the page through the Artifact tool's `files` map, and link it with a relative `<link rel="stylesheet" href="./carbon-charts.css">`.

## Clips

A clip is motion rendered to video from code: a logo loop, a product shot, a launch clip, a GIF. Motion inside the page follows Motion on the page; math explainers go to `polished-artifacts:manim`.

- Load `motion-lab:directing-motion` and follow its brief, render and review loop. If it is not installed, say so and offer Manim or in-page motion instead.
- The clip's HTML pastes the page's look `tokens.css` at the top of its `<style>` and takes every colour and face from `--pa-*`. For Editorial, link `et-book.css` from that look's folder too. Set `window.__ready` only after `document.fonts.ready`, or frames render in the fallback face.
- Fill the brief's LOOK slot from that file in hex: background `--pa-bg`, text `--pa-text` and `--pa-text-2`, the one accent `--pa-cat-1`, the other categories only where they encode data, and the look's heading face and weight. The brief may not add colours the look lacks.
- Use the light theme's values. A video cannot follow the reader's theme, so on a dark page it sits on `--pa-surface` like any other figure.
- Motion-lab's BANNED list adds to this skill's rules; neither overrides the other.
- Embed the result as in `polished-artifacts:manim` (Rendering and embedding, steps 3–5): the 15 MB limit, uploaded assets, a poster frame, no autoplay, and a transcript. A seamless loop may add `loop`.

## Page width

Paste `layout.css` (this folder) after the look's tokens and put every block of the page directly inside one `<div class="pa-page">`. Do not pad `body` or set your own outer `max-width`; the grid does both.

- Under 768px: one column, 16px gutters. From 768px: 32px gutters. From 1200px: the column grows to the look's `--pa-col-wide` with 48px gutters.
- From 1440px, a `.pa-aside` moves into a rail beside the block before it, with 64px gutters. Asides hold what supports the block without being read in line: its key figure, a sidenote, a small table, a contents list. Under 1440px they sit inline after that block. An aside shares a grid row with that block, so keep it shorter than the block; a taller one leaves a gap in the column, which `lint.js` reports as `asideGaps`. Never put a sticky figure in the rail: it can only stick within its row (see the scroll-linked recipe in `libraries.md`).
- A wide figure or table that should cross both columns gets `.pa-span`.
- Use the rail when the page has supporting material; otherwise the page stays one wide column. `lint.js` fails a page whose content spans less than 55% of a 1200–1439px screen, 50% of a 1440–1599px one, or 40% of a wider one. The wide columns are about 1.2 times the base: wider lines read badly and the owner found the first, wider settings overdone.

## Layout traps

- Every grid that holds a chart, table, share bar or diagram uses `grid-template-columns: minmax(0, 1fr)`. A plain `1fr` track grows to its widest child's content, and one `nowrap` element then widens the whole page.
- Footnote markers: `sup { font-size: 12px; line-height: 0; }`. The browser default renders them under 12px.
- Every table sits in `<div class="table-scroll">` with `.table-scroll { overflow-x: auto; }`, and diagram SVGs get `max-width: 100%`. At 375px a four-column table already overflows, and without its own container it scrolls the whole page.

## Accessibility and print

Follow `accessibility.md`: keyboard reach and focus rings, a caption and data `<table>` for every chart, `accTitle`/`accDescr` on every Mermaid diagram, reduced motion, and a print stylesheet.

## Before publishing

Run `checklist.md`. In Claude Code, also open the local file in chrome-devtools and run `lint.js` there with `evaluate_script`, passing the file's contents inside a function: `async () => { <contents of lint.js>; const r = await polishedLint(); return { pass: polishedLintPass(r), ...r }; }`. Check both themes (set `document.documentElement.dataset.theme`) at 375px, 1280px and 1920px, and once with the "Reduce motion" button pressed, and fix every failure before publishing.
