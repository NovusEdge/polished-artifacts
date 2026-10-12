// Builds skills/editorial/et-book.css from the vendored woff files.
// Usage: node scripts/et-book-css.mjs > skills/editorial/et-book.css
import { readFileSync } from "node:fs";

const FACES = [["roman", 400, "normal"], ["italic", 400, "italic"], ["bold", 700, "normal"]];

export function etBookCss() {
  const dir = new URL("../skills/editorial/", import.meta.url);
  return FACES.map(([file, weight, style]) => {
    const b64 = readFileSync(new URL(`et-book-${file}.woff`, dir)).toString("base64");
    return `@font-face { font-family: "et-book"; src: url("data:font/woff;base64,${b64}") format("woff"); font-weight: ${weight}; font-style: ${style}; font-display: swap; }\n`;
  }).join("");
}

if (import.meta.url === `file://${process.argv[1]}`) process.stdout.write(etBookCss());
