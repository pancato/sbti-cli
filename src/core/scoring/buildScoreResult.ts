import type {
  BucketValue,
  RankedTypeMatch,
  RuntimeSnapshot,
  ScoreResult,
  TypeDefinition
} from '../types';

function toResultPattern(levels: Record<string, BucketValue>, dimensionOrder: string[]): string {
  const pattern = dimensionOrder.map((dimensionCode) => levels[dimensionCode]).join('');

  return [
    pattern.slice(0, 3),
    pattern.slice(3, 6),
    pattern.slice(6, 9),
    pattern.slice(9, 12),
    pattern.slice(12, 15)
  ].join('-');
}

function toResultVector(levels: Record<string, BucketValue>, dimensionOrder: string[]): number[] {
  const bucketToNumber: Record<BucketValue, number> = {
    L: 1,
    M: 2,
    H: 3
  };

  return dimensionOrder.map((dimensionCode) => bucketToNumber[levels[dimensionCode]]);
}

function requireType(snapshot: RuntimeSnapshot, code: string): TypeDefinition {
  const matchedType = snapshot.types.find((type) => type.code === code);

  if (!matchedType) {
    throw new Error(`Unknown type code: ${code}`);
  }

  return matchedType;
}

export function buildScoreResult(
  snapshot: RuntimeSnapshot,
  rawScores: Record<string, number>,
  levels: Record<string, BucketValue>,
  ranked: RankedTypeMatch[],
  drinkTriggered: boolean
): ScoreResult {
  const dimensionOrder = snapshot.dimensions.map((dimension) => dimension.code);
  const resultPattern = toResultPattern(levels, dimensionOrder);
  const resultVector = toResultVector(levels, dimensionOrder);
  const bestNormal = ranked[0];
  const fallbackTriggered = !drinkTriggered && bestNormal.similarity < 60;

  let primaryType: TypeDefinition | RankedTypeMatch = bestNormal;
  let secondaryType: RankedTypeMatch | null = null;
  let modeKicker = '你的主类型';
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
  let special = false;

  if (drinkTriggered) {
    primaryType = requireType(snapshot, 'DRUNK');
    secondaryType = bestNormal;
    modeKicker = '隐藏人格已激活';
    badge = '匹配度 100% · 酒精异常因子已接管';
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
    special = true;
  } else if (fallbackTriggered) {
    primaryType = requireType(snapshot, 'HHHH');
    modeKicker = '系统强制兜底';
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
    special = true;
  }

  return {
    rawScores,
    levels,
    resultPattern,
    resultVector,
    ranked,
    bestNormal,
    primaryType,
    secondaryType,
    dimensions: snapshot.dimensions.map((dimension) => ({
      code: dimension.code,
      name: dimension.name,
      model: dimension.model,
      score: rawScores[dimension.code],
      level: levels[dimension.code],
      explanation: dimension.tiers[levels[dimension.code]]
    })),
    flags: {
      drinkTriggered,
      fallbackTriggered
    },
    modeKicker,
    badge,
    sub,
    special
  };
}
