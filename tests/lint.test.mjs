import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

test("a fixed 680px column fails the width check on a wide screen but not on a phone", () => {
  const wide = runPage("tests/fixtures/narrow-column.html", { width: 1280, inject });
  assert.ok(wide.usedWidth < 0.55, `usedWidth=${wide.usedWidth}`);
  assert.equal(wide.pass, false);
  const phone = runPage("tests/fixtures/narrow-column.html", { width: 375, inject });
  assert.equal(phone.pass, true, JSON.stringify(phone));
});

// Apple and Studio have the narrowest wide column (820px), so they are the hardest looks to pass with.
const gridPage = () => readFileSync("tests/fixtures/page-grid.html", "utf8")
  .replace("/* tokens */", readFileSync("skills/apple/tokens.css", "utf8"))
  .replace("/* layout */", readFileSync("skills/core/layout.css", "utf8"));

test("core's page grid passes the width check from 1280px to 1920px, with and without asides", () => {
  const page = gridPage();
  const dir = mkdtempSync(join(tmpdir(), "pa-grid-"));
  writeFileSync(join(dir, "with-aside.html"), page);
  writeFileSync(join(dir, "single.html"), page.replace(/<aside[\s\S]*?<\/aside>/, ""));
  // 1536 and 1580 sit in the band where a one-column 820px page covers barely half the screen.
  for (const file of ["with-aside.html", "single.html"]) for (const width of [1280, 1536, 1580, 1920]) {
    const r = runPage(join(dir, file), { width, inject });
    assert.equal(r.pass, true, `${file} ${width}: ${JSON.stringify(r)}`);
  }
});

test("a rail aside taller than the block beside it fails as a gap", () => {
  const tall = gridPage().replace('<div class="fig-label">share shipped by Chinese firms</div>',
    '<div class="fig-label">share shipped by Chinese firms</div><div style="height:600px"></div>');
  const dir = mkdtempSync(join(tmpdir(), "pa-gap-"));
  writeFileSync(join(dir, "tall.html"), tall);
  const r = runPage(join(dir, "tall.html"), { width: 1600, inject });
  assert.equal(r.asideGaps, 1);
  assert.equal(r.pass, false);
});

test("accent on buttons, links and data-encodes elements is not decorative", () => {
  const r = runPage("tests/fixtures/good-report.html", { width: 1280, inject });
  assert.equal(r.decorativeColor, 0);
});

test("Carbon Charts legend swatches are not decorative", () => {
  const r = runPage("tests/fixtures/carbon-legend.html", { width: 1280, inject });
  assert.equal(r.decorativeColor, 0);
});
