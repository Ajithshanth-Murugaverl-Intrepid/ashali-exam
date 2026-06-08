import { type Batch } from "../types";

type McqUnitModeProps = {
  batches: Batch[];
  selectedBatch: Batch | null;
  onSelectBatch: (batchId: string) => void;
  onBackToBatches: () => void;
  onSelectExam: (batchId: string, examCode: string) => void;
};

export default function McqUnitMode({
  batches,
  selectedBatch,
  onSelectBatch,
  onBackToBatches,
  onSelectExam
}: McqUnitModeProps) {
  return (
    <div className="unit-mode">
      {!selectedBatch && (
        <div className="batch-grid">
          {batches.map((batch) => {
            const availableExamCount = batch.exams.filter((exam) => exam.examQuestions.length > 0).length;
            const totalBatchQuestions = batch.exams.reduce((sum, exam) => sum + exam.target, 0);
            return (
              <button
                key={batch.id}
                className="batch-card"
                type="button"
                onClick={() => onSelectBatch(batch.id)}
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
            <button className="back-btn" type="button" onClick={onBackToBatches}>
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
                onClick={() => onSelectExam(selectedBatch.id, exam.examCode)}
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
  );
}
