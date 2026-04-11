import runtimeSnapshotJson from '../../data/snapshot/runtime-snapshot.json';
import { runtimeSnapshotSchema } from '../../data/schemas/snapshot';
import type { RuntimeSnapshot } from '../types';

let cachedSnapshot: RuntimeSnapshot | null = null;

export function loadBundledSnapshot(): RuntimeSnapshot {
  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  cachedSnapshot = runtimeSnapshotSchema.parse(runtimeSnapshotJson);
  return cachedSnapshot;
}
