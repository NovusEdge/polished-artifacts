import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runPage } from "./browser/run.mjs";

// The artifact viewer renders Mermaid in its default theme and ignores %%{init}%% colours,
// so skills/core/mermaid.css has to make the default render readable in both themes.
function page() {
  const css = existsSync("skills/core/mermaid.css") ? readFileSync("skills/core/mermaid.css", "utf8") : "";
  const lib = readFileSync("skills/core/libraries.md", "utf8");
  const example = lib.match(/<pre class="mermaid">\nflowchart[\s\S]*?<\/pre>/)[0].replace('class="mermaid"', 'class="mermaid example"');
  const html = readFileSync("tests/browser/mermaid-theme.html", "utf8").replace("MERMAID_CSS", css).replace("EXAMPLE", example);
  const f = join(mkdtempSync(join(tmpdir(), "pa-")), "mermaid.html");
  writeFileSync(f, html);
  return f;
}

for (const theme of ["light", "dark"]) {
  test(`default-theme Mermaid is readable in ${theme} mode with mermaid.css`, { skip: process.env.PA_OFFLINE === "1" }, () => {
    const r = runPage(page(), { theme });
    assert.ok(r.label >= 4.5, `node label contrast ${r.label}`);
    assert.ok(r.edgeLabel >= 4.5, `edge label contrast ${r.edgeLabel}`);
    assert.ok(r.edge >= 3, `edge line contrast ${r.edge}`);
    assert.equal(r.tooltipTinted, false, "Mermaid's yellow tooltip is not restyled");
  });
}

test("libraries.md's wrap-into-rows example renders wider than tall", { skip: process.env.PA_OFFLINE === "1" }, () => {
  const r = runPage(page(), { width: 1280 });
  assert.equal(r.exampleWide, true);
});
