import { type ExamQuestion } from "../ExamModule";

export type RandomQuestion = ExamQuestion & {
  randomId: string;
  batchId: string;
  batchUnits: string;
};

export type BatchExam = {
  examCode: string;
  label: string;
  focus?: string;
  target: number;
  durationSeconds: number;
  examQuestions: ExamQuestion[];
};

export type Batch = {
  id: string;
  label: string;
  units: string;
  focus: string;
  exams: BatchExam[];
};

export type StoredGameProgress = {
  version: number;
  hearts: number;
  currentStreak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  xp: number;
  daily: {
    date: string;
    answered: number;
    correct: number;
    streakMissionDone: boolean;
  };
};

export type GameProgressSnapshot = {
  hearts: number;
  currentStreak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  xp: number;
  dailyAnswered: number;
  dailyCorrect: number;
  dailyStreakMissionDone: boolean;
};
