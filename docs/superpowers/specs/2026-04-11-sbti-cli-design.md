# SBTI CLI Design Spec

**Date:** 2026-04-11

**Status:** Approved in chat, documented for implementation

## Goal

Build a modern `sbti-cli` that brings the SBTI test into a local, agent-friendly command-line workflow.

The first release should support both:

- human-friendly interactive testing in the terminal
- machine-friendly structured commands for AI agents, scripts, and automations

The tool should be implemented with a modern TypeScript toolchain centered on Vite, ship as an npm CLI package, and remain fully usable offline by default through a bundled snapshot of SBTI data.

## Product Principles

1. **Dual-mode by default**
   The CLI should feel good for both humans and AI systems without forcing one mode to imitate the other.
2. **Offline-first**
   Normal use must not depend on live network access.
3. **Stable machine interface**
   JSON output, exit codes, and command behavior should be predictable enough for agent workflows.
4. **High-fidelity SBTI support**
   The original SBTI scoring model should be preserved where possible, with clear labeling when a feature is an inferred extension rather than an official-style result.
5. **Small, modern runtime**
   Keep dependencies light and focused. Prefer composable, minimal libraries over heavier legacy CLI stacks.

## Non-Goals for V1

- building a web UI
- bundling upstream artwork into the first implementation by default
- treating prompt-based inference as equivalent to the official questionnaire result
- multi-language support beyond an architecture that does not block it later
- deep analytics or telemetry

## User Personas

### Human User

Wants to run SBTI locally in a terminal, answer questions interactively, and inspect type or dimension details in a readable format.

### AI Agent

Wants deterministic commands, JSON output, predictable validation, and offline-safe access to SBTI scoring and reference data.

### Maintainer

Wants a clean TypeScript codebase, a modern build process, a documented update workflow, and legal clarity around repository code vs upstream SBTI content.

## Recommended Technical Stack

- **Language:** TypeScript
- **Build tool:** Vite
- **Runtime target:** Node.js CLI
- **Command parsing:** `cac`
- **Interactive prompts:** `@clack/prompts`
- **Terminal colors:** `yoctocolors`
- **Validation:** `zod`
- **Test runner:** Vitest
- **Formatting/linting:** to be chosen during implementation, but should favor a modern zero-drama setup

## Why This Stack

### Why not Commander

`Commander` is capable, but heavier and more old-school than needed for this project.

### Why not the legacy `prompts` package

`@clack/prompts` provides a cleaner modern interaction model with enough polish for a strong human CLI experience without committing us to a heavy TUI framework.

### Why Vite for a CLI

The goal is not to make the CLI behave like a frontend app. The goal is to use Vite as a modern TypeScript-first build layer that keeps the project ready for future package growth while still emitting a clean Node CLI artifact.

## V1 Scope

### Human-facing commands

- `sbti test`
- `sbti show <typeCode>`
- `sbti types`
- `sbti dimensions`
- `sbti update`

### Agent-facing commands

- `sbti score --answers <file|json>`
- `sbti batch --input <file>`
- `sbti export --format json`
- `sbti analyze-prompt --stdin`

## Command Design

### `sbti test`

Interactive questionnaire flow for terminal users.

Requirements:

- readable intro and outro
- single-question progression
- graceful cancel support
- final output in a visually clear terminal summary
- optional `--json` output for automation even when run from TTY

### `sbti show <typeCode>`

Displays a full type description for a standard or special SBTI type.

Requirements:

- accepts canonical type code
- prints category, Chinese name, intro, description, and dimension template when available
- supports `--json`

### `sbti types`

Lists all types in a compact format.

Requirements:

- type code
- Chinese name
- type category
- short summary
- `--json`

### `sbti dimensions`

Lists the 15 dimensions and their tier explanations.

Requirements:

- grouped view by model family
- ability to inspect tier meaning
- `--json`

### `sbti score --answers <file|json>`

Scores a provided answer set without interactive prompts.

Requirements:

- supports JSON object input
- validates shape before scoring
- returns fully structured output
- supports `stdin` in a follow-up enhancement if not included in the first cut

### `sbti batch --input <file>`

Processes multiple answer sets in one run.

Requirements:

- deterministic array-based input
- structured per-record success and failure reporting
- stable non-zero exit when the batch cannot be processed

### `sbti export --format json`

Exports normalized reference data for external use.

Requirements:

- dimensions
- type definitions
- normal templates
- snapshot version metadata

### `sbti analyze-prompt --stdin`

Agent extension feature that estimates a likely SBTI profile from a prompt, persona block, or behavior description.

Requirements:

- must be clearly labeled as inference
- must not claim to be an official questionnaire result
- should return confidence and warnings
- should produce structured JSON

### `sbti update`

Fetches and rebuilds the bundled snapshot from upstream references.

Requirements:

- network use only in this command path
- normalized snapshot output
- schema validation before accepting new data
- optional change summary

## Architecture

The project should be implemented as a single package in V1, but with internal module boundaries that make future extraction straightforward.

### Proposed source layout

