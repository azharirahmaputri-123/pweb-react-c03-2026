// [ORANG 3] Latihan interview berwaktu
import { useState } from "react";
import { useCountdown } from "../hooks/useCountdown";

const IT_INTERVIEW_QUESTIONS = [
  "Ceritakan pengalaman tersulitmu saat mengelola asynchronous state di React dan bagaimana caramu mengatasinya?",
  "Jelaskan perbedaan mendasar antara state management lokal (useState/useReducer) dengan Context API dan kapan saat yang tepat menggunakannya?",
  "Bagaimana cara kerjamu saat mengoptimasi performa render komponen React yang lambat atau sering re-render?",
  "Jika terjadi bentrok jadwal atau deadline proyek magang yang mepet, bagaimana strategi prioritas dan komunikasi yang kamu lakukan?",
  "Jelaskan konsep Immutability dalam JavaScript/TypeScript dan mengapa sangat penting saat memanipulasi state di React?",
];

export interface InterviewPrepProps {
  // tanpa props
}

export default function InterviewPrep(_props: InterviewPrepProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { secondsLeft, isRunning, toggle, reset } = useCountdown(120);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % IT_INTERVIEW_QUESTIONS.length);
    reset(); // reset timer ke 02:00
  };

  return (
    <div className="wr-card" style={{ background: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Latihan Interview Magang</h4>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
          Soal {currentQuestionIndex + 1} dari {IT_INTERVIEW_QUESTIONS.length}
        </span>
      </div>

      <div
        style={{
          background: "#ffffff",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          fontSize: "14px",
          lineHeight: 1.5,
          color: "#334155",
          marginBottom: "16px",
        }}
      >
        "{IT_INTERVIEW_QUESTIONS[currentQuestionIndex]}"
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            fontFamily: "monospace",
            color: secondsLeft <= 30 ? "#dc2626" : "#0f766e",
          }}
        >
          {formatTime(secondsLeft)}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={toggle}
            className={`wr-btn ${isRunning ? "wr-btn-outline" : "wr-btn-primary"}`}
          >
            {isRunning ? "Jeda (Pause)" : "Mulai (Start)"}
          </button>
          <button type="button" onClick={reset} className="wr-btn wr-btn-outline">
            Reset
          </button>
          <button type="button" onClick={handleNextQuestion} className="wr-btn wr-btn-outline">
            Soal Berikutnya ➔
          </button>
        </div>
      </div>
    </div>
  );
}
