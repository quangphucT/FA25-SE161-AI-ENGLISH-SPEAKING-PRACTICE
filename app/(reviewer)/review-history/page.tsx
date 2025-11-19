"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReviewReviewHistory } from "@/features/reviewer/hooks/useReviewReview";
import { useState } from "react";
import { ReviewerReviewHistory } from "@/features/reviewer/services/reviewerReviewService";

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
    audioUrl: "", // ReviewerReviewHistory doesn't have audioUrl field
    comment: review.comment,
    score: review.score,
    status: (review.status as "Approved" | "Rejected" | "Pending") || "Pending",
    reviewedAt: formatDate(review.createdAt),
    questionType: (review.reviewType as "Word" | "Phrase" | "Sentence" | "Conversation") || "Word",
  };
};

const ReviewHistory = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const { data, isLoading, error } = useReviewReviewHistory(pageNumber, pageSize);

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

  // Type assertion: API returns ReviewerReviewHistory[] but type says ReviewerReview[]
  const reviewedAnswers: ReviewedAnswer[] = (data?.data?.items as unknown as ReviewerReviewHistory[])?.map(mapReviewToReviewedAnswer) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reviewed Answers</h1>
        <p className="text-sm text-slate-500">
          Learner submissions you&apos;ve reviewed
        </p>
      </div>

      {reviewedAnswers.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No reviewed answers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviewedAnswers.map((item) => (
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
    </div>
  );
};

export default ReviewHistory;
