import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';
import { scoreAnswers } from '../../core/scoring/scoreAnswers';
import { parseBatchInput } from '../../core/scoring/parseScoreInput';

export function runBatchCommand(args: string[], jsonMode: boolean): { exitCode: number; output: string; error?: string } {
  const inputIndex = args.indexOf('--input');

  if (inputIndex === -1 || !args[inputIndex + 1]) {
    return {
      exitCode: 1,
      output: '',
      error: 'Missing required --input file path.'
    };
  }

  const snapshot = loadBundledSnapshot();
  const entries = parseBatchInput(args[inputIndex + 1]);
  const results = entries.map((entry, index) => ({
    id: entry.id ?? `record-${index + 1}`,
    result: scoreAnswers(snapshot, entry.answers)
  }));

  if (jsonMode) {
    return {
      exitCode: 0,
      output: JSON.stringify(
        {
          snapshotVersion: snapshot.version,
          results
        },
        null,
        2
      )
    };
  }

  return {
    exitCode: 0,
    output: results.map((entry) => `${entry.id}: ${entry.result.primaryType.code}`).join('\n')
  };
}
