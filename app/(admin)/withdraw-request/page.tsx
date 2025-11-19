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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions
interface WithdrawRequest {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  avatar: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Processing";
  processedDate?: string;
  processedBy?: string;
  notes?: string;
  transactionId?: string;
}

const sampleWithdrawRequests: WithdrawRequest[] = [
  {
    id: "WR001",
    reviewerId: "M001",
    reviewerName: "Dr. Sarah Johnson",
    reviewerEmail: "sarah.johnson@example.com",
    avatar: "https://via.placeholder.com/150",
    amount: 2500000,
    bankName: "Vietcombank",
    bankAccount: "1234567890",
    accountHolder: "Sarah Johnson",
    requestDate: "2024-01-15",
    status: "Pending",
  },
  {
    id: "WR002",
    reviewerId: "M002",
    reviewerName: "Prof. Michael Chen",
    reviewerEmail: "michael.chen@example.com",
    avatar: "https://via.placeholder.com/150",
    amount: 1800000,
    bankName: "Techcombank",
    bankAccount: "0987654321",
    accountHolder: "Michael Chen",
    requestDate: "2024-01-14",
    status: "Approved",
    processedDate: "2024-01-16",
    processedBy: "Admin User",
    transactionId: "TXN123456789",
  },
  {
    id: "WR003",
    reviewerId: "M003",
    reviewerName: "Ms. Emily Davis",
    reviewerEmail: "emily.davis@example.com",
    avatar: "https://via.placeholder.com/150",
    amount: 3200000,
    bankName: "BIDV",
    bankAccount: "1122334455",
    accountHolder: "Emily Davis",
    requestDate: "2024-01-13",
    status: "Rejected",
    processedDate: "2024-01-15",
    processedBy: "Admin User",
    notes: "Insufficient documentation",
  },
  {
    id: "WR004",
    reviewerId: "M004",
    reviewerName: "Dr. James Rodriguez",
    reviewerEmail: "james.rodriguez@example.com",
    avatar: "https://via.placeholder.com/150",
    amount: 1500000,
    bankName: "Agribank",
    bankAccount: "5566778899",
    accountHolder: "James Rodriguez",
    requestDate: "2024-01-12",
    status: "Processing",
    processedDate: "2024-01-14",
    processedBy: "Admin User",
    transactionId: "TXN987654321",
  },
  {
    id: "WR005",
    reviewerId: "M005",
    reviewerName: "Ms. Lisa Wang",
    reviewerEmail: "lisa.wang@example.com",
    avatar: "https://via.placeholder.com/150",
    amount: 2800000,
    bankName: "VietinBank",
    bankAccount: "9988776655",
    accountHolder: "Lisa Wang",
    requestDate: "2024-01-11",
    status: "Approved",
    processedDate: "2024-01-13",
    processedBy: "Admin User",
    transactionId: "TXN456789123",
  },
  {
    id: "WR006",
    reviewerId: "M006",
    reviewerName: "Dr. Robert Kim",
    reviewerEmail: "robert.kim@example.com",
    avatar: "https://via.placeholder.com/150",
    amount: 2100000,
    bankName: "ACB",
    bankAccount: "4433221100",
    accountHolder: "Robert Kim",
    requestDate: "2024-01-10",
    status: "Pending",
  },
];

