export interface LoginRequest {
  name: string;
  phone: string;
}

export interface AnswersRequest {
  phone: string;
  results: { answer: number; time: number }[];
}

export interface Result {
  answers: {
    answer: number;
    time: number;
  }[];
  lastResetTime: null | number;
}

export interface User {
  phone: string;
  name: string;
  lastResetTime: null | number;
}

export const Themes = {
  Main: "main-theme",
  Alternative: "alternative-theme"
} as const;

export const Stages = {
  Standby: 0,
  Running: 1,
  Finished: 2,
  Pending: 3
} as const;

export type Stage = (typeof Stages)[keyof typeof Stages];

export interface Question {
  question: string;
  answers: string[];
  background: string;
  time: number;
  correct: number;
  points: number;
  useAlternativeTheme: boolean;
}

export interface Leader {
  name: string;
  phone: string;
}

export interface LeaderboardResponse {
  leaders: Leader[];
  winningPosition: number;
}

export interface InitData {
  serverTime: number;
  startTime: number;
  lastResetTime: number | null;
}

export interface LoginResponse {
  message: string;
  serverTime: string;
}
