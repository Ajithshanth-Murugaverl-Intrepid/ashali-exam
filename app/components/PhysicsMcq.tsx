"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ExamModule, { type ExamQuestion } from "./ExamModule";
import { physicsBatch1ExamQuestionsPaper1 } from "./physicsBatch1ExamQuestionsPaper1";
import { physicsBatch2ExamQuestionsPaper1 } from "./physicsBatch2ExamQuestionsPaper1";
import { physicsBatch3ExamQuestionsPaper1 } from "./physicsBatch3ExamQuestionsPaper1";
import { physicsBatch3ExamQuestionsPaper2 } from "./physicsBatch3ExamQuestionsPaper2";
import { physicsBatch3ExamQuestionsPaper3 } from "./physicsBatch3ExamQuestionsPaper3";
import { physicsBatch3ExamQuestionsPaper4 } from "./physicsBatch3ExamQuestionsPaper4";
import { physicsBatch4ExamQuestionsPaper1 } from "./physicsBatch4ExamQuestionsPaper1";
import { physicsBatch5ExamQuestionsPaper1 } from "./physicsBatch5ExamQuestionsPaper1";
import { physicsBatch6ExamQuestionsPaper1 } from "./physicsBatch6ExamQuestionsPaper1";
import { physicsBatch7ExamQuestionsPaper1 } from "./physicsBatch7ExamQuestionsPaper1";
import { physicsBatch8ExamQuestionsPaper1 } from "./physicsBatch8ExamQuestionsPaper1";
import { physicsBatch9ExamQuestionsPaper1 } from "./physicsBatch9ExamQuestionsPaper1";
import { physicsBatch10ExamQuestionsPaper1 } from "./physicsBatch10ExamQuestionsPaper1";
import { physicsBatch11ExamQuestionsPaper1 } from "./physicsBatch11ExamQuestionsPaper1";

type RandomQuestion = ExamQuestion & {
  randomId: string;
  batchId: string;
  batchUnits: string;
};

type BatchExam = {
  examCode: string;
  label: string;
  focus?: string;
  target: number;
  durationSeconds: number;
  examQuestions: ExamQuestion[];
};

type Batch = {
  id: string;
  label: string;
  units: string;
  focus: string;
  exams: BatchExam[];
};

