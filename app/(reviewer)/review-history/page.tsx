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
import { Loader2, Gift, Play, History, MessageSquare, Star, Calendar, Coins, Volume2, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
      toast.success(`Tip of ${amount} coins sent successfully!`, {
        description: tipMessage.trim() || "Thank you for your submission!",
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
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <History className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Reviewed Answers</h1>
              <p className="text-blue-100 mt-1">
                Learner submissions you&apos;ve reviewed
              </p>
            </div>
          </div>
        </div>
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-slate-600 font-medium">Loading review history...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <History className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Reviewed Answers</h1>
              <p className="text-blue-100 mt-1">
                Learner submissions you&apos;ve reviewed
              </p>
            </div>
          </div>
        </div>
        <Card className="p-12 border-red-200 bg-red-50">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold text-lg">Error loading reviews</p>
            <p className="text-red-500 text-sm">{error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
              <History className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Reviewed Answers</h1>
              <p className="text-blue-100 mt-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Learner submissions you&apos;ve reviewed
              </p>
            </div>
          </div>
          {totalItems > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-blue-100">Total Reviews</div>
            </div>
          )}
        </div>
      </div>

      {reviewedAnswers.length === 0 ? (
        <Card className="p-12 border-2 border-dashed border-slate-200">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="p-4 bg-slate-100 rounded-full">
              <History className="w-12 h-12 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-700">No reviewed answers found</h3>
              <p className="text-slate-500 mt-2">Start reviewing learner submissions to see them here.</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 hover:from-slate-100 hover:via-blue-100 hover:to-indigo-100 border-b-2 border-slate-200">
                  <TableHead className="font-bold text-slate-900 text-sm uppercase tracking-wide">Type</TableHead>
                  <TableHead className="font-bold text-slate-900 text-sm uppercase tracking-wide">Question</TableHead>
                  <TableHead className="font-bold text-slate-900 text-sm uppercase tracking-wide">Comment</TableHead>
                  <TableHead className="font-bold text-slate-900 text-center text-sm uppercase tracking-wide">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4" />
                      Score
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-900 text-center text-sm uppercase tracking-wide">
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="w-4 h-4" />
                      Earned
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Audio
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-900 text-center text-sm uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewedAnswers.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border-b border-slate-100 group"
                    style={{ animationDelay: `${index * 50}ms` }}
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
                        className={`text-center font-semibold shadow-sm ${
                          item.questionType === "Word"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : item.questionType === "Phrase"
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        }`}
                      >
                        {item.questionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-slate-900 font-semibold line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {item.question}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                        {item.comment || <span className="text-slate-400 italic">No comment</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-1 shadow-sm ${
                        item.score >= 8
                          ? "bg-green-100 text-green-700"
                          : item.score >= 6
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        <Star className={`w-4 h-4 ${item.score >= 8 ? "fill-green-600" : item.score >= 6 ? "fill-yellow-600" : "fill-red-600"}`} />
                        {item.score}/10
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-700 font-semibold">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="text-base">{item.reviewerEarnCoin || 0}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {item.reviewedAt}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(item.audioUrl, item.id)}
                          disabled={!item.audioUrl}
                          className={[
                            "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 shadow-sm",
                            item.audioUrl
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-110 hover:shadow-lg"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60",
                            playingReviewId === item.id ? "ring-4 ring-blue-300 animate-pulse scale-110" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          aria-label={item.audioUrl ? "Play learner audio" : "Audio unavailable"}
                        >
                          <Play
                            className={`w-5 h-5 ${playingReviewId === item.id ? "scale-125 transition-transform" : ""} ${item.audioUrl ? "fill-white" : ""}`}
                          />
                        </button>
                       
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTipModal(item)}
                        className="gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300 hover:shadow-md transition-all font-semibold"
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
        <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-slate-600 font-medium flex items-center gap-2">
              <span className="bg-white px-3 py-1 rounded-lg shadow-sm">Showing</span>
              <span className="font-bold text-blue-600">{startItem}-{endItem}</span>
              <span>of</span>
              <span className="font-bold text-indigo-600">{totalItems}</span>
              <span>reviewed answers</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={pageNumber === 1}
                className="shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                Trước
              </Button>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm">
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
                      className={`w-9 h-9 p-0 font-semibold transition-all ${
                        pageNumber === pageNum
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "hover:bg-slate-100"
                      }`}
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
                className="shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                Sau
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={handleCloseTipModal}
        >
          <Card 
            className="w-full max-w-md shadow-2xl border-0 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 space-y-6 bg-gradient-to-br from-white to-blue-50/30">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                      Tip Learner
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Reward the learner for their submission
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseTipModal}
                  disabled={tipAfterReviewMutation.isPending}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="tipAmount" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    Amount (Coins) *
                  </Label>
                  <Input
                    id="tipAmount"
                    type="number"
                    min="1"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border-2 focus:border-amber-400 focus:ring-amber-400 shadow-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipMessage" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    Message
                  </Label>
                  <Input
                    id="tipMessage"
                    type="text"
                    value={tipMessage}
                    onChange={(e) => setTipMessage(e.target.value)}
                    placeholder="Optional message"
                    className="w-full border-2 focus:border-blue-400 focus:ring-blue-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={handleCloseTipModal}
                  disabled={tipAfterReviewMutation.isPending}
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTipSubmit}
                  disabled={tipAfterReviewMutation.isPending || !tipAmount || Number(tipAmount) <= 0}
                  className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
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
