import { BIOLOGY_BATCHES } from "@/app/components/biology/data";
import { PHYSICS_BATCHES } from "@/app/components/physics/data";

export type StudySubject = "Biology" | "Physics";

export type ExamCatalogEntry = {
  subject: StudySubject;
  batchId: string;
  examCode: string;
  label: string;
  units: string;
  focus: string;
  target: number;
  durationSeconds: number;
  questionCount: number;
};

export const EXAM_CATALOG: ExamCatalogEntry[] = [
  ...BIOLOGY_BATCHES.flatMap((batch) =>
    batch.exams.map((exam) => ({
      subject: "Biology" as const,
      batchId: batch.id,
      examCode: exam.examCode,
      label: exam.label,
      units: batch.units,
      focus: exam.focus ?? batch.focus,
      target: exam.target,
      durationSeconds: exam.durationSeconds,
      questionCount: exam.examQuestions.length,
    }))
  ),
  ...PHYSICS_BATCHES.flatMap((batch) =>
    batch.exams.map((exam) => ({
      subject: "Physics" as const,
      batchId: batch.id,
      examCode: exam.examCode,
      label: exam.label,
      units: batch.units,
      focus: exam.focus ?? batch.focus,
      target: exam.target,
      durationSeconds: exam.durationSeconds,
      questionCount: exam.examQuestions.length,
    }))
  ),
];
