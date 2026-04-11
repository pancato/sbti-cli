import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('repository docs', () => {
  it('declares MIT licensing and upstream attribution', () => {
    const readme = readFileSync('README.md', 'utf8');
    const notice = readFileSync('NOTICE', 'utf8');
    const license = readFileSync('LICENSE', 'utf8');

    expect(license).toContain('MIT License');
    expect(readme).toContain('MIT');
    expect(readme).toContain('offline-first');
    expect(notice).toContain('upstream');
  });
});
