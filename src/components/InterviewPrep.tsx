// [ORANG 3] Latihan interview berwaktu
import { useState } from "react";
import { useCountdown } from "../hooks/useCountdown";

export interface InterviewPrepProps {
  // tanpa props: daftar >= 5 pertanyaan ada di dalam komponen / konstanta
}

const INTERVIEW_QUESTIONS: string[] = [
  "Ceritakan proyek web paling menantang yang pernah kamu kerjakan dan keputusan teknis yang kamu ambil.",
  "Ceritakan bug tersulit saat mengelola state di proyek React yang pernah kamu buat, dan bagaimana kamu memperbaikinya?",
  "Bagaimana cara kamu menangani request API asynchronous di React agar tidak terjadi race condition atau memory leak?",
  "Apa perbedaan state lokal, derived state, dan props drilling? Kapan kamu membuat Custom Hook sendiri?",
  "Jika diberi deadline magang yang mepet sementara ada dua fitur belum selesai, bagaimana cara kamu memprioritaskannya?",
  "Jelaskan pengalaman kamu berkolaborasi dengan Git (branching, pull request, dan menyelesaikan merge conflict).",
];

function formatTimer(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function InterviewPrep(_props: InterviewPrepProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const { secondsLeft, isRunning, toggle, reset } = useCountdown(120);

  function handleNextQuestion() {
    setQuestionIndex((prev) => (prev + 1) % INTERVIEW_QUESTIONS.length);
    reset();
  }

  return (
    <section className="card detail-panel interview-prep">
      <div className="row between">
        <h4>Latihan Interview</h4>
        <span className="muted">
          Soal {questionIndex + 1} / {INTERVIEW_QUESTIONS.length}
        </span>
      </div>

      <blockquote className="prep-question">
        “{INTERVIEW_QUESTIONS[questionIndex]}”
      </blockquote>

      <div className="prep-controls">
        <div
          className={`prep-timer ${secondsLeft <= 15 ? "prep-timer-low" : ""}`}
          aria-live="polite"
        >
          {formatTimer(secondsLeft)}
        </div>

        <div className="row">
          <button type="button" className="btn btn-primary" onClick={toggle}>
            {isRunning ? "Jeda" : "Mulai"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={reset}>
            Reset
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleNextQuestion}>
            Soal Berikutnya
          </button>
        </div>
      </div>
    </section>
  );
}
