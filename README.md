# sbti-cli

An offline-first, dual-mode SBTI CLI for humans and AI agents.

`sbti-cli` is being built as a modern TypeScript command-line tool that brings
SBTI into an agent-friendly workflow. The project aims to support:

- interactive terminal testing for human users
- stable JSON interfaces for AI and automation
- bundled local snapshot data for offline-first usage
- optional upstream refresh commands when you explicitly want new data

## Status

The repository is in active development. The initial scaffold, design spec, and
implementation plan are already committed, and the CLI foundation is now being
built incrementally with TDD.

## Tech Stack

- TypeScript
- Vite
- Vitest
- `cac`
- `@clack/prompts`
- `yoctocolors`
- `zod`

## Planned Command Surface

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
