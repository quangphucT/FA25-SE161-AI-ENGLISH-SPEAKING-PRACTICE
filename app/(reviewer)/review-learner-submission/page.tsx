"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Submission = {
  id: string;
  question: string;
  audioUrl?: string;
  learnerAnswer?: string;
};

const sampleSubmissions: Submission[] = [
  {
    id: "S001",
    question: "Read this Word: apple",
    audioUrl: "/sample-audios/answer-1.mp3",
    learnerAnswer:
      "Pronounced as 'apple' with slight stress on first syllable.",
  },
  {
    id: "S002",
    question: "Read this Phrase: good morning",
    audioUrl: "/sample-audios/answer-2.mp3",
    learnerAnswer: "Slight pause between words, intonation ok.",
  },
  {
    id: "S003",
    question: "Answer the question: What is your hobby?",
    audioUrl: "/sample-audios/answer-3.mp3",
    learnerAnswer: "I like reading books and playing football on weekends.",
  },
];

const ReviewLearnerSubmission = () => {
  const [items] = useState<Submission[]>(sampleSubmissions);
  const [index, setIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [score, setScore] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState<
    false | "left" | "right"
  >(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = items[index];

  useEffect(() => {
    // Reset form and UI when switching item
    setComment("");
    setScore("");
    setShowAnswer(false);
    setDragX(0);
    setIsAnimatingOut(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [index]);

  const goNext = () => {
    if (index < items.length - 1) setIndex(index + 1);
  };

  const saveAndContinue = () => {
    // TODO: Integrate API submit here
    // console.log({ id: current.id, comment, score });
    goNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    setDragX(dx);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    // Simple swipe-right to skip/continue
    if (dx <= -60 || dx >= 60) {
      // animate out, then go next
      setIsAnimatingOut(dx > 0 ? "right" : "left");
      setDragX(dx > 0 ? 400 : -400);
      setTimeout(() => {
        goNext();
      }, 180);
    } else {
      // snap back
      setDragX(0);
    }
    setTouchStartX(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Review Learner Submission
        </h1>
        <p className="text-sm text-slate-500">
          Listen, comment, score, then continue or swipe to the next.
        </p>
      </div>

      <Card
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border border-slate-200/70 shadow-sm hover:shadow-md active:scale-[0.99] transition-transform"
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX / 35}deg)`,
          opacity: 1 - Math.min(Math.abs(dragX) / 600, 0.25),
          transition:
            touchStartX == null
              ? "transform 180ms ease, opacity 180ms ease"
              : undefined,
        }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{current.question}</CardTitle>
            <span className="text-xs text-slate-500">
              {index + 1}/{items.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {current.audioUrl && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-medium text-slate-700 mb-2">
                Audio
              </div>
              <audio ref={audioRef} controls className="w-full">
                <source src={current.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label
                htmlFor="comment"
                className="text-sm font-semibold text-gray-700"
              >
                Comment
              </Label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                className="mt-2 w-full h-28 text-sm border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
              />
            </div>
            <div>
              <Label
                htmlFor="score"
                className="text-sm font-semibold text-gray-700"
              >
                Score
              </Label>
              <Input
                id="score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="0 - 10"
                className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter a numeric score, e.g., 8.5
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowAnswer(!showAnswer)}
              className="cursor-pointer"
            >
              {showAnswer ? "Hide Ai Feedback" : "> View Ai Feedback"}
            </Button>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={goNext}
                className="cursor-pointer"
              >
                Vuốt qua (Skip)
              </Button>
              <Button
                onClick={saveAndContinue}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Tiếp tục (Save & Next)
              </Button>
            </div>
          </div>

          {showAnswer && (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-sm font-medium text-slate-700 mb-1">
                Ai Feedback
              </div>
              <p className="text-sm text-slate-700">
                {current.learnerAnswer || "(No text provided)"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewLearnerSubmission;
