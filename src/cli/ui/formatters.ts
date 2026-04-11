import colors from 'yoctocolors';

import type { DimensionDefinition, RuntimeSnapshot, TypeDefinition } from '../../core/types';

export function formatTypesList(snapshot: RuntimeSnapshot): string {
  const header = colors.bold('SBTI Types');
  const lines = snapshot.types.map((type) => {
    const category = type.category === 'special' ? colors.yellow(type.category) : colors.green(type.category);

    return `${colors.cyan(type.code)}  ${type.name}  ${category}  ${type.intro}`;
  });

  return [header, ...lines].join('\n');
}

export function formatTypeDetail(type: TypeDefinition, templatePattern?: string): string {
  const lines = [
    `${colors.bold(colors.cyan(type.code))} · ${type.name}`,
    type.intro,
    '',
    type.description
  ];

  if (templatePattern) {
    lines.push('', `${colors.bold('Pattern')}: ${templatePattern}`);
  }

  if (type.trigger) {
    lines.push('', `${colors.bold('Trigger')}: ${type.trigger}`);
  }

  return lines.join('\n');
}

export function formatDimensionsList(dimensions: DimensionDefinition[]): string {
  const sections = dimensions.map((dimension) => {
    const tierText = `L ${dimension.tiers.L}\nM ${dimension.tiers.M}\nH ${dimension.tiers.H}`;

    return `${colors.bold(dimension.name)}\n${colors.gray(dimension.model)}\n${tierText}`;
  });

  return sections.join('\n\n');
}
