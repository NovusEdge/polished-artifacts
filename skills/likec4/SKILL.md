---
name: likec4
description: Architecture diagrams for polished-artifacts with LikeC4, built locally and published as an explorable page, an embedded view or an image. Use for system context, container and flow diagrams, and any architecture with more than one view or kept in a repo.
---

# LikeC4 architecture diagrams

LikeC4 compiles a text model into diagrams. One model gives several views (context, containers, one flow) that stay consistent, and the source diffs in git. It runs in Claude Code; the artifact gets the built output.

Use it for architecture: services, stores, queues, external systems and how they call each other, once there are more than about eight boxes or more than one view. A single small flow stays a Mermaid diagram (core, Libraries).

## Setup

- In a scratch directory: `npm init -y && npm i likec4@1.60.0` (current as of 2026-10-17), then run it as `npx likec4`.
- The package ships its own DSL reference at `node_modules/likec4/skills/likec4-dsl/`. Read its `SKILL.md` before writing syntax this file does not show.
- Check the model with `npx likec4 validate <dir>` after every edit.

## Theme

Generate the specification from the page's look, so the diagram uses the same palette:

```sh
node <this skill's directory>/theme.mjs <look> > <dir>/spec.c4
```

`theme.mjs` reads the look's `tokens.css`. Regenerate the file instead of editing it. It defines these kinds; the model uses only these:

| Kind | For |
|---|---|
| `actor` | People and outside agents |
| `system` | The system boundary |
| `layer` | A tier inside it: edge, orchestration, workers, data |
| `service`, `webapp` | Request-serving processes; a browser app |
| `worker` | Background processes |
| `bus` | Queues and workflow engines |
| `store` | Databases, caches, object storage |
| `external` | Third-party services |

Relationships take a kind: `-[sync]->` for calls, `-[async]->` for messages and dispatch, `-[data]->` for reads and writes, `-[ext]->` for third-party APIs, `-[planned]->` for edges not built yet. Each kind has its own colour and line style, and LikeC4's legend panel lists them. Extra kinds go in a second `specification` block in another file; a duplicate name is a validation error.

## Modelling rules

- Model tiers as `layer` elements nested in the `system`, and draw the view with `include app, app.**` (where `app` is the system). A view `group` cannot split the children of one parent, so groups collapse into one box once the system is drawn.
- Every view sets `autoLayout LeftRight 240 120 ortho`: requests enter on the left, edges run at right angles, and the gaps leave room for labels. Use `TopBottom` only for a view taller than it is wide.
- Overviews leave out back edges (responses, callbacks, a worker calling the API it was dispatched from) with `exclude a -> b`. The layout engine bends every node around them. Show them in order in a `dynamic view`.
- At most about 15 elements per view. Split by question instead of drawing everything: the request path, the async work, one flow end to end. Put each external service in the view of the process that calls it.
- Edge titles are one to three words (`append log`, `start / signal`); the protocol goes in `technology`. Element descriptions stay under 60 characters, because fixed-size boxes cut longer text with "…".
- Mark unbuilt parts with `#planned`, a `-[planned]->` edge, and `style { color gray; border dashed }` on the element. Say so in the view's description.
- Icons: `icon tech:postgresql`, `aws:`, `gcp:`, `azure:`, `bootstrap:`. Find names with `npx likec4 list-icons | grep <word>`.
- A view's `title` is its name; its `description` says what the view answers.

## Delivering

Pick by what the reader needs.

1. **The whole model, explorable** (all views, click to drill in): build a single-file site and publish it as its own artifact.
   ```sh
   npx likec4 build --output-single-file --use-hash-history -o out <dir>
   ```
   Delete `out/404.html`. Replace the first `<title>LikeC4</title>` with the page's name; the tag wins over the publish title. The bundle carries a few raw U+FFFD characters inside JS strings, which the Artifact tool refuses: replace each with its JavaScript escape, a backslash followed by `uFFFD`, which keeps the string the same. Its Export menu does nothing in an artifact, because the viewer blocks downloads.
2. **One view inside a polished page**: generate the web component and publish it beside the page through the Artifact tool's `files` map.
   ```sh
   npx likec4 gen webcomponent -o likec4-views.js <dir>
   ```
   Escape U+FFFD as above. The file is about 2.7 MB. In the page:
   ```html
   <script type="module" src="./likec4-views.js"></script>
   <figure>
     <likec4-view view-id="containers"></likec4-view>
     <figcaption>Requests enter on the left and go async through Temporal.</figcaption>
   </figure>
   ```
   Give it a size: `likec4-view { display: block; width: 100%; aspect-ratio: 16 / 9; }`. Set its `color-scheme` attribute to `light` or `dark` from the page's theme when the theme changes. Its labels use IBM Plex Sans from jsdelivr, which the artifact CSP blocks, so they render in the system sans; `--likec4-app-font` set on the element does not reach them.
3. **A still image** for print or a page that must be complete without scripts: `npx likec4 export png -o png <dir>` writes one PNG per view at 3× scale, in the correct face. Upload it as an asset (core, Clips) and put it in a `<figure>`.

## Checking

Open the built page in chrome-devtools, screenshot each view once, and fix overlapping labels and crossing edges in the model: shorten titles, move an element to another view, or drop a back edge. Every embedded view or image gets a figcaption, and a `<details>` list of the main flow in order for readers who cannot see the diagram.
