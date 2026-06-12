import { createClient } from "@/lib/supabase/client";
import type { ExamCatalogEntry, StudySubject } from "./study-data";

export type StoredExamResult = {
  subject: StudySubject;
  batchId: string;
  examCode: string;
  score: number;
  maxMark: number;
  percentage: number;
  answeredCount: number;
  timeTakenSeconds: number;
  completedAt: string;
};

export type StoredRevisionTopic = {
  id: string;
  title: string;
  subject: string;
  studiedOn: string;
  completedStepIndexes: number[];
  createdAt: string;
};

const SUBJECT_PROGRESS_KEYS: Record<string, StudySubject> = {
  "biology-random-game-v1": "Biology",
  "physics-random-game-v1": "Physics",
};

export const EXAM_RESULTS_UPDATED_EVENT = "exam-results-updated";

export async function syncExamCatalog(entries: ExamCatalogEntry[]) {
  const supabase = createClient();
  return supabase.from("exam_catalog").upsert(
    entries.map((entry) => ({
      subject: entry.subject,
      batch_id: entry.batchId,
      exam_code: entry.examCode,
      label: entry.label,
      units: entry.units,
      focus: entry.focus,
      target: entry.target,
      duration_seconds: entry.durationSeconds,
      question_count: entry.questionCount,
    })),
    { onConflict: "exam_code" }
  );
}

export async function fetchExamResults(userId: string): Promise<StoredExamResult[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exam_results")
    .select("subject, batch_id, exam_code, score, max_mark, percentage, answered_count, time_taken_seconds, completed_at")
    .eq("user_id", userId);

  if (error || !data) return [];

  return data.map((row) => ({
    subject: row.subject as StudySubject,
    batchId: row.batch_id,
    examCode: row.exam_code,
    score: row.score,
    maxMark: row.max_mark,
    percentage: row.percentage,
    answeredCount: row.answered_count,
    timeTakenSeconds: row.time_taken_seconds,
    completedAt: row.completed_at,
  }));
}

export async function saveExamResult(input: Omit<StoredExamResult, "completedAt"> & { completedAt?: string }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("exam_results").upsert(
    {
      user_id: user.id,
      subject: input.subject,
      batch_id: input.batchId,
      exam_code: input.examCode,
      score: input.score,
      max_mark: input.maxMark,
      percentage: input.percentage,
      answered_count: input.answeredCount,
      time_taken_seconds: input.timeTakenSeconds,
      completed_at: input.completedAt ?? new Date().toISOString(),
    },
    { onConflict: "user_id,exam_code" }
  );

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EXAM_RESULTS_UPDATED_EVENT));
  }
}

export async function fetchSubjectProgress(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subject_progress")
    .select("storage_key, payload")
    .eq("user_id", userId);

  if (error || !data) return [];
  return data;
}

export async function saveSubjectProgress(storageKey: string, payload: unknown) {
  const subject = SUBJECT_PROGRESS_KEYS[storageKey];
  if (!subject) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("subject_progress").upsert(
    {
      user_id: user.id,
      subject,
      storage_key: storageKey,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,storage_key" }
  );
}

export async function fetchRevisionTopics(userId: string): Promise<StoredRevisionTopic[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("spaced_revision_plans")
    .select("topics")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data?.topics || !Array.isArray(data.topics)) return [];
  return data.topics as StoredRevisionTopic[];
}

export async function saveRevisionTopics(topics: StoredRevisionTopic[]) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: null };
  }

  const result = await supabase.from("spaced_revision_plans").upsert(
    {
      user_id: user.id,
      topics,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  return { error: result.error ?? null };
}