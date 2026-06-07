"use client";

export default function ChemistryMcq() {
  return (
    <>
      <div className="subject-card">
        <div className="subject-header">
          <span className="subject-icon" aria-hidden="true">⚗️</span>
          <div>
            <h3 className="subject-name">வேதியியல் (Chemistry)</h3>
            <p className="subject-meta">விரைவில் வரும் · MCQ பயிற்சி</p>
          </div>
        </div>
        <div className="coming-badge">🔜 விரைவில் வரும்</div>
      </div>

      <style jsx>{`
        .subject-card {
          background: rgba(255, 255, 255, 0.06);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 16px;
          display: grid;
          gap: 12px;
          opacity: 0.65;
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

        .coming-badge {
          font-size: 0.83rem;
          color: #b4bbd6;
          padding: 9px 14px;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
