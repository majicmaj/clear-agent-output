# Comparison

These tools overlap, but they solve different problems.

| Tool | Main job | Output style | Keeps actions and state visible | Best fit |
|---|---|---|---|---|
| **Clear Agent Output** | Make agent replies fast to scan, concise, and complete | Short, grammatical plain English | Yes; preserves results, actions, risks, blockers, uncertainty, and proof | Everyday agent replies, status, errors, decisions, and explanations |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Minimize agent output tokens | Can drop articles and use fragments | Preserves critical technical facts, but action-state structure is not its main job | Maximum terseness and token reduction |
| [ASD-STE100](https://www.asd-ste100.org/) | Standardize technical documentation | Controlled vocabulary and grammar | Procedures separate instructions, but chat state is outside its scope | Formal technical documentation |
| [STE Plain Writing](https://github.com/Ryuketsukami/ste-plain-writing) | Apply STE-inspired rules to technical prose | Clear technical writing with optional linting | Preserves warnings and constraints, but is document-focused | READMEs, runbooks, API docs, and UI copy |
| [i-have-adhd](https://github.com/ayghri/i-have-adhd) | Reduce execution and working-memory friction | Action-first, numbered, state-aware | Yes; strongest emphasis on immediate action and cross-turn state | Task execution for readers who want ADHD-friendly support |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Minimize what a coding agent builds | Normal prose; minimal code and dependencies | Not its focus; it governs implementation choices | Preventing over-engineering in coding tasks |

## What this skill combines

- Caveman: remove filler and repetition.
- ASD-STE100: use clear terms, active voice, short sentences, and one action per step.
- i-have-adhd: expose the next action, current state, blockers, and completed work.
- Ponytail philosophy: keep only what earns its place, without cutting safety or correctness.

## Key difference

Clear Agent Output does not aim for the fewest possible tokens or full ASD-STE100 compliance. It aims for the shortest reply that remains grammatical, complete, and easy to act on.

It also avoids a forced template. `Next:` appears only when the user must act now. Detailed explanations stay detailed when the task needs them.

## Scope note

The table compares published rules and stated scope. It is not a head-to-head benchmark. ASD-STE100 is a copyrighted international standard; this project uses a small set of its general clarity principles and does not claim compliance.
