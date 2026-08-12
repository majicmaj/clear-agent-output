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
  npx clear-agent-output            Install for your user
  npx clear-agent-output --project  Install in the current project
  npx clear-agent-output --force    Replace an existing copy`);
  process.exit(0);
}

if (unknown.length) {
  console.error(`Unknown option: ${unknown[0]}`);
  process.exit(1);
}

const root = args.has("--project") ? process.cwd() : os.homedir();
const target = path.join(root, ".agents", "skills", "clear-agent-output");
const source = path.join(__dirname, "..", "skill");

if (fs.existsSync(target) && !args.has("--force")) {
  console.error(`Already installed: ${target}\nRun again with --force to replace it.`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(source, target, { recursive: true, force: args.has("--force") });

console.log(`Installed Clear Agent Output: ${target}`);
console.log("Restart your agent, then use $clear-agent-output.");
