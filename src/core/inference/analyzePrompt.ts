import { buildScoreResult } from '../scoring/buildScoreResult';
import { rankNormalTypes } from '../scoring/matchTypes';
import { loadBundledSnapshot } from '../runtime/loadSnapshot';

import type { BucketValue, InferenceResult } from '../types';

const keywordRules: Array<{
  keywords: string[];
  assignments: Array<{ dimension: string; level: BucketValue }>;
}> = [
  {
    keywords: ['计划', '安排', '掌控', '控制', '有序', '秩序'],
    assignments: [
      { dimension: 'S2', level: 'H' },
      { dimension: 'A2', level: 'H' },
      { dimension: 'Ac2', level: 'H' },
      { dimension: 'Ac3', level: 'H' }
    ]
  },
  {
    keywords: ['目标', '成长', '上进', '推进', '执行', '结果'],
    assignments: [
      { dimension: 'S3', level: 'H' },
      { dimension: 'Ac1', level: 'H' },
      { dimension: 'Ac3', level: 'H' }
    ]
  },
  {
    keywords: ['边界', '独立', '空间'],
    assignments: [
      { dimension: 'E3', level: 'H' },
      { dimension: 'So2', level: 'H' }
    ]
  },
  {
    keywords: ['社恐', '慢热', '不主动'],
    assignments: [
      { dimension: 'So1', level: 'L' }
    ]
  },
  {
    keywords: ['社牛', '主动社交', '外向'],
    assignments: [
      { dimension: 'So1', level: 'H' }
    ]
  },
  {
    keywords: ['坦诚', '直接', '不绕弯'],
    assignments: [
      { dimension: 'So3', level: 'L' }
    ]
  },
  {
    keywords: ['体面', '圆滑', '场合'],
    assignments: [
      { dimension: 'So3', level: 'H' }
    ]
  },
  {
    keywords: ['不安全感', '敏感', '担心被抛弃'],
    assignments: [
      { dimension: 'E1', level: 'L' }
    ]
  },
  {
    keywords: ['信任', '稳定', '安全感'],
    assignments: [
      { dimension: 'E1', level: 'H' }
    ]
  }
];

function levelToScore(level: BucketValue): number {
  if (level === 'L') {
    return 2;
  }

  if (level === 'M') {
    return 4;
  }

  return 6;
}

export async function analyzePrompt(text: string): Promise<InferenceResult> {
  const snapshot = loadBundledSnapshot();
  const normalizedText = text.trim();
  const levels = Object.fromEntries(
    snapshot.dimensions.map((dimension) => [dimension.code, 'M'])
  ) as Record<string, BucketValue>;
  const matchedKeywords = new Set<string>();

  for (const rule of keywordRules) {
    if (rule.keywords.some((keyword) => normalizedText.includes(keyword))) {
      for (const keyword of rule.keywords) {
        if (normalizedText.includes(keyword)) {
          matchedKeywords.add(keyword);
        }
      }

      for (const assignment of rule.assignments) {
        levels[assignment.dimension] = assignment.level;
      }
    }
  }

  const rawScores = Object.fromEntries(
    snapshot.dimensions.map((dimension) => [dimension.code, levelToScore(levels[dimension.code])])
  ) as Record<string, number>;
  const ranked = rankNormalTypes(snapshot, levels);
  const baseResult = buildScoreResult(snapshot, rawScores, levels, ranked, false);
  const confidence = Math.min(0.9, 0.35 + matchedKeywords.size * 0.08);

  return {
    ...baseResult,
    mode: 'inferred',
    confidence,
    warning: 'This result is an inference, not an official questionnaire outcome.',
    matchedKeywords: [...matchedKeywords]
  };
}
