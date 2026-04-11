import { cac } from 'cac';

import { runDimensionsCommand } from './commands/dimensions';
import { runExportCommand } from './commands/export';
import { runShowCommand } from './commands/show';
import { runTestCommand } from './commands/test';
import { runTypesCommand } from './commands/types';
import type { TestDoubleInteraction } from './ui/prompts';

export interface CliRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface RunCliOptions {
  interaction?: TestDoubleInteraction;
}

function buildHelpText(): string {
  const cli = cac('sbti');

  cli.command('test', 'Run the interactive SBTI questionnaire');
  cli.command('types', 'List all SBTI types');
  cli.command('show <typeCode>', 'Show a single SBTI type');
  cli.command('dimensions', 'List the 15 SBTI dimensions');
  cli.command('export', 'Export normalized SBTI data');
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

  return {
    exitCode: 1,
    stdout: '',
    stderr: `Unknown command: ${argv.join(' ')}`
  };
}
