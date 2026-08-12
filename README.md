# Clear Agent Output

Make AI agent replies short, clear, complete, and easy to act on.

## Install

```sh
npx clear-agent-output
```

Restart your agent. The skill can activate automatically, or you can use:

```text
$clear-agent-output
```

To install it only in the current project:

```sh
npx clear-agent-output --project
```

The skill keeps results, actions, risks, blockers, uncertainty, and proof. It removes filler and low-value detail.

See [examples and benchmark results](EXAMPLES.md) or [compare related skills](COMPARISON.md).

Run the benchmark again:

```sh
npm run benchmark -- --model=gpt-5.6-terra
```

Inspired by [Caveman](https://github.com/JuliusBrussee/caveman), [Ponytail](https://github.com/DietrichGebert/ponytail), [i-have-adhd](https://github.com/ayghri/i-have-adhd), and [ASD-STE100](https://www.asd-ste100.org/).

MIT License.
