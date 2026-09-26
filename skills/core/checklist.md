# Pre-publish checklist

Fix every "no" before publishing.

1. Reading the `h1` and the first figure for ten seconds, can you state the main point?
2. Does every coloured element encode data, state or the focal point?
3. Is everything that should be a chart, diagram or table shown as one, rather than as a list?
4. Does every list longer than seven items hide the rest behind "Show all"?
5. Does every chart have a caption, an `aria-label`, and a data table in the HTML?
6. Are all labels 12px or larger, with monospace only in code?
7. Is the page free of `backdrop-filter`, blur and translucent panels?
8. Is the page free of raw filesystem paths?
9. In Claude Code: does `polishedLintPass(await polishedLint())` return true in light and dark, at 375px and 1280px?
