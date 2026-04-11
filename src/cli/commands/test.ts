import { createSurveySession } from '../../core/runtime/createSurveySession';
import { loadBundledSnapshot } from '../../core/runtime/loadSnapshot';
import { formatTypeDetail } from '../ui/formatters';
import { createPromptAdapter } from '../ui/prompts';

import type { TestDoubleInteraction } from '../ui/prompts';

function formatResultSummary(result: Awaited<ReturnType<typeof createSurveySession>>['computeResult'] extends () => infer T ? T : never) {
  const lines = [
    formatTypeDetail(result.primaryType, 'pattern' in result.bestNormal ? result.bestNormal.pattern : undefined),
    '',
    result.badge,
    result.sub
  ];

  if (result.secondaryType) {
    lines.push('', `Secondary type: ${result.secondaryType.code}`);
  }

  return lines.join('\n');
}

export async function runTestCommand(options: {
  jsonMode: boolean;
  interaction?: TestDoubleInteraction;
}): Promise<{ exitCode: number; output: string; error?: string }> {
  const snapshot = loadBundledSnapshot();
  const promptAdapter = createPromptAdapter(options.interaction);
  const session = createSurveySession(snapshot);

  promptAdapter.intro('SBTI CLI');

  while (!session.getProgress().complete) {
    const currentQuestion = session.getCurrentQuestion();

    if (!currentQuestion) {
      break;
    }

    const progress = session.getProgress();
    const answer = await promptAdapter.choose(
      currentQuestion,
      `Question ${progress.done + 1} / ${progress.total}`
    );

    if (answer === null) {
      promptAdapter.cancel('Test cancelled.');

      return {
        exitCode: 1,
        output: '',
        error: 'Test cancelled.'
      };
    }

    session.answerQuestion(currentQuestion.id, answer);
  }

  const result = session.computeResult();
  const output = options.jsonMode
    ? JSON.stringify(result, null, 2)
    : formatResultSummary(result);

  promptAdapter.outro('Done');

  return {
    exitCode: 0,
    output
  };
}
