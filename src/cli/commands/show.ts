import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';
import { formatTypeDetail } from '../ui/formatters';

import type { TypeDefinition } from '../../core/types';

function findTypeByCode(code: string): TypeDefinition | undefined {
  const snapshot = loadBundledSnapshot();

  return snapshot.types.find((type) => type.code.toUpperCase() === code.toUpperCase());
}

export function runShowCommand(code: string | undefined, jsonMode: boolean): { exitCode: number; output: string; error?: string } {
  if (!code) {
    return {
      exitCode: 1,
      output: '',
      error: 'Missing required type code.'
    };
  }

  const snapshot = loadBundledSnapshot();
  const type = findTypeByCode(code);

  if (!type) {
    return {
      exitCode: 1,
      output: '',
      error: `Unknown type code: ${code}`
    };
  }

  const template = snapshot.templates.find((entry) => entry.code === type.code);

  if (jsonMode) {
    return {
      exitCode: 0,
      output: JSON.stringify(
        {
          ...type,
          templatePattern: template?.pattern ?? null
        },
        null,
        2
      )
    };
  }

  return {
    exitCode: 0,
    output: formatTypeDetail(type, template?.pattern)
  };
}
