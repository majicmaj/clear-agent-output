# Examples

These are single-run examples. Each arm used a fresh session and the same task. Results can vary across runs.

## Codex · gpt-5.6-terra

| Measure | Without skill | With skill | Change |
| --- | ---: | ---: | ---: |
| Output tokens | 181 | 178 | 2% fewer |
| Words | 132 | 126 | 5% fewer |
| Required facts kept | 17/19 | 19/19 | — |
| Sentences over 20 words | 0 | 0 | — |
| Flagged complex words | 1 | 1 | — |
| Correct `Next:` use | 2/3 | 3/3 | — |

### Completed work with one skipped check

**Prompt**

> Turn this internal note into a user-facing agent reply. Preserve every important fact.
>
> The cache-key defect was remediated in src/cache.ts and src/api.ts. All 42 unit tests completed successfully, and the linting process also completed successfully. The browser-based verification could not be executed because Chrome is not installed. No action is required from the user.

| Without skill | With skill |
| --- | --- |
| The cache-key issue has been fixed in `src/cache.ts` and `src/api.ts`.<br><br>All 42 unit tests and linting completed successfully. Browser verification could not run because Chrome isn’t installed.<br><br>No action is needed from you. | Fixed the cache-key defect in `src/cache.ts` and `src/api.ts`.<br><br>- All 42 unit tests passed.<br>- Linting passed.<br>- Browser verification was not run because Chrome is not installed.<br><br>No action is required. |

| Measure | Without | With |
| --- | ---: | ---: |
| Output tokens | 52 | 52 |
| Words | 38 | 33 |
| Required facts | 5/6 | 6/6 |
| Sentences over 20 words | 0 | 0 |

### Blocked deployment with one required action

**Prompt**

> Turn this internal note into a user-facing agent reply. Preserve every important fact and the exact command.
>
> The deployment procedure was not initiated because the AWS session expired. The local production build completed successfully. No production files or services were modified. The user must execute `aws sso login --profile billing-prod` and tell the agent when authentication finishes.

| Without skill | With skill |
| --- | --- |
| The deployment was not initiated because the AWS session expired. The local production build completed successfully, and no production files or services were modified.<br><br>Please run:<br><br>```bash<br>aws sso login --profile billing-prod<br>```<br><br>Let me know when authentication finishes. | Deployment did not start because the AWS session expired.<br><br>The local production build completed successfully. No production files or services were changed.<br><br>Next: Run `aws sso login --profile billing-prod` and tell me when authentication finishes. |

| Measure | Without | With |
| --- | ---: | ---: |
| Output tokens | 55 | 49 |
| Words | 38 | 35 |
| Required facts | 6/6 | 6/6 |
| Sentences over 20 words | 0 | 0 |

### Recommendation with measurable limits

**Prompt**

> Turn this decision note into a user-facing recommendation. Preserve every important fact.
>
> For this small service, utilize a PostgreSQL-backed queue at the present time. PostgreSQL is already in operation, so this choice eliminates the necessity for an additional service and is sufficient for the current load. Redis can facilitate lower latency and additional queue features, but it introduces more operational work. Reconsider Redis if measured queue delay exceeds 500 ms or throughput exceeds 1,000 jobs per second.

| Without skill | With skill |
| --- | --- |
| Use a PostgreSQL-backed queue for the service today. PostgreSQL is already running, so this avoids adding another service and is sufficient for the current workload.<br><br>Redis can provide lower latency and more queue features, but it adds operational overhead. Re-evaluate Redis if measured queue delay exceeds 500 ms or throughput exceeds 1,000 jobs per second. | Use a PostgreSQL-backed queue for this small service now.<br><br>PostgreSQL is already running, so this avoids adding another service. It is sufficient for the current load.<br><br>Redis can provide lower latency and more queue features, but it adds operational work.<br><br>Reconsider Redis if either measured queue delay exceeds 500 ms or throughput exceeds 1,000 jobs per second. |

| Measure | Without | With |
| --- | ---: | ---: |
| Output tokens | 74 | 77 |
| Words | 56 | 58 |
| Required facts | 6/7 | 7/7 |
| Sentences over 20 words | 0 | 0 |

## Claude Code · opus

| Measure | Without skill | With skill | Change |
| --- | ---: | ---: | ---: |
| Output tokens | 309 | 292 | 6% fewer |
| Words | 142 | 124 | 13% fewer |
| Required facts kept | 15/19 | 19/19 | — |
| Sentences over 20 words | 0 | 0 | — |
| Flagged complex words | 0 | 0 | — |
| Correct `Next:` use | 2/3 | 3/3 | — |

### Completed work with one skipped check

