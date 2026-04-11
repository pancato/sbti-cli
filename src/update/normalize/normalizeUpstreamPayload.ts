import type { RuntimeSnapshot } from '../../core/types';

interface UpstreamQuestion {
  id: string;
  dim: string;
  text: string;
  options: Array<{ label: string; value: number }>;
}

interface UpstreamTypeLibraryEntry {
  code: string;
  cn: string;
  intro: string;
  desc: string;
}

interface UpstreamDimensions {
  order: string[];
  meta: Record<string, { name: string; model: string }>;
  explanations: Record<string, { L: string; M: string; H: string }>;
}

export interface UpstreamSnapshotPayload {
  version: string;
  questions: UpstreamQuestion[];
  specialQuestions: Array<{
    id: string;
    kind: string;
    text: string;
    options: Array<{ label: string; value: number }>;
  }>;
  typeLibrary: Record<string, UpstreamTypeLibraryEntry>;
  normalTypes: Array<{ code: string; pattern: string }>;
  specialTypes?: Array<{ code: string; trigger: string }>;
  dimensions: UpstreamDimensions;
}

export function normalizeUpstreamPayload(payload: UpstreamSnapshotPayload): RuntimeSnapshot {
  const normalTypeCodes = new Set(payload.normalTypes.map((entry) => entry.code));
  const specialTriggerMap = new Map(
    (payload.specialTypes ?? []).map((entry) => [entry.code, entry.trigger])
  );

  return {
    version: payload.version,
    dimensions: payload.dimensions.order.map((code) => ({
      code,
      name: payload.dimensions.meta[code].name,
      model: payload.dimensions.meta[code].model,
      tiers: payload.dimensions.explanations[code]
    })),
    questions: payload.questions.map((question) => ({
      id: question.id,
      dimension: question.dim,
      text: question.text,
      options: question.options
    })),
    specialQuestions: payload.specialQuestions.map((question) => ({
      id: question.id,
      kind: question.kind,
      text: question.text,
      options: question.options
    })),
    types: Object.values(payload.typeLibrary).map((type) => ({
      code: type.code,
      name: type.cn,
      intro: type.intro,
      description: type.desc,
      category: normalTypeCodes.has(type.code) ? 'normal' : 'special',
      trigger: specialTriggerMap.get(type.code)
    })),
    templates: payload.normalTypes.map((entry) => ({
      code: entry.code,
      pattern: entry.pattern
    }))
  };
}
