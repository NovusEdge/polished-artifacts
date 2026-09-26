import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTokens, contrast, checkTokens } from "../scripts/contrast.mjs";

const css = `
:root { --pa-bg: #ffffff; --pa-surface: #f4f4f4; --pa-text: #161616; --pa-text-2: rgba(60,60,67,0.6);
  --pa-interactive: #0f62fe; --pa-link: #0f62fe; --pa-focus: #0f62fe;
  --pa-cat-1: #6929c4; --pa-cat-2: #1192e8; --pa-cat-3: #005d5d; --pa-cat-4: #9f1853; --pa-cat-5: #eeeeee; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --pa-bg: #000; } }
:root[data-theme="dark"] { --pa-bg: #161616; --pa-surface: #262626; --pa-text: #f4f4f4; --pa-text-2: #c6c6c6;
  --pa-interactive: #4589ff; --pa-link: #78a9ff; --pa-focus: #ffffff;
  --pa-cat-1: #8a3ffc; --pa-cat-2: #33b1ff; --pa-cat-3: #007d79; --pa-cat-4: #ff7eb6; --pa-cat-5: #fa4d56; }`;

test("parses light and dark blocks", () => {
  const t = parseTokens(css);
  assert.equal(t.light["--pa-bg"], "#ffffff");
  assert.equal(t.dark["--pa-bg"], "#161616");
});

test("contrast of black on white is 21", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("alpha text composites over its background", () => {
  const r = contrast("rgba(60,60,67,0.6)", "#ffffff");
  assert.ok(r > 3.3 && r < 3.6, `got ${r}`);
});

test("flags failing pairs and passes good ones", () => {
  const res = checkTokens(css);
  const fail = res.filter(r => !r.ok).map(r => `${r.theme}:${r.pair}`);
  assert.ok(fail.includes("light:--pa-text-2/--pa-bg"));
  assert.ok(fail.includes("light:--pa-cat-5/--pa-bg"));
  assert.ok(!fail.includes("light:--pa-text/--pa-bg"));
});
