import { scoreAnswers } from '../scoring/scoreAnswers';

import type { QuestionDefinition, RuntimeSnapshot, ScoreResult, SpecialQuestionDefinition } from '../types';

function shuffleQuestions<T>(items: T[], random: () => number): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = shuffled[index];

    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = current;
  }

  return shuffled;
}

export function createSurveySession(snapshot: RuntimeSnapshot, random: () => number = Math.random) {
  const [drinkGateQuestion, drinkTriggerQuestion] = snapshot.specialQuestions;
  const shuffledQuestions = shuffleQuestions(snapshot.questions, random);
  const insertIndex = Math.floor(random() * shuffledQuestions.length) + 1;
  const baseVisibleQuestions = [
    ...shuffledQuestions.slice(0, insertIndex),
    drinkGateQuestion,
    ...shuffledQuestions.slice(insertIndex)
  ];
  const answers: Record<string, number> = {};
  let finalized = false;

  function getVisibleQuestions(): Array<QuestionDefinition | SpecialQuestionDefinition> {
    if (!drinkGateQuestion) {
      return shuffledQuestions;
    }

    const visibleQuestions = [...baseVisibleQuestions];
    const gateIndex = visibleQuestions.findIndex((question) => question.id === drinkGateQuestion.id);

    if (gateIndex !== -1 && answers[drinkGateQuestion.id] === 3 && drinkTriggerQuestion) {
      visibleQuestions.splice(gateIndex + 1, 0, drinkTriggerQuestion);
    }

    return visibleQuestions;
  }

  function getCurrentQuestion() {
    return getVisibleQuestions().find((question) => answers[question.id] === undefined) ?? null;
  }

  function getProgress() {
    const visibleQuestions = getVisibleQuestions();
    const done = visibleQuestions.filter((question) => answers[question.id] !== undefined).length;

    return {
      done,
      total: visibleQuestions.length,
      complete: visibleQuestions.length > 0 && done === visibleQuestions.length
    };
  }

  return {
    getAnswers() {
      return { ...answers };
    },
    getVisibleQuestions,
    getCurrentQuestion,
    getProgress,
    answerQuestion(questionId: string, value: number) {
      if (finalized) {
        throw new Error('This survey session has already been finalized.');
      }

      const currentQuestion = getCurrentQuestion();

      if (!currentQuestion) {
        throw new Error('All questions have already been answered.');
      }

      if (currentQuestion.id !== questionId) {
        throw new Error(`Expected answer for ${currentQuestion.id}, received ${questionId}.`);
      }

      answers[questionId] = Number(value);

      if (questionId === 'drink_gate_q1' && Number(value) !== 3) {
        delete answers.drink_gate_q2;
      }

      return getProgress();
    },
    computeResult(): ScoreResult {
      const progress = getProgress();

      if (!progress.complete) {
        throw new Error('All visible questions must be answered before computing a result.');
      }

      finalized = true;
      return scoreAnswers(snapshot, answers);
    }
  };
}
