"use client";

import { useMemo, useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLearnerReviewHistory } from "@/features/learner/hooks/useLearnerReview";
import { useLearnerFeedback, useLearnerReportReview } from "@/features/learner/hooks/useLearnerFeedback";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Calendar,
  User,
  Send,
  Search,
  X,
  Filter,
  Play,
} from "lucide-react";
import type { LearnerReviewHistory } from "@/features/learner/services/learnerReviewService";

const PAGE_SIZE = 10;

const SendingAudioToReviewer = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [status, setStatus] = useState<string>("all"); // Use "all" instead of empty string
  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Debounced keyword
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<LearnerReviewHistory | null>(null);
  const [activeTab, setActiveTab] = useState<string>("feedback");
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [reportReason, setReportReason] = useState("");
  
  // Convert "all" to empty string for API call
  const apiStatus = status === "all" ? "" : status;
  
  const { data, isLoading, isError, error } = useLearnerReviewHistory(
    pageNumber,
    PAGE_SIZE,
    apiStatus,
    searchKeyword
  );

  // Debounce keyword search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(keyword);
      setPageNumber(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [keyword]);

  // Reset to first page when status filter changes
  // React Query will automatically refetch when status changes (queryKey includes status)
  useEffect(() => {
    setPageNumber(1);
  }, [status]);
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } = useLearnerFeedback();
  const { mutate: submitReport, isPending: isSubmittingReport } = useLearnerReportReview();

  const reviews = useMemo(() => data?.data?.items ?? [], [data]);
  const totalItems = data?.data?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  const summaryStats = useMemo(() => {
    const completed = data?.data?.completed ?? reviews.filter((r) => r.status === "Completed").length;
    const pending =
      data?.data?.pending ??
      reviews.filter((r) => r.status === "Pending" || r.status === "InProgress").length;
    const rejected = data?.data?.rejected ?? reviews.filter((r) => r.status === "Rejected").length;
    const total = data?.data?.totalItems ?? totalItems;
    return { completed, pending, rejected, total };
  }, [data, reviews, totalItems]);

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

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
  };

  const handleClearSearch = () => {
    setKeyword("");
    setSearchKeyword("");
    setPageNumber(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPageNumber(1); // Reset to first page when filter changes
  };

  const handleOpenRequest = (review: LearnerReviewHistory) => {
    setSelectedReview(review);
    setActiveTab("feedback");
    setFeedbackRating(5);
    setFeedbackContent("");
    setReportReason("");
    setIsRequestDialogOpen(true);
  };

  const handleSubmitFeedback = () => {
    if (!selectedReview) {
      return;
    }
    
    // Validate inputs
    if (!feedbackContent.trim()) {
      return;
    }
    
    if (feedbackRating < 1 || feedbackRating > 5) {
      return;
    }
    
    if (!selectedReview.reviewId) {
      return;
    }
    
    submitFeedback(
      {
        reviewId: selectedReview.reviewId,
        rating: feedbackRating,
        content: feedbackContent.trim(),
      },
      {
        onSuccess: () => {
          setIsRequestDialogOpen(false);
          setFeedbackContent("");
          setFeedbackRating(5);
          setSelectedReview(null);
        },
        onError: (error) => {
          // Error is already handled by the hook's onError callback
          console.error("Feedback submission error:", error);
        },
      }
    );
  };

  const handleSubmitReport = () => {
    if (!selectedReview) {
      return;
    }
    
    // Validate inputs
    if (!reportReason.trim()) {
      return;
    }
    
    if (!selectedReview.reviewId) {
      return;
    }
    
    submitReport(
      {
        reviewId: selectedReview.reviewId,
        reason: reportReason.trim(),
      },
      {
        onSuccess: () => {
          setIsRequestDialogOpen(false);
          setReportReason("");
          setSelectedReview(null);
        },
        onError: (error) => {
          // Error is already handled by the hook's onError callback
          console.error("Report submission error:", error);
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

  const getStatusBadge = (feedbackStatus: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      "Approved": { label: "Hoàn thành", variant: "default" },
      "Pending": { label: "Đang chờ", variant: "secondary" },
      "Rejected": { label: "Từ chối", variant: "destructive" },
      "NotSent": { label: "Chưa Gửi", variant: "outline" },
    };
    
    const statusInfo = statusMap[feedbackStatus] || { label: feedbackStatus, variant: "outline" as const };
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
                <div className="text-3xl font-bold text-gray-900">{summaryStats.total}</div>
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
                  {summaryStats.completed}
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
                  {summaryStats.pending}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-shrink-0">
              <CardTitle className="text-xl font-semibold">Danh sách đánh giá</CardTitle>
              <CardDescription className="mt-1">
                Hiển thị {reviews.length} trên {totalItems} review
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Approved">Hoàn thành</SelectItem>
                    <SelectItem value="NotSent">Chưa Gửi</SelectItem>
                    <SelectItem value="Pending">Đang chờ</SelectItem>
                    <SelectItem value="Rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Search Bar */}
              <div className="w-full sm:w-auto sm:min-w-[300px] sm:max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo câu hỏi, reviewer, hoặc nhận xét..."
                  value={keyword}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  className="pl-10 pr-10 h-10 w-full"
                />
                {keyword && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
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
                    <TableHead className="font-semibold text-center">Audio</TableHead>
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
                        {getStatusBadge(review.feedbackStatus)}
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
                        {review.reviewAudioUrl ? (
                          <Button
                            size="icon"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => {
                              const audio = new Audio(review.reviewAudioUrl as string);
                              audio.play().catch((err) => {
                                console.error("Error playing audio:", err);
                              });
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Không có audio</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {review.feedbackStatus === "NotSent" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                          disabled={review.status == "Completed" || review.status == "Rejected"}
                          onClick={() => handleOpenRequest(review)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Gửi đơn
                        </Button>
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

      {/* Dialog gửi đơn với tabs */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gửi đơn</DialogTitle>
            <DialogDescription>
              Chọn loại đơn bạn muốn gửi cho review này.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feedback" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Gửi feedback
                </TabsTrigger>
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Gửi report
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-500">Câu hỏi:</p>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {selectedReview.questionContent || "N/A"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <User className="w-4 h-4" />
                    <span>{selectedReview.reviewerFullName || "Reviewer ẩn danh"}</span>
                  </div>
                </div>

                <TabsContent value="feedback" className="space-y-4 mt-0">
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
                </TabsContent>

                <TabsContent value="report" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Lý do báo cáo *</p>
                    <Textarea
                      rows={4}
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải với review này..."
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRequestDialogOpen(false)}
              className="cursor-pointer"
              disabled={isSubmittingFeedback || isSubmittingReport}
            >
              Hủy
            </Button>
            {activeTab === "feedback" ? (
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
            ) : (
              <Button
                onClick={handleSubmitReport}
                disabled={
                  !selectedReview ||
                  !reportReason.trim() ||
                  isSubmittingReport
                }
                className="cursor-pointer"
              >
                {isSubmittingReport && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Gửi report
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendingAudioToReviewer;
