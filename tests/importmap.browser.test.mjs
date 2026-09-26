import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runPage } from "./browser/run.mjs";

function page(importmap) {
  const html = readFileSync("tests/browser/react-dedupe.html", "utf8").replace("IMPORTMAP", importmap);
  const f = join(mkdtempSync(join(tmpdir(), "pa-")), "dedupe.html");
  writeFileSync(f, html);
  return f;
}

test("one React instance across recharts and react flow", { skip: process.env.PA_OFFLINE === "1" }, () => {
  const r = runPage(page(readFileSync("skills/core/importmap.json", "utf8")));
  assert.equal(r.hookErrors, 0);
  assert.equal(r.rendered, true);
});

test("a bare-specifier-only map breaks hooks (proves the check can fail)", { skip: process.env.PA_OFFLINE === "1" }, () => {
  const bare = JSON.stringify({ imports: {
    react: "https://cdn.jsdelivr.net/npm/react@19.3.0/+esm",
    "react-dom/client": "https://cdn.jsdelivr.net/npm/react-dom@19.3.0/client/+esm",
  } });
  const r = runPage(page(bare));
  assert.ok(r.hookErrors > 0 || r.rendered === false, JSON.stringify(r));
});
