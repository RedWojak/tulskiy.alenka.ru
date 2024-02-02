import type { Question } from "$lib/types";

export const calcScore = (results: { answer: number; time: number }[], quiz: Question[]) => {
  const score = results.reduce((acc, { answer }, idx) => {
    if (quiz[idx].correct === answer) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
  return score;
};
