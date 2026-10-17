import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { LOOKS } from "./looks.mjs";
import { spec } from "../skills/likec4/theme.mjs";

const KINDS = ["actor", "system", "layer", "service", "webapp", "worker", "bus", "store", "external"];
const RELATIONS = ["sync", "async", "data", "ext", "planned"];

for (const look of LOOKS) {
  test(`likec4 theme for ${look} defines every kind with opaque colours`, () => {
    const s = spec(look);
    const colours = [...s.matchAll(/^\s*color (pa-\w+) (.+)$/gm)];
    assert.equal(colours.length, 5);
    for (const [, name, value] of colours) assert.match(value, /^rgba\(\d+,\d+,\d+,1\)$/, `${look} ${name}`);
    for (const k of KINDS) assert.match(s, new RegExp(`^  element ${k} \\{`, "m"), `${look} lacks ${k}`);
    for (const r of RELATIONS) assert.match(s, new RegExp(`^  relationship ${r} \\{`, "m"), `${look} lacks ${r}`);
  });
}

test("likec4 theme flattens apple's translucent text colour over the page background", () => {
  // rgba(60,60,67,0.8) over #f2f2f7
  assert.match(spec("apple"), /color pa-store rgba\(96,96,103,1\)/);
});

test("core routes architecture diagrams to the likec4 skill", () => {
  const md = readFileSync("skills/core/SKILL.md", "utf8");
  assert.match(md, /architecture diagrams from LikeC4/);
  assert.match(md, /polished-artifacts:likec4/);
});

const MODEL = `model {
  u = actor 'User'
  app = system 'App' {
    edge = layer 'Edge' {
      web = webapp 'Web'
      api = service 'API'
    }
    q = bus 'Queue'
    w = worker 'Worker'
    db = store 'DB'
  }
  x = external 'Vendor'
  u -[sync]-> app.edge.web 'uses'
  app.edge.web -[sync]-> app.edge.api 'REST'
  app.edge.api -[async]-> app.q 'enqueue'
  app.q -[async]-> app.w 'dispatch'
  app.w -[data]-> app.db 'write'
  app.w -[ext]-> x 'call'
  app.edge.api -[planned]-> x 'later'
}
views {
  view index {
    include *, app.**
    autoLayout LeftRight 240 120 ortho
  }
}
`;

// Runs the pinned CLI the skill tells Claude to install, so a LikeC4 grammar change shows up here.
test("likec4 validates the generated spec for every look", { skip: process.env.PA_OFFLINE === "1", timeout: 300_000 }, () => {
  for (const look of LOOKS) {
    const dir = mkdtempSync(join(tmpdir(), `pa-likec4-${look}-`));
    writeFileSync(join(dir, "spec.c4"), spec(look));
    writeFileSync(join(dir, "model.c4"), MODEL);
    const out = execFileSync("npx", ["-y", "likec4@1.60.0", "validate", dir], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    // An invalid model exits 1, which makes execFileSync throw.
    assert.match(out, /✓ Valid/, `${look}: ${out}`);
  }
});
