const CDN = "https://cdn.jsdelivr.net";
const FAMILY = ["react", "react-dom", "react-is", "scheduler"];

export const PINS = { react: "19.3.0", "react-dom": "19.3.0", "react-is": "19.3.0", scheduler: "0.28.0" };

export const ROOTS = [
  "react@19.3.0/+esm",
  "react-dom@19.3.0/client/+esm",
  "htm@3.1.1/+esm",
  "recharts@3.10.1/+esm",
  "@xyflow/react@12.12.0/+esm",
  "@carbon/charts-react@1.27.20/+esm",
  "@react-three/fiber@9.8.1/+esm",
].map(p => `${CDN}/npm/${p}`);

export function extractImports(src) {
  return [...src.matchAll(/(?:from|import)\s*\(?\s*["'](\/npm\/[^"']+)["']/g)].map(m => m[1]);
}

export function canonicalFor(path, pins) {
  const m = path.match(/^\/npm\/((?:@[^/]+\/)?[^@/]+)@[^/]+\/(.*)$/);
  if (!m || !FAMILY.includes(m[1])) return null;
  return `${CDN}/npm/${m[1]}@${pins[m[1]]}/${m[2]}`;
}

// jsdelivr's +esm bundles import React by absolute URL, often at a different
// version or as a range, so bare-specifier entries alone leave several React
// copies loaded. Every such URL gets its own entry pointing at the pinned copy.
export async function buildImportMap(roots, pins, fetchText) {
  const seen = new Set();
  const imports = {};
  const queue = [...roots];
  while (queue.length) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    for (const path of extractImports(await fetchText(url))) {
      const abs = CDN + path;
      const canon = canonicalFor(path, pins);
      if (canon) {
        if (abs !== canon) imports[abs] = canon;
        queue.push(canon);
      } else {
        queue.push(abs);
      }
    }
  }
  for (const name of FAMILY) imports[name] = `${CDN}/npm/${name}@${pins[name]}/+esm`;
  imports["react-dom/client"] = `${CDN}/npm/react-dom@${pins["react-dom"]}/client/+esm`;
  imports["react/jsx-runtime"] = `${CDN}/npm/react@${pins.react}/jsx-runtime/+esm`;
  return { imports };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const map = await buildImportMap(ROOTS, PINS, async u => (await fetch(u)).text());
  process.stdout.write(JSON.stringify(map, null, 2) + "\n");
}