const WithdrawRequest = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawRequest | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [requestToAction, setRequestToAction] =
    useState<WithdrawRequest | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter requests by search and status
  const filteredRequests = sampleWithdrawRequests.filter((request) => {
    const matchesSearch =
      request.reviewerName.toLowerCase().includes(search.toLowerCase()) ||
      request.reviewerEmail.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(
      selectedRows.includes(idx)
        ? selectedRows.filter((i) => i !== idx)
        : [...selectedRows, idx]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredRequests.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRequests.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (request: WithdrawRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApproveReject = (
    request: WithdrawRequest,
    action: "approve" | "reject"
  ) => {
    setRequestToAction(request);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    // Here you would make the API call to approve/reject the request
    console.log(`${actionType}ing request:`, requestToAction);
    setShowConfirmDialog(false);
    setRequestToAction(null);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
            Tổng:{" "}
            <span className="font-semibold">{filteredRequests.length}</span> yêu
            cầu
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
              {
                sampleWithdrawRequests.filter((r) => r.status === "Pending")
                  .length
              }
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
              {
                sampleWithdrawRequests.filter((r) => r.status === "Approved")
                  .length
              }
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
              {
                sampleWithdrawRequests.filter((r) => r.status === "Rejected")
                  .length
              }
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
              {
                sampleWithdrawRequests.filter((r) => r.status === "Processing")
                  .length
              }
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
              <TableHead>
                <Checkbox
                  checked={
                    selectedRows.length === filteredRequests.length &&
                    filteredRequests.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
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
            {filteredRequests.map((request, idx) => (
              <TableRow
                key={request.id}
                className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                      <AvatarImage
                        src={request.avatar}
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
                        {request.reviewerEmail}
                      </div>
                      <div className="text-xs text-blue-600">{request.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(request.amount)}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {request.bankName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.bankAccount}
                    </div>
                    <div className="text-xs text-gray-400">
                      {request.accountHolder}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {request.requestDate}
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
                    {request.status === "Pending" && "Chờ xử lý"}
                    {request.status === "Approved" && "Đã duyệt"}
                    {request.status === "Rejected" && "Từ chối"}
                    {request.status === "Processing" && "Đang xử lý"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === request.id ? null : request.id
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

                    {openDropdownId === request.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleViewDetails(request);
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
                          {request.status === "Pending" && (
                            <>
                              <button
                                onClick={() => {
                                  handleApproveReject(request, "approve");
                                  setOpenDropdownId(null);
                                }}
                                className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
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
                              </button>
                              <button
                                onClick={() => {
                                  handleApproveReject(request, "reject");
                                  setOpenDropdownId(null);
                                }}
                                className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          Hiển thị 1-{filteredRequests.length} trong tổng số{" "}
          {filteredRequests.length} yêu cầu
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
                      {selectedRequest.id}
                    </div>
                    <div>
                      <span className="font-medium">Số tiền:</span>{" "}
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(selectedRequest.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Ngày yêu cầu:</span>{" "}
                      {selectedRequest.requestDate}
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
                        {selectedRequest.status === "Pending" && "Chờ xử lý"}
                        {selectedRequest.status === "Approved" && "Đã duyệt"}
                        {selectedRequest.status === "Rejected" && "Từ chối"}
                        {selectedRequest.status === "Processing" &&
                          "Đang xử lý"}
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
                      {selectedRequest.bankAccount}
                    </div>
                    <div>
                      <span className="font-medium">Chủ tài khoản:</span>{" "}
                      {selectedRequest.accountHolder}
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Info */}
              {(selectedRequest.processedDate ||
                selectedRequest.processedBy) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin xử lý
                  </h3>
                  <div className="space-y-3">
                    {selectedRequest.processedDate && (
                      <div>
                        <span className="font-medium">Ngày xử lý:</span>{" "}
                        {selectedRequest.processedDate}
                      </div>
                    )}
                    {selectedRequest.processedBy && (
                      <div>
                        <span className="font-medium">Người xử lý:</span>{" "}
                        {selectedRequest.processedBy}
                      </div>
                    )}
                    {selectedRequest.transactionId && (
                      <div>
                        <span className="font-medium">Mã giao dịch:</span>{" "}
                        {selectedRequest.transactionId}
                      </div>
                    )}
                    {selectedRequest.notes && (
                      <div>
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {selectedRequest.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              <strong>{formatCurrency(requestToAction.amount)}</strong> không?
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
              >
                {actionType === "approve" ? "Duyệt" : "Từ chối"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequest;
