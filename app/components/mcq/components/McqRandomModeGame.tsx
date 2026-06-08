import { type RandomQuestion } from "../types";

type McqRandomModeGameProps = {
  currentQ: RandomQuestion | null;
  randomQuestionsCount: number;
  seenIdsSize: number;
  seenPercent: number;
  hearts: number;
  startingHearts: number;
  currentStreak: number;
  bestStreak: number;
  totalAccuracy: number;
  totalCorrect: number;
  totalAnswered: number;
  level: number;
  xp: number;
  todayKey: string;
  dailyMissionQuestionsDone: boolean;
  dailyAnswered: number;
  dailyMissionAccuracyDone: boolean;
  dailyAccuracy: number;
  dailyStreakMissionDone: boolean;
  isRunOver: boolean;
  randomBackStackLength: number;
  revealed: boolean;
  selectedAnswer: number | null;
  onSelectRandomAnswer: (idx: number) => void;
  onRestartRun: () => void;
  onBackRandom: () => void;
  onNextRandom: () => void;
};

export default function McqRandomModeGame({
  currentQ,
  randomQuestionsCount,
  seenIdsSize,
  seenPercent,
  hearts,
  startingHearts,
  currentStreak,
  bestStreak,
  totalAccuracy,
  totalCorrect,
  totalAnswered,
  level,
  xp,
  todayKey,
  dailyMissionQuestionsDone,
  dailyAnswered,
  dailyMissionAccuracyDone,
  dailyAccuracy,
  dailyStreakMissionDone,
  isRunOver,
  randomBackStackLength,
  revealed,
  selectedAnswer,
  onSelectRandomAnswer,
  onRestartRun,
  onBackRandom,
  onNextRandom
}: McqRandomModeGameProps) {
  if (!currentQ) {
    return <p className="empty-batch">சீரற்ற பயிற்சிக்கான கேள்விகள் இன்னும் சேர்க்கப்படவில்லை.</p>;
  }

  return (
    <div className="random-mode">
      <div className="game-hud">
        <div className="hud-item">
          <p className="hud-label">Hearts</p>
          <p className="hud-value">{"❤".repeat(hearts)}{"♡".repeat(startingHearts - hearts)}</p>
        </div>
        <div className="hud-item">
          <p className="hud-label">Streak</p>
          <p className="hud-value">{currentStreak} (Best {bestStreak})</p>
        </div>
        <div className="hud-item">
          <p className="hud-label">Accuracy</p>
          <p className="hud-value">{totalAccuracy}% ({totalCorrect}/{totalAnswered})</p>
        </div>
        <div className="hud-item">
          <p className="hud-label">Level</p>
          <p className="hud-value">Lv.{level} · {xp} XP</p>
        </div>
      </div>

      <div className="daily-missions">
        <p className="daily-title">Daily Missions ({todayKey})</p>
        <p className={`mission-item ${dailyMissionQuestionsDone ? "done" : ""}`}>
          {dailyMissionQuestionsDone ? "✅" : "⬜"} Answer 15 questions ({dailyAnswered}/15)
        </p>
        <p className={`mission-item ${dailyMissionAccuracyDone ? "done" : ""}`}>
          {dailyMissionAccuracyDone ? "✅" : "⬜"} Keep 80%+ accuracy (today: {dailyAccuracy}%)
        </p>
        <p className={`mission-item ${dailyStreakMissionDone ? "done" : ""}`}>
          {dailyStreakMissionDone ? "✅" : "⬜"} Reach a streak of 7
        </p>
      </div>

      <div className="seen-bar" role="progressbar" aria-valuenow={seenPercent} aria-valuemin={0} aria-valuemax={100}>
        <div className="seen-fill" style={{ width: `${seenPercent}%` }} />
      </div>

      {isRunOver && (
        <div className="game-over-card">
          <p className="game-over-title">❤️ Hearts finished for this run</p>
          <p className="game-over-note">Restart to continue random challenge mode.</p>
          <button className="restart-run-btn" type="button" onClick={onRestartRun}>
            Restart Challenge
          </button>
        </div>
      )}

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
                onClick={() => onSelectRandomAnswer(idx)}
                disabled={revealed || isRunOver}
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
          onClick={onBackRandom}
          disabled={randomBackStackLength === 0}
        >
          ← முந்தைய கேள்வி
        </button>

        <button className="next-btn" type="button" onClick={onNextRandom} disabled={isRunOver}>
          அடுத்த கேள்வி →
        </button>
      </div>

      {seenIdsSize === randomQuestionsCount && randomQuestionsCount > 0 && (
        <p className="all-seen-note">
          🎉 அனைத்து கேள்விகளும் பார்க்கப்பட்டன! மீண்டும் தொடங்குகிறோம்...
        </p>
      )}
    </div>
  );
}
