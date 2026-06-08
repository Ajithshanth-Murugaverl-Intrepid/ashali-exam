"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BiologyMcq from "./components/BiologyMcq";
import ChemistryMcq from "./components/ChemistryMcq";
import PhysicsMcq from "./components/PhysicsMcq";

const EXAM_DATE = "2026-08-10T08:00:00+05:30";
const PREPARATION_START = "2025-01-01T00:00:00+05:30";
const NUMBER_FORMAT = new Intl.NumberFormat("en-US");

const QUOTES = [
  "Discipline is choosing what you want most over what you want now.",
  "You do not need more time. You need more focus.",
  "Success in A/L is built one chapter, one revision, one day at a time.",
  "Hard days are proof that your dream matters.",
  "Stay patient. Stay consistent. The result will follow.",
  "Every hour of study today is confidence you carry into the exam hall.",
  "Progress is not loud. It is repeated effort.",
  "Your future self is waiting for the choices you make today."
];

const CHALLENGES = [
  "Complete one full past-paper question under timed conditions.",
  "Do a 45-minute deep-focus session with zero distractions.",
  "Teach one difficult concept out loud in your own words.",
  "Review one weak topic and create a one-page summary sheet.",
  "Solve 20 MCQs and analyze every wrong answer.",
  "Run a 2-hour revision sprint: 50 min study + 10 min break x2.",
  "Memorize one key formula set and test recall after 2 hours.",
  "Finish one chapter recap before the end of the day."
];

type ExamMarkEntry = {
  subject: string;
  examCode: string;
  maxMark: number;
  mark: number;
};

