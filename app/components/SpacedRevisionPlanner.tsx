"use client";

import { useEffect, useMemo, useState } from "react";
import { safeReadStorageJson, safeWriteStorageJson } from "./mcq/utils/storage";

type RevisionTopic = {
  id: string;
  title: string;
  subject: string;
  studiedOn: string;
  completedStepIndexes: number[];
  createdAt: string;
};

type RevisionStatus = "overdue" | "due-today" | "upcoming" | "completed";

type SpacedRevisionPlannerProps = {
  examStartIso?: string;
};

const SPACED_REVISION_STORAGE_KEY = "ashali:spaced-revision-topics:v1";
const SUBJECT_OPTIONS = ["Biology", "Chemistry", "Physics"] as const;
type SubjectOption = (typeof SUBJECT_OPTIONS)[number];
const STEP_OFFSETS_DAYS = [0, 2, 6, 13, 29] as const;
const STEP_LABELS = [
  "Day 1 Study",
  "Day 3 Revision",
  "Day 7 Revision",
  "Day 14 Revision",
  "Day 30 Revision"
] as const;

function formatAsInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseInputDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateDiffInDays(a: Date, b: Date) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  return Math.floor((startOfDay(a).getTime() - startOfDay(b).getTime()) / oneDayMs);
}

function normalizeLoadedTopics(value: unknown): RevisionTopic[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const candidate = item as Partial<RevisionTopic>;
      const normalizedSubject =
        typeof candidate.subject === "string" && SUBJECT_OPTIONS.includes(candidate.subject as SubjectOption)
          ? candidate.subject
          : "Biology";

      return {
        id: typeof candidate.id === "string" ? candidate.id : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: typeof candidate.title === "string" ? candidate.title : "Untitled Topic",
        subject: normalizedSubject,
        studiedOn: typeof candidate.studiedOn === "string" ? candidate.studiedOn : formatAsInputDate(new Date()),
        completedStepIndexes: Array.isArray(candidate.completedStepIndexes)
          ? Array.from(new Set(candidate.completedStepIndexes.filter((x): x is number => Number.isInteger(x) && x >= 0 && x < STEP_OFFSETS_DAYS.length)))
          : [0],
        createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : new Date().toISOString()
      };
    });
}

function getNextStepIndex(topic: RevisionTopic) {
  for (let index = 1; index < STEP_OFFSETS_DAYS.length; index += 1) {
    if (!topic.completedStepIndexes.includes(index)) return index;
  }
  return null;
}

function getStepDate(topic: RevisionTopic, stepIndex: number) {
  const studyDate = parseInputDate(topic.studiedOn);
  if (!studyDate) return null;
  return addDays(studyDate, STEP_OFFSETS_DAYS[stepIndex]);
}

function getTopicStatus(topic: RevisionTopic): { status: RevisionStatus; nextStepIndex: number | null; dueDate: Date | null; dayDelta: number | null } {
  const nextStepIndex = getNextStepIndex(topic);
  if (nextStepIndex === null) {
    return { status: "completed", nextStepIndex: null, dueDate: null, dayDelta: null };
  }

  const dueDate = getStepDate(topic, nextStepIndex);
  if (!dueDate) {
    return { status: "upcoming", nextStepIndex, dueDate: null, dayDelta: null };
  }

  const today = new Date();
  const dayDelta = dateDiffInDays(dueDate, today);

  if (dayDelta < 0) return { status: "overdue", nextStepIndex, dueDate, dayDelta };
  if (dayDelta === 0) return { status: "due-today", nextStepIndex, dueDate, dayDelta };
  return { status: "upcoming", nextStepIndex, dueDate, dayDelta };
}

function getPendingRevisionStepIndexes(topic: RevisionTopic) {
  return STEP_OFFSETS_DAYS
    .map((_, index) => index)
    .filter((index) => index > 0 && !topic.completedStepIndexes.includes(index));
}

function getPendingAfterExamCount(topic: RevisionTopic, examStartDate: Date | null) {
  if (!examStartDate) return 0;

  const examDay = startOfDay(examStartDate);
  return getPendingRevisionStepIndexes(topic).reduce((count, stepIndex) => {
    const stepDate = getStepDate(topic, stepIndex);
    if (!stepDate) return count;
    return startOfDay(stepDate).getTime() > examDay.getTime() ? count + 1 : count;
  }, 0);
}

