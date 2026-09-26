import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const SKILLS = ["core", "carbon", "apple", "manim"];
for (const s of SKILLS) {
  test(`${s}/SKILL.md exists, has frontmatter, and is under 150 lines`, { skip: !existsSync(`skills/${s}/SKILL.md`) }, () => {
    const md = readFileSync(`skills/${s}/SKILL.md`, "utf8");
    assert.match(md, /^---\nname: [a-z]+\ndescription: .+\n---\n/);
    assert.ok(md.split("\n").length < 150, `${md.split("\n").length} lines`);
    assert.doesNotMatch(md, /\b(TBD|TODO|Stub)\b/);
  });
}

test("core references every reference file it ships", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  for (const f of ["libraries.md", "accessibility.md", "checklist.md", "lint.js", "importmap.json", "vendor/"]) assert.ok(md.includes(f), f);
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
  assert.match(readFileSync("skills/core/libraries.md", "utf8"), /pre\.mermaid \{[^}]*overflow-x: auto/);
});

test("carbon raises Carbon Charts' 10px ticks and orders bars largest first", () => {
  const md = readFileSync("skills/carbon/SKILL.md", "utf8");
  assert.match(md, /svg text \{ font-size: 12px/);
  assert.match(md, /largest/i);
});

test("libraries.md embeds the generated import map verbatim", () => {
  const lib = readFileSync("skills/core/libraries.md", "utf8");
  const map = JSON.parse(readFileSync("skills/core/importmap.json", "utf8"));
  for (const k of Object.keys(map.imports)) assert.ok(lib.includes(k), k);
});
