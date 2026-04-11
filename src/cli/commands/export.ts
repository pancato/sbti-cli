import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';

export function runExportCommand(format: string | undefined): { exitCode: number; output: string; error?: string } {
  const snapshot = loadBundledSnapshot();
  const resolvedFormat = format ?? 'json';

  if (resolvedFormat !== 'json') {
    return {
      exitCode: 1,
      output: '',
      error: `Unsupported export format: ${resolvedFormat}`
    };
  }

  return {
    exitCode: 0,
    output: JSON.stringify(
      {
        snapshotVersion: snapshot.version,
        dimensions: snapshot.dimensions,
        types: snapshot.types,
        templates: snapshot.templates
      },
      null,
      2
    )
  };
}
