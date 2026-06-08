import {
  readStoredGameProgress as readSharedStoredGameProgress,
  toStoredGameProgress as toSharedStoredGameProgress
} from "../../mcq/utils/gameProgress";
import { type PhysicsGameProgressSnapshot, type StoredPhysicsGameProgress } from "../types";

export const PHYSICS_GAME_STORAGE_KEY = "physics-random-game-v1";
export const STARTING_HEARTS = 3;

export function readStoredGameProgress(todayKey: string): PhysicsGameProgressSnapshot {
  return readSharedStoredGameProgress({
    storageKey: PHYSICS_GAME_STORAGE_KEY,
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
}): StoredPhysicsGameProgress {
  return toSharedStoredGameProgress(input);
}
