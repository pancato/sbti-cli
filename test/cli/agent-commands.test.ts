import { describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/index';

describe('agent commands', () => {
  it('scores a single JSON payload', async () => {
    const result = await runCli([
      'score',
      '--answers',
      '{"q1":1,"q2":1,"q3":1,"q4":1,"q5":1,"q6":1,"q7":1,"q8":1,"q9":1,"q10":1,"q11":1,"q12":1,"q13":1,"q14":1,"q15":1,"q16":1,"q17":1,"q18":1,"q19":1,"q20":1,"q21":1,"q22":1,"q23":1,"q24":1,"q25":1,"q26":1,"q27":1,"q28":1,"q29":1,"q30":1}',
      '--json'
    ]);

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout).primaryType.code).toBeDefined();
  });

  it('processes a batch file', async () => {
    const result = await runCli(['batch', '--input', 'test/fixtures/batch-input.json', '--json']);

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout).results.length).toBeGreaterThan(0);
  });
});
