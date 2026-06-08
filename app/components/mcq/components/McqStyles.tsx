export default function McqStyles() {
  return (
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

      .game-hud {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .hud-item {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 12px;
        padding: 9px 10px;
        display: grid;
        gap: 3px;
      }

      .hud-label {
        margin: 0;
        font-size: 0.7rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #9fb2ff;
        font-weight: 700;
      }

      .hud-value {
        margin: 0;
        font-size: 0.82rem;
        color: #f3f2ff;
        font-weight: 700;
      }

      .daily-missions {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 10px 11px;
        display: grid;
        gap: 6px;
      }

      .daily-title {
        margin: 0;
        font-size: 0.78rem;
        color: #7dd3fc;
        font-weight: 700;
      }

      .mission-item {
        margin: 0;
        font-size: 0.78rem;
        color: #b4bbd6;
      }

      .mission-item.done {
        color: #86efac;
        font-weight: 600;
      }

      .game-over-card {
        border: 1px solid rgba(248, 113, 113, 0.45);
        background: rgba(248, 113, 113, 0.12);
        border-radius: 12px;
        padding: 11px 12px;
        display: grid;
        gap: 8px;
      }

      .game-over-title {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 700;
        color: #fee2e2;
      }

      .game-over-note {
        margin: 0;
        font-size: 0.8rem;
        color: #fecaca;
      }

      .restart-run-btn {
        appearance: none;
        border: 0;
        border-radius: 10px;
        padding: 8px 12px;
        background: linear-gradient(95deg, #fb7185, #ef4444);
        color: #fff;
        font-family: inherit;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        width: fit-content;
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

      .next-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
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
  );
}
