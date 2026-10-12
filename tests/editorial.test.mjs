import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { etBookCss } from "../scripts/et-book-css.mjs";

// Artifacts load fonts only from Google Fonts or data: URIs, so et-book ships inlined.
test("et-book.css is the generated file, with each face inlined from its woff", () => {
  const css = readFileSync("skills/editorial/et-book.css", "utf8");
  assert.equal(css, etBookCss());
  for (const f of ["roman", "italic", "bold"]) {
    const b64 = readFileSync(`skills/editorial/et-book-${f}.woff`).toString("base64");
    assert.ok(css.includes(`data:font/woff;base64,${b64}`), f);
  }
});

test("editorial's tokens.css loads no font by URL", () => {
  assert.doesNotMatch(readFileSync("skills/editorial/tokens.css", "utf8"), /url\(/);
});

test("editorial's skill tells pages to load et-book.css", () => {
  assert.match(readFileSync("skills/editorial/SKILL.md", "utf8"), /et-book\.css/);
});
