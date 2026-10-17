import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const SKILLS = readdirSync("skills").filter(d => existsSync(`skills/${d}/SKILL.md`));
import { LOOKS } from "./looks.mjs";
for (const s of SKILLS) {
  test(`${s}/SKILL.md exists, has frontmatter, and is under 150 lines`, { skip: !existsSync(`skills/${s}/SKILL.md`) }, () => {
    const md = readFileSync(`skills/${s}/SKILL.md`, "utf8");
    assert.match(md, /^---\nname: [a-z][a-z0-9]*\ndescription: .+\n---\n/);
    assert.ok(md.split("\n").length < 150, `${md.split("\n").length} lines`);
    assert.doesNotMatch(md, /\b(TBD|TODO|Stub)\b/);
  });
}

test("core references every reference file it ships", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  for (const f of ["libraries.md", "accessibility.md", "checklist.md", "lint.js", "importmap.json", "vendor/", "layout.css", "motion.js"]) assert.ok(md.includes(f), f);
});

test("core loads artifact-design first, overrides artifact-diagramming, and names data-encodes", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  assert.match(md, /artifact-design/);
  assert.match(md, /artifact-diagramming/);
  assert.match(md, /hand-drawn|by hand/i);
  assert.match(md, /data-encodes/);
});

test("core forbids raw filesystem paths in pages", () => {
  assert.match(readFileSync("skills/core/SKILL.md", "utf8"), /filesystem path/i);
});

test("core names the layout traps found in the first real page", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  assert.match(md, /minmax\(0, 1fr\)/);
  assert.match(md, /sup/);
  assert.match(readFileSync("skills/core/mermaid.css", "utf8"), /pre\.mermaid \{[^}]*overflow-x: auto/);
});

test("carbon raises Carbon Charts' 10px ticks and orders bars largest first", () => {
  const md = readFileSync("skills/carbon/SKILL.md", "utf8");
  assert.match(md, /svg text \{ font-size: 12px/);
  assert.match(md, /largest/i);
});

test("core documents a lint call that works in evaluate_script", () => {
  assert.match(readFileSync("skills/core/SKILL.md", "utf8"), /async \(\) => \{/);
});

test("core keeps wide tables inside their own scroll container", () => {
  assert.match(readFileSync("skills/core/SKILL.md", "utf8"), /table-scroll/);
});

test("diagrams take their colours from mermaid.css, not init values", () => {
  assert.match(readFileSync("skills/core/SKILL.md", "utf8"), /mermaid\.css/);
  for (const look of LOOKS) {
    const md = readFileSync(`skills/${look}/SKILL.md`, "utf8");
    assert.match(md, /mermaid\.css/, look);
    assert.doesNotMatch(md, /primaryTextColor/, `${look} still lists init colours`);
  }
});

test("core asks for compact diagram shapes instead of long single-axis chains", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  assert.match(md, /direction LR/);
  assert.match(md, /hub|star/i);
});

test("core draws a layered stack as bands, not a flowchart", () => {
  assert.match(readFileSync("skills/core/SKILL.md", "utf8"), /stack.*bands/i);
});

test("core charts drop gridlines, label values on marks, and never put bars on a log axis", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  assert.match(md, /no gridlines/i);
  assert.match(md, /value.*on (each|the) (bar|mark)/i);
  assert.match(md, /log axis/i);
  assert.match(md, /line chart/i);
});

test("carbon turns off Carbon Charts' grid and sends bar charts to Recharts", () => {
  const md = readFileSync("skills/carbon/SKILL.md", "utf8");
  assert.match(md, /grid: \{ x: \{ enabled: false \}, y: \{ enabled: false \} \}/);
  assert.match(md, /truncation: \{ type: "none" \}/);
  assert.match(md, /Bar charts use Recharts/);
});

test("core sends rendered clips to motion-lab in the page's look", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  assert.match(md, /motion-lab:directing-motion/);
  assert.match(md, /## Clips[\s\S]*tokens\.css[\s\S]*LOOK/);
  assert.match(md, /## Clips[\s\S]*manim/i);
});

test("core puts GSAP and anime.js motion on the page, driven by the look's motion tokens", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  assert.match(md, /## Motion on the page[\s\S]*--pa-ease[\s\S]*ScrollTrigger/);
  assert.match(md, /complete at rest/i);
  assert.match(md, /Full motion is the default[\s\S]*paMotionInit/);
  assert.match(readFileSync("skills/core/layout.css", "utf8"), /:root\[data-motion="reduce"\]/);
  const lib = readFileSync("skills/core/libraries.md", "utf8");
  assert.match(lib, /gsap@3\.15\.0\/ScrollTrigger\/\+esm/);
  assert.match(lib, /animejs@4\.5\.0\/\+esm/);
});

test("look skills take their column widths from the width tokens", () => {
  for (const look of LOOKS) {
    const md = readFileSync(`skills/${look}/SKILL.md`, "utf8");
    assert.match(md, /--pa-col-wide/, look);
  }
});

test("apple's local Satoshi rule uses the installed family name", () => {
  assert.match(readFileSync("skills/apple/SKILL.md", "utf8"), /local\("Satoshi Variable"\)/);
});

test("print expands closed details, including their content", () => {
  const a = readFileSync("skills/core/accessibility.md", "utf8");
  assert.match(a, /::details-content/);
  assert.match(a, /beforeprint/);
});

test("libraries.md embeds the generated import map verbatim", () => {
  const lib = readFileSync("skills/core/libraries.md", "utf8");
  const map = JSON.parse(readFileSync("skills/core/importmap.json", "utf8"));
  for (const k of Object.keys(map.imports)) assert.ok(lib.includes(k), k);
});
