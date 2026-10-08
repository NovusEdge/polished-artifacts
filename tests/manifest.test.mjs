import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Claude Code reads .claude-plugin/plugin.json and Codex reads the root plugin.json.
test("Claude and Codex manifests agree on name and version", () => {
  const claude = JSON.parse(readFileSync(".claude-plugin/plugin.json", "utf8"));
  const codex = JSON.parse(readFileSync("plugin.json", "utf8"));
  assert.equal(codex.name, claude.name);
  assert.equal(codex.version, claude.version);
});
