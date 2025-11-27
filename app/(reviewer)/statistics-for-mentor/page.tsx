"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useMemo, useRef, useEffect } from "react";
import { useReviewReviewPending, useReviewReviewSubmit, useReviewReviewStatistics, useReviewerTipAfterReview } from "@/features/reviewer/hooks/useReviewReview";
import { useReviewFeedback } from "@/features/reviewer/hooks/useReviewFeedback";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { signalRService } from "@/lib/realtime/realtime";
import { ReviewCompleted } from "@/lib/realtime/realtime";
import { useRealtime } from "@/providers/RealtimeProvider";
import { CircleCheck } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const StatisticsForMentor = () => {
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  
  // Pagination state for feedback summary
  const [feedbackPageNumber, setFeedbackPageNumber] = useState(1);
  const [feedbackPageSize] = useState(5); // Show 5 feedbacks in summary
  
  // Pagination state for modal
  const [modalPageNumber, setModalPageNumber] = useState(1);
  const [modalPageSize] = useState(10); // Show 10 feedbacks per page in modal
  
  // Fetch statistics from API
  const { data: statisticsData, isLoading: isLoadingStats, isError: isErrorStats } = useReviewReviewStatistics();
  
  // Fetch feedback from API with pagination
  const { data: feedbackData, isLoading: isLoadingFeedback } = useReviewFeedback(feedbackPageNumber, feedbackPageSize);
  const { data: allFeedbackData, isLoading: isLoadingAllFeedback } = useReviewFeedback(modalPageNumber, modalPageSize);
  
  // Map API response to mentorStats format
  const mentorStats = useMemo(() => {
    if (!statisticsData?.isSucess || !statisticsData?.data) {
      return {
        totalFeedbacks: 0,
        totalReviews: 0,
        avgRating: 0,
        AmountOfMoneyEarned: "0",
      };
    }
    
    const stats = statisticsData.data;
    return {
      totalFeedbacks: stats.totalFeedback || 0,
      totalReviews: stats.totalReviews || 0,
      avgRating: stats.averageRating || 0,
      AmountOfMoneyEarned: (stats.coinBalance || 0).toLocaleString("vi-VN"),
    };
  }, [statisticsData]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Map API feedback data to component format
  const feedbackSummary = useMemo(() => {
    if (!feedbackData?.isSucess || !feedbackData?.data?.items) return [];
    
    return feedbackData.data.items.map((item) => ({
      id: item.feedbackId,
      studentName: item.learnerName,
      rating: item.rating,
      comment: item.content,
      sessionType: item.reviewType || "Đánh giá phát âm",
      date: format(new Date(item.createdAt), "dd/MM/yyyy", { locale: vi }),
      avatar: getInitials(item.learnerName),
    }));
  }, [feedbackData]);

  // Calculate pagination info for summary
  const feedbackPagination = useMemo(() => {
    if (!feedbackData?.data) {
      return { totalPages: 0, currentPage: 1, totalItems: 0 };
    }
    const totalItems = feedbackData.data.totalItems || 0;
    const totalPages = Math.ceil(totalItems / feedbackPageSize);
    return {
      totalPages,
      currentPage: feedbackPageNumber,
      totalItems,
    };
  }, [feedbackData, feedbackPageNumber, feedbackPageSize]);

  // Calculate pagination info for modal
  const modalPagination = useMemo(() => {
    if (!allFeedbackData?.data) {
      return { totalPages: 0, currentPage: 1, totalItems: 0 };
    }
    const totalItems = allFeedbackData.data.totalItems || 0;
    const totalPages = Math.ceil(totalItems / modalPageSize);
    return {
      totalPages,
      currentPage: modalPageNumber,
      totalItems,
    };
  }, [allFeedbackData, modalPageNumber, modalPageSize]);

  const [reviewedAnswers, setReviewedAnswers] = useState<string[]>([]);
  // Track numberOfReview updates from SignalR events
  const [numberOfReviewUpdates, setNumberOfReviewUpdates] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<{ id: string; question: string; audioUrl: string; submittedAt: string; duration?: string } | null>(null);
  const [comment, setComment] = useState("");
  const [score, setScore] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");
  const [rewardMessage, setRewardMessage] = useState("");
  // Fetch pending reviews
  const { data: pendingReviewsData, isLoading, error } = useReviewReviewPending(1, 100);
  
  // Get user info for reviewerProfileId
  const { data: userData } = useGetMeQuery();
  
  // Submit review mutation
  const submitReviewMutation = useReviewReviewSubmit();

  // Get SignalR connection state from RealtimeProvider
  const { isConnected } = useRealtime();

  const handleOpenReviewModal = (reviewId: string) => {
    const review = pendingReviews?.find((r) => r.id === reviewId);
    if (review) {
      setSelectedReview({
        id: review.id,
        question: review.question,
        audioUrl: review.audioUrl,
        submittedAt: review.submittedAt,
        duration: review.duration,
      });
      setIsModalOpen(true);
      setComment("");
      setScore("");
      setShowAnswer(false);
      setShowRewardForm(false);
      setRewardAmount("");
      setRewardMessage("");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setShowAnswer(false);
    setComment("");
    setScore("");
    setShowRewardForm(false);
    setRewardAmount("");
    setRewardMessage("");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  const tipAfterReviewMutation = useReviewerTipAfterReview();

  const handleRewardLearner = async () => {
    if (!selectedReview?.id) {
      return;
    }
    const amount = Number(rewardAmount);
    if (!amount || amount <= 0) {
      return;
    }
    try {
      await tipAfterReviewMutation.mutateAsync({
        reviewerId: selectedReview.id,
        amountCoin: amount,
        message: rewardMessage.trim(),
      });
      setRewardAmount("");
      setRewardMessage("");
      setShowRewardForm(false);
    } catch (error) {
      console.error("Reward learner failed:", error);
    }
  };
  const handleSaveAndFinish = async () => {
    if (!selectedReview) return;
    
    // Validate inputs
    if (!comment.trim()) {
      // You can add toast notification here if needed
      return;
    }
    
    const scoreValue = parseFloat(score);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
      // You can add toast notification here if needed
      return;
    }
    
    try {
      await submitReviewMutation.mutateAsync({
        learnerAnswerId: selectedReview.id,
        recordId: null, // Can be null as per requirement
        reviewerProfileId: userData?.reviewerProfile?.reviewerProfileId || null,
        score: scoreValue,
        comment: comment.trim(),
      });
      
      // Remove review from current reviewer's list immediately
      // SignalR event will handle updates for other reviewers
      setReviewedAnswers((prev) => [...prev, selectedReview.id]);
      
      // Close modal
      handleCloseModal();
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error("Error submitting review:", error);
    }
  };

  // Transform API data to component format
  // Merge with numberOfReview updates from SignalR events
  const pendingReviews = useMemo(() => {
    if (!pendingReviewsData?.data?.items) return [];
    return pendingReviewsData.data.items.map((item) => ({
      id: item.id,
      question: item.questionText,
      audioUrl: item.audioUrl,
      duration: undefined, // Duration not available in API
      submittedAt: new Date(item.submittedAt).toLocaleDateString('vi-VN'),
      status: "Pending",
      learnerFullName: item.learnerFullName,
      type: item.type,
      // Use updated numberOfReview from SignalR if available, otherwise use from API
      numberOfReview: numberOfReviewUpdates[item.id] !== undefined 
        ? numberOfReviewUpdates[item.id] 
        : item.numberOfReview,
    }));
  }, [pendingReviewsData, numberOfReviewUpdates]);

  // Filter out reviewed answers
  const availableReviews = pendingReviews.filter(
    (review) => !reviewedAnswers.includes(review.id)
  );

  // Setup SignalR listener for reviewCompleted events
  useEffect(() => {
    // Only setup handler when connection is established
    if (!isConnected) {
      return;
    }

    const handleReviewCompleted = (review: ReviewCompleted) => {
      console.log('SignalR: Review completed', review);
      
      if (!review.learnerAnswerId) return;

      // Case 1: If remaining = 0, remove from all reviewers' lists
      if (review.remaining === 0) {
        setReviewedAnswers((prev) => {
          if (prev.includes(review.learnerAnswerId)) {
            return prev;
          }
          return [...prev, review.learnerAnswerId];
        });
      } 
      // Case 2: If remaining > 0, only update numberOfReview for other reviewers
      else {
        setNumberOfReviewUpdates((prev) => ({
          ...prev,
          [review.learnerAnswerId]: review.remaining,
        }));
      }
    };

    // Register handler
    signalRService.setReviewCompletedHandler(handleReviewCompleted);

    // Cleanup when component unmounts or connection changes
    return () => {
      signalRService.setReviewCompletedHandler(null);
    };
  }, [isConnected]);

  // Full feedback data cho modal - map từ API
  const allFeedbackDataForModal = useMemo(() => {
    if (!allFeedbackData?.isSucess || !allFeedbackData?.data?.items) return [];
    
    return allFeedbackData.data.items.map((item) => ({
      id: item.feedbackId,
      studentName: item.learnerName,
      rating: item.rating,
      comment: item.content,
      sessionType: item.reviewType || "Đánh giá phát âm",
      date: format(new Date(item.createdAt), "dd/MM/yyyy", { locale: vi }),
      avatar: getInitials(item.learnerName),
    }));
  }, [allFeedbackData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 border-dashed border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-24">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng phản hồi
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mentorStats.totalFeedbacks}
                  </p>
                </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-blue-600"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng đánh giá
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mentorStats.totalReviews}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-green-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Đánh giá trung bình
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mentorStats.avgRating}/5
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="text-yellow-500"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Số tiền trong ví
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mentorStats.AmountOfMoneyEarned} coin
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-purple-600"
                >
                  <path d="M9 11l3 3 8-8" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.34 0 2.6.29 3.74.82" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Câu trả lời cần review</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg font-medium">
                    Đang tải...
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-lg font-medium">
                    Lỗi khi tải dữ liệu: {error.message}
                  </div>
                </div>
              ) : availableReviews.length === 0 ? (
                <div className="text-center py-12">
                 <CircleCheck size={64} color="green" className="text-6xl mb-4 text-center w-full"/>
                  <div className="text-gray-500 text-lg font-medium">
                    Tất cả câu trả lời đã được review
                  </div>  
                </div>
              ) : (
                availableReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                    onClick={() => handleOpenReviewModal(review.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Question */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              Câu hỏi:
                            </h4>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {review.question}
                          </p>
                        </div>

                        {/* Audio Player */}
                        <div className="mb-3">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                            <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors">
                              <svg
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  Audio Response
                                </span>
                                {review.duration && (
                                  <span className="text-xs text-gray-500">
                                    ({review.duration})
                                  </span>
                                )}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {review.submittedAt}
                          </div>
                          <div className="text-xs text-gray-500">
                            {review.numberOfReview}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt phản hồi</CardTitle>
            <p className="text-sm text-gray-500">
              Phản hồi gần đây từ học viên của bạn
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingFeedback ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">Đang tải phản hồi...</div>
                </div>
              ) : feedbackSummary.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-sm">Chưa có phản hồi nào</div>
                </div>
              ) : (
                feedbackSummary.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {feedback.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {feedback.studentName}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="14"
                            height="14"
                            fill={i < feedback.rating ? "#fbbf24" : "#e5e7eb"}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      &quot;{feedback.comment}&quot;
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {feedback.sessionType}
                      </span>
                      <span>{feedback.date}</span>
                    </div>
                  </div>
                </div>
              )))}
            </div>
            
            {/* Pagination for summary */}
            {feedbackPagination.totalPages > 1 && (
              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFeedbackPageNumber((prev) => Math.max(1, prev - 1))}
                    disabled={feedbackPageNumber === 1 || isLoadingFeedback}
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-gray-600">
                    Trang {feedbackPagination.currentPage} / {feedbackPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFeedbackPageNumber((prev) => Math.min(feedbackPagination.totalPages, prev + 1))}
                    disabled={feedbackPageNumber >= feedbackPagination.totalPages || isLoadingFeedback}
                  >
                    Sau
                  </Button>
                </div>
                <button
                  onClick={() => {
                    setShowAllFeedback(true);
                    setModalPageNumber(1); // Reset to first page when opening modal
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Xem tất cả phản hồi →
                </button>
              </div>
            )}
            
            {feedbackPagination.totalPages <= 1 && (
              <div className="mt-4 pt-3 border-t">
                <button
                  onClick={() => {
                    setShowAllFeedback(true);
                    setModalPageNumber(1);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Xem tất cả phản hồi →
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Feedback Modal */}
      {showAllFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-1.5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Tất cả phản hồi học viên
                </h2>
                <p className="text-sm text-gray-500">
                  Lịch sử phản hồi đầy đủ từ học viên của bạn
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllFeedback(false)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid gap-4">
                {isLoadingAllFeedback ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg">Đang tải phản hồi...</div>
                  </div>
                ) : allFeedbackDataForModal.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Chưa có phản hồi nào</div>
                  </div>
                ) : (
                  allFeedbackDataForModal.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {feedback.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {feedback.studentName}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="16"
                                height="16"
                                fill={
                                  i < feedback.rating ? "#fbbf24" : "#e5e7eb"
                                }
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              ({feedback.rating}/5)
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          &quot;{feedback.comment}&quot;
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {feedback.sessionType}
                          </span>
                          <span className="text-sm text-gray-500">
                            {feedback.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Tổng phản hồi:{" "}
                    <span className="font-semibold">
                      {modalPagination.totalItems}
                    </span>{" "}
                    đánh giá
                  </p>
                  
                  {/* Pagination Controls */}
                  {modalPagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModalPageNumber((prev) => Math.max(1, prev - 1))}
                        disabled={modalPageNumber === 1 || isLoadingAllFeedback}
                      >
                        Trước
                      </Button>
                      <span className="text-sm text-gray-600">
                        Trang {modalPagination.currentPage} / {modalPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModalPageNumber((prev) => Math.min(modalPagination.totalPages, prev + 1))}
                        disabled={modalPageNumber >= modalPagination.totalPages || isLoadingAllFeedback}
                      >
                        Sau
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setShowAllFeedback(false);
                    setModalPageNumber(1); // Reset to first page when closing
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-3xl max-h-[90vh] overflow-y-auto data-[state=open]:!animate-none data-[state=closed]:!animate-none"
          
        >
          <DialogHeader>
            <DialogTitle>{selectedReview?.question}</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-5 mt-4">
              {selectedReview.audioUrl && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-medium text-slate-700 mb-2">
                    Audio
                  </div>
                  <audio ref={audioRef} controls className="w-full">
                    <source src={selectedReview.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label
                    htmlFor="modal-comment"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Comment
                  </Label>
                  <textarea
                    id="modal-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback..."
                    className="mt-2 w-full h-28 text-sm border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                  />
                </div>
                <div className="relative">
                  <Label
                    htmlFor="modal-score"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Score
                  </Label>
                  <Input
                    id="modal-score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="0 - 10"
                    className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Enter a numeric score, e.g., 8.5
                  </p>
                  <div className="mt-2 inline-flex items-start gap-3">
                    <Button
                      variant="outline"
                      className="bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50 text-white"
                      onClick={() => setShowRewardForm((prev) => !prev)}
                    >
                      {showRewardForm ? "Close reward form" : "Reward Learner"}
                    </Button>
                   
                  </div>
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
                    variant="outline"
                    onClick={handleCloseModal}
                    className="cursor-pointer"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSaveAndFinish}
                    disabled={submitReviewMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                  >
                    {submitReviewMutation.isPending ? "Đang xử lý..." : "Hoàn thành (Finish)"}
                  </Button>
                </div>
              </div>

              {showAnswer && (
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Ai Feedback
                  </div>
                  <p className="text-sm text-slate-700">
                    (No text provided)
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatisticsForMentor;
