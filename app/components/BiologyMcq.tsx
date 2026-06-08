"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import ExamModule, { type ExamQuestion } from "./ExamModule";
import { biologyBatch1ExamQuestions } from "./biologyBatch1ExamQuestions";
import { biologyBatch2ExamQuestions } from "./biologyBatch2ExamQuestions";
import { biologyBatch3ExamQuestions } from "./biologyBatch3ExamQuestions";
import { biologyBatch4ExamQuestions } from "./biologyBatch4ExamQuestions";
import { biologyBatch5ExamQuestions } from "./biologyBatch5ExamQuestions";
import { biologyBatch6ExamQuestions } from "./biologyBatch6ExamQuestions";
import { biologyBatch7ExamQuestions } from "./biologyBatch7ExamQuestions";

type RandomQuestion = ExamQuestion & {
  randomId: string;
  batchId: string;
  batchUnits: string;
};

type Batch = {
  id: string;
  label: string;
  units: string;
  focus: string;
  target: number;
  durationSeconds: number;
  examQuestions: ExamQuestion[];
};

const BIOLOGY_BATCHES: Batch[] = [
  {
    id: "b1",
    label: "தொகுதி 1",
    units: "அலகு 1 & 2",
    focus: "வாழ்வின் வேதியியல் அடிப்படை & செல் உயிரியல்",
    target: 50,
    durationSeconds: 7200,
    examQuestions: biologyBatch1ExamQuestions
  },
  {
    id: "b2",
    label: "தொகுதி 2",
    units: "அலகு 3",
    focus: "உயிரினங்களின் பரிணாமம் & பன்முகத்தன்மை",
    target: 50,
    durationSeconds: 7200,
    examQuestions: biologyBatch2ExamQuestions
  },
  {
    id: "b3",
    label: "தொகுதி 3",
    units: "அலகு 4",
    focus: "தாவர வடிவமும் செயல்பாடும் (நீர் சமன்பாடு, ஒளிச்சேர்க்கை)",
    target: 50,
    durationSeconds: 7200,
    examQuestions: biologyBatch3ExamQuestions
  },
  {
    id: "b4",
    label: "தொகுதி 4",
    units: "அலகு 5 (பகுதி அ)",
    focus: "விலங்கு வடிவமும் செயல்பாடும் — செரிமானம், இரத்த ஓட்டம், சுவாசம்",
    target: 50,
    durationSeconds: 7200,
    examQuestions: biologyBatch4ExamQuestions
  },
  {
    id: "b5",
    label: "தொகுதி 5",
    units: "அலகு 5 (பகுதி ஆ)",
    focus: "விலங்கு வடிவமும் செயல்பாடும் — கழிவு நீக்கம், நரம்பு/நாளமில்லா, இனப்பெருக்கம்",
    target: 50,
    durationSeconds: 7200,
    examQuestions: biologyBatch5ExamQuestions
  },
  {
    id: "b6",
    label: "தொகுதி 6",
    units: "அலகு 6 & 7",
    focus: "மரபியல், மூலக்கூறு உயிரியல் & மறுசேர்க்கை DNA தொழில்நுட்பம்",
    target: 50,
    durationSeconds: 7200,
    examQuestions: biologyBatch6ExamQuestions
  },
  {
    id: "b7",
    label: "தொகுதி 7",
    units: "அலகு 8, 9 & 10",
    focus: "சுற்றுச்சூழல் உயிரியல், நுண்ணுயிரியல் & பயன்பாட்டு உயிரியல்",
    target: 100,
    durationSeconds: 10800,
    examQuestions: biologyBatch7ExamQuestions
  }
];

