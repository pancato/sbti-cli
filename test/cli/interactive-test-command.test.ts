import { describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/index';

describe('test command', () => {
  it('returns a structured cancel result when interaction is aborted', async () => {
    const result = await runCli(['test'], {
      interaction: { mode: 'test-double', answers: ['cancel'] }
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('cancelled');
  });

  it('can complete the questionnaire with canned answers and emit json', async () => {
    const result = await runCli(['test', '--json'], {
      interaction: { mode: 'test-double', answers: new Array(31).fill(1) }
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout).primaryType.code).toBeDefined();
  });
});
