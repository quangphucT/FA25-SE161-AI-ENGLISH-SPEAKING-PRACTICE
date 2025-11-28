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
import { useAdminReviewFeePackagesQuery } from "@/features/admin/hooks/useAdminReviewFee";

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

interface ReviewDetailItem {
  reviewId: string;
  score: number;
  question: string;
  comment: string | null;
  status: string;
  createdAt: Date;
  learner: string;
  earnedFromThisReview: number;
}


const ReviewMoneyManagement = () => {
  const [selectedReviewItem, setSelectedReviewItem] = useState<ReviewDetailItem | null>(null);
const [showReviewDetailModal, setShowReviewDetailModal] = useState(false);

    const { data: feePackages } = useAdminReviewFeePackagesQuery(1, 10);

const pricePerReview = feePackages?.data?.items
  ?.sort((a, b) =>
    new Date(b.currentPricePolicy.appliedDate).getTime() -
    new Date(a.currentPricePolicy.appliedDate).getTime()
  )[0]?.currentPricePolicy?.pricePerReviewFee ?? 0;

  const { data: adminReviewerIncome, isLoading: isLoadingIncome, isError: isErrorIncome } = useAdminReviewerIncome();
  const calculatedPricePerReview =
  (adminReviewerIncome?.data?.totalIncome ?? 0) /
  (adminReviewerIncome?.data?.totalReviews || 1);

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


  const formatCoin = (amount: number | undefined) => {
  const value = amount ?? 0;
  return `${value} coin`;
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
 const selectedReviewerRecords = adminReviewerIncomeDetail?.data?.items || [];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
{formatCoin(adminReviewerIncome?.data?.totalIncome)}
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
    {reviewer.reviewCount ?? 0}
  </div>
</TableCell>

<TableCell>
  <div className="font-semibold text-green-600">
{formatCoin(reviewer.totalIncome)}
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
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={() => setShowReviewerDetails(false)}
  >
    <div
      className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
           <h2 className="text-2xl font-bold">
  Chi tiết review của: <span className="text-white">{selectedReviewerName}</span>
</h2>

<p className="text-indigo-200 text-sm mt-1">
  Mã Reviewer: <span className="font-mono">{selectedReviewerProfileId}</span>
  <br />
  Tổng review: {selectedReviewerStats?.totalReviews ?? 0}
</p>

          </div>

          <Button
            variant="ghost"
            onClick={() => setShowReviewerDetails(false)}
            className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">

     {/* 🔥 THAY BLOCK NÀY – TOP STATISTICS MỚI */}
{selectedReviewerStats && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    {/* Tổng review */}
    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <p className="text-gray-500 text-sm">Tổng review</p>
        <p className="text-3xl font-bold text-gray-900">
          {selectedReviewerStats.totalReviews}
        </p>
      </CardContent>
    </Card>

    {/* Tổng thu nhập */}
    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <p className="text-gray-500 text-sm">Tổng thu nhập</p>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(selectedReviewerStats.totalEarnedFromSystem)}
        </p>
      </CardContent>
    </Card>

    {/* Thu nhập thực nhận */}
    <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <p className="text-gray-500 text-sm">Thu nhập thực nhận</p>
        <p className="text-3xl font-bold text-orange-600">
          {formatCurrency(selectedReviewerStats.netIncome)}
        </p>
      </CardContent>
    </Card>

    {/* Thu nhập mỗi review */}
    <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <p className="text-gray-500 text-sm">Thu nhập mỗi review</p>
        <p className="text-3xl font-bold text-purple-600">
          {formatCurrency(selectedReviewerStats.incomePerReview)}
        </p>
      </CardContent>
    </Card>

  </div>
)}

        {/* RECORD TABLE */}
        {selectedReviewerRecords.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Câu hỏi</TableHead>
                  <TableHead className="font-semibold text-gray-700">Learner</TableHead>
                  <TableHead className="font-semibold text-gray-700">Điểm</TableHead>
                  <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    Thu nhập
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedReviewerRecords.map((r) => (
                  <TableRow key={r.reviewId} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900 line-clamp-2">
                        {r.question}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">ID: {r.reviewId}</div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 border">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                            {getInitials(r.learner)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-800">
                          {r.learner}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-indigo-600">
                        {r.score}/10
                      </span>
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>

                    <TableCell className="text-center font-semibold text-green-600">
                      {formatCurrency(r.earnedFromThisReview)}
                    </TableCell>
                    <TableCell className="text-center">
  <Button
    size="sm"
    variant="outline"
    onClick={() => {
      setSelectedReviewItem(r);
      setShowReviewDetailModal(true);
    }}
  >
    Xem
  </Button>
</TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Chưa có review nào</h3>
            <p className="text-gray-500">
              Reviewer chưa thực hiện review nào trong khoảng thời gian đã chọn.
            </p>
          </div>
        )}

      </div>
    </div>
  </div>
  
)}
{/* Modal xem chi tiết 1 review */}
{showReviewDetailModal && selectedReviewItem && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={() => setShowReviewDetailModal(false)}
  >
    <div
      className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Chi tiết review</h2>
        <Button variant="ghost" onClick={() => setShowReviewDetailModal(false)}>
          ✕
        </Button>
      </div>

      <div className="space-y-4">

        <div>
          <p className="text-gray-500 text-sm">Câu hỏi</p>
          <p className="font-semibold">{selectedReviewItem.question}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Learner</p>
          <p className="font-semibold">{selectedReviewItem.learner}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Điểm</p>
          <p className="font-semibold text-indigo-600">
            {selectedReviewItem.score}/10
          </p>
        </div>

        {selectedReviewItem.comment && (
          <div>
            <p className="text-gray-500 text-sm">Nhận xét</p>
            <p>{selectedReviewItem.comment}</p>
          </div>
        )}

        <div>
          <p className="text-gray-500 text-sm">Thu nhập review này</p>
          <p className="font-bold text-green-600">
            {formatCurrency(selectedReviewItem.earnedFromThisReview)}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Ngày tạo</p>
          <p>{new Date(selectedReviewItem.createdAt).toLocaleString("vi-VN")}</p>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

export default ReviewMoneyManagement;
