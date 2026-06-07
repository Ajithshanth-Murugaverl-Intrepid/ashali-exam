"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export type ExamQuestion = {
  id: string;
  q: string;
  options: string[];
  answer: number; // 0-based index
  note?: string;
};

export type ExamConfig = {
  title: string;
  units: string;
  focus: string;
  durationSeconds: number;
  questions: ExamQuestion[];
};

type Phase = "intro" | "exam" | "result";

const OPTS = ["1", "2", "3", "4", "5"] as const;

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamModule({ config, onClose }: { config: ExamConfig; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(config.durationSeconds);
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (phase !== "exam") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setTimeTaken(config.durationSeconds);
          setPhase("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, config.durationSeconds]);

  const startExam = () => {
    setTimeLeft(config.durationSeconds);
    setAnswers({});
    setPhase("exam");
  };

  const submitExam = useCallback(() => {
    setTimeTaken((tt) => tt === 0 ? config.durationSeconds - timeLeft : tt);
    setPhase("result");
  }, [config.durationSeconds, timeLeft]);

  const select = useCallback((qid: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }, []);

  const answeredCount = Object.keys(answers).length;
  const score = config.questions.filter((q) => answers[q.id] === q.answer).length;
  const percentage = Math.round((score / config.questions.length) * 100);
  const isWarning = timeLeft > 0 && timeLeft < 600;
  const isCritical = timeLeft > 0 && timeLeft < 120;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="em-overlay" role="dialog" aria-modal="true">
      <div className="em-shell">

        {/* ════════ INTRO ════════ */}
        {phase === "intro" && (
          <div className="em-intro">
            <button className="em-x-btn" type="button" onClick={onClose} aria-label="மூடு">✕</button>
            <div className="em-intro-icon">📋</div>
            <h2 className="em-intro-title">{config.title}</h2>
            <p className="em-intro-units">{config.units}</p>
            <p className="em-intro-focus">{config.focus}</p>
            <div className="em-meta-row">
              <div className="em-meta-box">
                <span className="em-meta-lbl">வினாக்கள்</span>
                <span className="em-meta-val">{config.questions.length}</span>
              </div>
              <div className="em-meta-box">
                <span className="em-meta-lbl">நேரம்</span>
                <span className="em-meta-val">{formatTime(config.durationSeconds)}</span>
              </div>
              <div className="em-meta-box">
                <span className="em-meta-lbl">மொத்த மதிப்பெண்</span>
                <span className="em-meta-val">{config.questions.length}</span>
              </div>
            </div>
            <div className="em-instructions">
              <p className="em-instr-title">📌 அறிவுறுத்தல்கள்</p>
              <ul className="em-instr-list">
                <li>ஒவ்வொரு வினாவுக்கும் ஒரு சரியான விடையை மட்டும் தேர்ந்தெடுக்கவும்.</li>
                <li>தேர்வு தொடங்கியதும் நேரமணி ஓடத் தொடங்கும்.</li>
                <li>நேரம் முடிந்தால் தேர்வு தானாகவே சமர்ப்பிக்கப்படும்.</li>
                <li>நீங்கள் விரும்பும் போது தேர்வை முன்கூட்டியே முடிக்கலாம்.</li>
                <li>எல்லா வினாக்களுக்கும் பதிலளிக்க முயற்சிக்கவும்.</li>
              </ul>
            </div>
            <button className="em-start-btn" type="button" onClick={startExam}>
              தேர்வு தொடங்கு →
            </button>
          </div>
        )}

        {/* ════════ EXAM ════════ */}
        {phase === "exam" && (
          <>
            <div className={`em-topbar${isWarning ? " em-topbar-warn" : ""}${isCritical ? " em-topbar-crit" : ""}`}>
              <div className="em-tb-left">
                <span className="em-tb-title">{config.title}</span>
                <span className="em-tb-prog">
                  {answeredCount} / {config.questions.length} பதிலளிக்கப்பட்டது
                </span>
              </div>
              <div className="em-tb-right">
                <span className={`em-timer${isCritical ? " em-timer-crit" : isWarning ? " em-timer-warn" : ""}`}>
                  ⏱ {formatTime(timeLeft)}
                </span>
                <button className="em-submit-sm" type="button" onClick={submitExam}>
                  சமர்ப்பிக்கவும்
                </button>
              </div>
            </div>

            <div className="em-q-scroll">
              {config.questions.map((q, qi) => (
                <div key={q.id} className={`em-q-wrap${answers[q.id] !== undefined ? " em-q-answered" : ""}`}>
                  <p className="em-q-text">
                    <span className="em-q-num">{qi + 1}.</span> {q.q}
                  </p>
                  <div className="em-opts">
                    {q.options.map((opt, oi) => (
                      <label
                        key={oi}
                        className={`em-opt${answers[q.id] === oi ? " em-opt-sel" : ""}`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === oi}
                          onChange={() => select(q.id, oi)}
                          className="em-radio"
                        />
                        <span className="em-opt-num">{OPTS[oi]})</span>
                        <span className="em-opt-txt">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="em-submit-row">
                <p className="em-submit-note">
                  {answeredCount < config.questions.length
                    ? `⚠ ${config.questions.length - answeredCount} வினாக்கள் இன்னும் பதிலளிக்கப்படவில்லை`
                    : "✅ அனைத்து வினாக்களுக்கும் பதிலளிக்கப்பட்டது"}
                </p>
                <button className="em-submit-lg" type="button" onClick={submitExam}>
                  தேர்வு முடிக்கவும் →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ════════ RESULT ════════ */}
        {phase === "result" && (
          <div className="em-result-shell">
            <div className="em-result-hdr">
              <h2 className="em-result-title">தேர்வு முடிவு</h2>
              <button className="em-x-btn em-x-btn-inline" type="button" onClick={onClose} aria-label="மூடு">
                ✕ மூடு
              </button>
            </div>

            <div className="em-score-band">
              <div
                className="em-score-ring"
                style={{
                  background: `conic-gradient(${percentage >= 75 ? "#22c55e" : percentage >= 50 ? "#fbbf24" : "#ef4444"} ${percentage * 3.6}deg, rgba(255,255,255,0.1) 0)`
                }}
              >
                <div className="em-score-ring-inner">
                  <span className="em-score-num">{score}</span>
                  <span className="em-score-total">/ {config.questions.length}</span>
                </div>
              </div>
              <div className="em-score-meta">
                <p className="em-score-pct">{percentage}%</p>
                <p className="em-score-grade">
                  {percentage >= 75 ? "🎉 சிறந்தது!" : percentage >= 50 ? "👍 நல்லது" : "💪 மேலும் பயிற்சி தேவை"}
                </p>
                <p className="em-score-time">நேரம் எடுத்தது: {formatTime(timeTaken)}</p>
                <p className="em-score-correct">
                  சரி: {score} &nbsp;|&nbsp; தவறு: {answeredCount - score} &nbsp;|&nbsp; விடுபட்டவை: {config.questions.length - answeredCount}
                </p>
              </div>
            </div>

            <div className="em-review">
              <h3 className="em-review-title">விரிவான மதிப்பாய்வு</h3>
              {config.questions.map((q, qi) => {
                const ua = answers[q.id];
                const correct = ua === q.answer;
                const skipped = ua === undefined;
                return (
                  <div key={q.id} className={`em-rev-q${correct ? " em-rev-ok" : skipped ? " em-rev-skip" : " em-rev-bad"}`}>
                    <p className="em-rev-q-text">
                      <span className={`em-rev-badge${correct ? " em-badge-ok" : skipped ? " em-badge-skip" : " em-badge-bad"}`}>
                        {correct ? "✓" : skipped ? "—" : "✗"}
                      </span>
                      <span className="em-q-num">{qi + 1}.</span> {q.q}
                    </p>
                    <div className="em-rev-opts">
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className={`em-rev-opt${oi === q.answer ? " em-rev-correct" : ""}${oi === ua && !correct ? " em-rev-user-wrong" : ""}`}
                        >
                          <span className="em-opt-num">{OPTS[oi]})</span>
                          <span className="em-opt-txt">{opt}</span>
                          {oi === q.answer && (
                            <span className="em-correct-label">← சரியான விடை</span>
                          )}
                          {oi === ua && !correct && (
                            <span className="em-wrong-label">← உங்கள் விடை</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {skipped && <p className="em-skipped-note">⚠ பதிலளிக்கப்படவில்லை</p>}
                    {q.note && <p className="em-note">💡 {q.note}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        /* ════ Overlay & shell ════ */
        .em-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(3, 5, 15, 0.93);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
          color: #f3f2ff;
          padding: 8px;
        }

        .em-shell {
          background: linear-gradient(145deg, #0c1228, #160d30);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 22px;
          width: min(100%, 840px);
          height: calc(100dvh - 16px);
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.88);
          overflow: hidden;
          animation: emIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes emIn {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ════ Close button ════ */
        .em-x-btn {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.07);
          color: #f3f2ff;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 180ms;
          flex-shrink: 0;
        }
        .em-x-btn:hover { background: rgba(255, 255, 255, 0.14); }
        .em-x-btn-inline { position: static; }

        /* ════ INTRO ════ */
        .em-intro {
          flex: 1;
          overflow-y: auto;
          padding: 32px 24px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          position: relative;
        }

        .em-intro .em-x-btn {
          position: absolute;
          top: 16px;
          right: 16px;
        }

        .em-intro-icon { font-size: 2.8rem; line-height: 1; }

        .em-intro-title {
          margin: 0;
          font-size: clamp(1.15rem, 4vw, 1.55rem);
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          font-weight: 700;
        }

        .em-intro-units {
          margin: 0;
          color: #9fb2ff;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .em-intro-focus {
          margin: 0;
          color: #b4bbd6;
          font-size: 0.85rem;
          max-width: 540px;
          line-height: 1.5;
        }

        .em-meta-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .em-meta-box {
          background: rgba(255, 255, 255, 0.09);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 14px;
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 110px;
        }

        .em-meta-lbl {
          font-size: 0.7rem;
          color: #9fb2ff;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-weight: 700;
        }

        .em-meta-val {
          font-size: 1.35rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          font-weight: 700;
        }

        .em-instructions {
          background: rgba(127, 91, 255, 0.12);
          border: 1px solid rgba(127, 91, 255, 0.3);
          border-radius: 16px;
          padding: 16px 20px;
          text-align: left;
          max-width: 520px;
          width: 100%;
        }

        .em-instr-title { margin: 0 0 10px; font-weight: 700; font-size: 0.9rem; }

        .em-instr-list {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 6px;
        }

        .em-instr-list li { font-size: 0.84rem; color: #d0d6f8; line-height: 1.5; }

        .em-start-btn {
          appearance: none;
          border: 0;
          border-radius: 14px;
          padding: 13px 36px;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          background: linear-gradient(95deg, #22c55e, #16a34a);
          color: white;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(34, 197, 94, 0.38);
          transition: transform 180ms, box-shadow 180ms;
        }

        .em-start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(34, 197, 94, 0.55);
        }

        /* ════ TOPBAR ════ */
        .em-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          flex-shrink: 0;
          gap: 10px;
          flex-wrap: wrap;
        }

        .em-topbar-warn { border-bottom-color: rgba(251, 191, 36, 0.4); background: rgba(251, 191, 36, 0.05); }
        .em-topbar-crit { border-bottom-color: rgba(239, 68, 68, 0.45); background: rgba(239, 68, 68, 0.07); }

        .em-tb-left { display: flex; flex-direction: column; gap: 2px; }
        .em-tb-title { font-size: 0.85rem; font-weight: 700; color: #f3f2ff; }
        .em-tb-prog { font-size: 0.72rem; color: #9fb2ff; }

        .em-tb-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        .em-timer {
          font-size: 1.15rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          font-weight: 700;
          color: #77f2ff;
          min-width: 64px;
          text-align: right;
        }

        .em-timer-warn { color: #fbbf24; }

        .em-timer-crit {
          color: #ef4444;
          animation: emTimerPulse 1s ease infinite;
        }

        @keyframes emTimerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .em-submit-sm {
          appearance: none;
          border: 1px solid rgba(127, 91, 255, 0.4);
          border-radius: 10px;
          padding: 7px 14px;
          background: rgba(127, 91, 255, 0.18);
          color: #f3f2ff;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 180ms;
        }
        .em-submit-sm:hover { background: rgba(127, 91, 255, 0.36); }

        /* ════ QUESTION SCROLL ════ */
        .em-q-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 14px 16px 28px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
          display: grid;
          gap: 12px;
          align-content: start;
        }

        .em-q-wrap {
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 14px;
          transition: border-color 220ms;
        }

        .em-q-answered { border-color: rgba(127, 91, 255, 0.38); }

        .em-q-text {
          margin: 0 0 12px;
          font-size: 0.88rem;
          line-height: 1.7;
          color: #f0eeff;
        }

        .em-q-num {
          color: #9fb2ff;
          font-weight: 700;
          margin-right: 4px;
        }

        .em-opts { display: grid; gap: 7px; }

        .em-opt {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 12px;
          cursor: pointer;
          transition: all 180ms;
          background: rgba(255, 255, 255, 0.04);
          user-select: none;
        }

        .em-opt:hover {
          background: rgba(127, 91, 255, 0.1);
          border-color: rgba(127, 91, 255, 0.28);
        }

        .em-opt-sel {
          background: rgba(127, 91, 255, 0.22) !important;
          border-color: rgba(127, 91, 255, 0.6) !important;
        }

        .em-radio { display: none; }

        .em-opt-num {
          color: #9fb2ff;
          font-weight: 700;
          font-size: 0.82rem;
          flex-shrink: 0;
          min-width: 18px;
          margin-top: 1px;
        }

        .em-opt-txt {
          font-size: 0.85rem;
          line-height: 1.55;
          color: #e2e6ff;
        }

        /* ════ SUBMIT ROW ════ */
        .em-submit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 4px;
        }

        .em-submit-note {
          margin: 0;
          font-size: 0.83rem;
          color: #b4bbd6;
          line-height: 1.4;
        }

        .em-submit-lg {
          appearance: none;
          border: 0;
          border-radius: 13px;
          padding: 12px 28px;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          background: linear-gradient(95deg, #7f5bff, #3b82ff);
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(127, 91, 255, 0.38);
          transition: transform 180ms;
        }

        .em-submit-lg:hover { transform: translateY(-2px); }

        /* ════ RESULT ════ */
        .em-result-shell {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .em-result-hdr {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          flex-shrink: 0;
          gap: 12px;
        }

        .em-result-title {
          margin: 0;
          font-size: 1.2rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
        }

        .em-score-band {
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .em-score-ring {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .em-score-ring-inner {
          width: 72px;
          height: 72px;
          background: #0c1228;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .em-score-num {
          font-size: 1.55rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          font-weight: 700;
          line-height: 1;
        }

        .em-score-total {
          font-size: 0.7rem;
          color: #9fb2ff;
        }

        .em-score-meta {
          display: grid;
          gap: 4px;
          flex: 1;
        }

        .em-score-pct {
          margin: 0;
          font-size: 1.6rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          font-weight: 700;
          line-height: 1;
        }

        .em-score-grade { margin: 0; font-size: 0.92rem; font-weight: 600; }

        .em-score-time { margin: 0; font-size: 0.8rem; color: #b4bbd6; }

        .em-score-correct { margin: 0; font-size: 0.8rem; color: #9fb2ff; }

        /* ════ REVIEW ════ */
        .em-review {
          flex: 1;
          overflow-y: auto;
          padding: 14px 18px 28px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
          display: grid;
          gap: 10px;
          align-content: start;
        }

        .em-review-title {
          margin: 0 0 6px;
          font-size: 1rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          color: #dbe2ff;
        }

        .em-rev-q {
          border-radius: 14px;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
        }

        .em-rev-ok  { border-color: rgba(34, 197, 94, 0.3);  background: rgba(34, 197, 94, 0.06); }
        .em-rev-bad { border-color: rgba(239, 68, 68, 0.3);  background: rgba(239, 68, 68, 0.06); }
        .em-rev-skip { border-color: rgba(251, 191, 36, 0.3); background: rgba(251, 191, 36, 0.05); }

        .em-rev-q-text {
          margin: 0 0 10px;
          font-size: 0.87rem;
          line-height: 1.65;
          color: #f3f2ff;
          display: flex;
          gap: 6px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .em-rev-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .em-badge-ok   { background: rgba(34, 197, 94, 0.25);  color: #4ade80; }
        .em-badge-bad  { background: rgba(239, 68, 68, 0.22);  color: #f87171; }
        .em-badge-skip { background: rgba(251, 191, 36, 0.2);  color: #fbbf24; }

        .em-rev-opts { display: grid; gap: 5px; }

        .em-rev-opt {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 10px;
          border: 1px solid transparent;
          font-size: 0.83rem;
          line-height: 1.5;
          color: #c8ccf0;
          flex-wrap: wrap;
        }

        .em-rev-correct {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.45);
          color: #bbf7d0;
        }

        .em-rev-user-wrong {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .em-correct-label {
          margin-left: auto;
          font-size: 0.72rem;
          color: #4ade80;
          font-weight: 700;
          white-space: nowrap;
        }

        .em-wrong-label {
          margin-left: auto;
          font-size: 0.72rem;
          color: #f87171;
          font-weight: 700;
          white-space: nowrap;
        }

        .em-skipped-note {
          margin: 8px 0 0;
          font-size: 0.8rem;
          color: #fbbf24;
        }

        .em-note {
          margin: 8px 0 0;
          font-size: 0.82rem;
          color: #77f2ff;
          background: rgba(119, 242, 255, 0.08);
          border-radius: 8px;
          padding: 7px 10px;
          line-height: 1.5;
        }

        @media (min-width: 600px) {
          .em-shell { padding: 0; }
          .em-q-scroll { padding: 16px 22px 32px; }
          .em-review  { padding: 16px 22px 32px; }
        }
      `}</style>
    </div>,
    document.body
  );
}
