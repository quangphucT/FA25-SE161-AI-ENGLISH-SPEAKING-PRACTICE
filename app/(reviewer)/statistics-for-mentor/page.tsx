"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useMemo } from "react";
import { useSelectedReviewsStore } from "@/store/selectedReviewsStore";

const StatisticsForMentor = () => {
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  // Sample data for mentor stats
  const mentorStats = {
    totalFeedbacks: 42,
    totalReviews: 186,
    avgRating: 4.8,
    AmountOfMoneyEarned: "23.000",
  };

  const feedbackSummary = [
    {
      id: 1,
      studentName: "Nguyễn Văn An",
      rating: 5,
      comment:
        "Excellent teaching method! Very clear explanations and patient guidance.",
      sessionType: "Luyện nói",
      date: "20/09/2025",
      avatar: "NVA",
    },
    {
      id: 2,
      studentName: "Trần Thị Bình",
      rating: 4,
      comment:
        "Great IELTS preparation. Helped me improve my speaking confidence significantly.",
      sessionType: "IELTS Nói",
      date: "19/09/2025",
      avatar: "TTB",
    },
    {
      id: 3,
      studentName: "Lê Minh Hoàng",
      rating: 5,
      comment:
        "Professional business English training. Very practical and useful content.",
      sessionType: "Tiếng Anh thương mại",
      date: "18/09/2025",
      avatar: "LMH",
    },
    {
      id: 4,
      studentName: "Phạm Thu Dung",
      rating: 4,
      comment:
        "Good grammar lessons with clear examples. Would recommend to others.",
      sessionType: "Ôn tập ngữ pháp",
      date: "17/09/2025",
      avatar: "PTD",
    },
    {
      id: 5,
      studentName: "Nguyễn Thị Lan",
      rating: 5,
      comment:
        "Amazing mentor! Very encouraging and creates comfortable learning environment.",
      sessionType: "Luyện hội thoại",
      date: "16/09/2025",
      avatar: "NTL",
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [reviewedAnswers, setReviewedAnswers] = useState<number[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { setSelectedReviews } = useSelectedReviewsStore();

  const handleSelectAnswer = (id: number) => {
    setSelectedAnswers((prev) =>
      prev.includes(id)
        ? prev.filter((answerId) => answerId !== id)
        : [...prev, id]
    );
  };

  const pendingReviews = useMemo(
    () => [
      {
        id: 1,
        question: "Describe your favorite hobby and explain why you enjoy it.",

        audioUrl: "https://example.com/audio1.mp3",
        duration: "2:30",

        submittedAt: "15/01/2024",
        status: "Pending",
      },
      {
        id: 2,
        question:
          "What are the advantages and disadvantages of living in a big city?",

        audioUrl: "https://example.com/audio2.mp3",
        duration: "3:15",

        submittedAt: "14/01/2024",
        status: "Pending",
      },
      {
        id: 3,
        question: "Explain the process of photosynthesis in plants.",

        audioUrl: "https://example.com/audio3.mp3",
        duration: "4:20",

        submittedAt: "13/01/2024",
        status: "Pending",
      },
      {
        id: 4,
        question:
          "What is your opinion about social media's impact on society?",

        audioUrl: "https://example.com/audio4.mp3",
        duration: "2:45",

        submittedAt: "12/01/2024",
        status: "Pending",
      },
      {
        id: 5,
        question: "Describe a memorable trip you have taken.",

        audioUrl: "https://example.com/audio5.mp3",
        duration: "3:00",

        submittedAt: "11/01/2024",
        status: "Pending",
      },
    ],
    []
  );

  const handleSelectAll = () => {
    if (selectedAnswers.length === availableReviews.length) {
      setSelectedAnswers([]);
    } else {
      setSelectedAnswers(availableReviews.map((review) => review.id));
    }
  };

  const handleReviewSelected = async () => {
    if (selectedAnswers.length === 0) return;

    setIsReviewing(true);

    // Simulate WebSocket call to review answers
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add to reviewed answers (they will disappear from the list)
      setReviewedAnswers((prev) => [...prev, ...selectedAnswers]);

      // Clear selected answers
      setSelectedAnswers([]);

      // Show notification
      setNotificationMessage(
        `Đã review thành công ${selectedAnswers.length} câu trả lời!`
      );
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      // Simulate WebSocket notification
      console.log(`Reviewed ${selectedAnswers.length} answers via WebSocket`);
    } catch (error) {
      console.error("Error reviewing answers:", error);
    } finally {
      setIsReviewing(false);
    }
  };

  // Filter out reviewed answers
  const availableReviews = pendingReviews.filter(
    (review) => !reviewedAnswers.includes(review.id)
  );

  // Sync selected answers to global store for cross-page usage
  useEffect(() => {
    const selected = pendingReviews
      .filter((r) => selectedAnswers.includes(r.id))
      .map((r) => ({ id: r.id, question: r.question, audioUrl: r.audioUrl }));
    setSelectedReviews(selected);
  }, [selectedAnswers, pendingReviews, setSelectedReviews]);

  // Simulate WebSocket connection
  useEffect(() => {
    // Simulate WebSocket connection
    const ws = new WebSocket("ws://localhost:8080/reviews");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "review_completed") {
        // Remove completed reviews from the list
        setReviewedAnswers((prev) => [...prev, data.reviewId]);
        console.log(`Review ${data.reviewId} completed via WebSocket`);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  // Full feedback data cho modal
  const allFeedbackData = [
    ...feedbackSummary,
    {
      id: 6,
      studentName: "Hoàng Văn Tùng",
      rating: 5,
      comment:
        "Outstanding mentor! The lessons are well-structured and very engaging. I've learned so much in just a few sessions.",
      sessionType: "Nói nâng cao",
      date: "15/09/2025",
      avatar: "HVT",
    },
    {
      id: 7,
      studentName: "Lý Thị Mai",
      rating: 4,
      comment:
        "Great pronunciation coaching. Helped me overcome my accent issues and speak more confidently.",
      sessionType: "Phát âm",
      date: "14/09/2025",
      avatar: "LTM",
    },
    {
      id: 8,
      studentName: "Trương Minh Đức",
      rating: 5,
      comment:
        "Excellent TOEFL preparation. The practice tests and tips were incredibly helpful for my exam.",
      sessionType: "Chuẩn bị TOEFL",
      date: "13/09/2025",
      avatar: "TMD",
    },
    {
      id: 9,
      studentName: "Phan Thị Hương",
      rating: 4,
      comment:
        "Very patient teacher. Explains complex grammar rules in an easy-to-understand way.",
      sessionType: "Tập trung ngữ pháp",
      date: "12/09/2025",
      avatar: "PTH",
    },
    {
      id: 10,
      studentName: "Ngô Văn Khang",
      rating: 5,
      comment:
        "Amazing business English course! Really practical for my work environment. Highly recommended.",
      sessionType: "Tiếng Anh thương mại",
      date: "11/09/2025",
      avatar: "NVK",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
                  {mentorStats.AmountOfMoneyEarned} VND
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Câu trả lời cần review</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedAnswers.length === availableReviews.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </Button>
                {selectedAnswers.length > 0 && (
                  <Button
                    size="sm"
                    onClick={handleReviewSelected}
                    disabled={isReviewing}
                    className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isReviewing
                      ? "Đang review..."
                      : `Review đã chọn (${selectedAnswers.length})`}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableReviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">✅</div>
                  <div className="text-gray-500 text-lg font-medium">
                    Tất cả câu trả lời đã được review
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Không còn câu trả lời nào cần review
                  </div>
                </div>
              ) : (
                availableReviews.map((review) => (
                  <div
                    key={review.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedAnswers.includes(review.id)
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectAnswer(review.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="flex items-center pt-1">
                        <div className="relative">
                          <Checkbox
                            checked={selectedAnswers.includes(review.id)}
                            onCheckedChange={() =>
                              handleSelectAnswer(review.id)
                            }
                            className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 hover:border-blue-400 transition-colors"
                          />
                          {selectedAnswers.includes(review.id) && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg
                                width="8"
                                height="8"
                                fill="white"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Question */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              Câu hỏi:
                            </h4>
                            {selectedAnswers.includes(review.id) && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                                Đã chọn
                              </Badge>
                            )}
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
                                <span className="text-xs text-gray-500">
                                  ({review.duration})
                                </span>
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
              {feedbackSummary.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
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
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <button
                onClick={() => setShowAllFeedback(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Xem tất cả phản hồi →
              </button>
            </div>
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
                {allFeedbackData.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Tổng phản hồi:{" "}
                  <span className="font-semibold">
                    {allFeedbackData.length}
                  </span>{" "}
                  đánh giá
                </p>
                <Button
                  onClick={() => setShowAllFeedback(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span className="font-medium">{notificationMessage}</span>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsForMentor;
