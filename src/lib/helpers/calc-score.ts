import type { Question } from "$lib/types";

export const calcScore = (
  results: { answer: number; time: number }[],
  correctAnswers: number[]
) => {
  const score = results.reduce((acc, { answer }, idx) => {
    if (correctAnswers[idx] === answer) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
  return score;
};
