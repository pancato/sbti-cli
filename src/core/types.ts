export const bucketValues = ['L', 'M', 'H'] as const;
export type BucketValue = (typeof bucketValues)[number];

export const typeCategories = ['normal', 'special'] as const;
export type TypeCategory = (typeof typeCategories)[number];

export interface QuestionOption {
  label: string;
  value: number;
}

export interface DimensionDefinition {
  code: string;
  name: string;
  model: string;
  tiers: Record<BucketValue, string>;
}

export interface QuestionDefinition {
  id: string;
  dimension: string;
  text: string;
  options: QuestionOption[];
}

export interface SpecialQuestionDefinition {
  id: string;
  kind: string;
  text: string;
  options: QuestionOption[];
}

export interface TypeDefinition {
  code: string;
  name: string;
  intro: string;
  description: string;
  category: TypeCategory;
  trigger?: string;
}

export interface TypeTemplateDefinition {
  code: string;
  pattern: string;
}

export interface RuntimeSnapshot {
  version: string;
  dimensions: DimensionDefinition[];
  questions: QuestionDefinition[];
  specialQuestions: SpecialQuestionDefinition[];
  types: TypeDefinition[];
  templates: TypeTemplateDefinition[];
}

export interface RankedTypeMatch extends TypeDefinition {
  pattern: string;
  distance: number;
  exact: number;
  similarity: number;
}

export interface DimensionScore {
  code: string;
  name: string;
  model: string;
  score: number;
  level: BucketValue;
  explanation: string;
}

export interface ScoreResult {
  rawScores: Record<string, number>;
  levels: Record<string, BucketValue>;
  resultPattern: string;
  resultVector: number[];
  ranked: RankedTypeMatch[];
  bestNormal: RankedTypeMatch;
  primaryType: TypeDefinition | RankedTypeMatch;
  secondaryType: RankedTypeMatch | null;
  dimensions: DimensionScore[];
  flags: {
    drinkTriggered: boolean;
    fallbackTriggered: boolean;
  };
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
}
