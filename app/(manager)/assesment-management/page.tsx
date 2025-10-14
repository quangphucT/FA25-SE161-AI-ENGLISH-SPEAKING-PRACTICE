"use client";
import { useMemo, useState } from "react";
import type {
  Assessment,
  AssessmentDetail,
  PronunciationResult,
} from "@/types/assessment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data: one placement test with 3 word, 3 sentence, 1 paragraph
const learnerId = "learner-1";
const mockAssessments: Assessment[] = [
  {
    id: "asm-1",
    learnerId,
    type: "placement",
    score: 82,
    numberOfQuestion: 7,
    createdAt: new Date().toISOString(),
  },
];

const mockDetails: AssessmentDetail[] = [
  // 3 word
  {
    id: "ad-1",
    assessmentId: "asm-1",
    questionAssessmentId: "q-1",
    type: "word",
    answerAudio: "/audio/a1.mp3",
    score: 85,
    feedback: "Good articulation.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ad-2",
    assessmentId: "asm-1",
    questionAssessmentId: "q-2",
    type: "word",
    answerAudio: "/audio/a2.mp3",
    score: 75,
    feedback: "Watch the ending consonant.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ad-3",
    assessmentId: "asm-1",
    questionAssessmentId: "q-3",
    type: "word",
    answerAudio: "/audio/a3.mp3",
    score: 80,
    feedback: "Vowel length slightly short.",
    createdAt: new Date().toISOString(),
  },
  // 3 sentence
  {
    id: "ad-4",
    assessmentId: "asm-1",
    questionAssessmentId: "q-4",
    type: "sentence",
    answerAudio: "/audio/a4.mp3",
    score: 78,
    feedback: "Rhythm is uneven.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ad-5",
    assessmentId: "asm-1",
    questionAssessmentId: "q-5",
    type: "sentence",
    answerAudio: "/audio/a5.mp3",
    score: 84,
    feedback: "Clear stress on content words.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ad-6",
    assessmentId: "asm-1",
    questionAssessmentId: "q-6",
    type: "sentence",
    answerAudio: "/audio/a6.mp3",
    score: 79,
    feedback: "Linking can be improved.",
    createdAt: new Date().toISOString(),
  },
  // 1 paragraph
  {
    id: "ad-7",
    assessmentId: "asm-1",
    questionAssessmentId: "q-7",
    type: "paragraph",
    answerAudio: "/audio/a7.mp3",
    score: 85,
    feedback: "Overall good pacing.",
    createdAt: new Date().toISOString(),
  },
];

// Map question ids to human-readable question text
const questionTextById: Record<string, string> = {
  "q-1": "Apple",
  "q-2": "Banana",
  "q-3": "Computer",
  "q-4": "I like apples",
  "q-5": "She goes to school every day",
  "q-6": "They are watching a movie",
  "q-7": "Reading is a wonderful way to explore different worlds and ideas.",
};

const mockResults: PronunciationResult[] = [
  {
    id: "r-1",
    assessmentId: "asm-1",
    wordOrPhoneme: "th",
    expectedSound: "θ",
    learnerSound: "t",
    timestampMs: 520,
    accuracyScore: 60,
  },
  {
    id: "r-2",
    assessmentId: "asm-1",
    wordOrPhoneme: "long vowel",
    expectedSound: "iː",
    learnerSound: "ɪ",
    timestampMs: 1420,
    accuracyScore: 72,
  },
];

export default function AssesmentManagement() {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    mockAssessments[0]?.id
  );
  // const selected = useMemo(() => mockAssessments.find(a => a.id === selectedAssessmentId), [selectedAssessmentId]);
  const details = useMemo(
    () => mockDetails.filter((d) => d.assessmentId === selectedAssessmentId),
    [selectedAssessmentId]
  );
  const results = useMemo(
    () => mockResults.filter((r) => r.assessmentId === selectedAssessmentId),
    [selectedAssessmentId]
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý bài kiểm tra đầu vào</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Assessments list */}
        <Card className="lg:col-span-4 p-3">
          <h2 className="font-medium mb-2">Danh sách bài kiểm tra</h2>
          <ul className="space-y-2">
            {mockAssessments.map((a) => (
              <li key={a.id}>
                <Button
                  variant={
                    a.id === selectedAssessmentId ? "default" : "secondary"
                  }
                  className="w-full justify-start"
                  onClick={() => setSelectedAssessmentId(a.id)}
                >
                  <div className="flex flex-col items-start">
                    <span>Mã: {a.id}</span>
                    <span className="text-xs text-muted-foreground">
                      Loại: {a.type} • Câu hỏi: {a.numberOfQuestion} • Điểm:{" "}
                      {a.score ?? "-"}
                    </span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Center: Detail by question */}
        <Card className="lg:col-span-5 p-3">
          <h2 className="font-medium mb-2">Chi tiết bài kiểm tra</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {details.map((d) => (
              <div key={d.id} className="border rounded p-2">
                <div className="text-sm">Loại: {d.type}</div>
                <div className="text-sm">Điểm: {d.score ?? "-"}</div>
                <div className="text-sm">
                  Câu hỏi:{" "}
                  {questionTextById[d.questionAssessmentId] ??
                    d.questionAssessmentId}
                </div>
                {d.answerAudio && (
                  <audio controls className="mt-1 w-full">
                    <source src={d.answerAudio} />
                  </audio>
                )}
                {d.feedback && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {d.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Pronunciation results */}
        <Card className="lg:col-span-3 p-3">
          <h2 className="font-medium mb-2">Kết quả phát âm</h2>
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.id} className="text-sm">
                <div className="font-medium">{r.wordOrPhoneme}</div>
                <div className="text-xs">
                  Mong đợi: {r.expectedSound} • Thực tế: {r.learnerSound}
                </div>
                <div className="text-xs">
                  Thời gian: {r.timestampMs}ms • Độ chính xác: {r.accuracyScore}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
