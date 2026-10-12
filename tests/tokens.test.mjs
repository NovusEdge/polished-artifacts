import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { checkTokens, parseTokens } from "../scripts/contrast.mjs";

function mediaDark(css) {
  const media = css.slice(css.indexOf("@media (prefers-color-scheme: dark)"));
  const body = media.slice(media.indexOf("{", media.indexOf(":root:not")) + 1, media.indexOf("}"));
  return Object.fromEntries([...body.matchAll(/(--pa-[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}

const LOOKS = readdirSync("skills").filter(d => existsSync(`skills/${d}/tokens.css`));

test("every look core offers has a tokens file, and the reverse", () => {
  const offered = [...readFileSync("skills/core/SKILL.md", "utf8").matchAll(/^\| `(\w+)` \|/gm)].map(m => m[1]);
  assert.deepEqual(offered.sort(), [...LOOKS].sort());
});

const theme = readFileSync("skills/manim/theme.py", "utf8");

for (const look of LOOKS) {
  const path = `skills/${look}/tokens.css`;
  test(`${look} tokens pass WCAG in both themes`, () => {
    const res = checkTokens(readFileSync(path, "utf8"));
    assert.ok(res.length >= 40, `only ${res.length} pairs checked`);
    assert.deepEqual(res.filter(r => !r.ok), []);
  });
  test(`${look} media-query dark block matches data-theme dark block`, () => {
    const css = readFileSync(path, "utf8");
    assert.deepEqual(mediaDark(css), parseTokens(css).dark);
  });
  test(`${look} has no translucent surfaces`, () => {
    assert.doesNotMatch(readFileSync(path, "utf8"), /backdrop-filter|blur\(/);
  });
  test(`${look} categories match the Manim theme`, () => {
    const { light, dark } = parseTokens(readFileSync(path, "utf8"));
    for (const [mode, t] of [["False", light], ["True", dark]]) {
      const entry = theme.match(new RegExp(`\\("${look}", ${mode}\\): \\{[^}]*\\}`));
      assert.ok(entry, `theme.py has no (${look}, ${mode})`);
      for (let i = 1; i <= 5; i++) assert.ok(entry[0].includes(`"${t[`--pa-cat-${i}`]}"`), `${look} ${mode} cat-${i}`);
    }
  });
}
