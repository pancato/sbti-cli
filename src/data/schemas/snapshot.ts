import { z } from 'zod';

export const bucketSchema = z.enum(['L', 'M', 'H']);

export const questionOptionSchema = z.object({
  label: z.string().min(1),
  value: z.number().int().positive()
});

export const dimensionSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  model: z.string().min(1),
  tiers: z.object({
    L: z.string().min(1),
    M: z.string().min(1),
    H: z.string().min(1)
  })
});

export const questionSchema = z.object({
  id: z.string().min(1),
  dimension: z.string().min(1),
  text: z.string().min(1),
  options: z.array(questionOptionSchema).min(1)
});

export const specialQuestionSchema = z.object({
  id: z.string().min(1),
  kind: z.string().min(1),
  text: z.string().min(1),
  options: z.array(questionOptionSchema).min(1)
});

export const typeDefinitionSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  intro: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['normal', 'special']),
  trigger: z.string().min(1).optional()
});

export const typeTemplateSchema = z.object({
  code: z.string().min(1),
  pattern: z.string().min(1)
});

export const runtimeSnapshotSchema = z.object({
  version: z.string().min(1),
  dimensions: z.array(dimensionSchema).min(1),
  questions: z.array(questionSchema).min(1),
  specialQuestions: z.array(specialQuestionSchema),
  types: z.array(typeDefinitionSchema).min(1),
  templates: z.array(typeTemplateSchema)
});

export type RuntimeSnapshotSchema = z.infer<typeof runtimeSnapshotSchema>;