```text
src/
  cli/
    index.ts
    commands/
    ui/
  core/
    runtime/
    scoring/
    inference/
    formatting/
  data/
    snapshot/
    schemas/
  update/
    fetch/
    normalize/
    diff/
```

### Responsibility boundaries

- `src/cli` handles argument parsing, TTY behavior, and human-facing rendering
- `src/core` contains all pure domain logic
- `src/data` owns the bundled snapshot and related schemas
- `src/update` handles remote synchronization and snapshot regeneration

The CLI layer must never reimplement scoring logic.

## Data Model

The system should normalize all bundled data into explicit TypeScript domain objects.

### Core entities

- `Question`
- `SpecialQuestion`
- `Dimension`
- `DimensionTierExplanation`
- `TypeTemplate`
- `TypeDefinition`
- `RuntimeSnapshot`
- `ScoreInput`
- `ScoreResult`
- `BatchScoreResult`
- `InferenceResult`

## Scoring Model

The runtime should preserve the original SBTI structure:

- 30 normal scoring questions
- 15 dimensions
- each dimension scored from 2 questions
- dimension bucketed into `L`, `M`, or `H`
- best normal type selected by template matching
- `DRUNK` hidden override branch
- `HHHH` fallback branch when the best normal similarity is too low

The implementation should make these rules inspectable and testable instead of burying them in CLI-specific code.

## Snapshot Strategy

The repository should bundle a local snapshot so the CLI works offline by default.

### Default behavior

- use bundled snapshot
- no network access during ordinary scoring or browsing commands

### Update behavior

`sbti update` should:

1. fetch upstream source data
2. parse and normalize it
3. validate it with schema checks
4. write the normalized snapshot
5. optionally print a change summary

If validation fails, the existing snapshot must remain untouched.

## Output Design

### Human output

Human-facing output should be attractive but restrained.

Use:

- `@clack/prompts` for intro, outro, selection, and spinner interactions
- `yoctocolors` for semantic color only
- a thin internal UI helper layer for reusable formatting

Avoid:

- excessive box drawing
- heavy TUI dependencies
- visual noise that makes output worse for copy/paste

### JSON output

JSON mode should be stable and explicit.

Proposed fields include:

- `mode`
- `resultType`
- `primaryType`
- `secondaryType`
- `similarity`
- `bestNormalSimilarity`
- `dimensions`
- `rawScores`
- `matchedTemplate`
- `warnings`
- `snapshotVersion`

Errors in JSON mode should also be structured JSON rather than plain terminal prose.

## Error Handling

Use categorized errors with stable codes, including:

- `CLI_USAGE_ERROR`
- `INPUT_VALIDATION_ERROR`
- `SNAPSHOT_LOAD_ERROR`
- `UPDATE_FETCH_ERROR`
- `UPDATE_PARSE_ERROR`
- `INFERENCE_NOT_DETERMINISTIC`

Exit codes should remain predictable so agents can branch safely on failures.

## Legal and Licensing

### Repository code license

This repository's original code and documentation should be released under the MIT License.

### Upstream SBTI content

Any upstream SBTI prompts, scoring data, long-form result copy, extracted artwork, or derived snapshots may have different ownership and usage constraints from the repository code itself.

The implementation must therefore keep these concerns separate:

- `LICENSE` should cover the repository's own code
- `README` should explain the distinction
- a `NOTICE` or equivalent attribution file should document upstream ownership and scope where needed

This split is important so the project does not accidentally imply that all embedded content is MIT just because the codebase is.

## Documentation Requirements for V1

The repository should include:

- `README.md`
- `LICENSE` with MIT text
- `NOTICE` or equivalent attribution file if bundled upstream content is included
- contributor-friendly setup instructions
- npm usage instructions
- clear explanation of offline snapshot vs update behavior

## Testing Strategy

V1 must include:

- snapshot schema tests
- scoring logic tests
- special branch tests for `DRUNK` and `HHHH`
- command behavior tests
- JSON output tests
- update-path parsing tests
- regression fixtures for known answer sets

## Release Expectations

The package should support:

- local development from the repo
- npm publication
- executable CLI entry via package `bin`

The first release does not need every possible extension, but it should already feel like a serious CLI foundation rather than a throwaway prototype.

## Recommended V1 Delivery Order

1. scaffold repository and tooling
2. establish snapshot schema and core runtime interfaces
3. implement scoring engine with tests
4. implement read-only commands (`types`, `show`, `dimensions`, `export`)
5. implement interactive `test`
6. implement machine commands (`score`, `batch`)
7. implement `update`
8. implement `analyze-prompt`
9. finalize documentation and npm packaging details

## Open Decisions Resolved in Chat

- product mode: `Dual-mode`
- data strategy: bundled snapshot plus optional update command
- release strategy: both repo-first and npm-publishable
- v1 scope: high-fidelity SBTI plus agent-oriented extensions
- preferred lightweight stack: `cac + @clack/prompts + yoctocolors`

## Ready for Next Step

Once this spec is reviewed, the next step is to write the implementation plan and then begin repository setup and TDD-based implementation.
