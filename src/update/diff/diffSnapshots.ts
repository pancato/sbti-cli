import type { RuntimeSnapshot } from '../../core/types';

export function diffSnapshots(current: RuntimeSnapshot, next: RuntimeSnapshot) {
  return {
    currentVersion: current.version,
    nextVersion: next.version,
    questionCountDelta: next.questions.length - current.questions.length,
    specialQuestionCountDelta: next.specialQuestions.length - current.specialQuestions.length,
    typeCountDelta: next.types.length - current.types.length,
    templateCountDelta: next.templates.length - current.templates.length
  };
}
