import { describe, expect, it } from 'vitest';

import { normalizeUpstreamPayload } from '../../src/update/normalize/normalizeUpstreamPayload';

describe('update path', () => {
  it('normalizes upstream payload into the runtime snapshot format', () => {
    const normalized = normalizeUpstreamPayload({
      version: 'fixture',
      questions: [
        {
          id: 'q1',
          dim: 'S1',
          text: '测试题',
          options: [
            { label: '低', value: 1 },
            { label: '高', value: 3 }
          ]
        }
      ],
      specialQuestions: [],
      typeLibrary: {
        CTRL: {
          code: 'CTRL',
          cn: '拿捏者',
          intro: 'intro',
          desc: 'desc'
        }
      },
      normalTypes: [{ code: 'CTRL', pattern: 'H' }],
      dimensions: {
        order: ['S1'],
        meta: {
          S1: {
            name: 'S1 自尊自信',
            model: '自我模型'
          }
        },
        explanations: {
          S1: {
            L: '低',
            M: '中',
            H: '高'
          }
        }
      }
    });

    expect(normalized.version).toBe('fixture');
    expect(normalized.types[0]?.code).toBe('CTRL');
  });
});
