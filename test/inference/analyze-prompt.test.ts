import { describe, expect, it } from 'vitest';

import { analyzePrompt } from '../../src/core/inference/analyzePrompt';

describe('analyzePrompt', () => {
  it('returns an explicitly inferred result with warnings', async () => {
    const result = await analyzePrompt('喜欢计划、很强控制感、总想把事情安排好');

    expect(result.mode).toBe('inferred');
    expect(result.warning).toContain('inference');
    expect(result.primaryType.code).toBeDefined();
  });
});