const EXAM_MARK_ENTRIES: ExamMarkEntry[] = [
  { subject: "Physics", examCode: "PHY-B1-E1", maxMark: 50, mark: 38 },
  { subject: "Physics", examCode: "PHY-B2-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B3-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B3-E2", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B3-E3", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B3-E4", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B4-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B5-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B6-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B7-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B8-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B9-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B10-E1", maxMark: 50, mark: 0 },
  { subject: "Physics", examCode: "PHY-B11-E1", maxMark: 50, mark: 0 },

  { subject: "Biology", examCode: "BIO-B1-E1", maxMark: 50, mark: 37 },
  { subject: "Biology", examCode: "BIO-B2-E1", maxMark: 50, mark: 0 },
  { subject: "Biology", examCode: "BIO-B3-E1", maxMark: 50, mark: 0 },
  { subject: "Biology", examCode: "BIO-B4-E1", maxMark: 50, mark: 0 },
  { subject: "Biology", examCode: "BIO-B5-E1", maxMark: 50, mark: 0 },
  { subject: "Biology", examCode: "BIO-B6-E1", maxMark: 50, mark: 0 },
  { subject: "Biology", examCode: "BIO-B7-E1", maxMark: 50, mark: 0 },
  { subject: "Biology", examCode: "BIO-B7-E2", maxMark: 50, mark: 0 }

  // { subject: "Chemistry", examCode: "CHE-B1-E1", maxMark: 50, mark: 0 },
  // Add future exam papers here with examCode and mark.
];

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getEncouragement(daysRemaining: number) {
  if (daysRemaining > 160) return "Ashalini, your effort is compounding. Keep going.";
  if (daysRemaining > 100) return "You are building exam confidence one focused hour at a time.";
  if (daysRemaining > 60) return "The plan is working. Stay consistent and trust yourself.";
  if (daysRemaining > 30) return "Small wins today become big results in August.";
  return "You are closer than you think. Keep your momentum alive.";
}

export default function Home() {
  const examMs = useMemo(() => new Date(EXAM_DATE).getTime(), []);
  const prepStartMs = useMemo(() => new Date(PREPARATION_START).getTime(), []);

  const [now, setNow] = useState(prepStartMs);
  const [quoteIndex, setQuoteIndex] = useState(2);
  const [challengeIndex, setChallengeIndex] = useState(1);

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        left: ((index * 17.37) % 100),
        size: 2 + ((index * 1.11) % 5),
        duration: 8 + ((index * 1.7) % 11),
        delay: -((index * 0.9) % 18),
        bottom: -((index * 11.2) % 90)
      })),
    []
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        left: ((index * 9.21) % 100),
        size: 1 + ((index * 0.37) % 2.2),
        duration: 2 + ((index * 0.53) % 5),
        delay: -((index * 0.31) % 5),
        top: ((index * 13.73) % 100)
      })),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const diff = Math.max(0, examMs - now);
  const totalSeconds = Math.floor(diff / 1000);

  const countdown: Countdown = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };

  const weeksRemaining = (countdown.days / 7).toFixed(1);
  const studyHours = countdown.days * 4;
  const studySessions = Math.floor(studyHours / 2);

  const prepTotal = Math.max(1, examMs - prepStartMs);
  const prepElapsed = Math.max(0, now - prepStartMs);
  const prepTimelineProgress = Math.min(100, Math.max(0, (prepElapsed / prepTotal) * 100));
  const roundedTimelineProgress = Math.round(prepTimelineProgress);

  const completedExamsCount = EXAM_MARK_ENTRIES.filter((exam) => exam.mark > 0).length;
  const totalExamsCount = EXAM_MARK_ENTRIES.length;
  const examCompletionProgress = totalExamsCount > 0
    ? Math.round((completedExamsCount / totalExamsCount) * 100)
    : 0;

  const careerProgress = Math.min(100, Math.round(roundedTimelineProgress * 0.94 + 6));

  const hourNow = new Date(now).getHours();
  const greeting = getGreeting(hourNow);

  const subjectMarksSummary = useMemo(
    () => {
      const grouped = EXAM_MARK_ENTRIES.reduce<Record<string, ExamMarkEntry[]>>((acc, entry) => {
        if (!acc[entry.subject]) acc[entry.subject] = [];
        acc[entry.subject].push(entry);
        return acc;
      }, {});

      return Object.entries(grouped).map(([subject, exams]) => {
        const completedExams = exams.filter((exam) => exam.mark > 0);
        const total = exams.reduce((sum, exam) => sum + exam.mark, 0);
        const completedTotal = completedExams.reduce((sum, exam) => sum + exam.mark, 0);
        const completedMaxTotal = completedExams.reduce((sum, exam) => sum + exam.maxMark, 0);
        const completionRate = exams.length > 0 ? (completedExams.length / exams.length) * 100 : 0;
        const averageOutOf100 = completedExams.length > 0
          ? completedExams.reduce((sum, exam) => sum + ((exam.mark / exam.maxMark) * 100), 0) / completedExams.length
          : 0;

        return {
          subject,
          exams,
          total,
          completedTotal,
          completedMaxTotal,
          completionRate,
          averageOutOf100,
          completedExamsCount: completedExams.length,
          totalExamsCount: exams.length
        };
      });
    },
    []
  );

  const badges = [
    {
      icon: "🕊️",
      title: "Calm Starter",
      note: "You are taking the mission seriously.",
      unlocked: roundedTimelineProgress > 1
    },
    {
      icon: "🔥",
      title: "Momentum Builder",
      note: "Preparation progress reached 35%+.",
      unlocked: roundedTimelineProgress >= 35
    },
    {
      icon: "🎯",
      title: "Precision Focus",
      note: "Less than 100 days left. Focus gets sharper.",
      unlocked: countdown.days <= 100
    },
    {
      icon: "🌅",
      title: "Early Bird",
      note: "You opened the dashboard before 8 AM.",
      unlocked: hourNow < 8
    }
  ];

  return (
    <div className="page-wrap">
      <div className="bg-glow bg-glow-a" />
      <div className="bg-glow bg-glow-b" />

      <div className="field" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={`p-${index}`}
            className="particle"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              bottom: `${particle.bottom}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      <div className="star-field" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            key={`s-${index}`}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      <main className="app-shell">
        <section className="card reveal hero">
          <div className="hero-layout">
            <div>
              <p className="greeting">
                {greeting}, Ashalini
              </p>
              <h1>🎓 Ashalini&apos;s A/L 2026 Mission</h1>
              <p className="tagline">&quot;Today&apos;s effort is tomorrow&apos;s success.&quot;</p>
              <p className="encouragement">
                Ashalini, every study session brings you closer to your dream. Stay focused, trust the process, and make
                yourself proud. ❤️
                {"\n\n"}
                {getEncouragement(countdown.days)}
              </p>
            </div>
          </div>
        </section>

        <section className="card reveal countdown">
          <div className="section-title-wrap">
            <h2>Exam Countdown</h2>
            <p className="section-subtitle">August 10, 2026 at 8:00 AM (Asia/Colombo)</p>
          </div>
          <div className="timer-grid">
            <div className="timer-box">
              <span>{String(countdown.days).padStart(3, "0")}</span>
              <label>Days</label>
            </div>
            <div className="timer-box">
              <span>{pad(countdown.hours)}</span>
              <label>Hours</label>
            </div>
            <div className="timer-box">
              <span>{pad(countdown.minutes)}</span>
              <label>Minutes</label>
            </div>
            <div className="timer-box">
              <span>{pad(countdown.seconds)}</span>
              <label>Seconds</label>
            </div>
          </div>
        </section>

        <section className="card reveal progress-card">
          <div className="section-title-wrap">
            <h2>Preparation Progress</h2>
            <p className="section-subtitle">Based on completed exam papers</p>
          </div>
          <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={examCompletionProgress}>
            <div className="progress-fill" style={{ width: `${examCompletionProgress}%` }} />
          </div>
          <div className="progress-meta">
            <span className="progress-percent">{examCompletionProgress}%</span>
            <span className="progress-caption">{completedExamsCount}/{totalExamsCount} exams completed</span>
          </div>
        </section>

        <section className="card reveal">
          <div className="section-title-wrap">
            <h2>📖 பாட MCQ பயிற்சி</h2>
            <p className="section-subtitle">உயிரியல், இரசாயனவியல் & பெளதிகவியல் — தொகுதி வாரியாக கேள்விகள்</p>
          </div>
          <div className="subjects-grid">
            <PhysicsMcq />
            <BiologyMcq />
            <ChemistryMcq />
          </div>
        </section>

        <section className="card reveal marks-status">
          <div className="section-title-wrap">
            <h2>📊 Current Marks Status</h2>
            <p className="section-subtitle">Clean view of completion and performance for each subject</p>
          </div>
          <div className="marks-grid">
            {subjectMarksSummary.map((subject) => (
              <article key={subject.subject} className="marks-card">
                <div className="marks-head">
                  <div>
                    <h3>{subject.subject}</h3>
                    <p className="marks-head-subline">{subject.completedExamsCount}/{subject.totalExamsCount} papers completed</p>
                  </div>
                  <span className="subject-score-pill">{subject.averageOutOf100.toFixed(1)}%</span>
                </div>

                <div className="marks-progress-wrap">
                  <div className="marks-progress-label-row">
                    <p>Completion</p>
                    <span>{subject.completionRate.toFixed(0)}%</span>
                  </div>
                  <div className="marks-progress-track">
                    <div className="marks-progress-fill completion" style={{ width: `${subject.completionRate}%` }} />
                  </div>
                </div>

                <div className="marks-progress-wrap">
                  <div className="marks-progress-label-row">
                    <p>Average Score</p>
                    <span>{subject.averageOutOf100.toFixed(1)}%</span>
                  </div>
                  <div className="marks-progress-track">
                    <div className="marks-progress-fill performance" style={{ width: `${subject.averageOutOf100}%` }} />
                  </div>
                </div>

                <div className="marks-meta">
                  <p><strong>Total:</strong> {subject.total}</p>
                </div>
                <p className="marks-subline">Completed total: {subject.completedTotal}/{subject.completedMaxTotal || 0}</p>
                <div className="marks-chips">
                  {subject.exams.map((exam) => (
                    <span key={exam.examCode} className={`mark-chip ${exam.mark > 0 ? "done" : "pending"}`}>
                      {exam.examCode}: {exam.mark}/{exam.maxMark}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card reveal today-matters">
          <div className="section-title-wrap">
            <h2>🚀 Why Today Matters</h2>
            <p className="section-subtitle">Small daily actions create major future outcomes</p>
          </div>
          <div className="stats-grid">
            <article className="stat-box">
              <p className="stat-label">Days Remaining</p>
              <p className="stat-value">{countdown.days}</p>
            </article>
            <article className="stat-box">
              <p className="stat-label">Weeks Remaining</p>
              <p className="stat-value">{weeksRemaining}</p>
            </article>
            <article className="stat-box">
              <p className="stat-label">Potential Study Hours</p>
              <p className="stat-value">{NUMBER_FORMAT.format(studyHours)}h</p>
            </article>
            <article className="stat-box">
              <p className="stat-label">Potential Study Sessions</p>
              <p className="stat-value">{NUMBER_FORMAT.format(studySessions)}</p>
            </article>
          </div>
        </section>

        <section className="card reveal split-layout">
          <article className="panel">
            <h2>Daily Motivation</h2>
            <p className="quote-text">{QUOTES[quoteIndex]}</p>
            <button
              className="action-btn"
              type="button"
              onClick={() => setQuoteIndex((prev) => (prev + 1 + Math.floor(Math.random() * 3)) % QUOTES.length)}
            >
              New Quote
            </button>
          </article>

          <article className="panel">
            <h2>Study Challenge</h2>
            <p className="challenge-text">{CHALLENGES[challengeIndex]}</p>
            <button
              className="action-btn alt"
              type="button"
              onClick={() =>
                setChallengeIndex((prev) => (prev + 1 + Math.floor(Math.random() * 3)) % CHALLENGES.length)
              }
            >
              Random Challenge
            </button>
          </article>
        </section>

        <section className="card reveal badges-wrap">
          <div className="section-title-wrap">
            <h2>Achievement Badges</h2>
            <p className="section-subtitle">Your consistency creates your edge</p>
          </div>
          <div className="badges-grid">
            {badges.map((badge) => (
              <article key={badge.title} className={`badge ${badge.unlocked ? "unlocked" : ""}`}>
                <div className="badge-icon">{badge.icon}</div>
                <div>
                  <p className="badge-label">{badge.title}</p>
                  <p className="badge-note">{badge.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card reveal career-card">
          <div>
            <h2>Future Career Loading...</h2>
            <p className="section-subtitle">Every focused day adds momentum to your future.</p>
          </div>
          <figure className="hero-photo-wrap career-photo-wrap">
            <div className="hero-photo-frame">
              <Image
                src="/ashali.png"
                alt="Ashali visualized as a future doctor"
                width={620}
                height={760}
                priority
                className="hero-photo"
                style={{ borderRadius: "25px" }}
              />
            </div>
            <figcaption className="hero-photo-caption">Future Dr. Ashalini Murugaverl</figcaption>
          </figure>
          <div className="career-loader">
            <div className="career-progress" style={{ width: `${careerProgress}%` }} />
          </div>
          <p className="career-percent">{careerProgress}%</p>
        </section>

        <div className="mobile-end-spacer" aria-hidden="true" />
      </main>

      <style jsx>{`
        .page-wrap {
          min-height: 100dvh;
          position: relative;
          overflow-x: hidden;
          overflow-y: visible;
          color: #f3f2ff;
          background:
            radial-gradient(circle at 10% 0%, rgba(127, 91, 255, 0.25) 0%, rgba(127, 91, 255, 0) 45%),
            radial-gradient(circle at 90% 10%, rgba(59, 130, 255, 0.22) 0%, rgba(59, 130, 255, 0) 50%),
            linear-gradient(150deg, #080916, #0d1430);
          font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
        }

        .bg-glow {
          position: fixed;
          width: 45vw;
          height: 45vw;
          border-radius: 50%;
          filter: blur(65px);
          pointer-events: none;
          z-index: 0;
        }

        .bg-glow-a {
          background: rgba(255, 121, 199, 0.22);
          top: -10vw;
          right: -10vw;
        }

        .bg-glow-b {
          background: rgba(119, 242, 255, 0.12);
          bottom: -12vw;
          left: -12vw;
        }

        .field,
        .star-field {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .field {
          z-index: 0;
        }

        .star-field {
          z-index: 1;
        }

        .particle,
        .star {
          position: absolute;
          border-radius: 50%;
        }

        .particle {
          opacity: 0.45;
          background: linear-gradient(180deg, rgba(127, 91, 255, 0.9), rgba(255, 121, 199, 0.4));
          animation: floatUp linear infinite;
        }

        .star {
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          animation: twinkle ease-in-out infinite;
        }

        .app-shell {
          position: relative;
          z-index: 2;
          width: min(100%, 1100px);
          margin: 0 auto;
          padding: 18px 14px calc(150px + env(safe-area-inset-bottom));
          display: grid;
          gap: 14px;
        }

        .mobile-end-spacer {
          height: calc(64px + env(safe-area-inset-bottom));
        }

        .card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          box-shadow: 0 20px 55px rgba(5, 7, 20, 0.55);
          padding: 18px;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(127, 91, 255, 0.08), rgba(59, 130, 255, 0.03), rgba(255, 121, 199, 0.08));
          pointer-events: none;
        }

        .reveal {
          opacity: 0;
          transform: translateY(18px);
          animation: revealUp 760ms ease forwards;
        }

        .reveal:nth-child(2) {
          animation-delay: 90ms;
        }

        .reveal:nth-child(3) {
          animation-delay: 140ms;
        }

        .reveal:nth-child(4) {
          animation-delay: 190ms;
        }

        .reveal:nth-child(5) {
          animation-delay: 230ms;
        }

        .reveal:nth-child(6) {
          animation-delay: 280ms;
        }

        .reveal:nth-child(7) {
          animation-delay: 320ms;
        }

        h1,
        h2,
        .timer-box span,
        .stat-value,
        .career-percent,
        .progress-percent {
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          margin: 0;
        }

        .hero {
          padding-top: 24px;
        }

        .hero-layout {
          display: grid;
          gap: 14px;
        }

        h1 {
          font-size: clamp(1.35rem, 6vw, 2.4rem);
          letter-spacing: -0.02em;
        }

        h2 {
          font-size: clamp(1.15rem, 4vw, 1.65rem);
        }

        .greeting {
          margin: 0 0 10px;
          color: #77f2ff;
          font-weight: 700;
        }

        .tagline {
          margin: 10px 0 14px;
          color: #b4bbd6;
          font-size: 1rem;
          font-weight: 500;
        }

        .encouragement {
          margin: 0;
          padding: 14px;
          border-radius: 18px;
          background: rgba(127, 91, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.2);
          line-height: 1.6;
          white-space: pre-line;
        }

        .hero-photo-wrap {
          margin: 0;
          display: grid;
          gap: 8px;
        }

        .hero-photo-frame {
          border-radius: 25px !important;
          padding: 6px;
          background: linear-gradient(135deg, rgba(127, 91, 255, 0.75), rgba(59, 130, 255, 0.6), rgba(255, 121, 199, 0.5));
          box-shadow: 0 18px 28px rgba(9, 13, 32, 0.5);
          overflow: hidden;
        }

        .hero-photo {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 25px !important;
          object-fit: cover;
          max-height: 340px;
        }

        .hero-photo-caption {
          font-size: 0.82rem;
          color: #cfd5fb;
          letter-spacing: 0.02em;
        }

        .section-title-wrap {
          margin-bottom: 14px;
        }

        .section-subtitle {
          margin: 6px 0 0;
          color: #b4bbd6;
          font-size: 0.9rem;
        }

        .timer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .timer-box {
          text-align: center;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 18px;
          padding: 12px 8px;
        }

        .timer-box span {
          display: block;
          font-size: clamp(1.5rem, 8vw, 2.4rem);
          line-height: 1.1;
        }

        .timer-box label {
          color: #b4bbd6;
          letter-spacing: 0.03em;
          font-size: 0.76rem;
          text-transform: uppercase;
        }

        .progress-track,
        .career-loader {
          width: 100%;
          height: 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .progress-fill,
        .career-progress {
          width: 0;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #7f5bff, #3b82ff, #ff79c7);
          box-shadow: 0 0 25px rgba(127, 91, 255, 0.45);
          transition: width 900ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .progress-meta {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 0.92rem;
        }

        .progress-caption {
          color: #b4bbd6;
          text-align: right;
        }

        .stats-grid,
        .badges-grid {
          display: grid;
          gap: 10px;
        }

        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .stat-box,
        .badge {
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 18px;
          padding: 12px;
        }

        .stat-label {
          margin: 0 0 6px;
          color: #b4bbd6;
          font-size: 0.85rem;
        }

        .stat-value {
          font-size: clamp(1rem, 4.7vw, 1.35rem);
        }

        .split-layout {
          display: grid;
          gap: 12px;
        }

        .panel {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 18px;
          padding: 14px;
        }

        .quote-text,
        .challenge-text {
          margin: 12px 0;
          line-height: 1.6;
        }

        .action-btn {
          appearance: none;
          border: 0;
          border-radius: 12px;
          padding: 10px 14px;
          font-family: inherit;
          font-weight: 700;
          background: linear-gradient(95deg, #7f5bff, #3b82ff);
          color: white;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 10px 22px rgba(59, 130, 255, 0.27);
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .action-btn.alt {
          background: linear-gradient(95deg, #3b82ff, #ff79c7);
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .badge.unlocked {
          border-color: rgba(119, 242, 255, 0.45);
          background: linear-gradient(120deg, rgba(59, 130, 255, 0.2), rgba(119, 242, 255, 0.16));
        }

        .badge-icon {
          font-size: 1.25rem;
        }

        .badge-label {
          margin: 0;
          font-weight: 700;
        }

        .badge-note {
          margin: 2px 0 0;
          color: #b4bbd6;
          font-size: 0.86rem;
        }

        .career-card {
          display: grid;
          gap: 12px;
        }

        .career-photo-wrap {
          max-width: 360px;
          margin: 0 auto;
        }

        .career-card .hero-photo {
          max-height: 320px;
        }

        .subjects-grid {
          display: grid;
          gap: 12px;
        }

        .marks-grid {
          display: grid;
          gap: 12px;
          align-items: stretch;
          grid-auto-rows: 1fr;
        }

        .marks-card {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 18px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .marks-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .marks-head h3 {
          margin: 0;
          font-size: 1rem;
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
        }

        .marks-head span {
          color: #b4bbd6;
          font-size: 0.82rem;
        }

        .marks-head-subline {
          margin: 4px 0 0;
          color: #b4bbd6;
          font-size: 0.78rem;
        }

        .subject-score-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 62px;
          padding: 5px 11px;
          border-radius: 999px;
          color: #ffffff;
          background: linear-gradient(95deg, rgba(127, 91, 255, 0.9), rgba(59, 130, 255, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.28);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .marks-progress-wrap {
          display: grid;
          gap: 6px;
        }

        .marks-progress-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .marks-progress-label-row p,
        .marks-progress-label-row span {
          margin: 0;
          font-size: 0.78rem;
          color: #ccd1f2;
        }

        .marks-progress-track {
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.16);
          overflow: hidden;
        }

        .marks-progress-fill {
          height: 100%;
          border-radius: inherit;
          transition: width 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .marks-progress-fill.completion {
          background: linear-gradient(95deg, #22c55e, #84cc16);
        }

        .marks-progress-fill.performance {
          background: linear-gradient(95deg, #7f5bff, #3b82ff);
        }

        .marks-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .marks-meta p {
          margin: 0;
          font-size: 0.9rem;
          color: #e8e9ff;
        }

        .marks-subline {
          margin: 0;
          font-size: 0.8rem;
          color: #b4bbd6;
        }

        .marks-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-content: flex-start;
        }

        .mark-chip {
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.76rem;
          color: #cfd5fb;
          background: rgba(127, 91, 255, 0.15);
        }

        .mark-chip.done {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(134, 239, 172, 0.38);
          color: #dcfce7;
        }

        .mark-chip.pending {
          background: rgba(127, 91, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.22);
          color: #cfd5fb;
        }

        .average-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
          padding: 3px 10px;
          border-radius: 999px;
          font-weight: 800;
          letter-spacing: 0.01em;
          color: #ffffff;
          background: linear-gradient(95deg, #7f5bff, #3b82ff);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 8px 16px rgba(59, 130, 255, 0.24);
        }

        .career-percent {
          font-size: 1.1rem;
          text-align: right;
        }

        @keyframes revealUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatUp {
          from {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          to {
            transform: translateY(-20vh) translateX(22px);
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.1);
          }
        }

        @media (min-width: 720px) {
          .app-shell {
            padding: 30px 24px calc(130px + env(safe-area-inset-bottom));
            gap: 16px;
          }

          .hero-layout {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .hero-photo {
            max-height: 420px;
          }

          .mobile-end-spacer {
            height: 20px;
          }

          .card {
            padding: 22px;
          }

          .timer-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .split-layout {
            grid-template-columns: 1fr 1fr;
          }

          .badges-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .stats-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .subjects-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .marks-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