**Prompt**

> Turn this internal note into a user-facing agent reply. Preserve every important fact.
>
> The cache-key defect was remediated in src/cache.ts and src/api.ts. All 42 unit tests completed successfully, and the linting process also completed successfully. The browser-based verification could not be executed because Chrome is not installed. No action is required from the user.

| Without skill | With skill |
| --- | --- |
| Fixed the cache-key bug in `src/cache.ts` and `src/api.ts`.<br><br>- All 42 unit tests pass, and linting is clean.<br>- Browser-based verification did not run — Chrome isn't installed in this environment.<br><br>Nothing needed from you. | Fixed the cache-key defect in `src/cache.ts` and `src/api.ts`.<br><br>- All 42 unit tests passed.<br>- Linting passed.<br>- Browser verification did not run: Chrome is not installed.<br><br>No action needed from you. |

| Measure | Without | With |
| --- | ---: | ---: |
| Output tokens | 90 | 91 |
| Words | 36 | 33 |
| Required facts | 5/6 | 6/6 |
| Sentences over 20 words | 0 | 0 |

### Blocked deployment with one required action

**Prompt**

> Turn this internal note into a user-facing agent reply. Preserve every important fact and the exact command.
>
> The deployment procedure was not initiated because the AWS session expired. The local production build completed successfully. No production files or services were modified. The user must execute `aws sso login --profile billing-prod` and tell the agent when authentication finishes.

| Without skill | With skill |
| --- | --- |
| I didn't start the deployment — your AWS session has expired.<br><br>The local production build completed successfully. Nothing in production was modified: no files, no services.<br><br>To continue, run:<br><br>```<br>aws sso login --profile billing-prod<br>```<br><br>Let me know once you're authenticated and I'll pick up the deployment from there. | Deployment did not start. Your AWS session expired.<br><br>- The local production build completed successfully.<br>- No production files or services were changed.<br><br>Next: run `aws sso login --profile billing-prod`, then tell me when authentication finishes. |

| Measure | Without | With |
| --- | ---: | ---: |
| Output tokens | 99 | 75 |
| Words | 47 | 34 |
| Required facts | 3/6 | 6/6 |
| Sentences over 20 words | 0 | 0 |

### Recommendation with measurable limits

**Prompt**

> Turn this decision note into a user-facing recommendation. Preserve every important fact.
>
> For this small service, utilize a PostgreSQL-backed queue at the present time. PostgreSQL is already in operation, so this choice eliminates the necessity for an additional service and is sufficient for the current load. Redis can facilitate lower latency and additional queue features, but it introduces more operational work. Reconsider Redis if measured queue delay exceeds 500 ms or throughput exceeds 1,000 jobs per second.

| Without skill | With skill |
| --- | --- |
| Use a PostgreSQL-backed queue for this small service for now. PostgreSQL is already running, so this avoids adding another service, and it handles the current load fine.<br><br>Redis would give lower latency and more queue features, but it adds operational work. Revisit Redis if measured queue delay goes above 500 ms or throughput exceeds 1,000 jobs per second. | **Recommendation: use a PostgreSQL-backed queue for now.**<br><br>- PostgreSQL is already running, so this adds no new service.<br>- It handles the current load for this small service.<br>- Redis offers lower latency and more queue features, but adds operational work.<br><br>Revisit Redis if measured queue delay goes above 500 ms or throughput goes above 1,000 jobs per second. |

| Measure | Without | With |
| --- | ---: | ---: |
| Output tokens | 120 | 126 |
| Words | 59 | 57 |
| Required facts | 7/7 | 7/7 |
| Sentences over 20 words | 0 | 0 |

## Simpler wording seen in the examples

These pairs compare the source notes with skill output. They are examples, not a fixed replacement dictionary.

| Source wording | Simpler wording |
| --- | --- |
| remediated | fixed |
| completed successfully | passed |
| could not be executed | was not run |
| procedure was not initiated | did not start |
| modified | changed |
| execute | run |
| utilize | use |
| at the present time | now |
| in operation | already running |
| eliminates the necessity for an additional service | avoids adding another service |
| facilitate | provide |
| introduces more operational work | adds operational work |

## Method

Run `npm run benchmark` for Codex or `npm run benchmark:claude` for Claude Code. Add `-- --model=MODEL` to choose another model.

Raw results: `benchmark/results.json`, `benchmark/results-claude-opus.json`.

The test uses one run per arm, so it measures these samples, not universal model behavior. Output tokens are reported by each harness. Input tokens are not compared because they include host prompts and skill instructions. Required-fact checks use fixed regular expressions in `benchmark/cases.json`.
