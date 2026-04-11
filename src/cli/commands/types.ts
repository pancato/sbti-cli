import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';
import { formatTypesList } from '../ui/formatters';

export function runTypesCommand(jsonMode: boolean): string {
  const snapshot = loadBundledSnapshot();

  if (jsonMode) {
    return JSON.stringify(
      {
        snapshotVersion: snapshot.version,
        types: snapshot.types.map((type) => ({
          code: type.code,
          name: type.name,
          category: type.category,
          intro: type.intro,
          trigger: type.trigger ?? null
        }))
      },
      null,
      2
    );
  }

  return formatTypesList(snapshot);
}
