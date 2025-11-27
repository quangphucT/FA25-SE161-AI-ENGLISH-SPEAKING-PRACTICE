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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Download,
  Eye,
  X,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  FileSpreadsheet,
  Filter,
  MoreVertical,
} from "lucide-react";

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
    if (statusFilter === "Approved") return "approved";
    if (statusFilter === "Rejected") return "rejected";
    if (statusFilter === "Pending") return "pending";
    if (statusFilter === "Processing") return "processing";
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý phản hồi & bình luận</h1>
          <p className="text-gray-500 mt-1">Theo dõi và quản lý tất cả phản hồi và bình luận trong hệ thống</p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-[600px]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm theo nội dung, người gửi..."
                  value={search}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Tabs 
                value={statusFilter} 
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPageNumber(1);
                }}
              >
                <TabsList className="grid grid-cols-4 w-auto">
                  <TabsTrigger value="All">Tất cả</TabsTrigger>
                  <TabsTrigger value="Pending">Chờ xử lý</TabsTrigger>
                  <TabsTrigger value="Approved">Đã duyệt</TabsTrigger>
                  <TabsTrigger value="Rejected">Từ chối</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button 
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 cursor-pointer transition-all hover:shadow-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 border-dashed border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng số phản hồi</p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Đã duyệt</p>
                  <div className="text-3xl font-bold text-gray-900">{totalApproved}</div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Bị từ chối</p>
                  <div className="text-3xl font-bold text-gray-900">{totalRejected}</div>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Điểm trung bình</p>
                  <div className="text-3xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Danh sách phản hồi & bình luận</CardTitle>
              <CardDescription className="mt-1">
                {isLoading
                  ? "Đang tải..."
                  : `Hiển thị ${mappedFeedbacks.length} trên ${totalItems} phản hồi và bình luận`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="font-medium text-red-600 text-lg">Có lỗi xảy ra khi tải dữ liệu</p>
              <p className="text-sm text-gray-600 mt-2">Vui lòng thử lại sau.</p>
            </div>
          ) : mappedFeedbacks.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Không có phản hồi nào</p>
              <p className="text-sm text-gray-400 mt-2">Thử thay đổi bộ lọc để xem thêm kết quả</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Người đánh giá</TableHead>
                    <TableHead className="font-semibold text-gray-700">Mục tiêu</TableHead>
                    <TableHead className="font-semibold text-gray-700">Điểm</TableHead>
                    <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                    <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedFeedbacks.map((feedback) => (
                    <TableRow key={feedback.feedbackId} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <span className="font-mono text-sm block truncate max-w-[150px] text-gray-900">
                          {feedback.feedbackId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
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
                          <span className="font-medium text-gray-900">
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
                          <span className="ml-2 text-sm font-semibold text-gray-900">
                            ({feedback.rating}/5)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
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
                          className="text-xs font-medium"
                        >
                          {feedback.status === "Active"
                            ? "Đã duyệt"
                            : feedback.status === "Rejected"
                            ? "Bị từ chối"
                            : feedback.status === "Pending"
                            ? "Đang chờ"
                            : feedback.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(feedback)}
                              className="cursor-pointer flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(feedback, "reject")}
                              className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700"
                            >
                              <X className="w-4 h-4" />
                              Từ chối
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
      {!isLoading && mappedFeedbacks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-gray-900">{totalItems > 0 ? (pageNumber - 1) * pageSize + 1 : 0}</span> đến{" "}
                <span className="font-semibold text-gray-900">{Math.min(pageNumber * pageSize, totalItems)}</span> trong tổng số{" "}
                <span className="font-semibold text-gray-900">{totalItems}</span> phản hồi
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                  disabled={pageNumber === 1 || isLoading}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  Trước
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
                        onClick={() => setPageNumber(pageNum)}
                        className={`cursor-pointer min-w-[40px] ${
                          pageNumber === pageNum
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-gray-50"
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
                  onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
                  disabled={pageNumber >= totalPages || isLoading}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal xác nhận từ chối */}
      {showActionModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setShowActionModal(false);
          setSelectedFeedbackId(null);
        }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Từ chối phản hồi</h3>
                    <p className="text-sm text-gray-600 mt-1">Xác nhận hành động này</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedFeedbackId(null);
                  }}
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-white/50 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Bạn có chắc muốn từ chối phản hồi này? Hành động này không thể hoàn tác.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">Người dùng:</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedFeedback.reviewer.fullName}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Nội dung:</span>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    {selectedFeedback.content.length > 100
                      ? `${selectedFeedback.content.substring(0, 100)}...`
                      : selectedFeedback.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedFeedbackId(null);
                  }}
                  disabled={rejectMutation.isPending}
                  className="cursor-pointer"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                  {rejectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Từ chối"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết */}
      {showDetailsModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setShowDetailsModal(false);
          setSelectedFeedbackId(null);
        }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Chi tiết phản hồi</h2>
                  <p className="text-sm text-gray-600 mt-1">Thông tin chi tiết về phản hồi này</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedFeedbackId(null);
                  }}
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-white/50 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Người dùng
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFeedback.reviewer.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedFeedback.reviewer.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Điểm đánh giá
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        {renderStars(selectedFeedback.rating)}
                        <span className="ml-2 text-sm font-semibold text-gray-900">
                          {selectedFeedback.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Loại
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Badge
                        variant={selectedFeedback.type === "feedback" ? "default" : "secondary"}
                        className="text-xs font-medium"
                      >
                        {selectedFeedback.type === "feedback" ? "Phản hồi" : "Bình luận"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Trạng thái
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Badge
                        variant={
                          selectedFeedback.status === "Active"
                            ? "default"
                            : selectedFeedback.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs font-medium"
                      >
                        {selectedFeedback.status === "Active"
                          ? "Đã duyệt"
                          : selectedFeedback.status === "Rejected"
                          ? "Bị từ chối"
                          : "Đang chờ"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nội dung
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedFeedback.content}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ngày gửi
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900">
                      {new Date(selectedFeedback.createdAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedFeedbackId(null);
                  }}
                  className="cursor-pointer"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbacksCommentsManagement;
