#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const inputArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
const dataPath = path.resolve(root, inputArg || "benchmark/results.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, "cases.json"), "utf8"));
const failures = [];

if (data.schema_version !== 1) failures.push("unexpected result schema");
if (data.results.length !== cases.length * 2) failures.push("expected two arms for every case");

for (const test of cases) {
  for (const arm of ["baseline", "skill"]) {
    const run = data.results.find((row) => row.id === test.id && row.arm === arm);
    if (!run) {
      failures.push(`missing ${test.id}/${arm}`);
      continue;
    }
    if (!run.output.trim()) failures.push(`empty output: ${test.id}/${arm}`);
    if (!(run.usage.output_tokens > 0)) failures.push(`missing token count: ${test.id}/${arm}`);
    if (run.metrics.facts_total !== test.required.length) failures.push(`fact-count mismatch: ${test.id}/${arm}`);
    if (/benchmark|clear-agent-output|SKILL\.md/i.test(run.output)) failures.push(`instruction leak: ${test.id}/${arm}`);
  }
}

for (const run of data.results.filter((row) => row.arm === "skill")) {
  if (run.metrics.facts_kept !== run.metrics.facts_total) failures.push(`skill lost a fact: ${run.id}`);
  if (!run.metrics.next_label_correct) failures.push(`skill used Next incorrectly: ${run.id}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Benchmark results valid: ${data.results.length} runs on ${data.provider || "codex"}/${data.model}`);
