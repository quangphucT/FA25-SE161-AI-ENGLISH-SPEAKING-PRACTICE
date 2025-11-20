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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminReviewerIncome, useAdminReviewerIncomeDetail, useAdminReviewerIncomeList } from "@/features/admin/hooks/useAdminReviewerIncome";
import { Loader2, Search, Calendar, RefreshCw, Eye, TrendingUp, Users, DollarSign, FileText } from "lucide-react";

// Type definitions
interface ReviewRecord {
  id: string;
  question: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerAvatar: string;
  learnerName: string;
  learnerEmail: string;
  learnerAvatar: string;
  score: number;
  maxScore: number;
  createdAt: string;
  reviewTime: string; // Time spent on review
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}


const ReviewMoneyManagement = () => {
  const { data: adminReviewerIncome, isLoading: isLoadingIncome, isError: isErrorIncome } = useAdminReviewerIncome();
  const [showReviewerDetails, setShowReviewerDetails] =
    useState<boolean>(false);
  const [selectedReviewerProfileId, setSelectedReviewerProfileId] =
    useState<string>("");
  const [selectedReviewerName, setSelectedReviewerName] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("2024-01-01");
  const [toDate, setToDate] = useState<string>("2024-01-31");
  const { data: adminReviewerIncomeList, isLoading: isLoadingList, isError: isErrorList } = useAdminReviewerIncomeList(pageNumber, pageSize, search, fromDate, toDate);
  const { data: adminReviewerIncomeDetail, isLoading: isLoadingDetail } = useAdminReviewerIncomeDetail(selectedReviewerProfileId);
  
  // Get reviewers from API data
  const reviewers = adminReviewerIncomeList?.data?.items || [];
  const totalItems = reviewers.length; // API might not return totalItems, use current items length
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [search, fromDate, toDate, pageSize]);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };



  const handleViewReviewerDetails = (
    reviewerProfileId: string,
    reviewerName: string
  ) => {
    setSelectedReviewerProfileId(reviewerProfileId);
    setSelectedReviewerName(reviewerName);
    setShowReviewerDetails(true);
  };

  // Get records for selected reviewer from API
  const selectedReviewerRecords = adminReviewerIncomeDetail?.data?.reviews || [];
  const selectedReviewerStats = adminReviewerIncomeDetail?.data;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý thu nhập reviewer</h1>
          <p className="text-gray-500 mt-1">Theo dõi và quản lý thu nhập của các reviewer trong hệ thống</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {isLoadingIncome ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
      ) : isErrorIncome ? (
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Không thể tải thống kê</p>
              <p className="text-sm mt-1">Vui lòng thử lại sau</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng số review</p>
                  <div className="text-3xl font-bold text-gray-900">
                    {adminReviewerIncome?.data?.totalReviews ?? 0}
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng thu nhập</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(adminReviewerIncome?.data?.totalIncome ?? 0)}
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Số reviewer</p>
                  <div className="text-3xl font-bold text-gray-900">
                    {adminReviewerIncome?.data?.totalReviewer ?? 0}
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Phí review</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(adminReviewerIncome?.data?.pricePerReview ?? 0)}
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      

      {/* Reviewer Statistics */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-white">
          <CardTitle className="text-xl font-semibold">Thống kê theo Reviewer</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters for Reviewer Statistics */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên reviewer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Từ ngày:
                </label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-40 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Đến ngày:
                </label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-40 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={() => {
                  setFromDate("2024-01-01");
                  setToDate("2024-01-31");
                  setSearch("");
                }}
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {isLoadingList ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : isErrorList ? (
            <div className="text-center py-12 text-red-500">
              <p className="font-medium">Không thể tải dữ liệu</p>
              <p className="text-sm mt-1">Vui lòng thử lại sau</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Reviewer</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Số review</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Thu nhập</TableHead>
                    <TableHead className="text-center text-gray-700 font-semibold">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewers.length > 0 ? (
                    reviewers.map((reviewer) => (
                      <TableRow key={reviewer.reviewerProfileId} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10 border-2 border-gray-200 shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                                {getInitials(reviewer.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {reviewer.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reviewer.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-blue-600">
                            {/* TODO: Add totalReviews to Reviewer interface */}
                            -
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">
                            {/* TODO: Add totalIncome to Reviewer interface */}
                            -
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewReviewerDetails(
                                    reviewer.reviewerProfileId || reviewer.email,
                                    reviewer.fullName
                                  )
                                }
                                className="cursor-pointer flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-gray-300" />
                          <p className="font-medium">Không có dữ liệu</p>
                          <p className="text-sm">Không tìm thấy reviewer nào</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoadingList && reviewers.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-6 border-t gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageNumber(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:border-gray-400 transition-colors"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">mục mỗi trang</span>
                </div>
                <div className="text-sm text-gray-600">
                  Hiển thị <span className="font-semibold text-gray-900">{totalItems > 0 ? (pageNumber - 1) * pageSize + 1 : 0}</span> đến{" "}
                  <span className="font-semibold text-gray-900">{Math.min(pageNumber * pageSize, totalItems)}</span> trong tổng số{" "}
                  <span className="font-semibold text-gray-900">{totalItems}</span> reviewer
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={pageNumber === 1 || isLoadingList}
                  className="hover:bg-gray-50"
                >
                  Trước
                </Button>
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
                      disabled={isLoadingList}
                      className={`min-w-[40px] ${
                        pageNumber === pageNum
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={pageNumber >= totalPages || isLoadingList}
                  className="hover:bg-gray-50"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewer Details Modal */}
      {showReviewerDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowReviewerDetails(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
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
                      Chi tiết review của {selectedReviewerName}
                    </h2>
                    <p className="text-blue-100">
                      {selectedReviewerProfileId} • {selectedReviewerStats?.totalReviews ?? 0}{" "}
                      review
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowReviewerDetails(false)}
                  className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full transition-colors"
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
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingDetail ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
              ) : selectedReviewerStats ? (
                <>
                  {/* Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng số review</p>
                            <div className="text-3xl font-bold text-gray-900">
                              {selectedReviewerStats.totalReviews ?? 0}
                            </div>
                          </div>
                          <div className="p-3 bg-blue-100 rounded-full">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng thu nhập</p>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(selectedReviewerStats.totalIncome ?? 0)}
                            </div>
                          </div>
                          <div className="p-3 bg-green-100 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Review Records Table */}
                  {selectedReviewerRecords.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="text-gray-700 font-semibold">Câu hỏi</TableHead>
                            <TableHead className="text-gray-700 font-semibold">Learner</TableHead>
                            <TableHead className="text-gray-700 font-semibold">Điểm</TableHead>
                            <TableHead className="text-gray-700 font-semibold">Ngày tạo</TableHead>
                            <TableHead className="text-center text-gray-700 font-semibold">Thu nhập</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedReviewerRecords.map((record) => (
                            <TableRow
                              key={record.id}
                              className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                            >
                              <TableCell className="max-w-xs">
                                <div className="font-medium text-gray-900 line-clamp-2">
                                  {record.question}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  ID: {record.id}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="size-8 border-2 border-gray-200">
                                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs font-semibold">
                                      {getInitials(record.learnerName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">
                                      {record.learnerName}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  className={`font-semibold ${getScoreColor(
                                    record.score,
                                    record.maxScore
                                  )}`}
                                >
                                  {record.score}/{record.maxScore}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-600">
                                  {new Date(record.createdAt).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="font-semibold text-green-600">
                                  {formatCurrency(record.earnings ?? 0)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="text-gray-600 text-lg font-semibold mb-2">
                        Chưa có review nào
                      </div>
                      <div className="text-gray-400 text-sm">
                        Reviewer này chưa thực hiện review nào trong khoảng thời gian đã chọn
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-gray-600 text-lg font-semibold mb-2">
                    Không tìm thấy thông tin
                  </div>
                  <div className="text-gray-400 text-sm">
                    Không thể tải chi tiết reviewer
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewMoneyManagement;
