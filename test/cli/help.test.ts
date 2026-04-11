import { describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/index';

describe('sbti help', () => {
  it('prints the root help text without throwing', async () => {
    const result = await runCli(['--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('sbti');
    expect(result.stdout).toContain('test');
  });
});
