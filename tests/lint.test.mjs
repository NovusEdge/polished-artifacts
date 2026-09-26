import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runPage } from "./browser/run.mjs";

// lint.js is injected verbatim, exactly as the skill tells Claude to use it.
const LINT = readFileSync("skills/core/lint.js", "utf8");
const inject = `<script>${LINT}</script><script>polishedLint().then(r=>{r.pass=polishedLintPass(r);const p=document.createElement("pre");p.id="result";p.textContent=JSON.stringify(r);document.body.append(p)})</script>`;

test("lint.js runs as a plain <script> with no module syntax", () => {
  assert.doesNotMatch(LINT, /^\s*export\s/m);
});

for (const theme of ["light", "dark"]) {
  test(`bad fixture fails on all four faults (${theme}, 375px)`, () => {
    const r = runPage("tests/fixtures/bad-landscape.html", { width: 375, theme, inject });
    assert.ok(r.decorativeColor > 10, `decorativeColor=${r.decorativeColor}`);
    assert.ok(r.smallText > 0, `smallText=${r.smallText}`);
    assert.ok(r.monoOrUpper > 10, `monoOrUpper=${r.monoOrUpper}`);
    // The fixture has 42 .chip and 5 .tag badges.
    assert.equal(r.pills, 47, `pills=${r.pills}`);
    assert.equal(r.firstViewport.figure, false);
    assert.equal(r.pass, false);
  });

  test(`good fixture passes (${theme}, 375px and 1280px)`, () => {
    for (const width of [375, 1280]) {
      const r = runPage("tests/fixtures/good-report.html", { width, theme, inject });
      assert.equal(r.pass, true, JSON.stringify(r));
    }
  });
}

test("accent on buttons, links and data-encodes elements is not decorative", () => {
  const r = runPage("tests/fixtures/good-report.html", { width: 1280, inject });
  assert.equal(r.decorativeColor, 0);
});

test("Carbon Charts legend swatches are not decorative", () => {
  const r = runPage("tests/fixtures/carbon-legend.html", { width: 1280, inject });
  assert.equal(r.decorativeColor, 0);
});
