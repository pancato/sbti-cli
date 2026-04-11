import { cancel, intro, isCancel, outro, select } from '@clack/prompts';

import type { QuestionDefinition, SpecialQuestionDefinition } from '../../core/types';

export type InteractionAnswer = number | 'cancel';

export interface TestDoubleInteraction {
  mode: 'test-double';
  answers: InteractionAnswer[];
}

export interface PromptAdapter {
  intro(message: string): void;
  outro(message: string): void;
  cancel(message: string): void;
  choose(
    question: QuestionDefinition | SpecialQuestionDefinition,
    progressLabel: string
  ): Promise<number | null>;
}

function createHumanPromptAdapter(): PromptAdapter {
  return {
    intro(message: string) {
      intro(message);
    },
    outro(message: string) {
      outro(message);
    },
    cancel(message: string) {
      cancel(message);
    },
    async choose(question, progressLabel) {
      const value = await select({
        message: `${progressLabel} ${question.text}`,
        options: question.options.map((option) => ({
          label: option.label,
          value: option.value
        }))
      });

      if (isCancel(value)) {
        return null;
      }

      return Number(value);
    }
  };
}

function createTestDoublePromptAdapter(interaction: TestDoubleInteraction): PromptAdapter {
  let index = 0;

  return {
    intro() {},
    outro() {},
    cancel() {},
    async choose() {
      const answer = interaction.answers[index];
      index += 1;

      if (answer === 'cancel' || answer === undefined) {
        return null;
      }

      return Number(answer);
    }
  };
}

export function createPromptAdapter(interaction?: TestDoubleInteraction): PromptAdapter {
  if (interaction?.mode === 'test-double') {
    return createTestDoublePromptAdapter(interaction);
  }

  return createHumanPromptAdapter();
}
