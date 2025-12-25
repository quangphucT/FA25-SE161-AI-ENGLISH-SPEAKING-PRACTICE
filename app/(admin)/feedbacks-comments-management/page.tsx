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
  useAdminFeedbackReject,
  useAdminFeedbackApprove,
} from "@/features/admin/hooks/useAdminFeedback";
import {
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
  FileText,
} from "lucide-react";
import { Feedback } from "@/features/admin/services/adminFeedbackService";

// Type definitions

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



const FeedbacksCommentsManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null
  );
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const queryClient = useQueryClient();

  // Convert status filter for API (UI format -> API format)
  const apiStatus = useMemo(() => {
    if (statusFilter === "All") return "";
    // Map UI status to API status format
    if (statusFilter === "Approved") return "approved";
    if (statusFilter === "Rejected") return "rejected";
    if (statusFilter === "Pending") return "Pending";
    if (statusFilter === "Processing") return "processing";
    return statusFilter; // Fallback to original value
  }, [statusFilter]);

  // Convert type filter for API
  const apiType = useMemo(() => {
    if (typeFilter === "All") return "";
    return typeFilter;
  }, [typeFilter]);

  // Fetch feedbacks from API (with filters)
  const feedbacksQuery = useAdminFeedback(
    pageNumber,
    pageSize,
    apiStatus,
    search,
    apiType
  );
  const { data, isLoading, error } = feedbacksQuery;
  const feedbacksResponse = data as AdminFeedbackResponse | undefined;

  // Fetch total statistics (without filters) to show overall stats
  const totalStatsQuery = useAdminFeedback(1, 1, "", "", "");
  const totalStatsResponse = totalStatsQuery.data as AdminFeedbackResponse | undefined;

  // Reject mutation
  const rejectMutation = useAdminFeedbackReject();
  const approveMutation = useAdminFeedbackApprove();

  // Get feedbacks from API
  const feedbacks = useMemo<Feedback[]>(() => {
    if (!feedbacksResponse?.isSucess) return [];
    return feedbacksResponse.data?.items ?? [];
  }, [feedbacksResponse]);

  const totalItems = feedbacksResponse?.isSucess
    ? feedbacksResponse.data?.totalItems ?? 0
    : 0;

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Get statistics from API response (total statistics, not filtered)
  // Use totalStatsResponse for overall stats that don't change with filters
  const totalFeedback = useMemo(() => {
    return totalStatsResponse?.isSucess ? (totalStatsResponse.data?.totalFeedback ?? 0) : 0;
  }, [totalStatsResponse]);

  const totalReports = useMemo(() => {
    return totalStatsResponse?.isSucess ? (totalStatsResponse.data?.totalReports ?? 0) : 0;
  }, [totalStatsResponse]);

  const totalApproved = useMemo(() => {
    return totalStatsResponse?.isSucess ? (totalStatsResponse.data?.totalApproved ?? 0) : 0;
  }, [totalStatsResponse]);

  const totalRejected = useMemo(() => {
    return totalStatsResponse?.isSucess ? (totalStatsResponse.data?.totalRejected ?? 0) : 0;
  }, [totalStatsResponse]);

  const averageRating = useMemo(() => {
    return totalStatsResponse?.isSucess ? (totalStatsResponse.data?.averageRating ?? 0) : 0;
  }, [totalStatsResponse]);

  // Get selected feedback for display
  const selectedFeedback = useMemo<Feedback | null>(() => {
    if (!selectedFeedbackId) return null;
    return feedbacks.find((f) => f.feedbackId === selectedFeedbackId) || null;
  }, [selectedFeedbackId, feedbacks]);

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

  const handleAction = (feedback: Feedback, action: "approve" | "reject") => {
    setSelectedFeedbackId(feedback.feedbackId);
    setActionType(action);
    setShowActionModal(true);
    if (action === "reject") {
      setRejectReason("");
    }
  };
  const closeActionModal = () => {
    setShowActionModal(false);
    //setSelectedFeedbackId(null);
    setActionType(null);
    setRejectReason("");
  };

  const handleConfirmAction = () => {
    if (!selectedFeedbackId || !actionType) return;

    const isApprove = actionType === "approve";
    const successMessage = isApprove
      ? "Phê duyệt phản hồi thành công"
      : "Từ chối phản hồi thành công";
    const errorMessage = isApprove
      ? "Có lỗi xảy ra khi phê duyệt phản hồi"
      : "Có lỗi xảy ra khi từ chối phản hồi";

    const onSettled = {
      onSuccess: () => {
        toast.success(successMessage);
        queryClient.invalidateQueries({ queryKey: ["adminFeedback"] });
        closeActionModal();
        // Close detail modal after successful action
        setShowDetailsModal(false);
        setSelectedFeedbackId(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || errorMessage);
      },
    };

    if (isApprove) {
      approveMutation.mutate(selectedFeedbackId, onSettled);
    } else {
      if (!rejectReason.trim()) {
        toast.error("Vui lòng nhập lý do từ chối.");
        return;
      }
      rejectMutation.mutate({ feedbackId: selectedFeedbackId, reason: rejectReason.trim() }, onSettled);
    }
  };

  const handleSearchInput = (value: string) => {
    setSearch(value);
    setPageNumber(1);
  };

  const isApproveAction = actionType === "approve";
  const actionModalConfig = isApproveAction
    ? {
        title: "Phê duyệt phản hồi",
        description: "Xác nhận hành động phê duyệt này",
        headerBg: "from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        primaryButtonClass: "bg-green-600 text-white hover:bg-green-700 cursor-pointer",
        primaryLabel: "Phê duyệt",
      }
    : {
        title: "Từ chối phản hồi",
        description: "Xác nhận hành động này",
        headerBg: "from-red-50 to-pink-50",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        primaryButtonClass: "bg-red-600 text-white hover:bg-red-700 cursor-pointer",
        primaryLabel: "Từ chối",
      };

  const isActionPending =
    actionType === "approve" ? approveMutation.isPending : rejectMutation.isPending;
  const isPrimaryDisabled =
    isActionPending || (!isApproveAction && !rejectReason.trim());

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
  const changeType = (type: string) => {
    if (type === "ReviewerFeedback") {
      return "Phản hồi";
    } else if (type === "ReviewerReport") {
      return "Báo cáo";
    } else {
      return "Tất cả";
    }
  }
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen ">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng số phản hồi</p>
                  <div className="text-3xl font-bold text-gray-900">{totalFeedback}</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng số báo cáo</p>
                  <div className="text-3xl font-bold text-gray-900">{totalReports}</div>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <FileText className="w-6 h-6 text-orange-600" />
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
                  : `Hiển thị ${feedbacks.length} trên ${totalItems} phản hồi và bình luận`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Tabs 
                value={typeFilter} 
                onValueChange={(v) => {
                  setTypeFilter(v);
                  setPageNumber(1);
                }}
              >
                <TabsList className="grid grid-cols-3 w-auto">
                  <TabsTrigger value="All">Tất cả</TabsTrigger>
                  <TabsTrigger value="ReviewerFeedback">Phản hồi</TabsTrigger>
                  <TabsTrigger value="ReviewerReport">Báo cáo</TabsTrigger>
                </TabsList>
              </Tabs>
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
          ) : feedbacks.length === 0 ? (
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
                    <TableHead className="font-semibold text-gray-700">Điểm</TableHead>
                    <TableHead className="font-semibold text-gray-700">Loại</TableHead>
                    <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                    <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => {
                    const status = mapApiStatusToUI(feedback.status);
                    return (
                    <TableRow key={feedback.feedbackId} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <span className="font-mono text-sm block truncate max-w-[150px] text-gray-900">
                          {feedback.feedbackId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {feedback.senderName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {feedback.senderEmail}
                          </span>
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
                      <TableCell>
                        <Badge variant="outline" className="w-fit text-xs mt-1">
                          {changeType(feedback.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(feedback.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "Active"
                              ? "default"
                              : status === "Rejected"
                              ? "destructive"
                              : status === "Pending"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs font-medium"
                        >
                          {status === "Active"
                            ? "Đã duyệt"
                            : status === "Rejected"
                            ? "Bị từ chối"
                            : status === "Pending"
                            ? "Đang chờ"
                            : status}
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && feedbacks.length > 0 && (
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-1000 p-4" onClick={closeActionModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className={`p-6 border-b bg-gradient-to-r ${actionModalConfig.headerBg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${actionModalConfig.iconBg} rounded-full`}>
                    {isApproveAction ? (
                      <CheckCircle2 className={`w-6 h-6 ${actionModalConfig.iconColor}`} />
                    ) : (
                      <XCircle className={`w-6 h-6 ${actionModalConfig.iconColor}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{actionModalConfig.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{actionModalConfig.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeActionModal}
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-white/50 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Bạn có chắc muốn {isApproveAction ? "phê duyệt" : "từ chối"} phản hồi này? Hành động này không thể hoàn tác.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">Người dùng:</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedFeedback.senderName}
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
              {!isApproveAction && (
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-semibold text-gray-600">
                    Lý do từ chối (bắt buộc)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do của bạn..."
                    className="w-full min-h-[90px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>
              )}
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={closeActionModal}
                  disabled={isActionPending}
                  className="cursor-pointer"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleConfirmAction}
                  disabled={isPrimaryDisabled}
                  className={actionModalConfig.primaryButtonClass}
                >
                  {isActionPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    actionModalConfig.primaryLabel
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
                        {selectedFeedback.senderName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedFeedback.senderEmail}
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
                        {selectedFeedback.type === "feedback" ? "Phản hồi" : "Báo cáo"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Trạng thái
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {(() => {
                        const status = mapApiStatusToUI(selectedFeedback.status);
                        return (
                          <Badge
                            variant={
                              status === "Active"
                                ? "default"
                                : status === "Rejected"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs font-medium"
                          >
                            {status === "Active"
                              ? "Đã duyệt"
                              : status === "Rejected"
                              ? "Bị từ chối"
                              : "Đang chờ"}
                          </Badge>
                        );
                      })()}
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

                {/* Reviewer Information */}
                {selectedFeedback.reviewerName && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Tên reviewer
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900">
                          {selectedFeedback.reviewerName}
                        </p>
                      </div>
                    </div>
                    {(selectedFeedback.reviewScore !== undefined || selectedFeedback.reviewerScore !== undefined) && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Điểm reviewer
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900">
                            {selectedFeedback.reviewScore ?? selectedFeedback.reviewerScore}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(selectedFeedback.reviewComment || selectedFeedback.reviewerComment) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Nhận xét của reviewer
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedFeedback.reviewComment || selectedFeedback.reviewerComment}
                      </p>
                    </div>
                  </div>
                )}

                {(selectedFeedback.reviewType || selectedFeedback.reviewerType) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Loại reviewer
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {selectedFeedback.reviewType || selectedFeedback.reviewerType}
                      </p>
                    </div>
                  </div>
                )}

                {selectedFeedback.learnerRecordAudioUrl && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Audio của learner
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <audio controls className="w-full">
                        <source src={selectedFeedback.learnerRecordAudioUrl} type="audio/mpeg" />
                        <source src={selectedFeedback.learnerRecordAudioUrl} type="audio/wav" />
                        Trình duyệt của bạn không hỗ trợ phát audio.
                      </audio>

                    </div>
                  </div>
                )}

                {selectedFeedback.reviewerRecordAudioUrl && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Audio của reviewer
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <audio controls className="w-full">
                        <source src={selectedFeedback.reviewerRecordAudioUrl} type="audio/mpeg" />
                        <source src={selectedFeedback.reviewerRecordAudioUrl} type="audio/wav" />
                        Trình duyệt của bạn không hỗ trợ phát audio.
                      </audio>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                {mapApiStatusToUI(selectedFeedback.status) === "Pending" && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        setActionType("approve");
                        setShowActionModal(true);
                      }}
                      className="bg-green-600 text-white hover:bg-green-700 cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Phê duyệt
                    </Button>
                    <Button
                      onClick={() => {
                        setActionType("reject");
                        setRejectReason("");
                        setShowActionModal(true);
                      }}
                      className="bg-red-600 text-white hover:bg-red-700 cursor-pointer flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Từ chối
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-3 ml-auto">
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
        </div>
      )}
    </div>
  );
};

export default FeedbacksCommentsManagement;
