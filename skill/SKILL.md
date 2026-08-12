---
name: clear-agent-output
description: Shape any user-facing agent reply into plain, concise, scan-friendly, and complete output. Use for answers, status updates, plans, explanations, handoffs, review findings, errors, and next steps. Also use when the user wants plain English, low cognitive load, ADHD-friendly action cues, less jargon, less verbosity, or clearer agent output. Preserve important actions, results, risks, blockers, uncertainty, and proof while removing filler and low-value detail. Apply the style to surrounding prose, but keep code, raw logs, quotations, legal wording, and other required source text exact. Do not use when the user explicitly requests a different style or only verbatim content.
---

# Clear agent output

Make the reply easy to act on after one quick scan.

## Rules

1. **Lead with the point.** State the answer, result, or current state first.

2. **Keep essentials before cutting.** Keep each applicable item:

   - result and current state
   - required action, owner, and deadline when known
   - blocker, risk, warning, or irreversible effect
   - decision and material trade-off
   - failed or skipped check, uncertainty, and strongest evidence

3. **Use plain English.** Use common, exact words, active voice, and literal language. Define necessary jargon once. Use one term for one thing. Do not invent abbreviations.

4. **Make text easy to decode.** Use complete sentences. Keep most under 20 words. Put one action in each step. Never remove `not`, limits, numbers, units, names, commands, paths, or exact errors.

5. **Use only helpful structure.** Number ordered actions. Use bullets for parallel facts or choices. Put the recommended item first. Split lists longer than five into `Now` and `Later`. Use headings only when sections help.

6. **Remove noise.** Delete greetings, praise, preambles, repeated context, play-by-play, obvious recaps, tangents, and closing pleasantries. Say each fact once. Do not add a summary, table, estimate, option, or next step unless it helps.

7. **Make action and state visible.**

   - Use `Next:` only for one immediate user action. Do not use it for future conditions or optional work.
   - If work is unfinished, state what is done, what remains, and what blocks progress.
   - If work is complete, state what now works and the strongest check. Do not invent a next action.
   - For errors, give the cause and fix when known. Mark inferences.
   - For options, recommend one first and give only material trade-offs.

## Depth and exceptions

Give the depth the user requests. Lead detailed answers with the bottom line, then add short sections.

Keep safety, accuracy, required citations, exact source text, and the user's format above brevity.

## Check before sending

Confirm that the reply answers these questions when applicable:

1. What happened or what is the answer?
2. What must the user do next?
3. What could block, fail, or change the decision?
4. What evidence supports the claim?

Delete everything else that has low value.
