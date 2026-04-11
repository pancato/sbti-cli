import { describe, expect, it } from 'vitest';

import { loadBundledSnapshot } from '../../src/core/runtime/loadSnapshot';
import { scoreAnswers } from '../../src/core/scoring/scoreAnswers';

function buildAnswersForPattern(
  pattern: string,
  drinkAnswers: Record<string, number> = { drink_gate_q1: 1 }
) {
  const snapshot = loadBundledSnapshot();
  const questionsByDimension = new Map<string, string[]>();

  for (const question of snapshot.questions) {
    const entries = questionsByDimension.get(question.dimension) ?? [];
    entries.push(question.id);
    questionsByDimension.set(question.dimension, entries);
  }

  const levelAnswers = {
    L: [1, 1],
    M: [1, 3],
    H: [3, 3]
  } as const;

  const answers: Record<string, number> = { ...drinkAnswers };

  snapshot.dimensions.forEach((dimension, index) => {
    const level = pattern[index] as keyof typeof levelAnswers;
    const [firstAnswer, secondAnswer] = levelAnswers[level];
    const [firstQuestionId, secondQuestionId] = questionsByDimension.get(dimension.code) ?? [];

    answers[firstQuestionId] = firstAnswer;
    answers[secondQuestionId] = secondAnswer;
  });

  return answers;
}

describe('scoreAnswers', () => {
  it('maps valid answers into dimension buckets and returns the expected normal type', () => {
    const snapshot = loadBundledSnapshot();
    const result = scoreAnswers(snapshot, buildAnswersForPattern('HHHHMHMHHHHHMHM'));

    expect(result.dimensions).toHaveLength(15);
    expect(result.resultPattern).toBe('HHH-HMH-MHH-HHH-MHM');
    expect(result.primaryType.code).toBe('CTRL');
    expect(result.bestNormal.code).toBe('CTRL');
    expect(result.flags.drinkTriggered).toBe(false);
  });

  it('returns DRUNK when the hidden drink trigger is selected', () => {
    const snapshot = loadBundledSnapshot();
    const result = scoreAnswers(
      snapshot,
      buildAnswersForPattern('HHHHHHHHHHHHHHH', {
        drink_gate_q1: 3,
        drink_gate_q2: 2
      })
    );

    expect(result.primaryType.code).toBe('DRUNK');
    expect(result.secondaryType?.code).toBe(result.bestNormal.code);
    expect(result.flags.drinkTriggered).toBe(true);
    expect(result.flags.fallbackTriggered).toBe(false);
  });

  it('falls back to HHHH when the best normal match stays below 60 percent', () => {
    const snapshot = loadBundledSnapshot();
    const result = scoreAnswers(snapshot, buildAnswersForPattern('LLLLLLMLLHHHHML'));

    expect(result.primaryType.code).toBe('HHHH');
    expect(result.bestNormal.similarity).toBeLessThan(60);
    expect(result.flags.drinkTriggered).toBe(false);
    expect(result.flags.fallbackTriggered).toBe(true);
  });
});
