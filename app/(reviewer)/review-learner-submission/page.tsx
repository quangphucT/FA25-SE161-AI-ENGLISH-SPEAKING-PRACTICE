"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useSelectedReviewsStore } from "@/store/selectedReviewsStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = items[index];

  useEffect(() => {
    // Reset form and UI when switching item
    setComment("");
    setScore("");
    setShowAnswer(false);
    setDragX(0);
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

  const handleSelectSubmission = (submissionId: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(submissionId)
        ? prev.filter((id) => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === items.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(items.map((item) => item.id));
    }
  };

  const selectedItems = items.filter((item) =>
    selectedSubmissions.includes(item.id)
  );

  // Read selected items from global store and merge with local selection
  const { selectedReviews } = useSelectedReviewsStore();
  const sidebarItems: Submission[] = useMemo(() => {
    if (selectedReviews.length === 0) return selectedItems;
    // Map global selected to Submission shape when possible, fallback if not found
    const mapped: Submission[] = selectedReviews.map((r) => {
      const found = items.find((i) => String(i.id) === String(r.id));
      return (
        found || {
          id: String(r.id),
          question: r.question,
          audioUrl: r.audioUrl,
        }
      );
    });
    return mapped;
  }, [selectedReviews, selectedItems, items]);

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Review Learner Submission
                </h1>
                <p className="text-sm text-slate-500">
                  Listen, comment, score, then continue or swipe to the next.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedSubmissions.length === items.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </Button>
              </div>
            </div>
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
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedSubmissions.includes(current.id)}
                    onCheckedChange={() => handleSelectSubmission(current.id)}
                    className="w-4 h-4"
                  />
                  <CardTitle className="text-base">
                    {current.question}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSubmissions.includes(current.id) && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                      Đã chọn
                    </Badge>
                  )}
                  <span className="text-xs text-slate-500">
                    {index + 1}/{items.length}
                  </span>
                </div>
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

        {/* Right Sidebar - Selected Submissions */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Danh sách đã chọn</CardTitle>
                    <p className="text-sm text-gray-500">
                      {selectedSubmissions.length} câu trả lời
                    </p>
                  </div>
                  {selectedSubmissions.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubmissions([])}
                      className="text-xs"
                    >
                      Bỏ chọn tất cả
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📝</div>
                    <p className="text-sm text-gray-500">
                      Chưa có câu trả lời nào được chọn
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-lg border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b">
                          <TableHead className="w-10"></TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700">
                            ID
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700">
                            Câu hỏi
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700">
                            Audio
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sidebarItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="w-10">
                              <Checkbox
                                checked={true}
                                onCheckedChange={() =>
                                  handleSelectSubmission(item.id)
                                }
                                className="w-4 h-4"
                              />
                            </TableCell>
                            <TableCell className="text-xs text-gray-700 font-medium">
                              {item.id}
                            </TableCell>
                            <TableCell className="text-xs text-gray-900 max-w-[220px]">
                              <div className="line-clamp-2">
                                {item.question}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.audioUrl ? (
                                <audio controls className="h-6">
                                  <source
                                    src={item.audioUrl}
                                    type="audio/mpeg"
                                  />
                                </audio>
                              ) : (
                                <span className="text-[10px] text-gray-500">
                                  Không có
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewLearnerSubmission;
