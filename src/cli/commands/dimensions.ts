import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';
import { formatDimensionsList } from '../ui/formatters';

export function runDimensionsCommand(jsonMode: boolean): string {
  const snapshot = loadBundledSnapshot();

  if (jsonMode) {
    return JSON.stringify(
      {
        snapshotVersion: snapshot.version,
        dimensions: snapshot.dimensions
      },
      null,
      2
    );
  }

  return formatDimensionsList(snapshot.dimensions);
}
