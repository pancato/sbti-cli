# sbti-cli 🧠

An offline-first, dual-mode SBTI CLI for humans and AI agents.

`sbti-cli` is being built as a modern TypeScript command-line tool that brings
SBTI into an agent-friendly workflow. The project aims to support:

- interactive terminal testing for human users
- stable JSON interfaces for AI and automation
- bundled local snapshot data for offline-first usage
- optional upstream refresh commands when you explicitly want new data

## Installation 🚀

You can install `sbti-cli` globally using your favorite package manager:

```bash
# Using npm
npm install -g @pancato/sbti-cli

# Using pnpm
pnpm add -g @pancato/sbti-cli

# Using yarn
yarn global add @pancato/sbti-cli
```

## Status

The project is already usable in local development. The current implementation
includes:

- interactive `sbti test`
- read-only reference commands such as `types`, `show`, and `dimensions`
- machine-oriented `score`, `batch`, and `export`
- `update` for fetching and normalizing upstream data
- `analyze-prompt` for explicit heuristic inference

## Tech Stack

- TypeScript
- Vite
- Vitest
- `cac`
- `@clack/prompts`
- `yoctocolors`
- `zod`

## Command Surface

Human-friendly commands:

- `sbti test`
- `sbti show <typeCode>`
- `sbti types`
- `sbti dimensions`
- `sbti update`

Agent-friendly commands:

- `sbti score --answers <file|json>`
- `sbti batch --input <file>`
- `sbti export --format json`
- `sbti analyze-prompt --stdin`

### AI Agent Integration 🤖

`sbti-cli` is specifically designed to be called by AI Agents (like GPT-4, Claude, or local LLMs).

1.  **JSON Output**: Always use the `--json` flag to get machine-readable output. This allows agents to parse results without regex.
2.  **Stateless Scoring**: Use `sbti score --answers '{"q1": 1, ...}' --json` to perform calculations without managing local state.
3.  **Heuristic Inference**: Agents can pipe user descriptions into `sbti analyze-prompt --stdin --json` to get a preliminary SBTI type inference based on text analysis.
4.  **Reference Data**: Agents can use `sbti types --json` or `sbti show <TYPE> --json` to look up personality descriptions and characteristics to provide better context in conversations.

## Example Usage

Run the interactive test:

```bash
node ./dist/bin/sbti.js test
```

Score a JSON payload:

```bash
node ./dist/bin/sbti.js score --answers '{"q1":1,"q2":1,"q3":1,"q4":1,"q5":1,"q6":1,"q7":1,"q8":1,"q9":1,"q10":1,"q11":1,"q12":1,"q13":1,"q14":1,"q15":1,"q16":1,"q17":1,"q18":1,"q19":1,"q20":1,"q21":1,"q22":1,"q23":1,"q24":1,"q25":1,"q26":1,"q27":1,"q28":1,"q29":1,"q30":1}' --json
```

Inspect a type:

```bash
node ./dist/bin/sbti.js show CTRL --json
```

Infer from freeform text:

```bash
printf '喜欢计划、很强控制感、总想把事情安排好' | sbti analyze-prompt --stdin --json
```

## Development

Install dependencies:

```bash
npm install --registry=https://registry.npmjs.org/
```

Run tests:

```bash
npm test
```

Run type-checking:

```bash
npm run typecheck
```

Build the CLI:

```bash
npm run build
```

## Repository Documents

- Design spec: [docs/superpowers/specs/2026-04-11-sbti-cli-design.md](docs/superpowers/specs/2026-04-11-sbti-cli-design.md)
- Implementation plan: [docs/superpowers/plans/2026-04-11-sbti-cli.md](docs/superpowers/plans/2026-04-11-sbti-cli.md)

## License

This repository's original code is licensed under MIT. See [LICENSE](LICENSE).

Important: upstream SBTI content is a separate matter. If this project later
bundles questionnaire text, type descriptions, normalized snapshots, or other
derived upstream material, that content is not automatically MIT. See
[NOTICE](NOTICE) for the attribution and ownership boundary.
