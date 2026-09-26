const TEXT = ["--pa-text", "--pa-text-2", "--pa-interactive", "--pa-link"];
const MARKS = ["--pa-focus", "--pa-cat-1", "--pa-cat-2", "--pa-cat-3", "--pa-cat-4", "--pa-cat-5"];
const BGS = ["--pa-bg", "--pa-surface"];

function block(css, selector) {
  const i = css.indexOf(selector + " {");
  if (i < 0) return {};
  const body = css.slice(css.indexOf("{", i) + 1, css.indexOf("}", i));
  return Object.fromEntries(
    [...body.matchAll(/(--pa-[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()])
  );
}

// Dark is read from the [data-theme="dark"] block only; tests/tokens.test.mjs
// asserts the prefers-color-scheme copy is identical.
export function parseTokens(css) {
  return { light: block(css, ":root"), dark: block(css, ':root[data-theme="dark"]') };
}

function rgba(c) {
  c = c.trim();
  if (c.startsWith("#")) {
    let h = c.slice(1);
    if (h.length === 3) h = [...h].map(x => x + x).join("");
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error(`unsupported colour ${c}`);
  const p = m[1].split(",").map(s => parseFloat(s));
  return [p[0], p[1], p[2], p[3] ?? 1];
}

function lum([r, g, b]) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(fg, bg) {
  const b = rgba(bg);
  const f = rgba(fg);
  const mix = [0, 1, 2].map(i => f[i] * f[3] + b[i] * (1 - f[3]));
  const [hi, lo] = [lum(mix), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function checkTokens(css) {
  const out = [];
  for (const [theme, t] of Object.entries(parseTokens(css))) {
    for (const bg of BGS) {
      if (!t[bg]) continue;
      for (const [names, min] of [[TEXT, 4.5], [MARKS, 3]]) {
        for (const fg of names) {
          if (!t[fg]) continue;
          const ratio = contrast(t[fg], t[bg]);
          out.push({ theme, pair: `${fg}/${bg}`, ratio: +ratio.toFixed(2), min, ok: ratio >= min });
        }
      }
    }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import("node:fs");
  const res = checkTokens(readFileSync(process.argv[2], "utf8"));
  for (const r of res) console.log(`${r.ok ? "ok  " : "FAIL"} ${r.theme} ${r.pair} ${r.ratio} (min ${r.min})`);
  process.exit(res.every(r => r.ok) ? 0 : 1);
}
