import { test } from "node:test";
import assert from "node:assert/strict";
import { extractImports, canonicalFor, buildImportMap } from "../scripts/importmap.mjs";

const PINS = { react: "19.3.0", "react-dom": "19.3.0", "react-is": "19.3.0", scheduler: "0.27.0" };

test("extracts static and dynamic jsdelivr imports", () => {
  const src = 'import e from"/npm/react@19.2.8/+esm";export*from"/npm/react-dom@%5E19.3.0/client/+esm";const x=import("/npm/d3@7/+esm")';
  assert.deepEqual(extractImports(src), ["/npm/react@19.2.8/+esm", "/npm/react-dom@%5E19.3.0/client/+esm", "/npm/d3@7/+esm"]);
});

test("canonicalises react-family paths to the pinned version, keeping subpaths", () => {
  assert.equal(canonicalFor("/npm/react@19.2.8/+esm", PINS), "https://cdn.jsdelivr.net/npm/react@19.3.0/+esm");
  assert.equal(canonicalFor("/npm/react-dom@%5E19.3.0/client/+esm", PINS), "https://cdn.jsdelivr.net/npm/react-dom@19.3.0/client/+esm");
  assert.equal(canonicalFor("/npm/d3@7/+esm", PINS), null);
});

test("maps every react URL reachable from the roots to one pinned URL", async () => {
  const files = {
    "https://cdn.jsdelivr.net/npm/recharts@3.10.1/+esm": 'import"/npm/react@19.2.8/+esm";import"/npm/react-is@19.2.8/+esm";import"/npm/lodash@4/+esm"',
    "https://cdn.jsdelivr.net/npm/lodash@4/+esm": "",
    "https://cdn.jsdelivr.net/npm/react-dom@19.3.0/client/+esm": 'import"/npm/react@%5E19.3.0/+esm";import"/npm/scheduler@%5E0.27.0/+esm"',
  };
  const map = await buildImportMap(
    ["https://cdn.jsdelivr.net/npm/recharts@3.10.1/+esm", "https://cdn.jsdelivr.net/npm/react-dom@19.3.0/client/+esm"],
    PINS, async u => files[u] ?? "");
  assert.equal(map.imports["https://cdn.jsdelivr.net/npm/react@19.2.8/+esm"], "https://cdn.jsdelivr.net/npm/react@19.3.0/+esm");
  assert.equal(map.imports["https://cdn.jsdelivr.net/npm/react@%5E19.3.0/+esm"], "https://cdn.jsdelivr.net/npm/react@19.3.0/+esm");
  assert.equal(map.imports["https://cdn.jsdelivr.net/npm/react-is@19.2.8/+esm"], "https://cdn.jsdelivr.net/npm/react-is@19.3.0/+esm");
  assert.equal(map.imports["react"], "https://cdn.jsdelivr.net/npm/react@19.3.0/+esm");
  assert.equal(map.imports["react-dom/client"], "https://cdn.jsdelivr.net/npm/react-dom@19.3.0/client/+esm");
  assert.ok(!("https://cdn.jsdelivr.net/npm/react@19.3.0/+esm" in map.imports), "canonical URL must not map to itself");
});
