type McqModeTabsProps = {
  mode: "random" | "unit";
  onChangeMode: (next: "random" | "unit") => void;
};

export default function McqModeTabs({ mode, onChangeMode }: McqModeTabsProps) {
  return (
    <div className="phy-mode-tabs" role="tablist">
      <button
        role="tab"
        aria-selected={mode === "random"}
        className={mode === "random" ? "phy-tab phy-tab-active" : "phy-tab"}
        type="button"
        onClick={() => onChangeMode("random")}
      >
        🎲 சீரற்ற கேள்விகள்
      </button>
      <button
        role="tab"
        aria-selected={mode === "unit"}
        className={mode === "unit" ? "phy-tab phy-tab-active" : "phy-tab"}
        type="button"
        onClick={() => onChangeMode("unit")}
      >
        📚 அலகு வாரியாக
      </button>
    </div>
  );
}
