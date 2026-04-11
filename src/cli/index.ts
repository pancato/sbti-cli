import { cac } from 'cac';

import { runBatchCommand } from './commands/batch';
import { runAnalyzePromptCommand } from './commands/analyzePrompt';
import { runDimensionsCommand } from './commands/dimensions';
import { runExportCommand } from './commands/export';
import { runScoreCommand } from './commands/score';
import { runShowCommand } from './commands/show';
import { runTestCommand } from './commands/test';
import { runTypesCommand } from './commands/types';
import { runUpdateCommand } from './commands/update';
import type { TestDoubleInteraction } from './ui/prompts';

export interface CliRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface RunCliOptions {
  interaction?: TestDoubleInteraction;
  stdinText?: string;
}

function buildHelpText(): string {
  const cli = cac('sbti');

  cli.command('test', 'Run the interactive SBTI questionnaire');
  cli.command('types', 'List all SBTI types');
  cli.command('show <typeCode>', 'Show a single SBTI type');
  cli.command('dimensions', 'List the 15 SBTI dimensions');
  cli.command('export', 'Export normalized SBTI data');
  cli.command('score', 'Score a provided answer payload');
  cli.command('batch', 'Score multiple answer payloads from a file');
  cli.command('update', 'Fetch and normalize upstream SBTI data');
  cli.command('analyze-prompt', 'Infer a likely SBTI result from freeform text');
  cli.help();

  let output = '';
  const originalLog = console.log;

  console.log = (...args: unknown[]) => {
    output += `${args.join(' ')}\n`;
  };

  try {
    cli.outputHelp();
  } finally {
    console.log = originalLog;
  }

  return output;
}

function hasFlag(argv: string[], flag: string): boolean {
  return argv.includes(flag);
}

function readOptionValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  return argv[index + 1];
}

export async function runCli(argv: string[], options: RunCliOptions = {}): Promise<CliRunResult> {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    return {
      exitCode: 0,
      stdout: buildHelpText(),
      stderr: ''
    };
  }

  const command = argv[0];
  const jsonMode = hasFlag(argv, '--json');

  if (command === 'test') {
    const result = await runTestCommand({
      jsonMode,
      interaction: options.interaction
    });

    return {
      exitCode: result.exitCode,
      stdout: result.output,
      stderr: result.error ?? ''
    };
  }

  if (command === 'types') {
    return {
      exitCode: 0,
      stdout: runTypesCommand(jsonMode),
      stderr: ''
    };
  }

  if (command === 'show') {
    const result = runShowCommand(argv[1], jsonMode);

    return {
      exitCode: result.exitCode,
      stdout: result.output,
      stderr: result.error ?? ''
    };
  }

  if (command === 'dimensions') {
    return {
      exitCode: 0,
      stdout: runDimensionsCommand(jsonMode),
      stderr: ''
    };
  }

  if (command === 'export') {
    const result = runExportCommand(readOptionValue(argv, '--format'));

    return {
      exitCode: result.exitCode,
      stdout: result.output,
      stderr: result.error ?? ''
    };
  }

  if (command === 'score') {
    const result = runScoreCommand(argv.slice(1), jsonMode);

    return {
      exitCode: result.exitCode,
      stdout: result.output,
      stderr: result.error ?? ''
    };
  }

  if (command === 'batch') {
    const result = runBatchCommand(argv.slice(1), jsonMode);

    return {
      exitCode: result.exitCode,
      stdout: result.output,
      stderr: result.error ?? ''
    };
  }

  if (command === 'update') {
    const result = await runUpdateCommand(jsonMode);

    return {
      exitCode: result.exitCode,
      stdout: result.output,
      stderr: result.error ?? ''
    };
  }

  if (command === 'analyze-prompt') {
    const result = await runAnalyzePromptCommand(argv.slice(1), jsonMode, options.stdinText);

    return {
      exitCode: result.exitCode,
      stdout: result.output,
      stderr: result.error ?? ''
    };
  }

  return {
    exitCode: 1,
    stdout: '',
    stderr: `Unknown command: ${argv.join(' ')}`
  };
}
