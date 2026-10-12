---
name: editorial
description: Editorial look for polished-artifacts, modelled on Tufte CSS and the AI 2040 Plan A scenario site. Load after polished-artifacts:core when the user picks the Editorial look. Ivory paper, et-book serif, one dark red accent, dot-fill figures.
---

# Editorial look

Paste `tokens.css` (this folder) at the top of the page's `<style>`. Use only its `--pa-*` tokens. The look follows ai-2040.com (sampled 2026-10-12), which is built on Tufte CSS: ivory paper, black ink, et-book, and dark red `#8b0000` as the only accent.

## Fonts
et-book (MIT, from tufte-css) is not on Google Fonts, and artifacts load other fonts only as `data:` URIs. `et-book.css` (this folder) holds its roman, italic and bold faces inlined, about 175 KB. Copy it next to the page and link it with `<link rel="stylesheet" href="./et-book.css">`; for an artifact, also publish it through the Artifact tool's `files` map under that name. Linking keeps the 175 KB out of the page's own source. Without it the page falls back to Palatino or Georgia, which keeps the layout but loses the look. After replacing a woff file, regenerate with `node scripts/et-book-css.mjs > skills/editorial/et-book.css`.

## Type
- et-book for everything except code. Headings at weight 400; italic for emphasis, never bold body text.
- Scale: h1 60/62, h2 40/46, h3 26/32, body 20/30, captions 14/20. Under 768px tokens.css drops body to 18/27, h1 to 40/44 and h2 to 30/36.
- The page opens with a small line above the h1 naming the series or report (ai-2040 sets "AI 2040" over "Plan A"), the h1, then an author or date line in `--pa-text-2`.

## Layout
- Core's page grid (`layout.css`) with `--pa-col` 760px, `--pa-col-wide` 880px and a wider `--pa-rail` of 440px, which holds sidenotes and the sticky figure in Tufte's margin. Without rail content, figures take `.pa-span`.
- Motion tokens come from ai-2040.com's stylesheets (sampled 2026-10-12): `cubic-bezier(0.4, 0, 0.2, 1)` for state changes, ease-out-quint to enter, and 150, 260, 500 and 700ms durations.
- Spacing only from `--pa-space-*`.
- No boxes or cards. Sections are separated by space alone.

## Surfaces
- `--pa-bg` is the paper. `--pa-surface` only behind code blocks and data tables.
- 1px `--pa-border` rules separate table rows. `--pa-radius` is 0 and there are no shadows.

## Components
- Section shortcuts at the top: outlined buttons, 1px `--pa-text` border, square corners, et-book at body size. ai-2040 uses them to jump to "What is Plan A?" style questions.
- "Show all": `<summary>` in `--pa-interactive`, with the browser's disclosure triangle and no added chevron: et-book maps "›" to an "ffl" ligature glyph.
- Key figure: the number at `--pa-fs-h2` in et-book with tabular numerals, a 14px `--pa-text-2` label below.
- Footnote markers in `--pa-interactive`, which is the red, so they read as links into the notes.

## Charts
- Recharts or D3. Marks carry halftone dot fills: circles of radius 1.2px on a 4px grid in the mark's colour, plus a 1px stroke in the same colour. A smaller grid blurs into a flat mesh at 1× pixel density. In SVG use one `<pattern>` per category, filled from a class that reads `--pa-cat-N`; an HTML bar uses `background: radial-gradient(circle, var(--c) 1.2px, transparent 1.6px) 0 0 / 4px 4px`.
- Focal marks are solid, the rest dotted. When a chart only separates the focus from the rest, both are `--pa-cat-1` red, solid against dotted, as on ai-2040.
- Trend lines are dotted (`stroke-dasharray: 2 3`) except the focal one.
- Axis and label text 14px et-book in `--pa-text-2`. Direct labels, no legend when they fit.

## Scroll-linked figure
For a narrative page whose story moves through states (years, phases, scenarios), one figure can stay pinned beside the prose and update as each section scrolls into view, as ai-2040's dashboard does.
- Wrap the story in one `<div class="scrolly">` inside `.pa-page`. It needs the pinned column from 1024px, before core's rail starts at 1440px, so it breaks out of the page column: `.scrolly { justify-self: center; width: min(calc(100vw - 2 * var(--pa-gutter)), calc(var(--pa-col-wide) + var(--pa-space-6) + var(--pa-rail))); }`.
- From 1024px up: `.scrolly { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); column-gap: var(--pa-space-6); }`, prose left, the figure right with `position: sticky; top: calc(env(safe-area-inset-top, 0px) + var(--pa-space-5)); align-self: start`. The 3:2 split keeps the prose near 550px at 1024px and 720px at full width.
- Each section carries `data-state="<key>"`; core's scroll-linked recipe in `libraries.md` (ScrollTrigger, the look's motion tokens) sets the figure's state as each section passes 60% of the screen.
- The figure renders the first section's state on load, so the page is complete without scrolling.
- Under 1024px the sticky figure is hidden and each section shows its own state as an inline figure at the section's top. Build both from the same render function.
- Every state's numbers also appear in the section text or a table, so nothing depends on the animation.

## Diagrams
Paste core's `mermaid.css` after this look's tokens. Nodes stay square. Set `pre.mermaid svg { font-family: var(--pa-font-sans); }` so diagram labels use et-book.

## References
- [AI 2040: Plan A](https://ai-2040.com/), the model for this look
- [Tufte CSS](https://edwardtufte.github.io/tufte-css/)
- [et-book](https://github.com/edwardtufte/et-book)
