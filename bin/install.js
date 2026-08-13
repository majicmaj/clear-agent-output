#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const args = new Set(process.argv.slice(2));
const known = new Set(["--project", "--force", "--help", "-h"]);
const unknown = [...args].filter((arg) => !known.has(arg));

if (args.has("--help") || args.has("-h")) {
  console.log(`Install Clear Agent Output.

Usage:
  npx clear-agent-output            Install for your user agents
  npx clear-agent-output --project  Install for this project's agents
  npx clear-agent-output --force    Replace an existing copy`);
  process.exit(0);
}

if (unknown.length) {
  console.error(`Unknown option: ${unknown[0]}`);
  process.exit(1);
}

const root = args.has("--project") ? process.cwd() : os.homedir();
const targets = [
  path.join(root, ".agents", "skills", "clear-agent-output"),
  path.join(root, ".claude", "skills", "clear-agent-output"),
];
const source = path.join(__dirname, "..", "skill");
const force = args.has("--force");
let installed = 0;

for (const target of targets) {
  if (fs.existsSync(target) && !force) {
    console.log(`Already installed: ${target}`);
    continue;
  }

  if (force) fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  console.log(`Installed: ${target}`);
  installed += 1;
}

if (!installed) {
  console.error("Run again with --force to replace the installed copies.");
  process.exit(1);
}

console.log("Restart your agent. Use $clear-agent-output in Codex or /clear-agent-output in Claude Code.");