export default function BiologyMcq() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"random" | "unit">("random");

  // Random mode
  const [seenIds, setSeenIds] = useState<ReadonlySet<string>>(new Set<string>());
  const [currentQ, setCurrentQ] = useState<RandomQuestion | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [randomBackStack, setRandomBackStack] = useState<RandomQuestion[]>([]);

  // Unit mode
  const [examBatch, setExamBatch] = useState<string | null>(null);

  const randomQuestions = useMemo(
    () => BIOLOGY_BATCHES
      .filter((batch) => batch.examQuestions.length > 0)
      .flatMap((batch) =>
        batch.examQuestions.map((question) => ({
          ...question,
          randomId: `${batch.id}:${question.id}`,
          batchId: batch.id,
          batchUnits: batch.units
        }))
      ),
    []
  );

  const totalTarget = BIOLOGY_BATCHES.reduce((sum, b) => sum + b.target, 0);

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    if (!currentQ && randomQuestions.length > 0) pickRandom(seenIds);
  };

  const handleClose = () => setOpen(false);

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

  return (
    <>
      <div className="subject-card">
        <div className="subject-header">
          <span className="subject-icon" aria-hidden="true">🧬</span>
          <div>
            <h3 className="subject-name">உயிரியல் (Biology)</h3>
            <p className="subject-meta">7 தொகுதிகள் · இலக்கு: {totalTarget} கேள்விகள்</p>
          </div>
        </div>
        <button className="practice-btn" type="button" onClick={handleOpen}>
          MCQ பயிற்சி தொடங்கு →
        </button>
      </div>

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="bio-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bio-modal">
            <div className="bio-modal-header">
              <div>
                <h2 className="bio-modal-title">🧬 உயிரியல் MCQ பயிற்சி</h2>
                <p className="bio-modal-sub">
                  {seenIds.size} / {randomQuestions.length} கேள்விகள் பார்க்கப்பட்டன ({seenPercent}%)
                </p>
              </div>
              <button
                className="close-btn"
                type="button"
                onClick={handleClose}
                aria-label="மூடு"
              >
                ✕
              </button>
            </div>

            <div className="bio-mode-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={mode === "random"}
                className={mode === "random" ? "bio-tab bio-tab-active" : "bio-tab"}
                type="button"
                onClick={() => setMode("random")}
              >
                🎲 சீரற்ற கேள்விகள்
              </button>
              <button
                role="tab"
                aria-selected={mode === "unit"}
                className={mode === "unit" ? "bio-tab bio-tab-active" : "bio-tab"}
                type="button"
                onClick={() => { setMode("unit"); setExamBatch(null); }}
              >
                📚 அலகு வாரியாக
              </button>
            </div>

            <div className="bio-modal-body">
              {/* ── RANDOM MODE ── */}
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
                        {selectedAnswer === currentQ.answer ? (
                          <p className="a-text">சரியான விடை: {String.fromCharCode(65 + currentQ.answer)}. {currentQ.options[currentQ.answer]}</p>
                        ) : (
                          <p className="a-text">சரியான விடை: {String.fromCharCode(65 + currentQ.answer)}. {currentQ.options[currentQ.answer]}</p>
                        )}
                        {currentQ.note && <p className="a-note">{currentQ.note}</p>}
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

              {/* ── UNIT MODE ── */}
              {mode === "unit" && (
                <div className="unit-mode">
                  <div className="batch-grid">
                    {BIOLOGY_BATCHES.map((batch) => (
                      <button
                        key={batch.id}
                        className="batch-card"
                        type="button"
                        onClick={() => setExamBatch(batch.id)}
                        disabled={batch.examQuestions.length === 0}
                      >
                        <span className="batch-label">{batch.label}</span>
                        <span className="batch-units">{batch.units}</span>
                        <span className="batch-focus">{batch.focus}</span>
                        <span className="batch-count">
                          {batch.examQuestions.length > 0
                            ? `${batch.examQuestions.length} / ${batch.target} வினாக்கள்`
                            : "🔜 விரைவில் வரும்"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      , document.body)}

      {examBatch && (() => {
        const batch = BIOLOGY_BATCHES.find((b) => b.id === examBatch);
        if (!batch || batch.examQuestions.length === 0) return null;
        return (
          <ExamModule
            config={{
              title: `🧬 உயிரியல் தேர்வு — ${batch.label}`,
              units: batch.units,
              focus: batch.focus,
              durationSeconds: batch.durationSeconds,
              questions: batch.examQuestions
            }}
            onClose={() => setExamBatch(null)}
          />
        );
      })()}

      <style jsx global>{`
        /* ── Subject card (trigger) ── */
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
          background: linear-gradient(95deg, #22c55e, #16a34a);
          color: white;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.28);
          width: 100%;
        }

        .practice-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(34, 197, 94, 0.4);
        }

        /* ── Modal overlay ── */
        .bio-modal-overlay {
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

        .bio-modal {
          background: linear-gradient(140deg, #0f1535, #1a1040);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 24px;
          width: min(100%, 700px);
          max-height: 90dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 90px rgba(3, 5, 16, 0.85);
          animation: bioModalIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes bioModalIn {
          from { opacity: 0; transform: scale(0.94) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Modal header ── */
        .bio-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 20px 0;
          gap: 12px;
          flex-shrink: 0;
        }

        .bio-modal-title {
          margin: 0;
          font-size: 1.25rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          color: #f3f2ff;
        }

        .bio-modal-sub {
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
          transition: background 180ms ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        /* ── Mode tabs ── */
        .bio-mode-tabs {
          display: flex;
          gap: 8px;
          padding: 14px 20px 0;
          flex-shrink: 0;
        }

        .bio-tab {
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
          transition: all 180ms ease;
        }

        .bio-tab-active {
          background: linear-gradient(95deg, #7f5bff, #3b82ff);
          border-color: transparent;
          color: white;
        }

        /* ── Scrollable body ── */
        .bio-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px 24px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }

        /* ── Random mode ── */
        .random-mode {
          display: grid;
          gap: 14px;
        }

        .seen-bar {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .seen-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #22c55e, #77f2ff);
          transition: width 500ms ease;
        }

        .q-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 18px;
          padding: 16px;
          display: grid;
          gap: 12px;
        }

        .q-label {
          margin: 0;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #9fb2ff;
          font-weight: 700;
        }

        .q-text {
          margin: 0;
          font-size: 1rem;
          line-height: 1.65;
          color: #f3f2ff;
        }

        .q-batch {
          margin: -2px 0 2px;
          font-size: 0.74rem;
          color: #77f2ff;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .q-options {
          display: grid;
          gap: 8px;
        }

        .q-option {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 8px;
          align-items: start;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 8px 10px;
          font-size: 0.9rem;
          color: #e7ebff;
          line-height: 1.5;
          width: 100%;
          text-align: left;
          font-family: inherit;
          cursor: default;
        }

        .q-option-interactive {
          cursor: pointer;
          transition: all 160ms ease;
        }

        .q-option-interactive:hover {
          border-color: rgba(127, 91, 255, 0.55);
          background: rgba(127, 91, 255, 0.16);
        }

        .q-option:disabled {
          opacity: 1;
        }

        .q-option-correct {
          border-color: rgba(34, 197, 94, 0.6);
          background: rgba(34, 197, 94, 0.14);
          color: #dfffea;
        }

        .q-option-wrong {
          border-color: rgba(239, 68, 68, 0.7);
          background: rgba(239, 68, 68, 0.16);
          color: #ffe5e5;
        }

        .q-option-key {
          color: #9fb2ff;
          font-weight: 700;
        }

        .reveal-btn {
          appearance: none;
          border: 0;
          border-radius: 12px;
          padding: 10px 18px;
          font-family: inherit;
          font-weight: 700;
          font-size: 0.9rem;
          background: linear-gradient(95deg, #7f5bff, #3b82ff);
          color: white;
          cursor: pointer;
          transition: transform 180ms ease;
          align-self: start;
        }

        .reveal-btn:hover {
          transform: translateY(-2px);
        }

        .pick-hint {
          margin: 0;
          font-size: 0.82rem;
          color: #b4bbd6;
        }

        .answer-reveal {
          background: rgba(119, 242, 255, 0.1);
          border: 1px solid rgba(119, 242, 255, 0.38);
          border-radius: 14px;
          padding: 12px;
          display: grid;
          gap: 6px;
          animation: fadeIn 280ms ease;
        }

        .answer-reveal-correct {
          background: rgba(34, 197, 94, 0.12);
          border-color: rgba(34, 197, 94, 0.45);
        }

        .answer-reveal-wrong {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.45);
        }

        .a-label {
          margin: 0;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #77f2ff;
          font-weight: 700;
        }

        .a-text {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: #e6feff;
        }

        .a-note {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #c9f8ff;
        }

        .next-btn {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 12px;
          padding: 10px 18px;
          font-family: inherit;
          font-weight: 700;
          font-size: 0.9rem;
          background: rgba(255, 255, 255, 0.08);
          color: #f3f2ff;
          cursor: pointer;
          transition: all 180ms ease;
          justify-self: end;
        }

        .random-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .back-random-btn {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 12px;
          padding: 10px 14px;
          font-family: inherit;
          font-weight: 700;
          font-size: 0.86rem;
          background: rgba(255, 255, 255, 0.08);
          color: #f3f2ff;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .back-random-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }

        .back-random-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .next-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .all-seen-note {
          margin: 0;
          text-align: center;
          font-size: 0.85rem;
          color: #77f2ff;
          padding: 8px;
          background: rgba(119, 242, 255, 0.08);
          border-radius: 12px;
        }

        /* ── Unit mode ── */
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
          transition: all 180ms ease;
          color: inherit;
          font-family: inherit;
        }

        .batch-card:hover {
          background: rgba(127, 91, 255, 0.18);
          border-color: rgba(127, 91, 255, 0.45);
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
          color: #77f2ff;
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

        .empty-batch {
          text-align: center;
          padding: 32px 0;
          color: #b4bbd6;
          font-size: 0.95rem;
        }

        .unit-q-list {
          display: grid;
          gap: 8px;
        }

        .unit-q {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 12px;
          transition: border-color 200ms ease;
        }

        .unit-q.open {
          border-color: rgba(119, 242, 255, 0.35);
        }

        .unit-q-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .unit-q-text {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.55;
          color: #f3f2ff;
          flex: 1;
        }

        .q-num {
          color: #9fb2ff;
          font-weight: 700;
        }

        .reveal-sm {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 5px 10px;
          background: rgba(255, 255, 255, 0.07);
          color: #f3f2ff;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.76rem;
          font-weight: 600;
          flex-shrink: 0;
          transition: all 180ms ease;
        }

        .reveal-sm.active {
          background: rgba(119, 242, 255, 0.15);
          border-color: rgba(119, 242, 255, 0.45);
          color: #77f2ff;
        }

        .unit-a-text {
          margin: 8px 0 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: #b8f9ff;
          background: rgba(119, 242, 255, 0.08);
          border-radius: 10px;
          padding: 8px 10px;
          animation: fadeIn 250ms ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 500px) {
          .batch-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}
