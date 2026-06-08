type McqSubjectCardProps = {
  icon: string;
  title: string;
  meta: string;
  buttonText: string;
  onOpen: () => void;
};

export default function McqSubjectCard({ icon, title, meta, buttonText, onOpen }: McqSubjectCardProps) {
  return (
    <div className="subject-card">
      <div className="subject-header">
        <span className="subject-icon" aria-hidden="true">{icon}</span>
        <div>
          <h3 className="subject-name">{title}</h3>
          <p className="subject-meta">{meta}</p>
        </div>
      </div>
      <button className="practice-btn" type="button" onClick={onOpen}>
        {buttonText}
      </button>
    </div>
  );
}
