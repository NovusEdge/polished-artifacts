import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { LOOKS } from "./looks.mjs";

// motion.js is pasted into pages as a plain <script>, so load it the same way.
const ctx = {};
vm.runInNewContext(readFileSync("skills/core/motion.js", "utf8"), ctx);
const { paEaseFrom, paSeconds, paTrack, paFinishTracked } = ctx;

test("a saved reduce choice applies as soon as motion.js loads, before paMotionInit", () => {
  const root = { dataset: {} };
  vm.runInNewContext(readFileSync("skills/core/motion.js", "utf8"),
    { document: { documentElement: root }, localStorage: { getItem: () => "reduce" } });
  assert.equal(root.dataset.motion, "reduce");
});

test("clamped easings never pass 1, for opacity and text", () => {
  const f = paEaseFrom("linear(0, 0.5, 1.05, 1)", { clamp: true });
  for (let p = 0; p <= 1; p += 0.01) assert.ok(f(p) <= 1, String(p));
});

test("finishing tracked motion ends GSAP loops and scrubs and completes anime.js", () => {
  const tween = { progress(p) { this.p = p; }, repeat(n) { this.r = n; }, scrollTrigger: { kill() { this.killed = true; } } };
  const anime = { complete() { this.done = true; } };
  paTrack(tween); paTrack(anime);
  paFinishTracked();
  assert.equal(tween.p, 1);
  assert.equal(tween.r, 0);
  assert.equal(tween.scrollTrigger.killed, true);
  assert.equal(anime.done, true);
});

const close = (a, b, eps = 0.01) => Math.abs(a - b) < eps;

test("cubic-bezier tokens become easing functions with fixed ends", () => {
  const f = paEaseFrom("cubic-bezier(0.2, 0, 0.38, 0.9)");
  assert.equal(f(0), 0);
  assert.equal(f(1), 1);
  // Carbon's productive standard curve is past halfway at the midpoint.
  assert.ok(f(0.5) > 0.6 && f(0.5) < 0.8, String(f(0.5)));
});

test("a symmetric curve passes through the middle", () => {
  assert.ok(close(paEaseFrom("cubic-bezier(0.6, 0, 0.4, 1)")(0.5), 0.5));
});

test("linear() tokens interpolate between their stops, overshoot included", () => {
  const f = paEaseFrom("linear(0, 0.5, 1.01, 1)");
  assert.ok(close(f(1 / 6), 0.25));
  assert.ok(close(f(2 / 3), 1.01));
  assert.equal(f(1), 1);
});

test("every look's easing tokens parse", () => {
  for (const look of LOOKS) {
    const css = readFileSync(`skills/${look}/tokens.css`, "utf8");
    for (const k of ["--pa-ease", "--pa-ease-enter", "--pa-ease-exit"]) {
      let v = css.match(new RegExp(`${k}:\\s*([^;]+);`))[1].trim();
      if (v.startsWith("var(")) v = css.match(/--pa-ease:\s*([^;]+);/)[1].trim();
      const f = paEaseFrom(v);
      assert.equal(f(0), 0, `${look} ${k}`);
      assert.ok(close(f(1), 1), `${look} ${k}`);
    }
  }
});

test("durations convert to seconds for GSAP", () => {
  assert.equal(paSeconds("240ms"), 0.24);
  assert.equal(paSeconds("0.7s"), 0.7);
});
