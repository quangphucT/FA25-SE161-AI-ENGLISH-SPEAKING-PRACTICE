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
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useAdminReviewer,
  useAdminReviewerDetail,
  useAdminReviewerBan,
} from "@/features/admin/hooks/useAdminReviewer";
import {
  Reviewer,
  AdminReviewersResponse,
  ReviewerDetailResponse,
  ReviewerDetail,
} from "@/features/admin/services/adminReviewerService";



const normalizeStatus = (
  status: string | null | undefined
): "Actived" | "InActived" | "Banned" => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "actived" || normalized === "active") return "Actived";
  if (normalized === "banned" || normalized === "isbanned") return "Banned";
  return "InActived";
};

const formatDisplayDate = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return "—";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN");
};

const getAvatarUrl = (fullName: string): string =>
  `https://ui-avatars.com/api/?background=1e293b&color=fff&name=${encodeURIComponent(
    fullName || "User"
  )}`;

const ReviewerManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Actived");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedReviewerProfileId, setSelectedReviewerProfileId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");
  const [reviewerToAction, setReviewerToAction] = useState<Reviewer | null>(
    null
  );
  const [banReason, setBanReason] = useState<string>("");
  const queryClient = useQueryClient();
  const { mutate: banReviewer, isPending: isBanning } = useAdminReviewerBan();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [previewOffset, setPreviewOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastPanPos, setLastPanPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const reviewersQuery = useAdminReviewer(
    pageNumber,
    pageSize,
    statusFilter,
    search
  );
  const { data, isLoading, error } = reviewersQuery;
  const reviewersResponse = data as AdminReviewersResponse | undefined;

  // Fetch reviewer detail when a user is selected
  const reviewerDetailQuery = useAdminReviewerDetail(selectedReviewerProfileId || "");
  const reviewerDetailResponse = reviewerDetailQuery.data as
    | ReviewerDetailResponse
    | undefined;
  const reviewerDetail = reviewerDetailResponse?.isSucess
    ? reviewerDetailResponse.data
    : null;

  const apiReviewers = useMemo<Reviewer[]>(() => {
    if (!reviewersResponse?.isSucess) return [];
    return reviewersResponse.data?.items ?? [];
  }, [reviewersResponse]);

  const mappedReviewers = useMemo<Reviewer[]>(() => {
    return apiReviewers;
  }, [apiReviewers]);

  const filteredReviewers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return mappedReviewers.filter((reviewer) => {
      const normalizedStatus = normalizeStatus(reviewer.status);
      const matchesStatus = normalizedStatus === statusFilter;
      const matchesKeyword =
        keyword.length === 0 ||
        [reviewer.reviewerProfileId, reviewer.fullName, reviewer.email, reviewer.phone]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword));
      return matchesStatus && matchesKeyword;
    });
  }, [mappedReviewers, search, statusFilter]);

  const totalItems = reviewersResponse?.isSucess
    ? reviewersResponse.data?.totalItems ?? mappedReviewers.length
    : mappedReviewers.length;
  const totalActive = mappedReviewers.filter(
    (reviewer) => normalizeStatus(reviewer.status) === "Actived"
  ).length;
  const startItem =
    totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(pageNumber * pageSize, totalItems);

  useEffect(() => {
    if (selectedReviewerProfileId && !mappedReviewers.some((reviewer) => reviewer.reviewerProfileId === selectedReviewerProfileId)) {
      setSelectedReviewerProfileId(null);
      setShowDetailsModal(false);
    }
  }, [mappedReviewers, selectedReviewerProfileId]);

  const handleSearchInput = (value: string) => {
    setSearch(value);
    setPageNumber(1);
  };

  const handleViewDetails = (reviewer: Reviewer) => {
    setSelectedReviewerProfileId(reviewer.reviewerProfileId);
    setShowDetailsModal(true);
  };

  const handleBlockUnblock = (
    reviewer: Reviewer,
    action: "block" | "unblock"
  ) => {
    setReviewerToAction(reviewer);
    setActionType(action);
    setBanReason("");
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (!reviewerToAction) return;

    if (actionType === "block") {
      if (!banReason.trim()) {
        toast.error("Vui lòng nhập lý do chặn");
        return;
      }
      banReviewer(
        {
          userId: reviewerToAction.userId,
          reason: banReason.trim(),
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminReviewer"] });
            setShowConfirmDialog(false);
            setReviewerToAction(null);
            setBanReason("");
          },
          onError: () => {
            // Error đã được xử lý trong hook, chỉ cần đảm bảo UI được reset nếu cần
          },
        }
      );
    } else {
      // Unban
      banReviewer(
        {
          userId: reviewerToAction.userId,
          reason: "Unban user",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminReviewer"] });
            setShowConfirmDialog(false);
            setReviewerToAction(null);
            setBanReason("");
          },
          onError: () => {
            // Error đã được xử lý trong hook, chỉ cần đảm bảo UI được reset nếu cần
          },
        }
      );
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setOpenDropdownId(null);
    }
  };
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-lg"
          />
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="Actived">Hoạt động</TabsTrigger>
              <TabsTrigger value="InActived">Ngưng hoạt động</TabsTrigger>
              <TabsTrigger value="Banned">Bị chặn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead className="text-gray-700 font-semibold">
                Thông tin
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Họ tên
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Liên hệ
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Trình độ
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Kinh nghiệm
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Trạng thái
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Đánh giá
              </TableHead>
              <TableHead className="ext-center text-gray-700 font-semibold">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-gray-500">Đang tải...</div>
                </TableCell>
              </TableRow>
            ) : filteredReviewers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-gray-500">Không có dữ liệu</div>
                </TableCell>
              </TableRow>
            ) : (
              filteredReviewers.map((reviewer) => {
                const normalizedStatus = normalizeStatus(reviewer.status);
                return (
                  <TableRow key={reviewer.reviewerProfileId} className="hover:bg-[#f0f7e6]">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="size-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                            <AvatarImage
                              src={getAvatarUrl(reviewer.fullName)}
                              alt={reviewer.fullName}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                              {getInitials(reviewer.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                              normalizedStatus === "Actived"
                                ? "bg-green-500"
                                : normalizedStatus === "InActived"
                                ? "bg-gray-400"
                                : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <div className="text-blue-600 font-semibold text-sm">
                            {reviewer.reviewerProfileId}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {reviewer.fullName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-sm">{reviewer.email}</span>
                        <span className="text-xs text-gray-500">
                          {reviewer.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{reviewer.level || "___"}</TableCell>
                    <TableCell>{reviewer.experience} năm</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          normalizedStatus === "Actived" ? "default" : normalizedStatus === "InActived" ? "secondary" : "destructive"
                        }
                        className={
                          normalizedStatus === "Actived"
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : normalizedStatus === "InActived"
                            ? "bg-gray-100 text-gray-600 border-gray-200"
                            : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                        }
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              normalizedStatus === "Actived"
                                ? "bg-green-500"
                                : normalizedStatus === "InActived"
                                ? "bg-gray-400"
                                : "bg-red-500"
                            }`}
                          ></div>
                          {normalizedStatus === "Actived"
                            ? "Hoạt động"
                            : normalizedStatus === "InActived"
                            ? "Ngưng hoạt động"
                            : "Bị chặn"}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-yellow-600">
                          {reviewer.rating}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="text-yellow-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="relative dropdown-container">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === reviewer.reviewerProfileId ? null : reviewer.reviewerProfileId
                            )
                          }
                          className="p-1 h-8 w-8 cursor-pointer"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </Button>

                        {openDropdownId === reviewer.reviewerProfileId && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleViewDetails(reviewer);
                                  setOpenDropdownId(null);
                                }}
                                className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  className="inline mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                Xem chi tiết
                              </button>
                              <button
                                onClick={() => {
                                  handleBlockUnblock(
                                    reviewer,
                                    normalizedStatus === "Actived" || normalizedStatus === "InActived"
                                      ? "block"
                                      : "unblock"
                                  );
                                  setOpenDropdownId(null);
                                }}
                                className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                  normalizedStatus === "Actived" || normalizedStatus === "InActived"
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {normalizedStatus === "Actived" || normalizedStatus === "InActived" ? (
                                  <>
                                    <svg
                                      width="16"
                                      height="16"
                                      className="inline mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="10"
                                        rx="2"
                                      />
                                      <circle cx="12" cy="16" r="1" />
                                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Chặn
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      width="16"
                                      height="16"
                                      className="inline mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="10"
                                        rx="2"
                                      />
                                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Bỏ chặn
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          ACTIVE REVIEWERS: {totalActive}/{totalItems}
        </div>
        <div>
          Rows per page: <span className="font-semibold">{pageSize}</span> &nbsp; {startItem}-{endItem}
          of {totalItems}
        </div>
      </div>

      {/* Reviewer Details Modal */}
      {showDetailsModal && reviewerDetail && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {reviewerDetail.fullName}
                    </h2>
                    <p className="text-blue-100">{reviewerDetail.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Kinh nghiệm
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {reviewerDetail.experience}
                        <span className="text-sm font-normal"> năm</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="text-white"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-600">
                        Điểm đánh giá
                      </p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {reviewerDetail.rating}
                        <span className="text-sm font-normal">/5.0</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600">
                        Ngày tham gia
                      </p>
                      <p className="text-sm font-bold text-purple-900">
                        {formatDisplayDate(reviewerDetail.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="text-white"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Levels
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        —
                        <span className="text-sm font-normal"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trạng thái tài khoản */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Mã người đánh giá
                      </span>
                      <span className="text-blue-600 font-mono">
                        {reviewerDetail.reviewerProfileId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Trạng thái tài khoản
                      </span>
                      <Badge
                        className={
                          normalizeStatus(reviewerDetail.status) === "Actived"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : normalizeStatus(reviewerDetail.status) === "InActived"
                            ? "bg-gray-100 text-gray-600 border-gray-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {normalizeStatus(reviewerDetail.status) === "Actived"
                          ? "Hoạt động"
                          : normalizeStatus(reviewerDetail.status) === "InActived"
                          ? "Ngưng hoạt động"
                          : "Bị chặn"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Địa chỉ email
                      </span>
                      <span className="text-gray-600 text-sm">
                        {reviewerDetail.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Ngày tham gia
                      </span>
                      <span className="text-gray-600">
                        {formatDisplayDate(reviewerDetail.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Certificates Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 17l-3 3-3-3m3 3V10m6-6H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  </svg>
                  Chứng chỉ (Certificates)
                </h3>

                {reviewerDetail.certificates &&
                reviewerDetail.certificates.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {reviewerDetail.certificates.map((cert) => (
                      <div key={cert.certificateId} className="group">
                        <div
                          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border cursor-zoom-in"
                          onClick={() => {
                            setPreviewZoom(1);
                            setPreviewOffset({ x: 0, y: 0 });
                            setPreviewImageUrl(cert.url);
                          }}
                          role="button"
                          aria-label={`Xem lớn ${cert.name}`}
                        >
                          <Image
                            src={cert.url}
                            alt={cert.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-800 line-clamp-2">
                          {cert.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Chưa có chứng chỉ.
                  </div>
                )}
              </div>
              {/* Feedbacks Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 17l-3 3-3-3m3 3V10m6-6H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    </svg>
                    Đánh giá từ học viên ({reviewerDetail.feedbacks?.length || 0})
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Đánh giá cao (4-5⭐)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Đánh giá trung bình (3⭐)
                      </span>
                    </div>
                  </div>
                </div>

                {reviewerDetail.feedbacks && reviewerDetail.feedbacks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                          <TableHead className="text-gray-700 font-semibold">
                            Học viên
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Đánh giá
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Nội dung
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Ngày gửi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviewerDetail.feedbacks.map((feedback) => (
                          <TableRow
                            key={feedback.id}
                            className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {feedback.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {feedback.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {feedback.email}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {feedback.phone}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < feedback.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <Badge
                                  className={`text-xs font-medium ${
                                    feedback.rating >= 4
                                      ? "bg-green-100 text-green-700 border-green-300"
                                      : feedback.rating >= 3
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                      : "bg-red-100 text-red-700 border-red-300"
                                  }`}
                                >
                                  {feedback.rating}/5
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {feedback.content}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {formatDisplayDate(feedback.createdAt)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💬</div>
                    <div className="text-gray-500 text-lg font-medium">
                      Chưa có đánh giá
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                      Học viên chưa gửi đánh giá nào cho reviewer này
                    </div>
                  </div>
                )}

                {reviewerDetail.feedbacks && reviewerDetail.feedbacks.length > 0 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Hiển thị {reviewerDetail.feedbacks.length} đánh giá
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Trước
                      </Button>
                      <Button variant="default" size="sm">
                        1
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hộp thoại xác nhận */}
      {showConfirmDialog && reviewerToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận {actionType === "block" ? "chặn" : "bỏ chặn"} người đánh
              giá
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn {actionType === "block" ? "chặn" : "bỏ chặn"}{" "}
              <strong>{reviewerToAction.fullName}</strong>?
              {actionType === "block"
                ? " Thao tác này sẽ ngăn họ truy cập hệ thống."
                : " Thao tác này sẽ khôi phục quyền truy cập của họ."}
            </p>
            <div className="text-gray-600 mb-6">
              <Input 
                placeholder="Lí do chặn" 
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                disabled={isBanning}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setBanReason("");
                }}
                className="cursor-pointer"
                disabled={isBanning}
              >
                Hủy
              </Button>
              <Button
                onClick={confirmAction}
                disabled={isBanning}
                className={
                  actionType === "block"
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }
              >
                {isBanning ? "Đang xử lý..." : actionType === "block" ? "Chặn" : "Bỏ chặn"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 select-none"
          onClick={() => setPreviewImageUrl(null)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="relative w-screen h-screen bg-black rounded-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              onClick={() => setPreviewImageUrl(null)}
              aria-label="Đóng xem ảnh"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {/* Zoom Controls */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <button
                className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                onClick={() =>
                  setPreviewZoom((z) =>
                    Math.max(0.5, parseFloat((z - 0.25).toFixed(2)))
                  )
                }
                aria-label="Thu nhỏ"
              >
                -
              </button>
              <div className="h-10 px-3 rounded-lg bg-white/10 text-white flex items-center">
                {(previewZoom * 100).toFixed(0)}%
              </div>
              <button
                className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                onClick={() =>
                  setPreviewZoom((z) =>
                    Math.min(3, parseFloat((z + 0.25).toFixed(2)))
                  )
                }
                aria-label="Phóng to"
              >
                +
              </button>
              <button
                className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                onClick={() => setPreviewZoom(1)}
                aria-label="Đặt lại"
              >
                Đặt lại
              </button>
            </div>
            {/* Scroll-to-pan area (no scrollbars, right-click drag to pan, wheel to zoom) */}
            <div
              className="relative w-full h-screen overflow-hidden cursor-default"
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setPreviewZoom((z) => {
                  const next = Math.min(
                    4,
                    Math.max(0.5, parseFloat((z + delta).toFixed(2)))
                  );
                  return next;
                });
              }}
              onMouseDown={(e) => {
                // Right-click to start panning
                if (e.button === 0) {
                  setIsPanning(true);
                  setLastPanPos({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseMove={(e) => {
                if (isPanning && lastPanPos) {
                  const dx = e.clientX - lastPanPos.x;
                  const dy = e.clientY - lastPanPos.y;
                  setPreviewOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
                  setLastPanPos({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseUp={() => {
                setIsPanning(false);
                setLastPanPos(null);
              }}
              onMouseLeave={() => {
                setIsPanning(false);
                setLastPanPos(null);
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div
                  className="relative w-full h-full"
                  style={{
                    transform: `translate(${previewOffset.x}px, ${previewOffset.y}px) scale(${previewZoom})`,
                    transformOrigin: "center center",
                    transition: isPanning ? "none" : "transform 120ms ease",
                    cursor: isPanning ? "grabbing" : "default",
                  }}
                >
                  <Image
                    src={previewImageUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerManagement;