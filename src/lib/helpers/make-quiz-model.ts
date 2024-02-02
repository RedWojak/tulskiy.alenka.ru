import type { Question } from "$lib/types";

export const makeQuizModel = (msTillStart: number, questions: Question[]) => {
  let prevTillEnd = msTillStart;
  const result = questions.map(({ question, answers, time, useAlternativeTheme, points }) => {
    const tillEnd = prevTillEnd + time;
    prevTillEnd = tillEnd;
    return {
      question,
      answers,
      tillEnd,
      duration: time,
      useAlternativeTheme,
      points
    };
  });
  return result;
};
