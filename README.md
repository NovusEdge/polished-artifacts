# polished-artifacts

A Claude Code plugin that gives Claude-built artifacts one design language, written for people to read.

| Skill | What it does |
|---|---|
| `polished-artifacts:core` | Reading and encoding rules, the library stack (Mermaid, React Flow, Carbon Charts, Recharts, D3, GSAP, anime.js, p5.js, three.js), accessibility, a pre-publish checklist and a page lint |
| `polished-artifacts:carbon` | IBM Carbon look: IBM Plex, flat and square, dense |
| `polished-artifacts:apple` | Apple HIG look with no glass: spacious, grouped, content-first |
| `polished-artifacts:manim` | Manim Community animations rendered locally and embedded as video |

## Install

```
/plugin marketplace add NovusEdge/polished-artifacts
/plugin install polished-artifacts@polished-artifacts
```

## Use

Ask for an artifact. Claude asks "Carbon or Apple look?" once per conversation and follows the language from there.

## What it fixes

Pages built for an agent to parse: decorative colour, tiny monospace labels, badges and cards everywhere, walls of lists. `skills/core/lint.js` measures those faults on a rendered page, and the pre-publish checklist has Claude run it.

## Development

- `npm test` runs the contrast, import-map, lint and skill-structure tests. The browser tests need Chromium at `/usr/bin/chromium` and network access; set `PA_OFFLINE=1` to skip them.
- `node scripts/importmap.mjs > skills/core/importmap.json` regenerates the React import map after a version bump. Paste the result into `skills/core/libraries.md`; a test checks they match.
- `node scripts/contrast.mjs skills/<look>/tokens.css` checks a look's tokens against WCAG AA.
- `node tests/eval.mjs <dir>` scores `baseline.html`, `carbon.html` and `apple.html` in that directory with the lint.

## Licences

MIT for this plugin. `skills/core/vendor/` holds unmodified stylesheets from @carbon/charts (Apache-2.0) and @xyflow/react (MIT); see its NOTICE. Libraries load from jsdelivr under their own licences: GSAP uses its Standard "no charge" licence, and p5.js is LGPL-2.1. No fonts ship with the plugin.
