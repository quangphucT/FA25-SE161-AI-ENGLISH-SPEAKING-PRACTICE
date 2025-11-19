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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAdminLearner, useAdminLearnerDetail, useAdminLearnerBan } from "@/features/admin/hooks/useAdminLearner";
import {
  Learner,
  AdminLearnersResponse,
  LearnerDetail,
  Course,
} from "@/features/admin/services/adminLearnerService";

// Type definitions
interface Package {
  name: string;
  duration: string;
  price: string;
  status: "Active" | "Completed" | "Expired";
}

interface Achievement {
  name: string;
  description: string;
  points: number;
  icon: string;
  date: string;
  requirement: string;
}

// Legacy sample data has been removed; learners now come from the API.

const levelToGoal = (
  level: string | null | undefined
): "Beginner" | "Intermediate" | "Advanced" | "Expert" => {
  const normalized = (level || "").toUpperCase();
  if (["A1", "A2"].includes(normalized)) return "Beginner";
  if (["B1"].includes(normalized)) return "Intermediate";
  if (["B2", "C1"].includes(normalized)) return "Advanced";
  if (["C2"].includes(normalized)) return "Expert";
  return "Intermediate";
};

const normalizeStatus = (
  status: string | null | undefined
): "Active" | "Inactive" | "Banned" => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "banned" || normalized === "banned") return "Banned";
  return "Inactive";
};

const mapCourseStatus = (
  status: string | null | undefined
): "Active" | "Completed" | "Expired" => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "enrolled" || normalized === "active") return "Active";
  if (normalized === "completed") return "Completed";
  if (normalized === "expired") return "Expired";
  return "Expired";
};

const formatDisplayDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("vi-VN");
};

const getAvatarUrl = (fullName: string): string =>
  `https://ui-avatars.com/api/?background=1e293b&color=fff&name=${encodeURIComponent(
    fullName || "User"
  )}`;

const LearnerManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedLearnerProfileId, setSelectedLearnerProfileId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");
  const [learnerToAction, setLearnerToAction] = useState<Learner | null>(null);
  const [banReason, setBanReason] = useState<string>("");
  const queryClient = useQueryClient();
  const { mutate: banLearner, isPending: isBanning } = useAdminLearnerBan();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const learnersQuery = useAdminLearner(
    pageNumber,
    pageSize,
    statusFilter,
    search
  );
  const { data, isLoading, error } = learnersQuery;
  const learnersResponse = data as AdminLearnersResponse | undefined;

  // Fetch learner detail when a user is selected
  const learnerDetailQuery = useAdminLearnerDetail(selectedLearnerProfileId || "");
  const learnerDetailResponse = learnerDetailQuery.data as
    | { isSucess: boolean; data: LearnerDetail }
    | undefined;
  const learnerDetail = learnerDetailResponse?.isSucess
    ? learnerDetailResponse.data
    : null;

  const apiLearners = useMemo<Learner[]>(() => {
    if (!learnersResponse?.isSucess) return [];
    return learnersResponse.data?.items ?? [];
  }, [learnersResponse]);

  const mappedLearners = useMemo<Learner[]>(() => {
    return apiLearners;
  }, [apiLearners]);

  const filteredLearners = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return mappedLearners.filter((learner) => {
      const normalizedStatus = normalizeStatus(learner.status);
      const matchesStatus = normalizedStatus === statusFilter;
      const matchesKeyword =
        keyword.length === 0 ||
        [learner.learnerProfileId, learner.fullName, learner.email, learner.phone]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword));
      return matchesStatus && matchesKeyword;
    });
  }, [mappedLearners, search, statusFilter]);

  const totalItems = learnersResponse?.isSucess
    ? learnersResponse.data?.totalItems ?? mappedLearners.length
    : mappedLearners.length;
  const totalActive = mappedLearners.filter(
    (learner) => normalizeStatus(learner.status) === "Active"
  ).length;
  const startItem =
    totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(pageNumber * pageSize, totalItems);
  const apiError =
    !!error || (learnersResponse && learnersResponse.isSucess === false);

  useEffect(() => {
    if (selectedLearnerProfileId && !mappedLearners.some((learner) => learner.learnerProfileId === selectedLearnerProfileId)) {
      setSelectedLearnerProfileId(null);
      setShowDetailsModal(false);
    }
  }, [mappedLearners, selectedLearnerProfileId]);

  const handleSearchInput = (value: string) => {
    setSearch(value);
    setPageNumber(1);
  };

  const handleViewDetails = (learner: Learner) => {
    setSelectedLearnerProfileId(learner.learnerProfileId);
    setShowDetailsModal(true);
  };

  const handleBlockUnblock = (
    learner: Learner,
    action: "block" | "unblock"
  ) => {
    setLearnerToAction(learner);
    setActionType(action);
    setBanReason("");
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (!learnerToAction) return;

    if (actionType === "block") {
      if (!banReason.trim()) {
        toast.error("Vui lòng nhập lý do chặn");
        return;
      }
      banLearner(
        {
          userId: learnerToAction.userId,
          reason: banReason.trim(),
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminLearner"] });
            setShowConfirmDialog(false);
            setLearnerToAction(null);
            setBanReason("");
          },
        }
      );
    } else {
      // Unban - có thể dùng reason rỗng hoặc tạo service riêng
      banLearner(
        {
          userId: learnerToAction.userId,
          reason: "Unban user",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminLearner"] });
            setShowConfirmDialog(false);
            setLearnerToAction(null);
            setBanReason("");
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
            placeholder="Tìm theo mã, họ tên, email hoặc số điện thoại..."
            value={search}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-lg"
          />
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPageNumber(1);
            }}
          >
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="Active">Hoạt động</TabsTrigger>
              <TabsTrigger value="Inactive">Ngưng hoạt động</TabsTrigger>
              <TabsTrigger value="Banned">Bị chặn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
              
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
                Trạng thái
              </TableHead>
              <TableHead className="text-center text-gray-700 font-semibold">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-6 text-center text-gray-500"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : apiError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-6 text-center text-red-500"
                >
                  Không thể tải danh sách người học. Vui lòng thử lại sau.
                </TableCell>
              </TableRow>
            ) : filteredLearners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-6 text-center text-gray-500"
                >
                  Không có người học nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              filteredLearners.map((learner) => (
                <TableRow
                  key={learner.learnerProfileId}
                  className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
                >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="size-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                          <AvatarImage
                            src={getAvatarUrl(learner.fullName || "")}
                            alt={learner.fullName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                            {getInitials(learner.fullName || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                            normalizeStatus(learner.status) === "Active"
                              ? "bg-green-500"
                              : normalizeStatus(learner.status) === "Inactive"
                              ? "bg-gray-400"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold text-sm">
                          {learner.learnerProfileId}
                        </div>
                      </div>
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {learner.fullName}
                    </span>
                  </div>
                </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex flex-col">
                      <span className="text-sm">{learner.email}</span>
                      <span className="text-xs text-gray-500">
                        {learner.phone || "—"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        normalizeStatus(learner.status) === "Active" ? "default" : "secondary"
                      }
                      className={
                        normalizeStatus(learner.status) === "Active"
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                          : normalizeStatus(learner.status) === "Inactive"
                          ? "bg-gray-100 text-gray-600 border-gray-200"
                          : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                      }
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            normalizeStatus(learner.status) === "Active"
                              ? "bg-green-500"
                              : normalizeStatus(learner.status) === "Inactive"
                              ? "bg-gray-400"
                              : "bg-red-500"
                          }`}
                        ></div>
                        {normalizeStatus(learner.status) === "Active"
                          ? "Hoạt động"
                          : normalizeStatus(learner.status) === "Inactive"
                          ? "Ngưng hoạt động"
                          : "Bị chặn"}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative dropdown-container">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === learner.learnerProfileId ? null : learner.learnerProfileId
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

                    {openDropdownId === learner.learnerProfileId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 ">
                        <div className="py-1 ">
                          <button
                            onClick={() => {
                              handleViewDetails(learner);
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
                              const normalizedStatus = normalizeStatus(learner.status);
                              handleBlockUnblock(
                                learner,
                                  normalizedStatus === "Active" ||
                                    normalizedStatus === "Inactive"
                                  ? "block"
                                  : "unblock"
                              );
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                normalizeStatus(learner.status) === "Active" ||
                                normalizeStatus(learner.status) === "Inactive"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                              {normalizeStatus(learner.status) === "Active" ||
                              normalizeStatus(learner.status) === "Inactive" ? (
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
                                Chặn người dùng
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
                                Bỏ chặn người dùng
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang & Thông tin */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          NGƯỜI HỌC HOẠT ĐỘNG: {totalActive}/{totalItems}
        </div>
        <div>
          Hàng mỗi trang:{" "}
          <span className="font-semibold">{pageSize}</span> &nbsp;
          {totalItems === 0 ? "0 trên 0" : `${startItem}-${endItem} trên ${totalItems}`}
        </div>
      </div>

      {/* Chi tiết người học */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thông tin chi tiết người học
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedLearnerProfileId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
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

            {learnerDetailQuery.isLoading ? (
              <div className="p-6 text-center">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : learnerDetailQuery.error || !learnerDetail ? (
              <div className="p-6 text-center">
                <div className="text-red-500">
                  {learnerDetailQuery.error?.message || "Không thể tải thông tin chi tiết"}
                </div>
              </div>
            ) : (
            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Mã:</span>{" "}
                        {learnerDetail.learnerProfileId}
                    </div>
                    <div>
                      <span className="font-medium">Họ tên:</span>{" "}
                        {learnerDetail.fullName || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                        {learnerDetail.email || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                        {learnerDetail.phoneNumber || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <Badge
                        className={`ml-2 ${
                            learnerDetail.status === "Active"
                            ? "bg-green-600"
                              : learnerDetail.status === "Inactive"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                      >
                          {learnerDetail.status === "Active"
                          ? "Hoạt động"
                            : learnerDetail.status === "Inactive"
                          ? "Ngưng hoạt động"
                          : "Bị chặn"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Ngày tham gia:</span>{" "}
                        {formatDisplayDate(learnerDetail.joinDate)}
                    </div>
                      {learnerDetail.lastActiveAt && (
                        <div>
                          <span className="font-medium">Hoạt động lần cuối:</span>{" "}
                          {formatDisplayDate(learnerDetail.lastActiveAt)}
                        </div>
                      )}
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    {/* Mục tiêu cấp độ */}
                    <div>
                        <span className="font-medium">Trình độ:</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            {learnerDetail.level || "—"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                            {levelToGoal(learnerDetail.level) === "Beginner" &&
                            "(Mới bắt đầu)"}
                            {levelToGoal(learnerDetail.level) ===
                            "Intermediate" && "(Trung bình)"}
                            {levelToGoal(learnerDetail.level) === "Advanced" &&
                            "(Nâng cao)"}
                            {levelToGoal(learnerDetail.level) === "Expert" &&
                            "(Chuyên gia)"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Điểm đánh giá:</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            {learnerDetail.pronunciationScore != null
                              ? Number((learnerDetail.pronunciationScore / 10).toFixed(1))
                              : 0}
                        </Badge>
                      </div>
                    </div>
                      <div>
                        <span className="font-medium">Điểm trung bình:</span>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-sm px-3 py-1">
                            {learnerDetail.avgScore != null
                              ? Number((learnerDetail.avgScore / 10).toFixed(1))
                              : 0}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Số bài đánh giá:</span>{" "}
                        {learnerDetail.assessmentCount || 0}
                      </div>
                      <div>
                        <span className="font-medium">Phút học mỗi ngày:</span>{" "}
                        {learnerDetail.dailyMinutes || 0} phút
                    </div>
                    {/* Trạng thái gói */}
                    <div>
                      <span className="font-medium">Gói học hiện tại:</span>
                      <div className="mt-2">
                          {learnerDetail.courses?.filter(
                            (course) => mapCourseStatus(course.status) === "Active"
                        ).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                              {learnerDetail.courses
                                .filter(
                                  (course) => mapCourseStatus(course.status) === "Active"
                                )
                                .map((course, index) => (
                                <Badge
                                  key={index}
                                  className="bg-green-100 text-green-800 border-green-300"
                                >
                                    ✅ {course.title}
                                </Badge>
                              ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Không có gói hoạt động
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchased Packages */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                      Các khóa học đã đăng ký
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{learnerDetail.courses?.length || 0} khóa học</span>
                    <span>•</span>
                    <span>
                      {
                          learnerDetail.courses?.filter(
                            (course) => mapCourseStatus(course.status) === "Active"
                          ).length || 0
                      }{" "}
                      đang học
                    </span>
                  </div>
                </div>

                  {learnerDetail.courses && learnerDetail.courses.length > 0 ? (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {learnerDetail.courses.map(
                          (course: Course, index: number) => {
                            const courseStatus = mapCourseStatus(course.status);
                            const startDate = course.startTime
                              ? new Date(course.startTime)
                              : null;
                            const endDate = course.endTime
                              ? new Date(course.endTime)
                              : null;
                            const now = new Date();
                            const remainingDays =
                              endDate && endDate > now
                                ? Math.ceil(
                                    (endDate.getTime() - now.getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )
                                : 0;

                            return (
                          <CarouselItem
                            key={index}
                            className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                          >
                            <Card
                              className={`border-2 shadow-lg transition-all duration-300 hover:shadow-xl h-full ${
                                    courseStatus === "Active"
                                  ? "border-green-200 bg-linear-to-br from-green-50 to-emerald-50"
                                      : courseStatus === "Completed"
                                  ? "border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50"
                                  : "border-gray-200 bg-linear-to-br from-gray-50 to-slate-50"
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle
                                    className={`text-lg font-bold ${
                                          courseStatus === "Active"
                                        ? "text-green-700"
                                            : courseStatus === "Completed"
                                        ? "text-blue-700"
                                        : "text-gray-600"
                                    }`}
                                  >
                                        {course.title}
                                  </CardTitle>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                            courseStatus === "Active"
                                          ? "bg-green-500 animate-pulse"
                                              : courseStatus === "Completed"
                                          ? "bg-blue-500"
                                          : "bg-gray-400"
                                      }`}
                                    ></div>
                                    <Badge
                                      className={`text-xs font-medium ${
                                            courseStatus === "Active"
                                          ? "bg-green-100 text-green-700 border-green-300"
                                              : courseStatus === "Completed"
                                          ? "bg-blue-100 text-blue-700 border-blue-300"
                                          : "bg-gray-100 text-gray-600 border-gray-300"
                                      }`}
                                    >
                                          {courseStatus === "Active"
                                        ? "Đang học"
                                            : courseStatus === "Completed"
                                        ? "Hoàn thành"
                                        : "Hết hạn"}
                                    </Badge>
                                  </div>
                                </div>
                                <CardDescription className="text-sm text-gray-600">
                                      {course.duration} ngày • {course.price.toLocaleString("vi-VN")} VND
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                    {courseStatus === "Active" ? (
                                  <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg text-center">
                                      <div className="text-2xl font-bold">
                                            {remainingDays}
                                      </div>
                                      <div className="text-sm opacity-90">
                                        ngày còn lại
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                          Tiến độ
                                        </span>
                                        <span className="font-semibold text-green-600">
                                              {course.progress}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                              style={{ width: `${course.progress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                          <span>
                                            Bắt đầu:{" "}
                                            {startDate
                                              ? formatDisplayDate(course.startTime)
                                              : "—"}
                                          </span>
                                          <span>
                                            Kết thúc:{" "}
                                            {endDate
                                              ? formatDisplayDate(course.endTime)
                                              : "—"}
                                          </span>
                                    </div>
                                  </div>
                                    ) : courseStatus === "Completed" ? (
                                  <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg text-center">
                                      <div className="text-lg font-bold">
                                        ✅ Hoàn thành
                                      </div>
                                      <div className="text-sm opacity-90">
                                        Đã kết thúc
                                      </div>
                                    </div>
                                    <div className="text-center text-sm text-gray-600">
                                          Khóa học đã được hoàn thành thành công
                                        </div>
                                        <div className="text-center text-xs text-gray-500">
                                          Tiến độ: {course.progress}%
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-4 rounded-lg text-center">
                                      <div className="text-lg font-bold">
                                        ⏰ Hết hạn
                                      </div>
                                      <div className="text-sm opacity-90">
                                        Đã kết thúc
                                      </div>
                                    </div>
                                    <div className="text-center text-sm text-gray-600">
                                          Khóa học đã hết hạn, cần gia hạn
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </CarouselItem>
                            );
                          }
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 bg-white/80 hover:bg-white shadow-lg" />
                    <CarouselNext className="right-4 bg-white/80 hover:bg-white shadow-lg" />
                  </Carousel>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <div className="text-gray-500 text-lg font-medium">
                        Chưa đăng ký khóa học nào
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                        Học viên chưa đăng ký khóa học nào
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && learnerToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận {actionType === "block" ? "Chặn" : "Bỏ chặn"} Người dùng
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn {actionType === "block" ? "chặn" : "bỏ chặn"}{" "}
              <strong>{learnerToAction.fullName}</strong> không?
              {actionType === "block"
                ? " Thao tác này sẽ ngăn họ truy cập vào nền tảng."
                : " Thao tác này sẽ khôi phục quyền truy cập vào nền tảng của họ."}
            </p>
            {actionType === "block" && (
              <div className="mb-4">
                <Label htmlFor="banReason" className="text-sm font-medium">
                  Lý do chặn <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="banReason"
                  value={banReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBanReason(e.target.value)}
                  placeholder="Nhập lý do chặn người dùng..."
                  className="mt-2 w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isBanning}
                />
              </div>
            )}
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
                disabled={isBanning || (actionType === "block" && !banReason.trim())}
                className={
                  actionType === "block"
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                }
              >
                {isBanning
                  ? "Đang xử lý..."
                  : actionType === "block"
                  ? "Chặn người dùng"
                  : "Bỏ chặn người dùng"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerManagement;
