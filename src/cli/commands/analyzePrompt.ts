import { analyzePrompt } from '../../core/inference/analyzePrompt';
import { formatTypeDetail } from '../ui/formatters';

export async function runAnalyzePromptCommand(
  args: string[],
  jsonMode: boolean,
  stdinText?: string
): Promise<{ exitCode: number; output: string; error?: string }> {
  const textIndex = args.indexOf('--text');
  const useStdin = args.includes('--stdin');
  const sourceText = textIndex !== -1 ? args[textIndex + 1] : useStdin ? stdinText : undefined;

  if (!sourceText?.trim()) {
    return {
      exitCode: 1,
      output: '',
      error: 'Missing prompt text. Use --stdin or --text.'
    };
  }

  const result = await analyzePrompt(sourceText);

  return {
    exitCode: 0,
    output: jsonMode
      ? JSON.stringify(result, null, 2)
      : [formatTypeDetail(result.primaryType, result.bestNormal.pattern), '', result.warning].join('\n')
  };
}
