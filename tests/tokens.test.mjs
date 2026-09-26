import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { checkTokens, parseTokens } from "../scripts/contrast.mjs";

function mediaDark(css) {
  const media = css.slice(css.indexOf("@media (prefers-color-scheme: dark)"));
  const body = media.slice(media.indexOf("{", media.indexOf(":root:not")) + 1, media.indexOf("}"));
  return Object.fromEntries([...body.matchAll(/(--pa-[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}

for (const look of ["carbon", "apple"]) {
  const path = `skills/${look}/tokens.css`;
  const skip = !existsSync(path);
  test(`${look} tokens pass WCAG in both themes`, { skip }, () => {
    const res = checkTokens(readFileSync(path, "utf8"));
    assert.ok(res.length >= 40, `only ${res.length} pairs checked`);
    assert.deepEqual(res.filter(r => !r.ok), []);
  });
  test(`${look} media-query dark block matches data-theme dark block`, { skip }, () => {
    const css = readFileSync(path, "utf8");
    assert.deepEqual(mediaDark(css), parseTokens(css).dark);
  });
  test(`${look} has no translucent surfaces`, { skip }, () => {
    assert.doesNotMatch(readFileSync(path, "utf8"), /backdrop-filter|blur\(/);
  });
}
