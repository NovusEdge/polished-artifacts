// Reads the look's motion tokens for GSAP and anime.js, which take an easing function, not a CSS string.
// In a page: paste this file into a <script> before the module that animates.
//   gsap.to(el, { x: 120, duration: paDur("--pa-dur-mid"), ease: paEase("--pa-ease") })
//   animate(el, { x: 120, duration: paDur("--pa-dur-mid") * 1000, ease: paEase("--pa-ease") })

function paEaseFrom(css) {
  const v = css.trim();
  const nums = s => s.split(",").map(Number);
  if (v.startsWith("cubic-bezier(")) return paBezier(...nums(v.slice(13, -1)));
  // Stops are evenly spaced, the only linear() form the looks use.
  if (v.startsWith("linear(")) {
    const stops = nums(v.slice(7, -1));
    const n = stops.length - 1;
    return p => {
      if (p <= 0) return stops[0];
      if (p >= 1) return stops[n];
      const i = Math.floor(p * n);
      return stops[i] + (stops[i + 1] - stops[i]) * (p * n - i);
    };
  }
  throw new Error(`unsupported easing: ${css}`);
}

function paBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const x = s => ((ax * s + bx) * s + cx) * s;
  const y = s => ((ay * s + by) * s + cy) * s;
  return p => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let lo = 0, hi = 1, s = p;
    for (let i = 0; i < 30 && Math.abs(x(s) - p) > 1e-6; i++) {
      x(s) < p ? (lo = s) : (hi = s);
      s = (lo + hi) / 2;
    }
    return y(s);
  };
}

function paSeconds(css) {
  const v = css.trim();
  return v.endsWith("ms") ? parseFloat(v) / 1000 : parseFloat(v);
}

function paToken(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function paEase(name) { return paEaseFrom(paToken(name)); }
function paDur(name) { return paSeconds(paToken(name)); }
function paReduced() { return matchMedia("(prefers-reduced-motion: reduce)").matches; }
