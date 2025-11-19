"use client";
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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useAdminFeedback,
  useAdminFeedbackDetail,
  useAdminFeedbackReject,
} from "@/features/admin/hooks/useAdminFeedback";
import {
  Feedback as ApiFeedback,
  AdminFeedbackResponse,
} from "@/features/admin/services/adminFeedbackService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type definitions
interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  userType: "learner" | "mentor";
}

interface FeedbackTarget {
  type: "mentor" | "package";
  id: string;
  name: string;
}

interface Feedback {
  feedbackId: string;
  reviewer: User;
  target: FeedbackTarget;
  rating: number; // 1-5 stars
  content: string;
  createdAt: string;
  status: "Active" | "Rejected" | "Pending";
  type: "feedback" | "comment";
}

// Map API status to UI status format
const mapApiStatusToUI = (apiStatus: string): "Active" | "Rejected" | "Pending" => {
  const normalized = apiStatus.trim();
  // API already returns "Active", "Rejected", "Pending" in some cases
  if (normalized === "Active") return "Active";
  if (normalized === "Rejected") return "Rejected";
  if (normalized === "Pending") return "Pending";
  // Fallback for old format
  const lower = normalized.toLowerCase();
  if (lower === "approved" || lower === "active") return "Active";
  if (lower === "rejected") return "Rejected";
  return "Pending";
};

// Map API feedback to UI feedback structure
const mapApiFeedbackToUI = (apiFeedback: ApiFeedback): Feedback => {
  // Determine target type based on reviewId presence
  // If reviewId exists, it's a mentor feedback, otherwise it's a package feedback
  const targetType: "mentor" | "package" = apiFeedback.reviewId ? "mentor" : "package";
  
  return {
    feedbackId: apiFeedback.feedbackId,
    reviewer: {
      id: apiFeedback.feedbackId, // Using feedbackId as id since we don't have user id
      fullName: apiFeedback.senderName,
      email: apiFeedback.senderEmail,
      userType: "learner", // Assuming all feedbacks are from learners
    },
    target: {
      type: targetType,
      id: apiFeedback.reviewId || apiFeedback.feedbackId,
      name: apiFeedback.reviewerName || "N/A",
    },
    rating: apiFeedback.rating,
    content: apiFeedback.content,
    createdAt: apiFeedback.createdAt,
    status: mapApiStatusToUI(apiFeedback.status),
    type: apiFeedback.type as "feedback" | "comment",
  };
};

const FeedbacksCommentsManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null
  );
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const queryClient = useQueryClient();

  // Convert status filter for API (UI format -> API format)
  const apiStatus = useMemo(() => {
    if (statusFilter === "All") return "";
    // Map UI status to API status format
    if (statusFilter === "Active") return "approved";
    if (statusFilter === "Rejected") return "rejected";
    if (statusFilter === "Pending") return "pending";
    return statusFilter; // Fallback to original value
  }, [statusFilter]);

  // Fetch feedbacks from API
  const feedbacksQuery = useAdminFeedback(
    pageNumber,
    pageSize,
    apiStatus,
    search
  );
  const { data, isLoading, error } = feedbacksQuery;
  const feedbacksResponse = data as AdminFeedbackResponse | undefined;

  // Fetch feedback detail when selected
  const feedbackDetailQuery = useAdminFeedbackDetail(selectedFeedbackId || "");
  const feedbackDetail = feedbackDetailQuery.data?.data;

  // Reject mutation
  const rejectMutation = useAdminFeedbackReject();

  // Map API feedbacks to UI structure
  const apiFeedbacks = useMemo<ApiFeedback[]>(() => {
    if (!feedbacksResponse?.isSucess) return [];
    return feedbacksResponse.data?.items ?? [];
  }, [feedbacksResponse]);

  const mappedFeedbacks = useMemo<Feedback[]>(() => {
    return apiFeedbacks.map(mapApiFeedbackToUI);
  }, [apiFeedbacks]);

  const totalItems = feedbacksResponse?.isSucess
    ? feedbacksResponse.data?.totalItems ?? 0
    : 0;

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Calculate statistics
  const totalApproved = useMemo(() => {
    return mappedFeedbacks.filter((f) => f.status === "Active").length;
  }, [mappedFeedbacks]);

  const totalRejected = useMemo(() => {
    return mappedFeedbacks.filter((f) => f.status === "Rejected").length;
  }, [mappedFeedbacks]);

  const averageRating = useMemo(() => {
    if (mappedFeedbacks.length === 0) return 0;
    const sum = mappedFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    return sum / mappedFeedbacks.length;
  }, [mappedFeedbacks]);

  // Get selected feedback for display
  const selectedFeedback = useMemo<Feedback | null>(() => {
    if (!selectedFeedbackId) return null;
    const found = mappedFeedbacks.find((f) => f.feedbackId === selectedFeedbackId);
    if (found) return found;
    // If not found in current page, use detail data
    if (feedbackDetail) {
      return {
        feedbackId: feedbackDetail.feedbackId,
        reviewer: {
          id: feedbackDetail.feedbackId,
          fullName: feedbackDetail.senderName || "",
          email: "",
          userType: "learner",
        },
        target: {
          type: feedbackDetail.reviewId ? "mentor" : "package",
          id: feedbackDetail.reviewId || feedbackDetail.feedbackId,
          name: "",
        },
        rating: feedbackDetail.rating,
        content: feedbackDetail.content,
        createdAt: feedbackDetail.createdAt,
        status: mapApiStatusToUI(feedbackDetail.status),
        type: feedbackDetail.type as "feedback" | "comment",
      };
    }
    return null;
  }, [selectedFeedbackId, mappedFeedbacks, feedbackDetail]);

  // const handleSelectRow = (idx: number) => {
  //   setSelectedRows(
  //     selectedRows.includes(idx)
  //       ? selectedRows.filter((i) => i !== idx)
  //       : [...selectedRows, idx]
  //   );
  // };

  // const handleSelectAll = () => {
  //   if (selectedRows.length === filteredFeedbacks.length) {
  //     setSelectedRows([]);
  //   } else {
  //     setSelectedRows(filteredFeedbacks.map((_, idx) => idx));
  //   }
  // };

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedbackId(feedback.feedbackId);
    setShowDetailsModal(true);
  };

  const handleAction = (feedback: Feedback, action: "reject") => {
    setSelectedFeedbackId(feedback.feedbackId);
    setShowActionModal(true);
  };

  const handleReject = () => {
    if (!selectedFeedbackId) return;
    
    rejectMutation.mutate(selectedFeedbackId, {
      onSuccess: () => {
        toast.success("Từ chối phản hồi thành công");
        queryClient.invalidateQueries({ queryKey: ["adminFeedback"] });
        setShowActionModal(false);
        setSelectedFeedbackId(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Có lỗi xảy ra khi từ chối phản hồi");
      },
    });
  };

  const handleSearchInput = (value: string) => {
    setSearch(value);
    setPageNumber(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        fill={i < rating ? "#fbbf24" : "#e5e7eb"}
        viewBox="0 0 24 24"
        className="inline"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString("vi-VN") +
      " " +
      new Date(dateString).toLocaleTimeString("vi-VN")
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          
          <Input
            placeholder="Tìm theo nội dung..."
            value={search}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-[300px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNumber(1);
            }}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Active">Đã duyệt</option>
            <option value="Rejected">Bị từ chối</option>
            <option value="Pending">Đang chờ</option>
          </select>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Tổng số phản hồi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalApproved}</div>
            <p className="text-xs text-muted-foreground">Đã duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalRejected}</div>
            <p className="text-xs text-muted-foreground">Bị từ chối</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Điểm trung bình</p>
          </CardContent>
        </Card>
      </div>

      {/* Bảng phản hồi */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lí phản hồi & bình luận</CardTitle>
          <CardDescription>
            {isLoading
              ? "Đang tải..."
              : `Hiển thị ${mappedFeedbacks.length} trên ${totalItems} phản hồi và bình luận`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Có lỗi xảy ra khi tải dữ liệu
            </div>
          ) : mappedFeedbacks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có phản hồi nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Người đánh giá</TableHead>
                    <TableHead>Mục tiêu</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedFeedbacks.map((feedback, idx) => (
                <TableRow key={feedback.feedbackId}>
                  
                  <TableCell>
                    <span className="font-mono text-sm">
                      {feedback.feedbackId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {feedback.reviewer.fullName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {feedback.reviewer.email}
                      </span>
                      <Badge variant="outline" className="w-fit text-xs mt-1">
                        {feedback.reviewer.userType === "learner"
                          ? "người học"
                          : "người hướng dẫn"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {feedback.target.name}
                      </span>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {feedback.target.type === "mentor"
                          ? "người hướng dẫn"
                          : "gói dịch vụ"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                      <span className="ml-2 text-sm font-medium">
                        ({feedback.rating})
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm">
                    {formatDate(feedback.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        feedback.status === "Active"
                          ? "default"
                          : feedback.status === "Rejected"
                          ? "destructive"
                          : feedback.status === "Pending"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {feedback.status === "Active"
                        ? "đã duyệt"
                        : feedback.status === "Rejected"
                        ? "bị từ chối"
                        : feedback.status === "Pending"
                        ? "đang chờ"
                        : feedback.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(feedback)}
                          className="cursor-pointer text-gray-700 focus:text-gray-900"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            className="inline mr-2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction(feedback, "reject")}
                          className="cursor-pointer text-red-600 focus:text-red-700"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            className="inline mr-2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Từ chối
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Trang {pageNumber} / {totalPages} ({totalItems} kết quả)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                      disabled={pageNumber === 1 || isLoading}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPageNumber((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={pageNumber === totalPages || isLoading}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal xác nhận từ chối */}
      {showActionModal && selectedFeedback && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-red-600"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Từ chối phản hồi
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc muốn từ chối phản hồi này? Hành động này không thể
                  hoàn tác.
                </p>
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Người dùng:</strong>{" "}
                    {selectedFeedback.reviewer.fullName}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Nội dung:</strong>{" "}
                    {selectedFeedback.content.length > 100
                      ? `${selectedFeedback.content.substring(0, 100)}...`
                      : selectedFeedback.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center px-4 py-3 gap-3">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedFeedbackId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-auto hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  disabled={rejectMutation.isPending}
                >
                  Hủy
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? "Đang xử lý..." : "Từ chối"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết */}
      {showDetailsModal && selectedFeedback && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Chi tiết phản hồi
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedFeedbackId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người dùng
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900">
                      {selectedFeedback.reviewer.fullName}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điểm
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          fill={
                            i < selectedFeedback.rating
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          className="text-yellow-500"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({selectedFeedback.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedFeedback.type === "feedback"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedFeedback.type === "feedback"
                        ? "Phản hồi"
                        : "Bình luận"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedFeedback.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : selectedFeedback.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedFeedback.status === "Active"
                        ? "Đã duyệt"
                        : selectedFeedback.status === "Rejected"
                        ? "Bị từ chối"
                        : "Đang chờ"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <div className="p-3 bg-gray-50 rounded-md max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedFeedback.content}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày gửi
                </label>
                <div className="p-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900">
                    {new Date(selectedFeedback.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedFeedbackId(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbacksCommentsManagement;
