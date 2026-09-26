---
name: manim
description: Manim (Community Edition) animations for polished-artifacts, rendered locally and embedded as video. Use only when the user asks for a Manim or 3Blue1Brown-style animation.
---

# Manim animations

Manim renders video in Python, so it runs in Claude Code, never inside an artifact. The page embeds the rendered file.

This skill uses Manim Community Edition (0.21.0 as of 2026-09-26), not ManimGL. ManimGL, 3Blue1Brown's own fork, needs a live OpenGL window and an interactive session; Community Edition renders headless to a file.

## Setup (once per machine)
- System packages (Arch): `ffmpeg cairo pango texlive-basic texlive-latexextra`. LaTeX is only needed for `MathTex` and `Tex`.
- Fonts for the looks: `ttf-ibm-plex` for Carbon; Satoshi for Apple, if the owner's opt-in is installed under `~/.local/share/fonts/`. Run `fc-cache -f` after adding fonts. A missing face falls back to `sans-serif`.
- Per scene, in a scratch directory: `uv init --bare && uv add manim`.

## Writing a scene
- Import the look: `sys.path.insert(0, "<this skill's directory>"); from theme import apply; T = apply("carbon" or "apple", dark=False)`. Use `T["text"]`, `T["text2"]`, `T["cat"][0..4]` and `T["font"]`. No other colours.
- One idea per scene. Each animation shows one state change and runs 0.3–1s. Hold the final state at least 1.5s so it can be read.
- Text uses `T["font"]` and is at least 24px at 1080p. Equations use `MathTex`.
- The camera moves only to follow the idea. No decorative motion.

## Rendering and embedding
1. Draft at low quality: `uv run manim render -ql scene.py Name`.
2. Final: `uv run manim render -qh --format webm scene.py Name` (1080p), and again with `--format mp4` as a fallback source. Render a poster with `-s` (last frame as PNG).
3. Keep each file under 15 MB, the artifact asset limit. Split long scenes.
4. Declare `capabilities: {"assets": {}}` on the artifact, upload the WebM, MP4 and poster with the Artifact tool (`asset: true`, `file_paths`), and use the returned URLs exactly.
5. Embed:
   ```html
   <figure>
     <video controls preload="metadata" poster="POSTER_URL" width="100%">
       <source src="WEBM_URL" type="video/webm"><source src="MP4_URL" type="video/mp4">
     </video>
     <figcaption>What the animation shows.</figcaption>
     <details><summary>Transcript</summary><p>Every change on screen, in order.</p></details>
   </figure>
   ```
   Never autoplay. The poster frame is what prints.
