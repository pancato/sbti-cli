import fixture from '../fixtures/minimal-runtime-snapshot.json';

import { describe, expect, it } from 'vitest';

import { runtimeSnapshotSchema } from '../../src/data/schemas/snapshot';

describe('runtime snapshot schema', () => {
  it('accepts a normalized snapshot fixture', () => {
    const parsed = runtimeSnapshotSchema.parse(fixture);

    expect(parsed.version).toBeDefined();
    expect(parsed.questions.length).toBeGreaterThan(0);
  });
});