export default function SpacedRevisionPlanner({ examStartIso }: SpacedRevisionPlannerProps) {
  const examStartDate = useMemo(() => {
    if (!examStartIso) return null;
    const parsed = new Date(examStartIso);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [examStartIso]);

  const examDaysLeft = useMemo(() => {
    if (!examStartDate) return null;
    return dateDiffInDays(examStartDate, new Date());
  }, [examStartDate]);

  const [topics, setTopics] = useState<RevisionTopic[]>(() => {
    const loaded = safeReadStorageJson<unknown>(SPACED_REVISION_STORAGE_KEY);
    return normalizeLoadedTopics(loaded);
  });
  const [topicTitle, setTopicTitle] = useState("");
  const [subject, setSubject] = useState<SubjectOption>("Biology");
  const [studiedOn, setStudiedOn] = useState(formatAsInputDate(new Date()));

  useEffect(() => {
    safeWriteStorageJson(SPACED_REVISION_STORAGE_KEY, topics);
  }, [topics]);

  const sortedTopics = useMemo(() => {
    const withStatus = topics.map((topic) => ({ topic, info: getTopicStatus(topic) }));
    const statusRank: Record<RevisionStatus, number> = {
      "overdue": 0,
      "due-today": 1,
      "upcoming": 2,
      "completed": 3
    };

    return withStatus.sort((a, b) => {
      const rankDiff = statusRank[a.info.status] - statusRank[b.info.status];
      if (rankDiff !== 0) return rankDiff;

      const aDate = a.info.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bDate = b.info.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    });
  }, [topics]);

  const summary = useMemo(() => {
    const counts = { overdue: 0, dueToday: 0, upcoming: 0, completed: 0, atRisk: 0 };

    topics.forEach((topic) => {
      const status = getTopicStatus(topic).status;
      if (status === "overdue") counts.overdue += 1;
      if (status === "due-today") counts.dueToday += 1;
      if (status === "upcoming") counts.upcoming += 1;
      if (status === "completed") counts.completed += 1;
      if (getPendingAfterExamCount(topic, examStartDate) > 0) counts.atRisk += 1;
    });

    return counts;
  }, [topics, examStartDate]);

  const addTopic = () => {
    const trimmed = topicTitle.trim();
    if (!trimmed) return;

    const nextTopic: RevisionTopic = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: trimmed,
      subject,
      studiedOn,
      completedStepIndexes: [0],
      createdAt: new Date().toISOString()
    };

    setTopics((prev) => [nextTopic, ...prev]);
    setTopicTitle("");
  };

  const markNextDone = (id: string) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== id) return topic;

        const nextStepIndex = getNextStepIndex(topic);
        if (nextStepIndex === null) return topic;

        return {
          ...topic,
          completedStepIndexes: [...topic.completedStepIndexes, nextStepIndex].sort((a, b) => a - b)
        };
      })
    );
  };

  const undoLastRevision = (id: string) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== id) return topic;

        const reversible = topic.completedStepIndexes.filter((index) => index > 0);
        if (reversible.length === 0) return topic;

        const lastCompleted = Math.max(...reversible);
        return {
          ...topic,
          completedStepIndexes: topic.completedStepIndexes.filter((index) => index !== lastCompleted)
        };
      })
    );
  };

  const restartPlanFromToday = (id: string) => {
    const today = formatAsInputDate(new Date());

    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              studiedOn: today,
              completedStepIndexes: [0]
            }
          : topic
      )
    );
  };

  const removeTopic = (id: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  };

  return (
    <section className="card reveal spaced-card">
      <div className="section-title-wrap">
        <h2>Spaced Revision Planner</h2>
        <p className="section-subtitle">Day 1 → Day 3 → Day 7 → Day 14 → Day 30 revision loop with local progress tracking</p>
        {examStartDate && (
          <p className="spaced-exam-line">
            Exam timeline: {examStartDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            {examDaysLeft !== null && examDaysLeft >= 0 ? ` (${examDaysLeft} day${examDaysLeft === 1 ? "" : "s"} left)` : " (started)"}
          </p>
        )}
      </div>

      <div className="spaced-summary-grid">
        <article className="spaced-stat overdue">
          <p>Overdue</p>
          <strong>{summary.overdue}</strong>
        </article>
        <article className="spaced-stat due">
          <p>Due Today</p>
          <strong>{summary.dueToday}</strong>
        </article>
        <article className="spaced-stat upcoming">
          <p>Upcoming</p>
          <strong>{summary.upcoming}</strong>
        </article>
        <article className="spaced-stat completed">
          <p>Completed</p>
          <strong>{summary.completed}</strong>
        </article>
        <article className="spaced-stat risk">
          <p>At Risk</p>
          <strong>{summary.atRisk}</strong>
        </article>
      </div>

      <div className="spaced-add-grid">
        <input
          className="spaced-input"
          type="text"
          value={topicTitle}
          onChange={(event) => setTopicTitle(event.target.value)}
          placeholder="Topic name (e.g. Thermodynamics)"
        />
        <select
          className="spaced-input"
          value={subject}
          onChange={(event) => {
            const next = event.target.value;
            if (SUBJECT_OPTIONS.includes(next as SubjectOption)) {
              setSubject(next as SubjectOption);
            }
          }}
        >
          <option value="Physics">Physics</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
        </select>
        <input
          className="spaced-input"
          type="date"
          value={studiedOn}
          onChange={(event) => setStudiedOn(event.target.value)}
        />
        <button className="spaced-btn" type="button" onClick={addTopic}>Add Topic</button>
      </div>

      <div className="spaced-list">
        {sortedTopics.length === 0 && (
          <p className="spaced-empty">No topics yet. Add your first topic and the system will schedule all revision checkpoints automatically.</p>
        )}

        {sortedTopics.map(({ topic, info }) => {
          const progressCount = topic.completedStepIndexes.filter((stepIndex) => stepIndex > 0).length;
          const pendingAfterExamCount = getPendingAfterExamCount(topic, examStartDate);
          const dueLabel = info.dueDate
            ? info.dueDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            : "-";
          const dueStepLabel = info.nextStepIndex !== null ? STEP_LABELS[info.nextStepIndex] : null;
          const dueInLabel =
            info.dayDelta !== null && info.dayDelta > 0
              ? `${info.dayDelta} day${info.dayDelta === 1 ? "" : "s"} left`
              : info.dayDelta === 0
                ? "Today"
                : info.dayDelta !== null && info.dayDelta < 0
                  ? `${Math.abs(info.dayDelta)} day${Math.abs(info.dayDelta) === 1 ? "" : "s"} overdue`
                  : null;

          return (
            <article key={topic.id} className="spaced-item">
              <div className="spaced-item-head">
                <div>
                  <h3>{topic.title}</h3>
                  <p>{topic.subject} · Studied on {topic.studiedOn}</p>
                </div>
                <span className={`spaced-status ${info.status}`}>
                  {info.status === "overdue" && "Overdue"}
                  {info.status === "due-today" && "Due Today"}
                  {info.status === "upcoming" && "Upcoming"}
                  {info.status === "completed" && "Completed"}
                </span>
              </div>

              {info.nextStepIndex === null ? (
                <p className="spaced-next">All scheduled revisions complete.</p>
              ) : (
                <div className="spaced-next-row">
                  <p className="spaced-next-label">Next Session: {dueStepLabel}</p>
                  <div className="spaced-next-date-wrap">
                    <span className="spaced-next-date">{dueLabel}</span>
                    {dueInLabel && <span className="spaced-next-meta">{dueInLabel}</span>}
                  </div>
                </div>
              )}

              {examStartDate && pendingAfterExamCount > 0 && (
                <p className="spaced-risk-note">
                  {pendingAfterExamCount} pending revision{pendingAfterExamCount === 1 ? "" : "s"} fall after exam start. Prioritize this topic.
                </p>
              )}

              <div className="spaced-steps">
                {STEP_LABELS.map((label, index) => {
                  const stepDate = getStepDate(topic, index);
                  const isDone = topic.completedStepIndexes.includes(index);
                  return (
                    <span key={`${topic.id}-${label}`} className={`step-pill ${isDone ? "done" : "pending"}`}>
                      {label}: {stepDate ? formatAsInputDate(stepDate) : "-"}
                    </span>
                  );
                })}
              </div>

              <div className="spaced-item-foot">
                <p className="spaced-progress">Revisions done: {progressCount}/4</p>
                <div className="spaced-actions">
                  <button className="spaced-btn" type="button" onClick={() => markNextDone(topic.id)}>
                    Mark Next Done
                  </button>
                  <button className="spaced-btn alt" type="button" onClick={() => undoLastRevision(topic.id)}>
                    Undo Last
                  </button>
                  <button className="spaced-btn alt" type="button" onClick={() => restartPlanFromToday(topic.id)}>
                    Restart From Today
                  </button>
                  <button className="spaced-btn alt" type="button" onClick={() => removeTopic(topic.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .spaced-card {
          display: grid;
          gap: 14px;
        }

        .spaced-summary-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .spaced-exam-line {
          margin: 8px 0 0;
          color: #ffe9a6;
          font-size: 0.85rem;
        }

        .spaced-stat {
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          padding: 10px;
          background: rgba(255, 255, 255, 0.08);
        }

        .spaced-stat p {
          margin: 0;
          font-size: 0.8rem;
          color: #c9cff5;
        }

        .spaced-stat strong {
          display: block;
          margin-top: 3px;
          font-size: 1.2rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
        }

        .spaced-stat.overdue {
          background: rgba(239, 68, 68, 0.18);
          border-color: rgba(254, 202, 202, 0.35);
        }

        .spaced-stat.due {
          background: rgba(245, 158, 11, 0.18);
          border-color: rgba(253, 230, 138, 0.35);
        }

        .spaced-stat.upcoming {
          background: rgba(59, 130, 246, 0.18);
          border-color: rgba(191, 219, 254, 0.35);
        }

        .spaced-stat.completed {
          background: rgba(34, 197, 94, 0.18);
          border-color: rgba(187, 247, 208, 0.35);
        }

        .spaced-stat.risk {
          background: rgba(244, 63, 94, 0.18);
          border-color: rgba(253, 164, 175, 0.35);
        }

        .spaced-add-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: 1.3fr 1fr 1fr auto;
        }

        .spaced-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: #f3f2ff;
          padding: 10px 12px;
          font: inherit;
        }

        .spaced-input::placeholder {
          color: #c9cff5;
        }

        .spaced-list {
          display: grid;
          gap: 10px;
        }

        .spaced-empty {
          margin: 0;
          color: #c9cff5;
          font-size: 0.92rem;
        }

        .spaced-item {
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          display: grid;
          gap: 10px;
        }

        .spaced-item-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .spaced-item-head h3 {
          margin: 0;
          font-size: 1rem;
        }

        .spaced-item-head p {
          margin: 4px 0 0;
          font-size: 0.82rem;
          color: #c9cff5;
        }

        .spaced-status {
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.74rem;
          font-weight: 800;
          border: 1px solid transparent;
          white-space: nowrap;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
        }

        .spaced-status.overdue {
          background: rgba(239, 68, 68, 0.6);
          border-color: rgba(254, 202, 202, 0.95);
          color: #fff1f2;
          box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.45), 0 0 18px rgba(239, 68, 68, 0.35);
        }

        .spaced-status.due-today {
          background: rgba(245, 158, 11, 0.6);
          border-color: rgba(253, 230, 138, 0.95);
          color: #fffbeb;
          box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.45), 0 0 18px rgba(245, 158, 11, 0.35);
        }

        .spaced-status.upcoming {
          background: rgba(59, 130, 246, 0.6);
          border-color: rgba(191, 219, 254, 0.95);
          color: #eff6ff;
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.45), 0 0 18px rgba(59, 130, 246, 0.35);
        }

        .spaced-status.completed {
          background: rgba(34, 197, 94, 0.6);
          border-color: rgba(187, 247, 208, 0.95);
          color: #ecfdf5;
          box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.45), 0 0 18px rgba(34, 197, 94, 0.35);
        }

        .spaced-next {
          margin: 0;
          font-size: 0.88rem;
          color: #e6e9ff;
        }

        .spaced-next-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid rgba(253, 230, 138, 0.4);
          background: linear-gradient(95deg, rgba(245, 158, 11, 0.22), rgba(59, 130, 246, 0.2));
        }

        .spaced-next-label {
          margin: 0;
          font-size: 0.84rem;
          font-weight: 700;
          color: #fff7d4;
          letter-spacing: 0.01em;
        }

        .spaced-next-date-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .spaced-next-date {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #1a1033;
          background: #fde68a;
          border: 1px solid #fef3c7;
          box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.45), 0 0 16px rgba(253, 230, 138, 0.35);
        }

        .spaced-next-meta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #e0e7ff;
          background: rgba(30, 41, 59, 0.45);
          border: 1px solid rgba(226, 232, 240, 0.35);
        }

        .spaced-risk-note {
          margin: 0;
          font-size: 0.82rem;
          color: #fecdd3;
        }

        .spaced-steps {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .step-pill {
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          font-size: 0.72rem;
        }

        .step-pill.done {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(187, 247, 208, 0.35);
          color: #dcfce7;
        }

        .step-pill.pending {
          background: rgba(59, 130, 246, 0.15);
          color: #dbeafe;
        }

        .spaced-item-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .spaced-progress {
          margin: 0;
          color: #c9cff5;
          font-size: 0.82rem;
        }

        .spaced-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .spaced-btn {
          appearance: none;
          border: 0;
          border-radius: 12px;
          padding: 10px 12px;
          font: inherit;
          font-weight: 700;
          background: linear-gradient(95deg, #7f5bff, #3b82ff);
          color: white;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 10px 22px rgba(59, 130, 255, 0.27);
        }

        .spaced-btn:hover {
          transform: translateY(-1px);
        }

        .spaced-btn.alt {
          background: linear-gradient(95deg, #3b82ff, #ff79c7);
        }

        .spaced-actions .spaced-btn {
          padding: 8px 11px;
          border-radius: 10px;
          font-size: 0.78rem;
          box-shadow: none;
        }

        @media (max-width: 920px) {
          .spaced-add-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 720px) {
          .spaced-summary-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
}
