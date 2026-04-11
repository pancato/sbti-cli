import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';
import { diffSnapshots } from '../../update/diff/diffSnapshots';
import { fetchUpstreamSnapshot } from '../../update/fetch/fetchUpstreamSnapshot';

export async function runUpdateCommand(jsonMode: boolean): Promise<{
  exitCode: number;
  output: string;
  error?: string;
}> {
  const current = loadBundledSnapshot();
  const next = await fetchUpstreamSnapshot();
  const diff = diffSnapshots(current, next);

  if (jsonMode) {
    return {
      exitCode: 0,
      output: JSON.stringify(
        {
          snapshotVersion: next.version,
          diff,
          snapshot: next
        },
        null,
        2
      )
    };
  }

  return {
    exitCode: 0,
    output: [
      `Current snapshot: ${current.version}`,
      `Fetched snapshot: ${next.version}`,
      `Question delta: ${diff.questionCountDelta}`,
      `Type delta: ${diff.typeCountDelta}`,
      `Template delta: ${diff.templateCountDelta}`
    ].join('\n')
  };
}
