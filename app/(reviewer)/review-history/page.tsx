"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReviewReviewHistory, useReviewerTipAfterReview } from "@/features/reviewer/hooks/useReviewReview";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { useEffect, useRef, useState } from "react";
import { ReviewerReviewHistory } from "@/features/reviewer/services/reviewerReviewService";
import { Loader2, Gift, Play } from "lucide-react";

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
  learnerAnswerId?: string;
  reviewerEarnCoin?: number;
};

const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const mapReviewToReviewedAnswer = (review: ReviewerReviewHistory): ReviewedAnswer => {
  return {
    id: review.reviewId,
    question: review.questionContent,
    audioUrl: review.learnerAudioUrl, // ReviewerReviewHistory doesn't have audioUrl field
    comment: review.comment,
    score: review.score,
    status: (review.status as "Approved" | "Rejected" | "Pending") || "Pending",
    reviewedAt: formatDate(review.createdAt),
    questionType: (review.reviewType as "Word" | "Phrase" | "Sentence" | "Conversation") || "Word",
    learnerAnswerId: review.learnerAnswerId,
    reviewerEarnCoin: review.reviewerEarnCoin,
  };
};

const ReviewHistory = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const { data, isLoading, error } = useReviewReviewHistory(pageNumber, pageSize);
  const { data: meData } = useGetMeQuery();
  const tipAfterReviewMutation = useReviewerTipAfterReview();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingReviewId, setPlayingReviewId] = useState<string | null>(null);
  
  // Tip modal state
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewedAnswer | null>(null);
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");

  // Calculate pagination info
  const totalItems = data?.data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems > 0 ? (pageNumber - 1) * pageSize + 1 : 0;
  const endItem = Math.min(pageNumber * pageSize, totalItems);

  // Handle pagination
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleOpenTipModal = (review: ReviewedAnswer) => {
    setSelectedReview(review);
    setShowTipModal(true);
    setTipAmount("");
    setTipMessage("");
  };

  const handleCloseTipModal = () => {
    setShowTipModal(false);
    setSelectedReview(null);
    setTipAmount("");
    setTipMessage("");
  };

  const handleTipSubmit = async () => {
    if (!selectedReview || !meData?.reviewerProfile?.reviewerProfileId) {
      console.error("Missing review or reviewer profile ID");
      return;
    }
    const amount = Number(tipAmount);
    if (!amount || amount <= 0) {
      console.error("Invalid tip amount");
      return;
    }
    try {
      console.log("Submitting tip:", {
        reviewerId: meData.reviewerProfile.reviewerProfileId,
        amountCoin: amount,
        message: tipMessage.trim() || "Thank you for your submission!",
        reviewId: selectedReview.id,
        learnerAnswerId: selectedReview.learnerAnswerId,
      });
      
      if (!selectedReview.id) {
        console.error("Review ID is missing");
        return;
      }
      
      await tipAfterReviewMutation.mutateAsync({
        reviewId: selectedReview.id,
        amountCoin: amount,
        message: tipMessage.trim() || "Thank you for your submission!",
      });
      handleCloseTipModal();
    } catch (error) {
      console.error("Tip after review failed:", error);
    }
  };

  // Type assertion: API returns ReviewerReviewHistory[] but type says ReviewerReview[]
  const reviewedAnswers: ReviewedAnswer[] = (data?.data?.items as unknown as ReviewerReviewHistory[])?.map(mapReviewToReviewedAnswer) || [];

  const handlePlayAudio = (audioUrl: string | undefined, reviewId: string) => {
    if (!audioUrl) {
      console.warn("Audio URL is missing for review:", reviewId);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingReviewId(reviewId);

    audio.play().catch((err) => {
      console.error("Failed to play audio:", err);
      setPlayingReviewId(null);
    });

    audio.onended = () => {
      setPlayingReviewId(null);
      audioRef.current = null;
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reviewed Answers</h1>
          <p className="text-sm text-slate-500">
            Learner submissions you&apos;ve reviewed
          </p>
        </div>
        <div className="text-center py-8 text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reviewed Answers</h1>
          <p className="text-sm text-slate-500">
            Learner submissions you&apos;ve reviewed
          </p>
        </div>
        <div className="text-center py-8 text-red-500">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reviewed Answers</h1>
        <p className="text-sm text-slate-500">
          Learner submissions you&apos;ve reviewed
        </p>
      </div>

      {reviewedAnswers.length === 0 ? (
        <Card className="p-8">
          <div className="text-center text-slate-500">
            No reviewed answers found.
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-150">
                  
                  <TableHead className="font-bold text-slate-900">Question Type</TableHead>
                  <TableHead className="font-bold text-slate-900">Question</TableHead>
                  <TableHead className="font-bold text-slate-900">Comment</TableHead>
                  <TableHead className="font-bold text-slate-900 text-center">Score</TableHead>
                  <TableHead className="font-bold text-slate-900 text-center">Reviewer Earned Coins</TableHead>
                  <TableHead className="font-bold text-slate-900">Reviewed At</TableHead>
                  <TableHead className="font-bold text-slate-900">Audio</TableHead>
                  <TableHead className="font-bold text-slate-900 text-center">Actions</TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewedAnswers.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant={
                          item.questionType === "Word"
                            ? "default"
                            : item.questionType === "Phrase"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-center"
                      >
                        {item.questionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-slate-900 font-medium line-clamp-2">
                        {item.question}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-slate-700 line-clamp-3">
                        {item.comment}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 inline-block">
                        {item.score}/10
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm text-slate-700 line-clamp-3">
                        {item.reviewerEarnCoin} 
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-sm text-slate-600">
                      {item.reviewedAt}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(item.audioUrl, item.id)}
                          disabled={!item.audioUrl}
                          className={[
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400",
                            item.audioUrl
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60",
                            playingReviewId === item.id ? "ring-2 ring-slate-400 animate-pulse" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          aria-label={item.audioUrl ? "Play learner audio" : "Audio unavailable"}
                        >
                          <Play
                            className={`w-5 h-5 ${playingReviewId === item.id ? "scale-110 transition-transform" : ""}`}
                          />
                        </button>
                       
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTipModal(item)}
                        className="gap-2"
                        disabled={tipAfterReviewMutation.isPending}
                      >
                        {tipAfterReviewMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4" />
                            Tip
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {reviewedAnswers.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Showing {startItem}-{endItem} of {totalItems} reviewed answers
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pageNumber <= 3) {
                  pageNum = i + 1;
                } else if (pageNumber >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = pageNumber - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNumber === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={pageNumber >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Tip Learner</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Reward the learner for their submission
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipAmount" className="text-sm font-semibold">
                    Amount (Coins) *
                  </Label>
                  <Input
                    id="tipAmount"
                    type="number"
                    min="1"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipMessage" className="text-sm font-semibold">
                    Message
                  </Label>
                  <Input
                    id="tipMessage"
                    type="text"
                    value={tipMessage}
                    onChange={(e) => setTipMessage(e.target.value)}
                    placeholder="Optional message"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCloseTipModal}
                  disabled={tipAfterReviewMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTipSubmit}
                  disabled={tipAfterReviewMutation.isPending || !tipAmount || Number(tipAmount) <= 0}
                  className="gap-2"
                >
                  {tipAfterReviewMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4" />
                      Send Tip
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;
