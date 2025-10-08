"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ReviewedAnswer = {
  id: string;
  question: string;
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  comment: string;
  score: number; // 0-10
  status: "Approved" | "Rejected" | "Pending";
  reviewedAt: string; // DD/MM/YYYY
  questionType: "Word" | "Phrase" | "Sentence" | "Conversation";
};

const sampleReviewedAnswers: ReviewedAnswer[] = [
  {
    id: "A001",
    question: "the favorite fruit of me is apple",
    audioUrl: "/sample-audios/answer-1.mp3",
    comment:
      "Good fluency and coherent structure. Work on pronunciation of long vowels.",
    score: 8.5,
    status: "Approved",
    reviewedAt: "05/10/2025",
    questionType: "Word",
  },
  {
    id: "A002",
    question: "apple",
    audioUrl: "/sample-audios/answer-2.mp3",
    comment:
      "Ideas are solid but there are frequent pauses. Try to reduce filler words.",
    score: 7.0,
    status: "Pending",
    reviewedAt: "04/10/2025",
    questionType: "Phrase",
  },
  {
    id: "A003",
    question:
      "sing a song",
    comment:
      "Response lacks detail and examples. Consider expanding your answers.",
    score: 5.5,
    status: "Rejected",
    reviewedAt: "03/10/2025",
    questionType: "Sentence",
  },
];

const ReviewHistory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reviewed Answers</h1>
        <p className="text-sm text-slate-500">
          Learner submissions you&apos;ve reviewed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleReviewedAnswers.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      item.questionType === "Word"
                        ? "default"
                        : item.questionType === "Phrase"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {item.questionType}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">ID: {item.id}</span>
                </div>
                <Badge
                  variant={
                    item.status === "Approved"
                      ? "default"
                      : item.status === "Rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>
              <CardTitle className="text-[15px] font-semibold mt-2 leading-6 line-clamp-2">
                <span className="text-slate-500">Read this {item.questionType}: </span> {item.question}
              </CardTitle>
              <div className="text-xs text-slate-500 mt-1">
                Reviewed at: {item.reviewedAt}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {item.audioUrl && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-medium text-slate-700 mb-2">
                    Audio
                  </div>
                  <audio controls className="w-full">
                    <source src={item.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">
                  Comment
                </div>
                <p className="text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-3">
                  {item.comment}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">Status:</div>
                <div className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  Score {item.score}/10
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewHistory;
