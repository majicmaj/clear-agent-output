const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const installer = path.join(__dirname, "..", "bin", "install.js");
const skillFile = path.join("skills", "clear-agent-output", "SKILL.md");

function run(args, options = {}) {
  return spawnSync(process.execPath, [installer, ...args], {
    cwd: options.cwd,
    env: {
      ...process.env,
      HOME: options.home ?? process.env.HOME,
      USERPROFILE: options.home ?? process.env.USERPROFILE,
    },
    encoding: "utf8",
  });
}

function makeTempDir(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "clear-agent-output-test-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test("installs user copies for shared agent harnesses and Claude Code", (t) => {
  const home = makeTempDir(t);
  const result = run([], { home });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(home, ".agents", skillFile)));
  assert.ok(fs.existsSync(path.join(home, ".claude", skillFile)));
});

test("installs both copies in the current project", (t) => {
  const project = makeTempDir(t);
  const result = run(["--project"], { cwd: project });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(project, ".agents", skillFile)));
  assert.ok(fs.existsSync(path.join(project, ".claude", skillFile)));
});

test("adds a missing Claude copy without replacing an existing shared copy", (t) => {
  const home = makeTempDir(t);
  const existing = path.join(home, ".agents", skillFile);
  fs.mkdirSync(path.dirname(existing), { recursive: true });
  fs.writeFileSync(existing, "keep me");

  const result = run([], { home });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(existing, "utf8"), "keep me");
  assert.ok(fs.existsSync(path.join(home, ".claude", skillFile)));
});

test("force replaces both installed copies", (t) => {
  const home = makeTempDir(t);

  for (const directory of [".agents", ".claude"]) {
    const target = path.join(home, directory, skillFile);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "old copy");
  }

  const result = run(["--force"], { home });

  assert.equal(result.status, 0, result.stderr);
  for (const directory of [".agents", ".claude"]) {
    const installed = fs.readFileSync(path.join(home, directory, skillFile), "utf8");
    assert.match(installed, /^---\nname: clear-agent-output/m);
  }
});
