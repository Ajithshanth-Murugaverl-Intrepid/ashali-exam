"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ExamModule from "./ExamModule";
import { BIOLOGY_BATCHES } from "./biology/data";
import {
  BIOLOGY_GAME_STORAGE_KEY,
  readStoredGameProgress,
  STARTING_HEARTS,
  toStoredGameProgress
} from "./biology/utils/gameProgress";
import McqModeTabs from "./mcq/components/McqModeTabs";
import McqRandomModeGame from "./mcq/components/McqRandomModeGame";
import McqStyles from "./mcq/components/McqStyles";
import McqSubjectCard from "./mcq/components/McqSubjectCard";
import McqUnitMode from "./mcq/components/McqUnitMode";
import { type RandomQuestion } from "./mcq/types";
import { getTodayKey } from "./mcq/utils/date";
import { safeWriteStorageJson } from "./mcq/utils/storage";

export default function BiologyMcq() {
  const todayKey = getTodayKey();
  const initialGameProgress = useMemo(() => readStoredGameProgress(todayKey), [todayKey]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"random" | "unit">("random");

  const [seenIds, setSeenIds] = useState<ReadonlySet<string>>(new Set<string>());
  const [currentQ, setCurrentQ] = useState<RandomQuestion | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [randomBackStack, setRandomBackStack] = useState<RandomQuestion[]>([]);

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedExamKey, setSelectedExamKey] = useState<string | null>(null);

  const [hearts, setHearts] = useState(initialGameProgress.hearts);
  const [currentStreak, setCurrentStreak] = useState(initialGameProgress.currentStreak);
  const [bestStreak, setBestStreak] = useState(initialGameProgress.bestStreak);
  const [totalAnswered, setTotalAnswered] = useState(initialGameProgress.totalAnswered);
  const [totalCorrect, setTotalCorrect] = useState(initialGameProgress.totalCorrect);
  const [xp, setXp] = useState(initialGameProgress.xp);

  const [dailyAnswered, setDailyAnswered] = useState(initialGameProgress.dailyAnswered);
  const [dailyCorrect, setDailyCorrect] = useState(initialGameProgress.dailyCorrect);
  const [dailyStreakMissionDone, setDailyStreakMissionDone] = useState(initialGameProgress.dailyStreakMissionDone);

  const totalTarget = useMemo(
    () => BIOLOGY_BATCHES.reduce((sum, batch) => sum + batch.exams.reduce((inner, exam) => inner + exam.target, 0), 0),
    []
  );
  const totalExamCount = useMemo(() => BIOLOGY_BATCHES.reduce((sum, batch) => sum + batch.exams.length, 0), []);

  const randomQuestions = useMemo(
    () =>
      BIOLOGY_BATCHES
        .filter((batch) => batch.exams.some((exam) => exam.examQuestions.length > 0))
        .flatMap((batch) =>
          batch.exams.flatMap((exam) =>
            exam.examQuestions.map((question) => ({
              ...question,
              randomId: `${batch.id}:${exam.examCode}:${question.id}`,
              batchId: batch.id,
              batchUnits: `${batch.units} · ${exam.examCode}`
            }))
          )
        ),
    []
  );

  const selectedBatch = useMemo(() => BIOLOGY_BATCHES.find((batch) => batch.id === selectedBatchId) ?? null, [selectedBatchId]);

  const selectedExam = useMemo(() => {
    if (!selectedExamKey) return null;
    const [batchId, examCode] = selectedExamKey.split(":");
    const batch = BIOLOGY_BATCHES.find((item) => item.id === batchId);
    if (!batch) return null;
    const exam = batch.exams.find((item) => item.examCode === examCode);
    return exam ? { batch, exam } : null;
  }, [selectedExamKey]);

  const pickRandom = useCallback(
    (existingSeen: ReadonlySet<string>) => {
      if (randomQuestions.length === 0) {
        setCurrentQ(null);
        return;
      }

      const unseen = randomQuestions.filter((q) => !existingSeen.has(q.randomId));
      const pool = unseen.length > 0 ? unseen : randomQuestions;
      const baseSeen: Set<string> = unseen.length > 0 ? new Set(existingSeen) : new Set();
      const picked = pool[Math.floor(Math.random() * pool.length)];
      baseSeen.add(picked.randomId);
      setSeenIds(baseSeen);
      setCurrentQ(picked);
      setRevealed(false);
      setSelectedAnswer(null);
    },
    [randomQuestions]
  );

  const selectRandomAnswer = (idx: number) => {
    if (!currentQ || revealed || hearts <= 0) return;

    const isCorrect = idx === currentQ.answer;

    setSelectedAnswer(idx);
    setRevealed(true);

    setTotalAnswered((prev) => prev + 1);
    setDailyAnswered((prev) => prev + 1);

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      setDailyCorrect((prev) => prev + 1);
      setXp((prev) => prev + 10);
      setCurrentStreak((prev) => {
        const next = prev + 1;
        if (next >= 7) setDailyStreakMissionDone(true);
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
      return;
    }

    setCurrentStreak(0);
    setHearts((prev) => Math.max(0, prev - 1));
  };

  const handleOpen = () => {
    setOpen(true);
    if (!currentQ && randomQuestions.length > 0) pickRandom(seenIds);
  };

  const nextRandom = () => {
    if (hearts <= 0) return;

    if (randomQuestions.length > 0) {
      if (currentQ) {
        setRandomBackStack((prev) => [...prev, currentQ]);
      }
      pickRandom(seenIds);
    }
  };

  const backRandom = () => {
    setRandomBackStack((prev) => {
      if (prev.length === 0) return prev;
      const previousQ = prev[prev.length - 1];
      setCurrentQ(previousQ);
      setRevealed(false);
      setSelectedAnswer(null);
      return prev.slice(0, -1);
    });
  };

  const seenPercent = randomQuestions.length > 0 ? Math.round((seenIds.size / randomQuestions.length) * 100) : 0;

  const totalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const dailyAccuracy = dailyAnswered > 0 ? Math.round((dailyCorrect / dailyAnswered) * 100) : 0;
  const dailyMissionQuestionsDone = dailyAnswered >= 15;
  const dailyMissionAccuracyDone = dailyAnswered >= 10 && dailyAccuracy >= 80;
  const isRunOver = hearts <= 0;
  const level = Math.floor(xp / 200) + 1;

  const restartRun = () => {
    setHearts(STARTING_HEARTS);
    setCurrentStreak(0);
    setRevealed(false);
    setSelectedAnswer(null);
    if (randomQuestions.length > 0) {
      pickRandom(seenIds);
    }
  };

  useEffect(() => {
    const toStore = toStoredGameProgress({
      hearts,
      currentStreak,
      bestStreak,
      totalAnswered,
      totalCorrect,
      xp,
      todayKey,
      dailyAnswered,
      dailyCorrect,
      dailyStreakMissionDone
    });

    safeWriteStorageJson(BIOLOGY_GAME_STORAGE_KEY, toStore);
  }, [
    hearts,
    currentStreak,
    bestStreak,
    totalAnswered,
    totalCorrect,
    xp,
    dailyAnswered,
    dailyCorrect,
    dailyStreakMissionDone,
    todayKey
  ]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <McqSubjectCard
        icon="🧬"
        title="உயிரியல் (Biology)"
        meta={`${BIOLOGY_BATCHES.length} தொகுதிகள் · ${totalExamCount} பரீட்சைகள் · இலக்கு: ${totalTarget} கேள்விகள்`}
        buttonText="MCQ பயிற்சி தொடங்கு →"
        onOpen={handleOpen}
      />

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="phy-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="phy-modal">
            <div className="phy-modal-header">
              <div>
                <h2 className="phy-modal-title">🧬 உயிரியல் MCQ பயிற்சி</h2>
                <p className="phy-modal-sub">
                  {seenIds.size} / {randomQuestions.length} கேள்விகள் பார்க்கப்பட்டன ({seenPercent}%)
                </p>
              </div>
              <button className="close-btn" type="button" onClick={() => setOpen(false)} aria-label="மூடு">
                ✕
              </button>
            </div>

            <McqModeTabs
              mode={mode}
              onChangeMode={(nextMode) => {
                setMode(nextMode);
                if (nextMode === "unit") {
                  setSelectedBatchId(null);
                  setSelectedExamKey(null);
                }
              }}
            />

            <div className="phy-modal-body">
              {mode === "random" && (
                <McqRandomModeGame
                  currentQ={currentQ}
                  randomQuestionsCount={randomQuestions.length}
                  seenIdsSize={seenIds.size}
                  seenPercent={seenPercent}
                  hearts={hearts}
                  startingHearts={STARTING_HEARTS}
                  currentStreak={currentStreak}
                  bestStreak={bestStreak}
                  totalAccuracy={totalAccuracy}
                  totalCorrect={totalCorrect}
                  totalAnswered={totalAnswered}
                  level={level}
                  xp={xp}
                  todayKey={todayKey}
                  dailyMissionQuestionsDone={dailyMissionQuestionsDone}
                  dailyAnswered={dailyAnswered}
                  dailyMissionAccuracyDone={dailyMissionAccuracyDone}
                  dailyAccuracy={dailyAccuracy}
                  dailyStreakMissionDone={dailyStreakMissionDone}
                  isRunOver={isRunOver}
                  randomBackStackLength={randomBackStack.length}
                  revealed={revealed}
                  selectedAnswer={selectedAnswer}
                  onSelectRandomAnswer={selectRandomAnswer}
                  onRestartRun={restartRun}
                  onBackRandom={backRandom}
                  onNextRandom={nextRandom}
                />
              )}

              {mode === "unit" && (
                <McqUnitMode
                  batches={BIOLOGY_BATCHES}
                  selectedBatch={selectedBatch}
                  onSelectBatch={setSelectedBatchId}
                  onBackToBatches={() => {
                    setSelectedBatchId(null);
                    setSelectedExamKey(null);
                  }}
                  onSelectExam={(batchId, examCode) => setSelectedExamKey(`${batchId}:${examCode}`)}
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {selectedExam && (() => {
        const { batch, exam } = selectedExam;
        if (!exam || exam.examQuestions.length === 0) return null;
        return (
          <ExamModule
            config={{
              title: `🧬 உயிரியல் தேர்வு — ${batch.label} (${exam.label})`,
              examCode: exam.examCode,
              units: batch.units,
              focus: exam.focus ?? batch.focus,
              durationSeconds: exam.durationSeconds,
              questions: exam.examQuestions
            }}
            onClose={() => setSelectedExamKey(null)}
          />
        );
      })()}

      <McqStyles />
    </>
  );
}
