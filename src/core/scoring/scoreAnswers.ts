import { buildScoreResult } from './buildScoreResult';
import { rankNormalTypes } from './matchTypes';

import type { BucketValue, RuntimeSnapshot, ScoreResult } from '../types';

function scoreToBucket(score: number): BucketValue {
  if (score <= 3) {
    return 'L';
  }

  if (score === 4) {
    return 'M';
  }

  return 'H';
}

export function scoreAnswers(
  snapshot: RuntimeSnapshot,
  answers: Record<string, number>
): ScoreResult {
  const rawScores = Object.fromEntries(
    snapshot.dimensions.map((dimension) => [dimension.code, 0])
  ) as Record<string, number>;

  for (const question of snapshot.questions) {
    rawScores[question.dimension] += Number(answers[question.id] ?? 0);
  }

  const levels = Object.fromEntries(
    snapshot.dimensions.map((dimension) => [
      dimension.code,
      scoreToBucket(rawScores[dimension.code])
    ])
  ) as Record<string, BucketValue>;

  const ranked = rankNormalTypes(snapshot, levels);
  const drinkTriggered = Number(answers.drink_gate_q2 ?? 0) === 2;

  return buildScoreResult(snapshot, rawScores, levels, ranked, drinkTriggered);
}
