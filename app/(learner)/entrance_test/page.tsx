"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { useGetQuestionTestQuery } from "@/features/manager/hook/useGetQuestionTestAssessment";

const steps = [
  {
    desc: 'Hãy đọc to từ sau :',
    type: "word",
    sample: "Apple",
  },
  {
    desc: 'Hãy đọc to câu sau: &quot;I like learning English.&quot;',
    type: "sentence",
    sample: "I like learning English.",
  },
  {
    desc: "Hãy giới thiệu bản thân với AI trong 30 giây.",
    type: "conversation",
    sample: "Xin chào, tôi tên là ...",
  },
];

const feedbackSamples = [
  "Phát âm từ 'apple' tốt, cần chú ý âm cuối.",
  "Câu nói rõ ràng, ngữ điệu tự nhiên.",
  "Bạn giao tiếp tự tin, nên luyện thêm phản xạ.",
];

const EntranceTest = () => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState([false, false, false]);

  // Demo: simulate recording
  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const newRec = [...recorded];
      newRec[step] = true;
      setRecorded(newRec);
    }, 2000); // Simulate 2s recording
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#181f2a]">
      <div className="w-[900px] mt-11 h-[15px] mb-[60px] flex rounded-full overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-full transition-all duration-300 ${
              step > i || done ? "bg-[#58cc02]" : "bg-[#37464F]"
            }`}
            style={{ width: "33.3333%" }}
          />
        ))}
      </div>

      {!done ? (
        <div className="w-full text-center">
          <div className="mb-[160px] font-bold text-[29px] text-[#cbe7ff]">
            {steps[step].desc}
          </div>
          <div className="mb-4 text-2xl font-bold text-[#fff]">
            {steps[step].sample}
          </div>
          <div className="flex flex-col items-center gap-4 mb-4">
            <Button
              className={`rounded-full w-20 h-20 flex items-center justify-center text-3xl bg-[#4fc3f7] shadow-lg ${
                isRecording ? "animate-pulse" : ""
              }`}
              onClick={handleRecord}
              disabled={isRecording || recorded[step]}
              aria-label="Ghi âm"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#181f2a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="2" width="6" height="14" rx="3" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                <line x1="12" y1="22" x2="12" y2="16" />
              </svg>
            </Button>
            <span className="text-[#cbe7ff] text-sm">
              Nhấn vào micro để bắt đầu ghi âm
            </span>
            {isRecording && (
              <span className="text-[#58cc02] font-bold">Đang ghi âm...</span>
            )}
            {recorded[step] && (
              <span className="text-[#58cc02] font-bold">Đã ghi âm xong!</span>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full text-center">
          <div className="text-2xl font-bold mb-4 text-[#4fc3f7]">
            Phản hồi kết quả
          </div>
          <ul className="mb-4 text-left mx-auto max-w-md">
            {feedbackSamples.map((fb, idx) => (
              <li key={idx} className="mb-2 text-[#e3e8ee]">
                {fb}
              </li>
            ))}
          </ul>
          <Button
            className="bg-[#4fc3f7] text-[#181f2a] font-bold px-8 py-3 rounded-xl shadow hover:bg-[#29b6f6]"
            onClick={() =>
              (window.location.href = "/learner/dashboard-learner")
            }
          >
            Vào trang học
          </Button>
        </div>
      )}

      {/* Footer kiểu Duolingo */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#22313f] py-6 px-[350px] flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <div className="rounded-full bg-[#181f2a] w-16 h-16 flex items-center justify-center">
            {recorded[step] ? (
              // Icon check xanh khi đã ghi âm xong
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#58cc02" />
                <path d="M8 12l2.5 2.5L16 9" stroke="#181f2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              // Icon micro khi chưa ghi âm
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="14" rx="3" fill="#58cc02" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#181f2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="22" x2="12" y2="16" stroke="#181f2a" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          {step < steps.length - 1 ? (
            <div>
              <div className="text-2xl font-bold text-[#58cc02]">
                {recorded[step] ? "Great!" : "Keep going!"}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <Button
          className={`${
            recorded[step]
              ? "bg-[#58cc02] text-[#181f2a]"
              : "bg-[#37464F] text-[#cbe7ff]"
          } font-bold px-8 py-3 rounded-xl shadow hover:bg-[#47b800]`}
          onClick={handleNext}
          disabled={!recorded[step]}
        >
          {step < steps.length - 1 ? "Tiếp tục" : "Hoàn thành"}
        </Button>
      </footer>
    </div>
  );
};

export default EntranceTest;
