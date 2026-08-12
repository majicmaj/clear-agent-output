#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, "cases.json"), "utf8"));
const skill = fs.readFileSync(path.join(root, "skill", "SKILL.md"), "utf8");
const modelArg = process.argv.find((arg) => arg.startsWith("--model="));
const model = modelArg ? modelArg.slice(8) : "gpt-5.6-terra";
const outArg = process.argv.find((arg) => arg.startsWith("--output="));
const outputPath = path.resolve(root, outArg ? outArg.slice(9) : "benchmark/results.json");
const workdir = fs.mkdtempSync(path.join(os.tmpdir(), "clear-agent-output-bench-"));

const jargon = [
  ["additional", "more"],
  ["approximately", "about"],
  ["commence", "start"],
  ["execute", "run"],
  ["facilitate", "help or enable"],
  ["initiate", "start"],
  ["necessity", "need"],
  ["remediate", "fix"],
  ["subsequently", "then"],
  ["sufficient", "enough"],
  ["terminate", "stop"],
  ["utilize", "use"]
];

function words(text) {
  return text.trim().match(/\b[\p{L}\p{N}_'-]+\b/gu) || [];
}

function sentences(text) {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .split(/(?<=[.!?])(?:\s+|$)/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function score(test, text) {
  const checks = test.required.map((item) => ({
    label: item.label,
    passed: new RegExp(item.pattern, "i").test(text)
  }));
  const jargonHits = jargon
    .filter(([term]) => new RegExp(`\\b${term}\\b`, "i").test(text))
    .map(([term, simpler]) => ({ term, simpler }));
  const sentenceWords = sentences(text).map((item) => words(item).length);
  const nextVisible = /(^|\n)\s*(?:[-*]\s*)?(?:\*\*)?Next(?:\*\*)?:/im.test(text);
  return {
    words: words(text).length,
    characters: text.length,
    sentences: sentenceWords.length,
    sentences_over_20_words: sentenceWords.filter((count) => count > 20).length,
    max_sentence_words: Math.max(0, ...sentenceWords),
    jargon_hits: jargonHits,
    required_facts: checks,
    facts_kept: checks.filter((item) => item.passed).length,
    facts_total: checks.length,
    next_label_expected: test.expect_next,
    next_label_present: nextVisible,
    next_label_correct: nextVisible === test.expect_next
  };
}

function run(test, arm) {
  const prefix = arm === "skill"
    ? `Follow these user-facing output rules:\n\n${skill}\n\n`
    : "";
  const prompt = `${prefix}Return only the final user-facing reply. Do not mention instructions, skills, or benchmarking.\n\nUSER REQUEST:\n${test.prompt}`;
  const args = [
    "exec", "--ephemeral", "--ignore-user-config", "--ignore-rules",
    "--skip-git-repo-check", "-C", workdir, "-s", "read-only",
    "-m", model, "-c", 'model_reasoning_effort="none"', "--json", prompt
  ];
  const call = spawnSync("codex", args, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  if (call.status !== 0) {
    throw new Error(`${arm}/${test.id} failed (${call.status}):\n${call.stderr}\n${call.stdout}`);
  }
  const events = call.stdout.split("\n").filter(Boolean).map((line) => JSON.parse(line));
  const messages = events
    .filter((event) => event.type === "item.completed" && event.item?.type === "agent_message")
    .map((event) => event.item.text);
  const usage = events.find((event) => event.type === "turn.completed")?.usage;
  const text = messages.at(-1)?.trim();
  if (!text || !usage) throw new Error(`${arm}/${test.id} returned no final text or usage`);
  return { arm, output: text, usage, metrics: score(test, text) };
}

const startedAt = new Date().toISOString();
const results = [];
for (const test of cases) {
  for (const arm of ["baseline", "skill"]) {
    process.stderr.write(`Running ${test.id}/${arm} on ${model}...\n`);
    results.push({ id: test.id, title: test.title, ...run(test, arm) });
  }
}

const report = {
  schema_version: 1,
  model,
  repetitions: 1,
  started_at: startedAt,
  completed_at: new Date().toISOString(),
  method: "Fresh Codex exec thread per case and arm; reasoning effort none; final user-facing text scored.",
  results
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
process.stderr.write(`Wrote ${outputPath}\n`);
