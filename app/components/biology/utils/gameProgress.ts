import {
  readStoredGameProgress as readSharedStoredGameProgress,
  toStoredGameProgress as toSharedStoredGameProgress
} from "../../mcq/utils/gameProgress";
import { type GameProgressSnapshot, type StoredGameProgress } from "../../mcq/types";

export const BIOLOGY_GAME_STORAGE_KEY = "biology-random-game-v1";
export const STARTING_HEARTS = 3;

export function readStoredGameProgress(todayKey: string): GameProgressSnapshot {
  return readSharedStoredGameProgress({
    storageKey: BIOLOGY_GAME_STORAGE_KEY,
    todayKey,
    startingHearts: STARTING_HEARTS
  });
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
  return toSharedStoredGameProgress(input);
}