const PHYSICS_BATCHES: Batch[] = [
  {
    id: "p1",
    label: "தொகுதி 1",
    units: "அலகு 1",
    focus: "அளவீடு: SI அலகுகள், பரிமாணங்கள், அளவீட்டு கருவிகள், திசையன்கள்",
    exams: [
      {
        examCode: "PHY-B1-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch1ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p2",
    label: "தொகுதி 2",
    units: "அலகு 2",
    focus: "பொறியியல்: Kinematics, Dynamics, Statics, Work-Energy-Power, வட்ட/சுழற்சி இயக்கம், Hydrostatics",
    exams: [
      {
        examCode: "PHY-B2-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch2ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p3",
    label: "தொகுதி 3",
    units: "அலகு 3",
    focus: "அலைவுகளும் அலைகளும்: SHM, ஒலி, ஒளி, குறுக்கீடு, விளிம்பு விளைவு, முனைவாக்கம்",
    exams: [
      {
        examCode: "PHY-B3-E1",
        label: "பரீட்சை 1",
        focus: "எளிய இசை இயக்கம் (Simple Harmonic Motion - SHM)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper1
      },
      {
        examCode: "PHY-B3-E2",
        label: "பரீட்சை 2",
        focus: "பொது அலை இயக்கம் (General Wave Motion)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper2
      },
      {
        examCode: "PHY-B3-E3",
        label: "பரீட்சை 3",
        focus: "ஒலியலைகள் (Sound Waves)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper3
      },
      {
        examCode: "PHY-B3-E4",
        label: "பரீட்சை 4",
        focus: "ஒளியியல் மற்றும் அலை ஒளியியல் (Light & Wave Optics)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper4
      }
    ]
  },
  {
    id: "p4",
    label: "தொகுதி 4",
    units: "அலகு 4",
    focus: "வெப்பப் பௌதிகவியல்: வெப்பநிலை, வாயு விதிகள், வெப்ப இடமாற்றம், வெப்ப இயக்கவியல்",
    exams: [
      {
        examCode: "PHY-B4-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch4ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p5",
    label: "தொகுதி 5",
    units: "அலகு 5",
    focus: "ஈர்ப்புப் புலம்: அகில ஈர்ப்பு விதி, g, விடுபடுகதி, செயற்கைக்கோள் இயக்கம்",
    exams: [
      {
        examCode: "PHY-B5-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch5ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p6",
    label: "தொகுதி 6",
    units: "அலகு 6",
    focus: "நிலைமின்புலம்: கூலோம் விதி, மின்புலச்செறிவு, அழுத்தம், கொள்ளளவிகள்",
    exams: [
      {
        examCode: "PHY-B6-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch6ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p7",
    label: "தொகுதி 7",
    units: "அலகு 7",
    focus: "காந்தப்புலம்: அசையும் மின்னேற்றங்கள், Biot-Savart, Ampere விதி, சுருள் மீதான திருப்புத்திறன்",
    exams: [
      {
        examCode: "PHY-B7-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch7ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p8",
    label: "தொகுதி 8",
    units: "அலகு 8",
    focus: "ஓட்டமின்னியல்: Ohm விதி, e.m.f., Kirchhoff விதிகள், Wheatstone bridge, Potentiometer",
    exams: [
      {
        examCode: "PHY-B8-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch8ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p9",
    label: "தொகுதி 9",
    units: "அலகு 9",
    focus: "இலத்திரனியல்: Diodes, Transistor, Op-Amp, Digital logic gates",
    exams: [
      {
        examCode: "PHY-B9-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch9ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p10",
    label: "தொகுதி 10",
    units: "அலகு 10",
    focus: "பதார்த்தங்களின் இயந்திரவியல் இயல்புகள்: மீட்சித்தன்மை, பாகுத்தன்மை, மேற்பரப்பு இழுவை",
    exams: [
      {
        examCode: "PHY-B10-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch10ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p11",
    label: "தொகுதி 11",
    units: "அலகு 11",
    focus: "பதார்த்தமும் கதிர்வீச்சும்: ஒளிமின் விளைவு, அணுக்கட்டமைப்பு, உட்கருப் பௌதிகவியல்",
    exams: [
      {
        examCode: "PHY-B11-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch11ExamQuestionsPaper1
      }
    ]
  }
];

export default function PhysicsMcq() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"random" | "unit">("random");

  const [seenIds, setSeenIds] = useState<ReadonlySet<string>>(new Set<string>());
  const [currentQ, setCurrentQ] = useState<RandomQuestion | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [randomBackStack, setRandomBackStack] = useState<RandomQuestion[]>([]);

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedExamKey, setSelectedExamKey] = useState<string | null>(null);

  const totalTarget = useMemo(() =>
    PHYSICS_BATCHES.reduce(
      (sum, batch) => sum + batch.exams.reduce((inner, exam) => inner + exam.target, 0),
      0
    ),
    []
  );
  const totalExamCount = useMemo(
    () => PHYSICS_BATCHES.reduce((sum, batch) => sum + batch.exams.length, 0),
    []
  );

  const randomQuestions = useMemo(
    () => PHYSICS_BATCHES
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

  const selectedBatch = useMemo(
    () => PHYSICS_BATCHES.find((batch) => batch.id === selectedBatchId) ?? null,
    [selectedBatchId]
  );

  const selectedExam = useMemo(() => {
    if (!selectedExamKey) return null;
    const [batchId, examCode] = selectedExamKey.split(":");
    const batch = PHYSICS_BATCHES.find((item) => item.id === batchId);
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
    if (!currentQ || revealed) return;
    setSelectedAnswer(idx);
    setRevealed(true);
  };

  const handleOpen = () => {
    setOpen(true);
    if (!currentQ && randomQuestions.length > 0) pickRandom(seenIds);
  };

  const nextRandom = () => {
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

  const seenPercent = randomQuestions.length > 0
    ? Math.round((seenIds.size / randomQuestions.length) * 100)
    : 0;

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
      <div className="subject-card">
        <div className="subject-header">
          <span className="subject-icon" aria-hidden="true">🔭</span>
          <div>
            <h3 className="subject-name">பெளதிகவியல் (Physics)</h3>
            <p className="subject-meta">11 தொகுதிகள் · {totalExamCount} பரீட்சைகள் · இலக்கு: {totalTarget} கேள்விகள்</p>
          </div>
        </div>
        <button className="practice-btn" type="button" onClick={handleOpen}>
          MCQ பயிற்சி தொடங்கு →
        </button>
      </div>

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
                <h2 className="phy-modal-title">🔭 பெளதிகவியல் MCQ பயிற்சி</h2>
                <p className="phy-modal-sub">
                  {seenIds.size} / {randomQuestions.length} கேள்விகள் பார்க்கப்பட்டன ({seenPercent}%)
                </p>
              </div>
              <button
                className="close-btn"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="மூடு"
              >
                ✕
              </button>
            </div>

            <div className="phy-mode-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={mode === "random"}
                className={mode === "random" ? "phy-tab phy-tab-active" : "phy-tab"}
                type="button"
                onClick={() => setMode("random")}
              >
                🎲 சீரற்ற கேள்விகள்
              </button>
              <button
                role="tab"
                aria-selected={mode === "unit"}
                className={mode === "unit" ? "phy-tab phy-tab-active" : "phy-tab"}
                type="button"
                onClick={() => {
                  setMode("unit");
                  setSelectedBatchId(null);
                  setSelectedExamKey(null);
                }}
              >
                📚 அலகு வாரியாக
              </button>
            </div>

            <div className="phy-modal-body">
              {mode === "random" && currentQ && (
                <div className="random-mode">
                  <div className="seen-bar" role="progressbar" aria-valuenow={seenPercent} aria-valuemin={0} aria-valuemax={100}>
                    <div className="seen-fill" style={{ width: `${seenPercent}%` }} />
                  </div>

                  <div className="q-card">
                    <p className="q-label">கேள்வி</p>
                    <p className="q-batch">{currentQ.batchUnits}</p>
                    <p className="q-text">{currentQ.q}</p>

                    <div className="q-options" role="list">
                      {currentQ.options.map((option, idx) => {
                        const isAnswer = idx === currentQ.answer;
                        const isSelected = idx === selectedAnswer;
                        const optionClass = [
                          "q-option",
                          !revealed ? "q-option-interactive" : "",
                          revealed && isAnswer ? "q-option-correct" : "",
                          revealed && isSelected && !isAnswer ? "q-option-wrong" : ""
                        ].filter(Boolean).join(" ");
                        return (
                          <button
                            key={`${currentQ.randomId}-opt-${idx}`}
                            className={optionClass}
                            role="listitem"
                            type="button"
                            onClick={() => selectRandomAnswer(idx)}
                            disabled={revealed}
                          >
                            <span className="q-option-key">{String.fromCharCode(65 + idx)}.</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!revealed && <p className="pick-hint">ஒரு விடையைத் தேர்ந்தெடுக்கவும்.</p>}

                    {revealed && selectedAnswer !== null && (
                      <div className={selectedAnswer === currentQ.answer ? "answer-reveal answer-reveal-correct" : "answer-reveal answer-reveal-wrong"}>
                        <p className="a-label">{selectedAnswer === currentQ.answer ? "✅ சரி" : "❌ தவறு"}</p>
                        <p className="a-text">சரியான விடை: {String.fromCharCode(65 + currentQ.answer)}. {currentQ.options[currentQ.answer]}</p>
                        {currentQ.note && <p className="a-note">💡 {currentQ.note}</p>}
                      </div>
                    )}
                  </div>

                  <div className="random-actions">
                    <button
                      className="back-random-btn"
                      type="button"
                      onClick={backRandom}
                      disabled={randomBackStack.length === 0}
                    >
                      ← முந்தைய கேள்வி
                    </button>

                    <button className="next-btn" type="button" onClick={nextRandom}>
                      அடுத்த கேள்வி →
                    </button>
                  </div>

                  {seenIds.size === randomQuestions.length && randomQuestions.length > 0 && (
                    <p className="all-seen-note">
                      🎉 அனைத்து கேள்விகளும் பார்க்கப்பட்டன! மீண்டும் தொடங்குகிறோம்...
                    </p>
                  )}
                </div>
              )}

              {mode === "random" && !currentQ && (
                <p className="empty-batch">சீரற்ற பயிற்சிக்கான கேள்விகள் இன்னும் சேர்க்கப்படவில்லை.</p>
              )}

              {mode === "unit" && (
                <div className="unit-mode">
                  {!selectedBatch && (
                    <div className="batch-grid">
                      {PHYSICS_BATCHES.map((batch) => {
                        const availableExamCount = batch.exams.filter((exam) => exam.examQuestions.length > 0).length;
                        const totalBatchQuestions = batch.exams.reduce((sum, exam) => sum + exam.target, 0);
                        return (
                          <button
                            key={batch.id}
                            className="batch-card"
                            type="button"
                            onClick={() => setSelectedBatchId(batch.id)}
                            disabled={availableExamCount === 0}
                          >
                            <span className="batch-label">{batch.label}</span>
                            <span className="batch-units">{batch.units}</span>
                            <span className="batch-focus">{batch.focus}</span>
                            <span className="batch-count">
                              {availableExamCount > 0
                                ? `${availableExamCount} பரீட்சைகள் · இலக்கு: ${totalBatchQuestions} வினாக்கள்`
                                : "🔜 விரைவில் வரும்"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedBatch && (
                    <>
                      <div className="batch-nav">
                        <button
                          className="back-btn"
                          type="button"
                          onClick={() => {
                            setSelectedBatchId(null);
                            setSelectedExamKey(null);
                          }}
                        >
                          ← தொகுதிகள்
                        </button>
                        <span className="batch-nav-title">{selectedBatch.label} — பரீட்சைகள்</span>
                      </div>

                      <div className="batch-grid">
                        {selectedBatch.exams.map((exam) => (
                          <button
                            key={exam.examCode}
                            className="batch-card"
                            type="button"
                            onClick={() => setSelectedExamKey(`${selectedBatch.id}:${exam.examCode}`)}
                            disabled={exam.examQuestions.length === 0}
                          >
                            <span className="batch-label">{exam.label}</span>
                            <span className="batch-units">குறியீடு: {exam.examCode}</span>
                            <span className="batch-focus">{exam.focus ?? selectedBatch.focus}</span>
                            <span className="batch-count">
                              {exam.examQuestions.length > 0
                                ? `${exam.examQuestions.length} / ${exam.target} வினாக்கள்`
                                : "🔜 விரைவில் வரும்"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
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
              title: `🔭 பெளதிகவியல் தேர்வு — ${batch.label} (${exam.label})`,
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

      <style jsx global>{`
        .subject-card {
          background: rgba(255, 255, 255, 0.09);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 16px;
          display: grid;
          gap: 12px;
        }

        .subject-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subject-icon {
          font-size: 2.2rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .subject-name {
          margin: 0;
          font-size: 1.08rem;
          font-weight: 700;
          color: #f3f2ff;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
        }

        .subject-meta {
          margin: 4px 0 0;
          font-size: 0.8rem;
          color: #b4bbd6;
        }

        .practice-btn {
          appearance: none;
          border: 0;
          border-radius: 12px;
          padding: 11px 16px;
          font-family: inherit;
          font-weight: 700;
          font-size: 0.9rem;
          background: linear-gradient(95deg, #0ea5e9, #2563eb);
          color: white;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
          width: 100%;
        }

        .practice-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4);
        }

        .phy-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(4, 6, 18, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
          color: #f3f2ff;
        }

        .phy-modal {
          background: linear-gradient(140deg, #0f1535, #10223f);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 24px;
          width: min(100%, 780px);
          max-height: 90dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 90px rgba(3, 5, 16, 0.85);
        }

        .phy-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 20px 0;
          gap: 12px;
          flex-shrink: 0;
        }

        .phy-modal-title {
          margin: 0;
          font-size: 1.25rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          color: #f3f2ff;
        }

        .phy-modal-sub {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: #9fb2ff;
        }

        .close-btn {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 10px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.08);
          color: #f3f2ff;
          cursor: pointer;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .phy-mode-tabs {
          display: flex;
          gap: 8px;
          padding: 14px 20px 0;
          flex-shrink: 0;
        }

        .phy-tab {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 8px 16px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.06);
          color: #b4bbd6;
          cursor: pointer;
        }

        .phy-tab-active {
          background: linear-gradient(95deg, #0ea5e9, #2563eb);
          border-color: transparent;
          color: white;
        }

        .phy-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px 24px;
        }

        .empty-batch {
          text-align: center;
          padding: 32px 0;
          color: #b4bbd6;
          font-size: 0.95rem;
        }

        .random-mode {
          display: grid;
          gap: 14px;
        }

        .seen-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          overflow: hidden;
        }

        .seen-fill {
          height: 100%;
          background: linear-gradient(90deg, #22d3ee, #3b82f6);
          transition: width 260ms ease;
        }

        .q-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 14px;
          display: grid;
          gap: 10px;
        }

        .q-label {
          margin: 0;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9fb2ff;
          font-weight: 700;
        }

        .q-batch {
          margin: 0;
          color: #7dd3fc;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .q-text {
          margin: 0;
          font-size: 1rem;
          line-height: 1.55;
          color: #f3f2ff;
          font-weight: 600;
        }

        .q-options {
          display: grid;
          gap: 8px;
        }

        .q-option {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.05);
          color: #dbe2ff;
          text-align: left;
          font-family: inherit;
          font-size: 0.92rem;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .q-option-interactive {
          cursor: pointer;
        }

        .q-option-interactive:hover {
          background: rgba(59, 130, 246, 0.16);
          border-color: rgba(59, 130, 246, 0.45);
        }

        .q-option-correct {
          border-color: rgba(34, 197, 94, 0.6);
          background: rgba(34, 197, 94, 0.17);
          color: #dcfce7;
        }

        .q-option-wrong {
          border-color: rgba(248, 113, 113, 0.6);
          background: rgba(248, 113, 113, 0.17);
          color: #fee2e2;
        }

        .q-option-key {
          font-weight: 700;
          color: #9fb2ff;
          min-width: 1.4rem;
        }

        .pick-hint {
          margin: 2px 0 0;
          font-size: 0.8rem;
          color: #b4bbd6;
        }

        .answer-reveal {
          border-radius: 12px;
          padding: 10px 12px;
          display: grid;
          gap: 6px;
        }

        .answer-reveal-correct {
          border: 1px solid rgba(34, 197, 94, 0.45);
          background: rgba(34, 197, 94, 0.14);
        }

        .answer-reveal-wrong {
          border: 1px solid rgba(248, 113, 113, 0.45);
          background: rgba(248, 113, 113, 0.12);
        }

        .a-label {
          margin: 0;
          font-size: 0.88rem;
          font-weight: 700;
          color: #f3f2ff;
        }

        .a-text {
          margin: 0;
          font-size: 0.88rem;
          color: #dbe2ff;
        }

        .a-note {
          margin: 0;
          font-size: 0.84rem;
          color: #c7d2fe;
          line-height: 1.5;
        }

        .random-actions {
          display: flex;
          gap: 10px;
        }

        .back-random-btn,
        .next-btn {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 10px 14px;
          font-family: inherit;
          font-weight: 700;
          font-size: 0.84rem;
          cursor: pointer;
          transition: transform 180ms ease, background 180ms ease;
          flex: 1;
        }

        .back-random-btn {
          background: rgba(255, 255, 255, 0.08);
          color: #dbe2ff;
        }

        .back-random-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .next-btn {
          border: 0;
          background: linear-gradient(95deg, #0ea5e9, #2563eb);
          color: white;
        }

        .next-btn:hover,
        .back-random-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .all-seen-note {
          margin: 0;
          font-size: 0.8rem;
          color: #93c5fd;
          text-align: center;
        }

        .unit-mode {
          display: grid;
          gap: 12px;
        }

        .batch-grid {
          display: grid;
          gap: 10px;
        }

        .batch-card {
          appearance: none;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 16px;
          padding: 14px;
          cursor: pointer;
          text-align: left;
          display: grid;
          gap: 4px;
          color: inherit;
          font-family: inherit;
        }

        .batch-card:hover {
          background: rgba(14, 165, 233, 0.18);
          border-color: rgba(14, 165, 233, 0.45);
          transform: translateY(-2px);
        }

        .batch-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9fb2ff;
          font-weight: 700;
        }

        .batch-units {
          font-size: 0.85rem;
          font-weight: 600;
          color: #dbe2ff;
        }

        .batch-focus {
          font-size: 0.8rem;
          color: #b4bbd6;
          line-height: 1.4;
        }

        .batch-count {
          font-size: 0.76rem;
          color: #7dd3fc;
          font-weight: 600;
          margin-top: 4px;
        }

        .batch-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }

        .back-btn {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 7px 12px;
          background: rgba(255, 255, 255, 0.07);
          color: #f3f2ff;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.83rem;
          font-weight: 600;
          transition: all 180ms ease;
          flex-shrink: 0;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.14);
        }

        .batch-nav-title {
          font-size: 0.85rem;
          color: #b4bbd6;
        }

        @media (min-width: 560px) {
          .batch-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}
