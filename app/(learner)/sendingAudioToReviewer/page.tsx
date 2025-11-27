"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLearnerReviewHistory } from "@/features/learner/hooks/useLearnerReview";
import { useLearnerFeedback } from "@/features/learner/hooks/useLearnerFeedback";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Calendar,
  User,
  Send,
} from "lucide-react";
import type { LearnerReviewHistory } from "@/features/learner/services/learnerReviewService";

const PAGE_SIZE = 10;

const SendingAudioToReviewer = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<LearnerReviewHistory | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackContent, setFeedbackContent] = useState("");
  
  const { data, isLoading, isError, error } = useLearnerReviewHistory(
    pageNumber,
    PAGE_SIZE
  );
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } = useLearnerFeedback();

  const reviews = useMemo(() => data?.data?.items ?? [], [data]);
  const totalItems = data?.data?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

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

  const handleOpenFeedback = (review: LearnerReviewHistory) => {
    setSelectedReview(review);
    setFeedbackRating(5);
    setFeedbackContent("");
    setIsFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = () => {
    if (!selectedReview) return;
    submitFeedback(
      {
        reviewId: selectedReview.reviewId,
        rating: feedbackRating,
        content: feedbackContent.trim(),
      },
      {
        onSuccess: () => {
          setIsFeedbackDialogOpen(false);
          setFeedbackContent("");
          setSelectedReview(null);
        },
      }
    );
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      "Completed": { label: "Hoàn thành", variant: "default" },
      "Pending": { label: "Đang chờ", variant: "secondary" },
      "Rejected": { label: "Từ chối", variant: "destructive" },
      "InProgress": { label: "Đang xử lý", variant: "outline" },
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: "outline" as const };
    return (
      <Badge variant={statusInfo.variant} className="font-medium">
        {statusInfo.label}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 font-bold";
    if (score >= 60) return "text-yellow-600 font-bold";
    return "text-red-600 font-bold";
  };

  const startItem = totalItems === 0 ? 0 : (pageNumber - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(pageNumber * PAGE_SIZE, totalItems);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử đánh giá</h1>
          <p className="text-gray-500 mt-1">
            Xem lại tất cả các lượt review đã được reviewer chấm điểm
          </p>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng số review</p>
                <div className="text-3xl font-bold text-gray-900">{totalItems}</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Đã hoàn thành</p>
                <div className="text-3xl font-bold text-gray-900">
                  {reviews.filter((r) => r.status === "Completed").length}
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Đang chờ</p>
                <div className="text-3xl font-bold text-gray-900">
                  {reviews.filter((r) => r.status === "Pending" || r.status === "InProgress").length}
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Danh sách đánh giá</CardTitle>
              <CardDescription className="mt-1">
                Hiển thị {reviews.length} trên {totalItems} review
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isError ? (
            <div className="text-center py-8 text-red-500">
              <p className="font-medium">Không thể tải dữ liệu</p>
              <p className="text-sm mt-1">
                {error?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."}
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">Chưa có review nào</p>
              <p className="text-sm text-gray-400 mt-2">
                Các review của bạn sẽ hiển thị ở đây sau khi được reviewer chấm điểm
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Ngày đánh giá</TableHead>
                    <TableHead className="font-semibold">Câu hỏi</TableHead>
                    <TableHead className="font-semibold">Reviewer</TableHead>
                    <TableHead className="font-semibold text-center">Điểm</TableHead>
                    <TableHead className="font-semibold text-center">Trạng thái</TableHead>
                    <TableHead className="font-semibold">Nhận xét</TableHead>
                    <TableHead className="font-semibold">Loại</TableHead>
                    <TableHead className="font-semibold text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review: LearnerReviewHistory) => (
                    <TableRow key={review.reviewId} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {review.questionContent || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {review.reviewerFullName || "Chưa có reviewer"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className={`text-lg ${getScoreColor(review.score)}`}>
                            {review.score}/100
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(review.status)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          {review.comment ? (
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {review.comment}
                            </p>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Chưa có nhận xét</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {review.reviewType === "Record" ? "Record" : "Learner Answer"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                          disabled={review.status !== "Completed"}
                          onClick={() => handleOpenFeedback(review)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Gửi feedback
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {startItem}-{endItem} trên {totalItems} review
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1 || isLoading}
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
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
                    onClick={() => setPageNumber(pageNum)}
                    disabled={isLoading}
                    className="min-w-[40px] cursor-pointer"
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
              disabled={pageNumber === totalPages || isLoading}
              className="cursor-pointer"
            >
              Sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gửi feedback cho reviewer</DialogTitle>
            <DialogDescription>
              Đánh giá chất lượng review để giúp hệ thống cải thiện trải nghiệm.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Question</p>
                <p className="text-sm font-medium text-gray-800 line-clamp-2">
                  {selectedReview.questionContent || "N/A"}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <User className="w-4 h-4" />
                  <span>{selectedReview.reviewerFullName || "Reviewer ẩn danh"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Đánh giá (1-5)</p>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(Math.max(1, Math.min(5, Number(e.target.value))))}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Nhận xét của bạn</p>
                <Textarea
                  rows={4}
                  placeholder="Chia sẻ cảm nhận của bạn về chất lượng review..."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsFeedbackDialogOpen(false)}
              className="cursor-pointer"
              disabled={isSubmittingFeedback}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={
                !selectedReview ||
                !feedbackContent.trim() ||
                feedbackRating < 1 ||
                feedbackRating > 5 ||
                isSubmittingFeedback
              }
              className="cursor-pointer"
            >
              {isSubmittingFeedback && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Gửi feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendingAudioToReviewer;
