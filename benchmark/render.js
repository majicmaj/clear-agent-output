#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const inputArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
const dataPath = path.resolve(root, inputArg || "benchmark/results.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, "cases.json"), "utf8"));

const esc = (text) => text.replaceAll("|", "\\|").replaceAll("\n", " ");
const pct = (before, after) => before ? `${Math.round((1 - after / before) * 100)}%` : "n/a";
const rows = cases.map((test) => {
  const baseline = data.results.find((row) => row.id === test.id && row.arm === "baseline");
  const skill = data.results.find((row) => row.id === test.id && row.arm === "skill");
  return { test, baseline, skill };
});

const totals = rows.reduce((sum, row) => {
  for (const key of ["baseline", "skill"]) {
    sum[key].tokens += row[key].usage.output_tokens;
    sum[key].words += row[key].metrics.words;
    sum[key].facts += row[key].metrics.facts_kept;
    sum[key].factTotal += row[key].metrics.facts_total;
    sum[key].long += row[key].metrics.sentences_over_20_words;
    sum[key].jargon += row[key].metrics.jargon_hits.length;
    sum[key].next += Number(row[key].metrics.next_label_correct);
  }
  return sum;
}, {
  baseline: { tokens: 0, words: 0, facts: 0, factTotal: 0, long: 0, jargon: 0, next: 0 },
  skill: { tokens: 0, words: 0, facts: 0, factTotal: 0, long: 0, jargon: 0, next: 0 }
});

let examples = `# Examples\n\n`;
examples += `These are single-run examples from \`${data.model}\`. Each arm used a fresh thread and the same task. Results can vary across runs.\n\n`;
examples += `## Summary\n\n`;
examples += `| Measure | Without skill | With skill | Change |\n|---|---:|---:|---:|\n`;
examples += `| Output tokens | ${totals.baseline.tokens} | ${totals.skill.tokens} | ${pct(totals.baseline.tokens, totals.skill.tokens)} fewer |\n`;
examples += `| Words | ${totals.baseline.words} | ${totals.skill.words} | ${pct(totals.baseline.words, totals.skill.words)} fewer |\n`;
examples += `| Required facts kept | ${totals.baseline.facts}/${totals.baseline.factTotal} | ${totals.skill.facts}/${totals.skill.factTotal} | — |\n`;
examples += `| Sentences over 20 words | ${totals.baseline.long} | ${totals.skill.long} | — |\n`;
examples += `| Flagged complex words | ${totals.baseline.jargon} | ${totals.skill.jargon} | — |\n`;
examples += `| Correct \`Next:\` use | ${totals.baseline.next}/3 | ${totals.skill.next}/3 | — |\n\n`;

for (const { test, baseline, skill } of rows) {
  examples += `## ${test.title}\n\n`;
  examples += `**Prompt**\n\n> ${test.prompt.replaceAll("\n", "\n> ")}\n\n`;
  examples += `### Without skill\n\n${baseline.output}\n\n`;
  examples += `### With skill\n\n${skill.output}\n\n`;
  examples += `| Measure | Without | With |\n|---|---:|---:|\n`;
  examples += `| Output tokens | ${baseline.usage.output_tokens} | ${skill.usage.output_tokens} |\n`;
  examples += `| Words | ${baseline.metrics.words} | ${skill.metrics.words} |\n`;
  examples += `| Required facts | ${baseline.metrics.facts_kept}/${baseline.metrics.facts_total} | ${skill.metrics.facts_kept}/${skill.metrics.facts_total} |\n`;
  examples += `| Sentences over 20 words | ${baseline.metrics.sentences_over_20_words} | ${skill.metrics.sentences_over_20_words} |\n\n`;
}

const sourceTerms = new Map([
  ["remediated", "fixed"], ["completed successfully", "passed"],
  ["could not be executed", "was not run"], ["procedure was not initiated", "did not start"],
  ["modified", "changed"], ["execute", "run"], ["utilize", "use"],
  ["at the present time", "now"], ["in operation", "already running"],
  ["eliminates the necessity for an additional service", "avoids adding another service"],
  ["facilitate", "provide"], ["introduces more operational work", "adds operational work"]
]);
examples += `## Simpler wording seen in the examples\n\n`;
examples += `These pairs compare the source notes with the skill output. They are examples, not a fixed replacement dictionary.\n\n`;
examples += `| Source wording | Simpler wording |\n|---|---|\n`;
for (const [from, to] of sourceTerms) examples += `| ${esc(from)} | ${esc(to)} |\n`;
examples += `\nThe skilled queue reply still used \`sufficient\`. A simpler choice would be \`enough\`. The complex-word count therefore stayed at one.\n`;
examples += `\n## Method\n\n`;
examples += `Run \`npm run benchmark\` to repeat this benchmark. Use \`npm run benchmark -- --model=MODEL\` for another Codex model. The runner stores raw outputs and usage in [benchmark/results.json](benchmark/results.json).\n`;
examples += `\nThe test uses one run per arm, so it measures these samples, not universal model behavior. Output tokens come from Codex's \`turn.completed\` usage event. Input tokens are not compared because they include the Codex host prompt and skill instructions. Required-fact checks use fixed regular expressions in [benchmark/cases.json](benchmark/cases.json).\n`;

fs.writeFileSync(path.join(root, "EXAMPLES.md"), examples);
console.log(`Wrote ${path.join(root, "EXAMPLES.md")}`);
