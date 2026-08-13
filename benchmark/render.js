#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const requested = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const defaults = ["benchmark/results.json", "benchmark/results-claude-opus.json"];
const dataPaths = (requested.length ? requested : defaults)
  .map((item) => path.resolve(root, item))
  .filter((item) => fs.existsSync(item));
const datasets = dataPaths.map((item) => ({
  path: path.relative(root, item),
  data: JSON.parse(fs.readFileSync(item, "utf8")),
}));
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, "cases.json"), "utf8"));

if (!datasets.length) throw new Error("No benchmark result files found");

const cell = (text) => text.replaceAll("|", "\\|").replaceAll("\n", "<br>");
const pct = (before, after) => before ? `${Math.round((1 - after / before) * 100)}%` : "n/a";
const label = (data) => `${data.provider === "claude" ? "Claude Code" : "Codex"} · ${data.model}`;

function rowsFor(data) {
  return cases.map((test) => ({
    test,
    baseline: data.results.find((row) => row.id === test.id && row.arm === "baseline"),
    skill: data.results.find((row) => row.id === test.id && row.arm === "skill"),
  }));
}

function totalsFor(rows) {
  return rows.reduce((sum, row) => {
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
    skill: { tokens: 0, words: 0, facts: 0, factTotal: 0, long: 0, jargon: 0, next: 0 },
  });
}

function renderDataset(data) {
  const rows = rowsFor(data);
  const totals = totalsFor(rows);
  let output = `## ${label(data)}\n\n`;
  output += "| Measure | Without skill | With skill | Change |\n| --- | ---: | ---: | ---: |\n";
  output += `| Output tokens | ${totals.baseline.tokens} | ${totals.skill.tokens} | ${pct(totals.baseline.tokens, totals.skill.tokens)} fewer |\n`;
  output += `| Words | ${totals.baseline.words} | ${totals.skill.words} | ${pct(totals.baseline.words, totals.skill.words)} fewer |\n`;
  output += `| Required facts kept | ${totals.baseline.facts}/${totals.baseline.factTotal} | ${totals.skill.facts}/${totals.skill.factTotal} | — |\n`;
  output += `| Sentences over 20 words | ${totals.baseline.long} | ${totals.skill.long} | — |\n`;
  output += `| Flagged complex words | ${totals.baseline.jargon} | ${totals.skill.jargon} | — |\n`;
  output += `| Correct \`Next:\` use | ${totals.baseline.next}/${cases.length} | ${totals.skill.next}/${cases.length} | — |\n\n`;

  for (const { test, baseline, skill } of rows) {
    output += `### ${test.title}\n\n`;
    const quotedPrompt = test.prompt.split("\n").map((line) => line ? `> ${line}` : ">").join("\n");
    output += `**Prompt**\n\n${quotedPrompt}\n\n`;
    output += "| Without skill | With skill |\n| --- | --- |\n";
    output += `| ${cell(baseline.output)} | ${cell(skill.output)} |\n\n`;
    output += "| Measure | Without | With |\n| --- | ---: | ---: |\n";
    output += `| Output tokens | ${baseline.usage.output_tokens} | ${skill.usage.output_tokens} |\n`;
    output += `| Words | ${baseline.metrics.words} | ${skill.metrics.words} |\n`;
    output += `| Required facts | ${baseline.metrics.facts_kept}/${baseline.metrics.facts_total} | ${skill.metrics.facts_kept}/${skill.metrics.facts_total} |\n`;
    output += `| Sentences over 20 words | ${baseline.metrics.sentences_over_20_words} | ${skill.metrics.sentences_over_20_words} |\n\n`;
  }
  return output;
}

const sourceTerms = new Map([
  ["remediated", "fixed"], ["completed successfully", "passed"],
  ["could not be executed", "was not run"], ["procedure was not initiated", "did not start"],
  ["modified", "changed"], ["execute", "run"], ["utilize", "use"],
  ["at the present time", "now"], ["in operation", "already running"],
  ["eliminates the necessity for an additional service", "avoids adding another service"],
  ["facilitate", "provide"], ["introduces more operational work", "adds operational work"],
]);

let examples = "# Examples\n\n";
examples += "These are single-run examples. Each arm used a fresh session and the same task. Results can vary across runs.\n\n";
for (const { data } of datasets) examples += renderDataset(data);
examples += "## Simpler wording seen in the examples\n\n";
examples += "These pairs compare the source notes with skill output. They are examples, not a fixed replacement dictionary.\n\n";
examples += "| Source wording | Simpler wording |\n| --- | --- |\n";
for (const [from, to] of sourceTerms) examples += `| ${cell(from)} | ${cell(to)} |\n`;
examples += "\n## Method\n\n";
examples += "Run `npm run benchmark` for Codex or `npm run benchmark:claude` for Claude Code. Add `-- --model=MODEL` to choose another model.\n\n";
examples += `Raw results: ${datasets.map(({ path: item }) => `\`${item}\``).join(", ")}.\n\n`;
examples += "The test uses one run per arm, so it measures these samples, not universal model behavior. Output tokens are reported by each harness. Input tokens are not compared because they include host prompts and skill instructions. Required-fact checks use fixed regular expressions in `benchmark/cases.json`.\n";

fs.writeFileSync(path.join(root, "EXAMPLES.md"), examples);
console.log(`Wrote ${path.join(root, "EXAMPLES.md")}`);
