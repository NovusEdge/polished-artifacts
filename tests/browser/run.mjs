import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Chromium's --dump-dom prints the DOM once the virtual time budget runs out.
// A page reports by writing JSON into <pre id="result">.
export function runPage(htmlPath, { width = 1280, height = 900, theme = "light", inject = "" } = {}) {
  let html = readFileSync(htmlPath, "utf8");
  html = /<html/i.test(html) ? html.replace(/<html/i, `<html data-theme="${theme}"`) : `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${html}</body></html>`;
  if (inject) html = html.replace(/<\/body>/i, `${inject}</body>`);
  const dir = mkdtempSync(join(tmpdir(), "pa-"));
  const file = join(dir, "page.html");
  writeFileSync(file, html);
  const dom = execFileSync("/usr/bin/chromium", [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--allow-file-access-from-files", "--hide-scrollbars",
    `--window-size=${width},${height}`, "--virtual-time-budget=20000", "--dump-dom", `file://${resolve(file)}`,
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  const m = dom.match(/<pre id="result">([\s\S]*?)<\/pre>/);
  if (!m) throw new Error(`no #result in ${htmlPath}`);
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
}
