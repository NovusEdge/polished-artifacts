// Reads the look's motion tokens for GSAP and anime.js, which take an easing function, not a CSS string.
// In a page: paste this file into a <script> before the module that animates, and call paMotionInit() once the body exists.
//   gsap.to(el, { x: 120, duration: paDur("--pa-dur-mid"), ease: paEase("--pa-ease") })
//   animate(el, { x: 120, duration: paDur("--pa-dur-mid") * 1000, ease: paEase("--pa-ease") })

// clamp: true caps the curve at 1, for opacity and text, which must not overshoot (Apple's spring does).
function paEaseFrom(css, { clamp = false } = {}) {
  const f = paEaseCurve(css);
  return clamp ? p => Math.min(1, f(p)) : f;
}

function paEaseCurve(css) {
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
function paEase(name, opts) { return paEaseFrom(paToken(name), opts); }
function paDur(name) { return paSeconds(paToken(name)); }

// Full motion is the default. The saved choice applies as this file loads, before any animation module runs;
// only the button waits for paMotionInit().
if (typeof document !== "undefined") {
  let saved = null;
  try { saved = localStorage.getItem("pa-motion"); } catch (e) {}
  document.documentElement.dataset.motion = saved === "reduce" ? "reduce" : "full";
}
function paReduced() { return document.documentElement.dataset.motion === "reduce"; }

// Animations a page starts go through paTrack(), so pressing "Reduce motion" can finish them:
// GSAP loops stop and jump to the end, scrubbed tweens lose their ScrollTrigger, anime.js completes.
const paTracked = new Set();
function paTrack(anim) { paTracked.add(anim); return anim; }
function paFinishTracked() {
  for (const a of paTracked) {
    a.scrollTrigger?.kill();
    if (a.complete) a.complete();
    else if (a.progress) { a.repeat?.(0); a.progress(1); }
  }
  paTracked.clear();
}

function paMotionInit() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "pa-motion-toggle";
  btn.textContent = "Reduce motion";
  btn.setAttribute("aria-pressed", String(paReduced()));
  btn.addEventListener("click", () => {
    const reduce = !paReduced();
    document.documentElement.dataset.motion = reduce ? "reduce" : "full";
    btn.setAttribute("aria-pressed", String(reduce));
    try { localStorage.setItem("pa-motion", reduce ? "reduce" : "full"); } catch (e) {}
    if (reduce) paFinishTracked();
    dispatchEvent(new CustomEvent("pa-motion", { detail: { reduced: reduce } }));
  });
  document.body.append(btn);
}
