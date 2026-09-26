import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runPage } from "./browser/run.mjs";
import { pass } from "../skills/core/lint.js";

const LINT = readFileSync("skills/core/lint.js", "utf8").replace(/^export .*$/gm, "");
const inject = `<script>${LINT}</script><script>polishedLint().then(r=>{const p=document.createElement("pre");p.id="result";p.textContent=JSON.stringify(r);document.body.append(p)})</script>`;

for (const theme of ["light", "dark"]) {
  test(`bad fixture fails on all four faults (${theme}, 375px)`, () => {
    const r = runPage("tests/fixtures/bad-landscape.html", { width: 375, theme, inject });
    assert.ok(r.decorativeColor > 10, `decorativeColor=${r.decorativeColor}`);
    assert.ok(r.smallText > 0, `smallText=${r.smallText}`);
    assert.ok(r.monoOrUpper > 10, `monoOrUpper=${r.monoOrUpper}`);
    // The fixture has 42 .chip and 5 .tag badges.
    assert.equal(r.pills, 47, `pills=${r.pills}`);
    assert.equal(r.firstViewport.figure, false);
    assert.equal(pass(r), false);
  });

  test(`good fixture passes (${theme}, 375px and 1280px)`, () => {
    for (const width of [375, 1280]) {
      const r = runPage("tests/fixtures/good-report.html", { width, theme, inject });
      assert.equal(pass(r), true, JSON.stringify(r));
    }
  });
}

test("accent on buttons, links and data-encodes elements is not decorative", () => {
  const r = runPage("tests/fixtures/good-report.html", { width: 1280, inject });
  assert.equal(r.decorativeColor, 0);
});
