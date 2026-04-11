import type { BucketValue, RankedTypeMatch, RuntimeSnapshot } from '../types';

const bucketToNumber: Record<BucketValue, number> = {
  L: 1,
  M: 2,
  H: 3
};

export function parsePattern(pattern: string): BucketValue[] {
  return pattern.replaceAll('-', '').split('') as BucketValue[];
}

export function rankNormalTypes(
  snapshot: RuntimeSnapshot,
  levels: Record<string, BucketValue>
): RankedTypeMatch[] {
  const dimensionOrder = snapshot.dimensions.map((dimension) => dimension.code);
  const userVector = dimensionOrder.map((dimensionCode) => bucketToNumber[levels[dimensionCode]]);
  const typeByCode = new Map(snapshot.types.map((type) => [type.code, type]));

  return snapshot.templates
    .map((template) => {
      const type = typeByCode.get(template.code);

      if (!type) {
        throw new Error(`Unknown type code in template list: ${template.code}`);
      }

      const vector = parsePattern(template.pattern).map((bucket) => bucketToNumber[bucket]);
      let distance = 0;
      let exact = 0;

      for (let index = 0; index < vector.length; index += 1) {
        const diff = Math.abs(userVector[index] - vector[index]);
        distance += diff;

        if (diff === 0) {
          exact += 1;
        }
      }

      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));

      return {
        ...type,
        pattern: template.pattern,
        distance,
        exact,
        similarity
      };
    })
    .sort((left, right) => {
      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }

      if (left.exact !== right.exact) {
        return right.exact - left.exact;
      }

      return right.similarity - left.similarity;
    });
}
