import { existsSync, readFileSync } from 'node:fs';

export function parseScoreInput(input: string): Record<string, number> {
  const sourceText =
    existsSync(input) && !input.trim().startsWith('{')
      ? readFileSync(input, 'utf8')
      : input;

  const parsed = JSON.parse(sourceText) as Record<string, unknown>;

  return Object.fromEntries(
    Object.entries(parsed).map(([key, value]) => [key, Number(value)])
  );
}

export function parseBatchInput(inputPath: string): Array<{ id?: string; answers: Record<string, number> }> {
  const parsed = JSON.parse(readFileSync(inputPath, 'utf8')) as Array<{
    id?: string;
    answers: Record<string, unknown>;
  }>;

  return parsed.map((entry) => ({
    id: entry.id,
    answers: Object.fromEntries(
      Object.entries(entry.answers).map(([key, value]) => [key, Number(value)])
    )
  }));
}
