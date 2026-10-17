# polished-artifacts

A Claude Code plugin that gives Claude-built artifacts one design language, written for people to read.

| Skill | What it does |
|---|---|
| `polished-artifacts:core` | Reading and encoding rules, the library stack (Mermaid, React Flow, Carbon Charts, Recharts, D3, GSAP, anime.js, p5.js, three.js), accessibility, a pre-publish checklist and a page lint |
| `polished-artifacts:carbon` | IBM Carbon look: IBM Plex, flat and square, dense |
| `polished-artifacts:apple` | Apple HIG look with no glass: spacious, grouped, content-first |
| `polished-artifacts:primer` | GitHub Primer look: system font, bordered boxes, dense |
| `polished-artifacts:editorial` | Tufte look after the AI 2040 Plan A site: ivory paper, et-book, one dark red accent, scroll-linked figures |
| `polished-artifacts:material` | Material 3 look: tonal surfaces, rounded containers, Roboto Flex |
| `polished-artifacts:clay` | Warm ivory, serif body and sans headings, clay accent; palette from anthropic.com |
| `polished-artifacts:studio` | Black and white, centred headline, colour only in figures; palette from OpenAI's blog |
| `polished-artifacts:manim` | Manim Community animations rendered locally and embedded as video |
| `polished-artifacts:likec4` | Architecture diagrams from a LikeC4 model in the look's colours, published as an explorable page, an embedded view or an image |

For rendered clips (logo loops, launch videos, GIFs), install [motion-lab](https://github.com/NovusEdge/motion-lab) alongside: core hands clips to its `directing-motion` skill and fills the clip's palette and type from the page's look. Everything else works without it.

## Install

```
/plugin marketplace add NovusEdge/polished-artifacts
/plugin install polished-artifacts@polished-artifacts
```

### Codex

From the Nimble Fox team marketplace, which is private to the `nimble-fox-ai` organization:

```sh
codex plugin marketplace add nimble-fox-ai/agent-plugins
codex plugin add polished-artifacts@nimble-fox
```

Codex reads the root `plugin.json`; Claude Code reads `.claude-plugin/plugin.json`. Both load the same `skills/` directory, so nothing is copied. Keep the two manifests' `name` and `version` equal (`tests/manifest.test.mjs` checks).

All ten skills carry over. Core hands rendered clips to motion-lab, a separate Claude Code plugin; without it, core offers Manim or motion on the page instead. The plugin has no agents, hooks, commands or MCP servers, so there is nothing else to port. The skills are written for Claude artifacts; in Codex they apply to any standalone HTML page you ask for.

## Use

Ask for an artifact. Claude asks which look to use once per conversation, recommending one for the content, and follows the language from there.

Clay and Studio take their palettes and layouts from the Anthropic and OpenAI sites, with open substitute fonts and no logos or names, so pages built with them do not pass as coming from either company.

## What it fixes

Pages built for an agent to parse: decorative colour, tiny monospace labels, badges and cards everywhere, walls of lists. `skills/core/lint.js` measures those faults on a rendered page, and the pre-publish checklist has Claude run it.

## Development

- `npm test` runs the contrast, import-map, lint and skill-structure tests. The browser tests need Chromium at `/usr/bin/chromium` and network access; set `PA_OFFLINE=1` to skip them.
- `node scripts/importmap.mjs > skills/core/importmap.json` regenerates the React import map after a version bump. Paste the result into `skills/core/libraries.md`; a test checks they match.
- `node scripts/contrast.mjs skills/<look>/tokens.css` checks a look's tokens against WCAG AA.
- `node tests/eval.mjs <dir>` scores `baseline.html` and `<look>.html` for each look in that directory with the lint.
- A look is a `skills/<look>/` folder with `SKILL.md` and `tokens.css`. The tests find looks by that folder shape, and core's look table must list each one.

## Licences

MIT for this plugin. `skills/core/vendor/` holds unmodified stylesheets from @carbon/charts (Apache-2.0) and @xyflow/react (MIT); see its NOTICE. Libraries load from jsdelivr under their own licences: GSAP uses its Standard "no charge" licence, and p5.js is LGPL-2.1. The only fonts that ship are the et-book files in `skills/editorial/` (MIT, from tufte-css).
