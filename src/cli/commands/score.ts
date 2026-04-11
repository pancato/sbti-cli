import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';
import { scoreAnswers } from '../../core/scoring/scoreAnswers';
import { parseScoreInput } from '../../core/scoring/parseScoreInput';
import { formatTypeDetail } from '../ui/formatters';

export function runScoreCommand(args: string[], jsonMode: boolean): { exitCode: number; output: string; error?: string } {
  const answersIndex = args.indexOf('--answers');

  if (answersIndex === -1 || !args[answersIndex + 1]) {
    return {
      exitCode: 1,
      output: '',
      error: 'Missing required --answers payload.'
    };
  }

  const snapshot = loadBundledSnapshot();
  const answers = parseScoreInput(args[answersIndex + 1]);
  const result = scoreAnswers(snapshot, answers);

  return {
    exitCode: 0,
    output: jsonMode
      ? JSON.stringify(result, null, 2)
      : formatTypeDetail(result.primaryType, result.bestNormal.pattern)
  };
}
