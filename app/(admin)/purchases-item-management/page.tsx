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
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminPurchase, useAdminPurchaseDetails } from "@/features/admin/hooks/useAdminPurchase";
import { Loader2, Search, Download, Eye, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react";
import type { AIConversationPurchaseDetail, Purchase } from "@/features/admin/services/adminPurchaseService";

const PAGE_SIZE = 10;

const PurchasesItemManagement = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);

  // Convert filter to API type format
  const apiType = itemTypeFilter === "All" ? "" : itemTypeFilter;
  

  const { data, isLoading, isError, error } = useAdminPurchase(
    pageNumber,
    PAGE_SIZE,
    search || "",
    apiType
  );

  const purchases = data?.data?.items ?? [];
  const totalItems = data?.data?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  // Filter by status on client side if needed (or let API handle it)
  const filteredPurchases = purchases.filter((purchase) => {
    if (statusFilter === "All") return true;
    return purchase.status === statusFilter;
  });

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setPageNumber(1);
  }, [search, statusFilter, itemTypeFilter]);

  // Fetch purchase details when modal is opened
  const { data: purchaseDetailsData, isLoading: isLoadingDetails, isError: isErrorDetails } = useAdminPurchaseDetails(
    selectedPurchaseId
  );

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchaseId(purchase.purchaseId);
    setShowDetailsModal(true);
  };

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

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getItemType = (purchase: Purchase): string => {
    return purchase.itemType || "Unknown";
  };

  const getItemName = (purchase: Purchase): string => {
    return purchase.itemName || "N/A";
  };

  const exportToPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Items Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .status-success { color: #16a34a; }
          .status-failed { color: #dc2626; }
          .status-pending { color: #ca8a04; }
          .status-refunded { color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>Purchase Items Management Report</h1>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString(
          "vi-VN"
        )} ${new Date().toLocaleTimeString("vi-VN")}</p>
        <p><strong>Total Records:</strong> ${filteredPurchases.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Purchase ID</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Item Type</th>
              <th>Item Name</th>
              <th>Amount (Coin)</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPurchases
              .map(
                (purchase) => `
              <tr>
                <td>${purchase.purchaseId}</td>
                <td>${purchase.userId}</td>
                <td>${purchase.userName || "-"}</td>
                <td>${getItemType(purchase)}</td>
                <td>${getItemName(purchase)}</td>
                <td>${purchase.coin?.toLocaleString("vi-VN") || 0} coin</td>
                <td class="status-${purchase.status.toLowerCase()}">${
                  purchase.status
                }</td>
                <td>${formatDate(purchase.createdAt)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý giao dịch</h1>
          <p className="text-gray-500 mt-1">Theo dõi và quản lý tất cả giao dịch trong hệ thống</p>
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
                  placeholder="Tìm theo mã giao dịch hoặc User ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Tabs value={itemTypeFilter} onValueChange={(v) => setItemTypeFilter(v)}>
                <TabsList className="grid grid-cols-4 w-auto">
                  <TabsTrigger value="All">Tất cả loại</TabsTrigger>
                  <TabsTrigger value="Course">Khóa học</TabsTrigger>
                  <TabsTrigger value="ReviewFee">Phí đánh giá</TabsTrigger>
                  <TabsTrigger value="AIConversation">AI Conversation</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 cursor-pointer transition-all hover:shadow-lg flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Xuất báo cáo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={exportToPDF}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Xuất PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Giao dịch thành công</p>
                  <div className="text-3xl font-bold text-gray-900">
                    {purchases.filter((p) => p.status === "Success" || p.status === "Completed").length}
                  </div>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Giao dịch thất bại</p>
                  <div className="text-3xl font-bold text-gray-900">
                    {purchases.filter((p) => p.status === "Failed").length}
                  </div>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Đang xử lý</p>
                  <div className="text-3xl font-bold text-gray-900">
                    {purchases.filter((p) => p.status === "Pending").length}
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(
                      purchases
                        .filter((p) => p.status === "Success" || p.status === "Completed")
                        .reduce((sum, p) => sum + (p.coin || 0), 0)
                    )}
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Danh sách giao dịch</CardTitle>
              <CardDescription className="mt-1">
                Hiển thị {filteredPurchases.length} trên {totalItems} giao dịch
              </CardDescription>
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
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Mã giao dịch</TableHead>
                    <TableHead className="font-semibold text-gray-700">Tên người dùng</TableHead>
                    <TableHead className="font-semibold text-gray-700">Loại item</TableHead>
                    <TableHead className="font-semibold text-gray-700">Tên item</TableHead>
                    <TableHead className="font-semibold text-gray-700">Số coin</TableHead>
                    <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.purchaseId} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <span className="font-mono text-sm block truncate max-w-[150px] text-gray-900">
                          {purchase.purchaseId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-900">{purchase.userName || "-"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            purchase.itemType === "Course" || purchase.itemType === "Course"
                              ? "default"
                              : purchase.itemType === "ReviewFee" || purchase.itemType === "Review Fee"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs font-medium"
                        >
                          {getItemType(purchase)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{getItemName(purchase)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {purchase.coin?.toLocaleString("vi-VN") || 0} coin
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            purchase.status === "Success" || purchase.status === "Completed"
                              ? "default"
                              : purchase.status === "Failed"
                              ? "destructive"
                              : purchase.status === "Pending"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs font-medium"
                        >
                          {purchase.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(purchase.createdAt)}
                        </span>
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
                              onClick={() => handleViewDetails(purchase)}
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
                )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && filteredPurchases.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-gray-900">{totalItems > 0 ? (pageNumber - 1) * PAGE_SIZE + 1 : 0}</span> đến{" "}
                <span className="font-semibold text-gray-900">{Math.min(pageNumber * PAGE_SIZE, totalItems)}</span> trong tổng số{" "}
                <span className="font-semibold text-gray-900">{totalItems}</span> giao dịch
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
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
                        onClick={() => handlePageChange(pageNum)}
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
                  onClick={handleNextPage}
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

      {/* Modal chi tiết giao dịch */}
      {showDetailsModal && selectedPurchaseId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setShowDetailsModal(false);
          setSelectedPurchaseId(null);
        }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch</h2>
                  <p className="text-sm text-gray-600 mt-1">Thông tin chi tiết về giao dịch này</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPurchaseId(null);
                  }}
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-white/50 rounded-full"
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
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
              ) : isErrorDetails ? (
                <div className="text-center py-16">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="font-medium text-red-600 text-lg">Không thể tải chi tiết giao dịch</p>
                  <p className="text-sm text-gray-600 mt-2">Vui lòng thử lại sau.</p>
                </div>
              ) : purchaseDetailsData?.data ? (
                <>
                  {(() => {
                    // Service returns { isSucess, data: { info, itemDetail }, businessCode, message }
                    const responseData = purchaseDetailsData.data;
                    const purchaseInfo = responseData?.info;
                    const itemDetail = responseData?.itemDetail;
                    
                    if (!purchaseInfo || !itemDetail) {
                      return (
                        <div className="text-center py-12 text-gray-500">
                          <p>Không tìm thấy thông tin giao dịch</p>
                        </div>
                      );
                    }
                    
                    // Normalize itemType (remove spaces, e.g., "Review Fee" -> "ReviewFee", "AI Conversation" -> "AIConversation")
                    const rawItemType = purchaseInfo?.itemType || "Unknown";
                    const itemType = rawItemType.replace(/\s+/g, "");
                    
                    // Also handle case-insensitive matching
                    const normalizedItemType = itemType.toLowerCase();
                    
                    // Get coin amount (could be coin or amountCoin)
                    const coinAmount = purchaseInfo.coin || purchaseInfo.amountCoin || 0;
                    
                    // Normalize status (Completed -> Success)
                    const normalizedStatus = purchaseInfo.status === "Completed" ? "Success" : purchaseInfo.status;

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Purchase Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Thông tin giao dịch</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-start py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">Mã giao dịch:</span>
                              <span className="font-mono text-sm text-gray-900 text-right">{purchaseInfo.purchaseId}</span>
                            </div>
                            <div className="flex justify-between items-start py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">User ID:</span>
                              <span className="font-mono text-sm text-gray-900 text-right">{purchaseInfo.userId}</span>
                            </div>
                            <div className="flex justify-between items-start py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">Tên người dùng:</span>
                              <span className="text-sm text-gray-900 font-medium">{purchaseInfo.userName || "-"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">Loại item:</span>
                              <Badge
                                variant={
                                  normalizedItemType === "course"
                                    ? "default"
                                    : normalizedItemType === "reviewfee"
                                    ? "secondary"
                                    : normalizedItemType === "aiconversation"
                                    ? "outline"
                                    : "outline"
                                }
                                className="font-medium"
                              >
                                {rawItemType}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">Số coin:</span>
                              <span className="text-lg font-bold text-green-600">
                                {coinAmount.toLocaleString("vi-VN")} coin
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                              <Badge
                                variant={
                                  normalizedStatus === "Success"
                                    ? "default"
                                    : normalizedStatus === "Failed"
                                    ? "destructive"
                                    : normalizedStatus === "Pending"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="font-medium"
                              >
                                {purchaseInfo.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-start py-2">
                              <span className="text-sm font-medium text-gray-600">Ngày tạo:</span>
                              <span className="text-sm text-gray-900">{formatDate(purchaseInfo.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Chi tiết item</h3>
                          <div className="space-y-3">
                            {(normalizedItemType === "course" || itemType === "Course") && "courseId" in itemDetail && (
                              <>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Course ID:</span>
                                  <span className="font-mono text-sm text-gray-900 text-right">{itemDetail.courseId}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Tiêu đề:</span>
                                  <span className="text-sm text-gray-900 font-medium text-right">{itemDetail.title}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Level:</span>
                                  <span className="text-sm text-gray-900">{itemDetail.level}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Số chương:</span>
                                  <span className="text-sm text-gray-900">{itemDetail.numberOfChapter}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Thứ tự:</span>
                                  <span className="text-sm text-gray-900">{itemDetail.orderIndex}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-sm font-medium text-gray-600">Giá:</span>
                                  <span className="font-bold text-green-600">
                                    {itemDetail.price?.toLocaleString("vi-VN") || 0} VND
                                  </span>
                                </div>
                              </>
                            )}
                            {(normalizedItemType === "reviewfee" || itemType === "ReviewFee") && "reviewFeeId" in itemDetail && (
                              <>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Review Fee ID:</span>
                                  <span className="font-mono text-sm text-gray-900 text-right">{itemDetail.reviewFeeId}</span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Số lượt đánh giá:</span>
                                  <span className="text-sm text-gray-900 font-medium">{itemDetail.numberOfReview}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Giá:</span>
                                  <span className="font-bold text-green-600">
                                    {itemDetail.price?.toLocaleString("vi-VN") || 0} VND
                                  </span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Phần trăm hệ thống:</span>
                                  <span className="text-sm text-gray-900 font-medium">{itemDetail.percentOfSystem * 100}%</span>
                                </div>
                                <div className="flex justify-between items-start py-2">
                                  <span className="text-sm font-medium text-gray-600">Phần trăm reviewer:</span>
                                  <span className="text-sm text-gray-900 font-medium">{itemDetail.percentOfReviewer * 100}%</span>
                                </div>
                              </>
                            )}
                            {(normalizedItemType === "aiconversation" || itemType === "AIConversation") && "aiConversationChargeId" in itemDetail && (
                              <>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">AI Conversation Charge ID:</span>
                                  <span className="font-mono text-sm text-gray-900 text-right">{(itemDetail as AIConversationPurchaseDetail).aiConversationChargeId}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Số coin:</span>
                                  <span className="font-bold text-green-600">
                                    {((itemDetail as AIConversationPurchaseDetail).amountCoin || 0).toLocaleString("vi-VN")} coin
                                  </span>
                                </div>
                                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                                  <span className="text-sm font-medium text-gray-600">Số phút cho phép:</span>
                                  <span className="text-sm text-gray-900 font-medium">{(itemDetail as AIConversationPurchaseDetail).allowedMinutes} phút</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                                  <Badge
                                    variant={
                                      (itemDetail as AIConversationPurchaseDetail).status === "Active"
                                        ? "default"
                                        : (itemDetail as AIConversationPurchaseDetail).status === "Inactive"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="font-medium"
                                  >
                                    {(itemDetail as AIConversationPurchaseDetail).status}
                                  </Badge>
                                </div>
                              </>
                            )}
                            {/* Fallback if itemType doesn't match any known type */}
                            {normalizedItemType !== "course" && 
                             normalizedItemType !== "reviewfee" && 
                             normalizedItemType !== "aiconversation" && (
                              <div className="text-gray-500 italic">
                                Không có thông tin chi tiết cho loại item này: {rawItemType}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesItemManagement;
