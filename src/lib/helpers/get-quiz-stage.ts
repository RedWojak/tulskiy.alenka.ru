import { LEADERS_DATA_LOAD_DELAY } from "$lib/constants/intervals";
import { Stages } from "$lib/types";

export const getQuizStage = (msTillStart: number, duration: number) => {
  if (msTillStart > 0) return Stages.Standby;
  if (Math.abs(msTillStart) < duration + LEADERS_DATA_LOAD_DELAY) return Stages.Running;
  return Stages.Finished;
};
