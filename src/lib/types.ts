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

export type QuizResponse = {
  question: string;
  answers: string[];
  background: string;
  time: number;
  correct: number;
  points: number;
  useAlternativeTheme: boolean;
}[];
export interface QuizData {
  quizDuration: number;
  questions: Question[];
  correctAnswers?: number[];
}

export interface Question {
  question: string;
  answers: string[];
  time: number;
  useAlternativeTheme: boolean;
}

export interface Leader {
  name: string;
  phone: string;
}

export interface LeaderboardResponse {
  leaders: Leader[];
  place: number;
}
export interface InitResponse {
  serverTime: number;
  quizLaunchTime: number;
  lastResetTime: number | null;
}
export interface InitData {
  serverTime: number;
  quizLaunchTime: number;
  lastResetTime: number | null;
}

export interface LoginResponse {
  message?: string;
  serverTime?: string;
  conflict?: boolean;
}

export type QuizModel = {
  question: string;
  answers: string[];
  tillEnd: number;
  duration: number;
  useAlternativeTheme: boolean;
}[];
