import { type GameProgressSnapshot, type StoredGameProgress } from "../types";
import { safeReadStorageJson } from "./storage";

export function createDefaultProgress(startingHearts: number): GameProgressSnapshot {
  return {
    hearts: startingHearts,
    currentStreak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    xp: 0,
    dailyAnswered: 0,
    dailyCorrect: 0,
    dailyStreakMissionDone: false
  };
}

export function readStoredGameProgress(params: {
  storageKey: string;
  todayKey: string;
  startingHearts: number;
}): GameProgressSnapshot {
  const { storageKey, todayKey, startingHearts } = params;
  const defaults = createDefaultProgress(startingHearts);

  const parsed = safeReadStorageJson<StoredGameProgress>(storageKey);
  if (!parsed || typeof parsed !== "object") return defaults;

  const isToday = parsed.daily?.date === todayKey;

  return {
    hearts: typeof parsed.hearts === "number" ? Math.max(0, Math.min(startingHearts, parsed.hearts)) : startingHearts,
    currentStreak: typeof parsed.currentStreak === "number" ? Math.max(0, parsed.currentStreak) : 0,
    bestStreak: typeof parsed.bestStreak === "number" ? Math.max(0, parsed.bestStreak) : 0,
    totalAnswered: typeof parsed.totalAnswered === "number" ? Math.max(0, parsed.totalAnswered) : 0,
    totalCorrect: typeof parsed.totalCorrect === "number" ? Math.max(0, parsed.totalCorrect) : 0,
    xp: typeof parsed.xp === "number" ? Math.max(0, parsed.xp) : 0,
    dailyAnswered: isToday && typeof parsed.daily?.answered === "number" ? Math.max(0, parsed.daily.answered) : 0,
    dailyCorrect: isToday && typeof parsed.daily?.correct === "number" ? Math.max(0, parsed.daily.correct) : 0,
    dailyStreakMissionDone: isToday ? Boolean(parsed.daily?.streakMissionDone) : false
  };
}

export function toStoredGameProgress(input: {
  hearts: number;
  currentStreak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  xp: number;
  todayKey: string;
  dailyAnswered: number;
  dailyCorrect: number;
  dailyStreakMissionDone: boolean;
}): StoredGameProgress {
  return {
    version: 1,
    hearts: input.hearts,
    currentStreak: input.currentStreak,
    bestStreak: input.bestStreak,
    totalAnswered: input.totalAnswered,
    totalCorrect: input.totalCorrect,
    xp: input.xp,
    daily: {
      date: input.todayKey,
      answered: input.dailyAnswered,
      correct: input.dailyCorrect,
      streakMissionDone: input.dailyStreakMissionDone
    }
  };
}
