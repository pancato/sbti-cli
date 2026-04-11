import { describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/index';

describe('read-only commands', () => {
  it('lists type codes in json mode', async () => {
    const result = await runCli(['types', '--json']);

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout).types.length).toBeGreaterThan(0);
  });

  it('shows a single type by code', async () => {
    const result = await runCli(['show', 'CTRL', '--json']);

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout).code).toBe('CTRL');
  });

  it('exports normalized snapshot data', async () => {
    const result = await runCli(['export', '--format', 'json']);

    expect(result.exitCode).toBe(0);

    const parsed = JSON.parse(result.stdout);

    expect(parsed.snapshotVersion).toBeDefined();
    expect(parsed.types.length).toBeGreaterThan(0);
    expect(parsed.dimensions.length).toBe(15);
  });
});
