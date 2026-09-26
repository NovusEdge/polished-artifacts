// Scores a rendered page on the four faults polished-artifacts exists to remove:
// decorative colour, weak hierarchy, chip and card clutter, agent-first reading.
// In a page: paste this file into a <script>, then `await polishedLint()`.
const PA_EXEMPT = "a,button,input,select,textarea,summary,[role=button],svg,svg *,canvas,video,img,[data-encodes],[data-encodes] *";
const PA_THRESHOLDS = { decorativeColor: 0, smallText: 0, pills: 0, translucent: 0, longLists: 0 };

function paRgb(s) {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
}
function paChroma(c) { return c && c.a > 0.05 ? (Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b)) / 255 : 0; }
function paHasText(el) { return [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); }
function paVisible(el) { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
function paBordered(cs) {
  return ["Top", "Right", "Bottom", "Left"].some(s => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none")
    || (cs.boxShadow && cs.boxShadow !== "none");
}

async function polishedLint() {
  const els = [...document.body.querySelectorAll("*")].filter(paVisible);
  const report = { decorativeColor: 0, smallText: 0, monoOrUpper: 0, typeSizes: 0, pills: 0, boxDepth: 0,
    firstViewport: { h1: false, figure: false }, longLists: 0, horizontalScroll: false, translucent: 0 };
  const sizes = new Set();
  const depth = new Map();
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (!el.matches(PA_EXEMPT)) {
      const sideAccent = ["Left", "Top"].some(s => parseFloat(cs[`border${s}Width`]) >= 2 && paChroma(paRgb(cs[`border${s}Color`])) > 0.12);
      const tinted = paChroma(paRgb(cs.backgroundColor)) > 0.06;
      if (sideAccent || tinted) report.decorativeColor++;
    }
    if (cs.backdropFilter && cs.backdropFilter !== "none") report.translucent++;
    if (paHasText(el)) {
      const fs = parseFloat(cs.fontSize);
      sizes.add(fs);
      if (fs < 12) report.smallText++;
      if (!el.closest("code,pre,kbd,samp") && (/mono/i.test(cs.fontFamily) || cs.textTransform === "uppercase")) report.monoOrUpper++;
      const rad = parseFloat(cs.borderTopLeftRadius);
      const h = el.getBoundingClientRect().height;
      const filled = paBordered(cs) || (paRgb(cs.backgroundColor)?.a ?? 0) > 0.05;
      if (h < 40 && rad > 0 && (rad >= 999 || rad >= h / 2 - 1 || rad <= 4) && filled && el.matches("span,i,b,em,strong,small,div,li,a")) report.pills++;
    }
    const parentDepth = depth.get(el.parentElement) ?? 0;
    const d = paBordered(cs) ? parentDepth + 1 : parentDepth;
    depth.set(el, d);
    report.boxDepth = Math.max(report.boxDepth, d);
  }
  report.typeSizes = sizes.size;
  const vh = innerHeight;
  const h1 = document.querySelector("h1");
  report.firstViewport.h1 = !!h1 && h1.getBoundingClientRect().top < vh && h1.textContent.trim().split(/\s+/).length >= 4;
  report.firstViewport.figure = [...document.querySelectorAll("figure,svg,canvas,img,video,[role=img]")]
    .some(f => { const r = f.getBoundingClientRect(); return r.top < vh && r.width * r.height > 12000 && !f.closest("button,a"); });
  report.longLists = [...document.querySelectorAll("ul,ol")].filter(l =>
    !l.closest("details:not([open])") && l.querySelectorAll(":scope > li").length > 7).length;
  report.horizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  return report;
}

function pass(r) {
  return Object.entries(PA_THRESHOLDS).every(([k, max]) => r[k] <= max)
    && r.firstViewport.h1 && r.firstViewport.figure && !r.horizontalScroll;
}

if (typeof window !== "undefined") { window.polishedLint = polishedLint; window.polishedLintPass = pass; }
export { pass, PA_THRESHOLDS as THRESHOLDS };
