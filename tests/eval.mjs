// Scores the baseline and plugin outputs of the evaluation prompt with lint.js.
// Usage: node tests/eval.mjs [dir]   (default docs/superpowers/notes/eval)
import { readFileSync, existsSync } from "node:fs";
import { runPage } from "./browser/run.mjs";

const dir = process.argv[2] ?? "docs/superpowers/notes/eval";
const LINT = readFileSync("skills/core/lint.js", "utf8");
const inject = `<script>${LINT}</script><script>polishedLint().then(r=>{r.pass=polishedLintPass(r);const p=document.createElement("pre");p.id="result";p.textContent=JSON.stringify(r);document.body.append(p)})</script>`;

for (const f of ["baseline", "carbon", "apple"]) {
  const path = `${dir}/${f}.html`;
  if (!existsSync(path)) { console.log(f, "missing"); continue; }
  for (const theme of ["light", "dark"]) for (const width of [375, 1280]) {
    const { pass, ...r } = runPage(path, { width, theme, inject });
    console.log(f.padEnd(8), theme.padEnd(5), String(width).padStart(4), pass ? "PASS" : "FAIL", JSON.stringify(r));
  }
}
