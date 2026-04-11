#!/usr/bin/env node

import { runCli } from './index';

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

const argv = process.argv.slice(2);
const stdinText = argv.includes('--stdin') ? await readStdin() : undefined;
const result = await runCli(argv, { stdinText });

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

process.exit(result.exitCode);
