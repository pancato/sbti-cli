import { cac } from 'cac';

export interface CliRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function buildHelpText(): string {
  const cli = cac('sbti');

  cli.command('test', 'Run the interactive SBTI questionnaire');
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

export async function runCli(argv: string[]): Promise<CliRunResult> {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    return {
      exitCode: 0,
      stdout: buildHelpText(),
      stderr: ''
    };
  }

  return {
    exitCode: 1,
    stdout: '',
    stderr: `Unknown command: ${argv.join(' ')}`
  };
}
