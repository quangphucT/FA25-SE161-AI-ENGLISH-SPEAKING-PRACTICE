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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminWithdrawal, useAdminWithdrawalApprove, useAdminWithdrawalReject } from "@/features/admin/hooks/useAdminWithdrawal";
import { Withdrawal } from "@/features/admin/services/adminWithdrawalService";
import { toast } from "sonner";

const WithdrawRequest = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] =
    useState<Withdrawal | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [requestToAction, setRequestToAction] =
    useState<Withdrawal | null>(null);
  const {
    data: withdrawalData,
    isLoading,
    error,
    refetch,
  } = useAdminWithdrawal(
    pageNumber,
    pageSize,
    statusFilter === "All" ? "" : statusFilter,
    search
  );
  const { mutateAsync: approveWithdrawal, isPending: isApproving } =
    useAdminWithdrawalApprove();
  const { mutateAsync: rejectWithdrawal, isPending: isRejecting } =
    useAdminWithdrawalReject();

  const requestItems = withdrawalData?.data?.items;
  const requests = useMemo(() => requestItems ?? [], [requestItems]);
  const totalItems = withdrawalData?.data?.totalItems ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  useEffect(() => {
    setPageNumber(1);
  }, [statusFilter, search]);

  const handleViewDetails = (request: Withdrawal) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApproveReject = (
    request: Withdrawal,
    action: "approve" | "reject"
  ) => {
    setRequestToAction(request);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    if (!requestToAction) return;
    try {
      if (actionType === "approve") {
        await approveWithdrawal(requestToAction.transactionId);
        toast.success("Duyệt yêu cầu thành công");
      } else {
        await rejectWithdrawal(requestToAction.transactionId);
        toast.success("Từ chối yêu cầu thành công");
      }
      setShowConfirmDialog(false);
      setRequestToAction(null);
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Thao tác không thành công"
      );
    }
  };

  const getInitials = (reviewerName?: string | null) => {
    const normalized = typeof reviewerName === "string" ? reviewerName.trim() : "";
    if (!normalized) {
      return "NA";
    }
    return normalized
      .split(" ")
      .filter(Boolean)
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "Approved":
        return "Đã duyệt";
      case "Rejected":
        return "Từ chối";
      case "Processing":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;
  const processingCount = requests.filter((r) => r.status === "Processing").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý yêu cầu rút tiền
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và xử lý yêu cầu rút tiền từ reviewers
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-semibold">{totalItems}</span> yêu cầu
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Chờ xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đã duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đã từ chối
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đang xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {processingCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm theo tên, email hoặc mã yêu cầu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80"
          />
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-5 w-[400px]">
              <TabsTrigger value="All">Tất cả</TabsTrigger>
              <TabsTrigger value="Pending">Chờ xử lý</TabsTrigger>
              <TabsTrigger value="Approved">Đã duyệt</TabsTrigger>
              <TabsTrigger value="Rejected">Từ chối</TabsTrigger>
              <TabsTrigger value="Processing">Đang xử lý</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
              <TableHead className="text-gray-700 font-semibold">
                Reviewer
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Số tiền
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Ngân hàng
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Ngày yêu cầu
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
                <TableCell colSpan={7} className="text-center py-8">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-red-500">
                  {error.message}
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Không có yêu cầu nào
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request, idx) => (
              <TableRow
                key={request.transactionId}
                className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
              >
           
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                      <AvatarImage
                        src={undefined}
                        alt={request.reviewerName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                        {getInitials(request.reviewerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {request.reviewerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.email}
                      </div>
                      <div className="text-xs text-blue-600">
                        {request.transactionId}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(request.amountMoney)}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {request.bankName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.accountNumber}
                    </div>
                    <div className="text-xs text-gray-400">
                      {request.orderCode}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleString("vi-VN")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs font-medium ${
                      request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : request.status === "Approved"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-blue-100 text-blue-700 border-blue-300"
                    }`}
                  >
                    {getStatusLabel(request.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 cursor-pointer">
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
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(request)}
                        className="cursor-pointer text-gray-700 focus:text-gray-900"
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
                      </DropdownMenuItem>
                      {request.status === "Pending" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleApproveReject(request, "approve")}
                            className="cursor-pointer text-green-600 focus:text-green-700"
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
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            Duyệt yêu cầu
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleApproveReject(request, "reject")}
                            className="cursor-pointer text-red-600 focus:text-red-700"
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
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Từ chối yêu cầu
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          {requests.length > 0
            ? `Hiển thị ${(pageNumber - 1) * pageSize + 1}-${Math.min(
                pageNumber * pageSize,
                totalItems
              )} trong tổng số ${totalItems} yêu cầu`
            : "Không có dữ liệu"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          >
            Trước
          </Button>
          <div className="px-3 py-1 border rounded">
            Trang {pageNumber} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pageNumber >= totalPages}
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi tiết yêu cầu rút tiền
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailsModal(false)}
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

            <div className="p-6 space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin yêu cầu
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Mã yêu cầu:</span>{" "}
                      {selectedRequest.transactionId}
                    </div>
                    <div>
                      <span className="font-medium">Số tiền:</span>{" "}
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(selectedRequest.amountMoney)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Số xu:</span>{" "}
                      {selectedRequest.coin}
                    </div>
                    <div>
                      <span className="font-medium">Mã đơn hàng:</span>{" "}
                      {selectedRequest.orderCode || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Ngày yêu cầu:</span>{" "}
                      {new Date(selectedRequest.createdAt).toLocaleString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <Badge
                        className={`ml-2 ${
                          selectedRequest.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : selectedRequest.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : selectedRequest.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {getStatusLabel(selectedRequest.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin ngân hàng
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Ngân hàng:</span>{" "}
                      {selectedRequest.bankName}
                    </div>
                    <div>
                      <span className="font-medium">Số tài khoản:</span>{" "}
                      {selectedRequest.accountNumber}
                    </div>
                    <div>
                      <span className="font-medium">Người dùng:</span>{" "}
                      {selectedRequest.reviewerName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedRequest.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && requestToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận {actionType === "approve" ? "Duyệt" : "Từ chối"} Yêu cầu
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn{" "}
              {actionType === "approve" ? "duyệt" : "từ chối"} yêu cầu rút tiền
              của <strong>{requestToAction.reviewerName}</strong> với số tiền{" "}
              <strong>{formatCurrency(requestToAction.amountMoney)}</strong> không?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={confirmAction}
                className={
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                }
                disabled={isApproving || isRejecting}
              >
                {actionType === "approve"
                  ? isApproving
                    ? "Đang duyệt..."
                    : "Duyệt"
                  : isRejecting
                  ? "Đang từ chối..."
                  : "Từ chối"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequest;
