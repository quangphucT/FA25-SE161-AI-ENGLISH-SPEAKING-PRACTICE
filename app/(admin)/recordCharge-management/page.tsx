"use client";

import { useState } from "react";
import {
  useAdminRecordCharge,
  useAdminRecordChargeDetail,
  useAdminRecordChargeCreate,
  useAdminRecordChargeUpdate,
  useAdminRecordChargeDelete,
  useAdminRecordChargePatch,
} from "@/features/admin/hooks/useAdminRecordCharge";
import type { RecordCharge, Buyer } from "@/features/admin/services/adminRecordChargeService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Trash2, 
  FileAudio, 
  Coins, 
  Loader2,
  Mic,
  AlertCircle,
  Edit,
  Eye,
  Users,
  Power
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RECORD_CHARGE_PAGE_SIZE = 5;
const BUYERS_PAGE_SIZE = 5;

const RecordChargeManagement = () => {
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = RECORD_CHARGE_PAGE_SIZE;

  const { data: recordChargeData, isPending: isLoading } = useAdminRecordCharge(pageNumber, pageSize);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isBuyersDialogOpen, setIsBuyersDialogOpen] = useState(false);
  const [selectedRecordChargeId, setSelectedRecordChargeId] = useState<string | null>(null);
  const [buyersPageNumber, setBuyersPageNumber] = useState(1);
  const buyersPageSize = BUYERS_PAGE_SIZE;
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingRecordCharge, setEditingRecordCharge] = useState<{
    recordChargeId: string;
    amountCoin: number;
    allowedRecords: number;
  } | null>(null);
  
  // Form state
  const [amountCoin, setAmountCoin] = useState<number>(0);
  const [allowedRecords, setAllowedRecords] = useState<number>(0);
  
  // State for mutation parameters (hooks require parameters at call time)
  const [createBody, setCreateBody] = useState<{ amountCoin: number; allowedRecordCount: number }>({ amountCoin: 0, allowedRecordCount: 0 });
  const [updateId, setUpdateId] = useState<string>("");
  const [updateBody, setUpdateBody] = useState<{ amountCoin: number; allowedRecordCount: number }>({ amountCoin: 0, allowedRecordCount: 0 });
  const [deleteIdParam, setDeleteIdParam] = useState<string>("");
  const [patchId, setPatchId] = useState<string>("");
  
  // Fetch buyers data when a record charge is selected
  const { data: buyersData, isPending: isLoadingBuyers } = useAdminRecordChargeDetail(
    selectedRecordChargeId || "",
    buyersPageNumber,
    buyersPageSize
  );
  
  // Mutations - hooks are called with state values
  const createMutation = useAdminRecordChargeCreate(createBody);
  const updateMutation = useAdminRecordChargeUpdate(updateId, updateBody);
  const deleteMutation = useAdminRecordChargeDelete(deleteIdParam);
  const patchMutation = useAdminRecordChargePatch(patchId);

  const handleCreate = () => {
    if (amountCoin <= 0) {
      toast.error("Số coin phải lớn hơn 0");
      return;
    }
    if (allowedRecords <= 0) {
      toast.error("Số lượt ghi âm phải lớn hơn 0");
      return;
    }

    const body = { amountCoin, allowedRecordCount: allowedRecords };
    setCreateBody(body);
    // Trigger mutation after state update
    requestAnimationFrame(() => {
      createMutation.mutate(body, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setAmountCoin(0);
          setAllowedRecords(0);
          setCreateBody({ amountCoin: 0, allowedRecordCount: 0 });
        },
      });
    });
  };

  const handleDelete = (id: string) => {
    setDeleteIdParam(id);
    // Trigger mutation after state update
    requestAnimationFrame(() => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setDeleteId(null);
          setDeleteIdParam("");
        },
        onError: () => {
          setDeleteId(null);
          setDeleteIdParam("");
        },
      });
    });
  };

  const handleEdit = (recordCharge: {
    recordChargeId: string;
    amountCoin: number;
    allowedRecords: number;
  }) => {
    setEditingRecordCharge(recordCharge);
    setAmountCoin(recordCharge.amountCoin);
    setAllowedRecords(recordCharge.allowedRecords);
    setIsUpdateDialogOpen(true);
  };

  const handleViewBuyers = (recordChargeId: string) => {
    setSelectedRecordChargeId(recordChargeId);
    setBuyersPageNumber(1); // Reset to first page when opening modal
    setIsBuyersDialogOpen(true);
  };

  const handleUpdate = () => {
    if (amountCoin <= 0) {
      toast.error("Số coin phải lớn hơn 0");
      return;
    }
    if (allowedRecords <= 0) {
      toast.error("Số lượt ghi âm phải lớn hơn 0");
      return;
    }
    if (!editingRecordCharge) return;

    const body = { amountCoin, allowedRecordCount: allowedRecords };
    setUpdateId(editingRecordCharge.recordChargeId);
    setUpdateBody(body);
    // Trigger mutation after state update
    requestAnimationFrame(() => {
      updateMutation.mutate(body, {
        onSuccess: () => {
          setIsUpdateDialogOpen(false);
          setEditingRecordCharge(null);
          setAmountCoin(0);
          setAllowedRecords(0);
          setUpdateId("");
          setUpdateBody({ amountCoin: 0, allowedRecordCount: 0 });
        },
      });
    });
  };

  const handlePatch = (id: string) => {
    setPatchId(id);
    // Trigger mutation after state update
    requestAnimationFrame(() => {
      patchMutation.mutate(id, {
        onSuccess: () => {
          setPatchId("");
        },
      });
    });
  };

  const recordCharges = recordChargeData?.data?.items ?? [];
  const totalItems = recordChargeData?.data?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              Quản lý Gói Phí Ghi Âm
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các gói coin cho tính năng ghi âm
            </p>
          </div>

          {/* Create Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Tạo gói mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo Gói Record Charge Mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Amount Coin Input */}
                <div className="space-y-2">
                  <Label htmlFor="amountCoin" className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    Số Coin
                  </Label>
                  <Input
                    id="amountCoin"
                    type="number"
                    placeholder="VD: 50"
                    value={amountCoin || ""}
                    onChange={(e) => setAmountCoin(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-gray-500">
                    Số coin cần thiết để sử dụng gói này
                  </p>
                </div>

                {/* Allowed Records Input */}
                <div className="space-y-2">
                  <Label htmlFor="allowedRecords" className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-purple-600" />
                    Số Lượt Ghi Âm
                  </Label>
                  <Input
                    id="allowedRecords"
                    type="number"
                    placeholder="VD: 10"
                    value={allowedRecords || ""}
                    onChange={(e) => setAllowedRecords(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-gray-500">
                    Số lượt ghi âm được phép
                  </p>
                </div>

                {/* Preview */}
                {amountCoin > 0 && allowedRecords > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-900 mb-1">
                      Tỷ lệ: {(amountCoin / allowedRecords).toFixed(1)} coin/lượt
                    </p>
                    <p className="text-xs text-purple-700">
                      {allowedRecords} lượt ghi âm sẽ tốn {amountCoin} coin
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 cursor-pointer"
                  disabled={createMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo gói"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số gói</p>
              <p className="text-2xl font-bold text-gray-900">
                {recordChargeData?.data?.totalItems}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Power className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gói hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {recordChargeData?.data?.totalActiveItems}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Danh sách gói
          </h3>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : recordCharges.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Chưa có gói nào</p>
              <p className="text-sm text-gray-500">
                Nhấn &quot;Tạo gói mới&quot; để thêm gói đầu tiên
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Số Coin</TableHead>
                    <TableHead>Số Lượt Ghi Âm</TableHead>
                    <TableHead>Tỷ lệ (coin/lượt)</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordCharges.map((recordCharge, index) => (
                    <TableRow key={recordCharge.recordChargeId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-700">
                            {recordCharge.amountCoin}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileAudio className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-700">
                            {recordCharge.allowedRecords}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-700">
                          {(recordCharge.amountCoin / recordCharge.allowedRecords).toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-auto p-2 hover:bg-gray-100 text-sm font-medium text-gray-900"
                            >
                              <div className="flex items-center justify-between gap-2 min-w-[120px]">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                    recordCharge.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {recordCharge.status === "Active" ? "Active" : "InActive"}
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4 text-gray-500"
                                >
                                  <path d="M12 15.5l-5-5h10l-5 5z" />
                                </svg>
                              </div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem
                              onClick={() => {
                                if (recordCharge.status !== "Active") {
                                  handlePatch(recordCharge.recordChargeId);
                                }
                              }}
                              className="flex items-center justify-between px-4 py-3"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">Active</span>
                                <span className="text-xs text-gray-500">
                                  Gói đang hoạt động - có thể sử dụng
                                </span>
                              </div>
                              {recordCharge.status === "Active" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="h-4 w-4 text-green-600"
                                >
                                  <path d="M20.285 6.707l-11 11-5.657-5.657 1.414-1.414 4.243 4.243 9.586-9.586z" />
                                </svg>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (recordCharge.status !== "InActive") {
                                  handlePatch(recordCharge.recordChargeId);
                                }
                              }}
                              className="flex items-center justify-between px-4 py-3"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">InActive</span>
                                <span className="text-xs text-gray-500">
                                  Gói không hoạt động - không thể sử dụng
                                </span>
                              </div>
                              {recordCharge.status === "InActive" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="h-4 w-4 text-gray-600"
                                >
                                  <path d="M20.285 6.707l-11 11-5.657-5.657 1.414-1.414 4.243 4.243 9.586-9.586z" />
                                </svg>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {dayjs(recordCharge.createdAt).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBuyers(recordCharge.recordChargeId)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                            title="Xem chi tiết người mua"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(recordCharge)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(recordCharge.recordChargeId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination Footer */}
              <div className="flex justify-between items-center px-6 py-4 border-t text-sm text-gray-700">
                {/* Left: Rows per page */}
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <span className="font-medium">{pageSize}</span>
                </div>

                {/* Middle: 1–5 of 18 */}
                <div>
                  {totalItems === 0
                    ? "0–0 of 0"
                    : `${(pageNumber - 1) * pageSize + 1}–${Math.min(pageNumber * pageSize, totalItems)} of ${totalItems}`}
                </div>

                {/* Right: Previous / Page number / Next */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>

                  <span className="px-3 py-1 border rounded-md bg-gray-50">
                    {pageNumber}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === totalPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật Gói Record Charge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Amount Coin Input */}
            <div className="space-y-2">
              <Label htmlFor="updateAmountCoin" className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-600" />
                Số Coin
              </Label>
              <Input
                id="updateAmountCoin"
                type="number"
                placeholder="VD: 50"
                value={amountCoin || ""}
                onChange={(e) => setAmountCoin(Number(e.target.value))}
                min={0}
              />
              <p className="text-xs text-gray-500">
                Số coin cần thiết để sử dụng gói này
              </p>
            </div>

            {/* Allowed Records Input */}
            <div className="space-y-2">
              <Label htmlFor="updateAllowedRecords" className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-purple-600" />
                Số Lượt Ghi Âm
              </Label>
              <Input
                id="updateAllowedRecords"
                type="number"
                placeholder="VD: 10"
                value={allowedRecords || ""}
                onChange={(e) => setAllowedRecords(Number(e.target.value))}
                min={0}
              />
              <p className="text-xs text-gray-500">
                Số lượt ghi âm được phép
              </p>
            </div>

            {/* Preview */}
            {amountCoin > 0 && allowedRecords > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm font-medium text-purple-900 mb-1">
                  Tỷ lệ: {(amountCoin / allowedRecords).toFixed(1)} coin/lượt
                </p>
                <p className="text-xs text-purple-700">
                  {allowedRecords} lượt ghi âm sẽ tốn {amountCoin} coin
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateDialogOpen(false);
                setEditingRecordCharge(null);
                setAmountCoin(0);
                setAllowedRecords(0);
              }}
              className="flex-1 cursor-pointer"
              disabled={updateMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              className="flex-1 bg-purple-600 hover:bg-purple-700 cursor-pointer"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buyers Detail Dialog */}
      <Dialog open={isBuyersDialogOpen} onOpenChange={(open) => {
        setIsBuyersDialogOpen(open);
        if (!open) {
          setSelectedRecordChargeId(null);
          setBuyersPageNumber(1); // Reset pagination when closing
        }
      }}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Chi tiết người mua gói Record Charge
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingBuyers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : buyersData?.data ? (
            (() => {
              // API có thể trả về object hoặc mảng object, nên chuẩn hoá lại
              const rawDetail = buyersData.data as any;
              const detail = Array.isArray(rawDetail) ? rawDetail[0] : rawDetail;
              if (!detail) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Chưa có người mua gói này</p>
                  </div>
                );
              }
              const buyers: Buyer[] = detail.buyers ?? [];
              const summary = detail.summary;
              const totalBuyer = summary?.totalBuyer || 0;
              const totalCoin = summary?.totalCoin || 0;
              const allowedRecordCount = summary?.allowedRecordCount || 0;
              const totalItems = detail.totalItems || 0;
              
              // Calculate pagination info
              const totalPages = Math.ceil(totalItems / buyersPageSize);
              const startIndex = (buyersPageNumber - 1) * buyersPageSize;
              const endIndex = startIndex + buyersPageSize;
              const paginatedBuyers = buyers.slice(startIndex, endIndex);

              return (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 border-l-4 border-l-purple-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng người mua</p>
                          <p className="text-xl font-bold text-gray-900">
                            {totalBuyer}
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-l-yellow-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Coins className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng coin</p>
                          <p className="text-xl font-bold text-gray-900">
                            {totalCoin}
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-l-green-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileAudio className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lượt ghi âm cho phép</p>
                          <p className="text-xl font-bold text-gray-900">
                            {allowedRecordCount}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Buyers Table */}
                  {buyers.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Danh sách người mua ({totalItems})
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>STT</TableHead>
                              <TableHead>Họ tên</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Số coin</TableHead>
                              <TableHead>Ngày mua</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedBuyers.map((buyer: Buyer, index: number) => (
                              <TableRow key={`${buyer.email}-${index}`}>
                                <TableCell className="font-medium">
                                  {startIndex + index + 1}
                                </TableCell>
                                <TableCell className="font-medium">{buyer.fullName}</TableCell>
                                <TableCell className="text-gray-600">{buyer.email}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-yellow-600" />
                                    <span className="font-semibold text-yellow-700">
                                      {buyer.coin}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {dayjs(buyer.purchaseDate).format("DD/MM/YYYY HH:mm")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {/* Pagination - Always show if there are buyers */}
                      {totalItems > 0 && (
                        <div className="flex justify-between items-center px-4 py-4 border-t text-sm text-gray-700 mt-4">
                          {/* Left: Rows per page */}
                          <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <span className="font-medium">{buyersPageSize}</span>
                          </div>

                          {/* Middle: 1–5 of 10 */}
                          <div>
                            {totalItems === 0
                              ? "0–0 of 0"
                              : `${startIndex + 1}–${Math.min(endIndex, totalItems)} of ${totalItems}`}
                          </div>

                          {/* Right: Previous / Page number / Next */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={buyersPageNumber === 1}
                              onClick={() => setBuyersPageNumber(buyersPageNumber - 1)}
                              className="cursor-pointer"
                            >
                              Previous
                            </Button>

                            <span className="px-3 py-1 border rounded-md bg-gray-50">
                              {buyersPageNumber} / {totalPages}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={buyersPageNumber >= totalPages}
                              onClick={() => setBuyersPageNumber(buyersPageNumber + 1)}
                              className="cursor-pointer"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Chưa có người mua gói này</p>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Không thể tải thông tin người mua</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa gói này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700 cursor-pointer px-5 text-white rounded-2xl"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecordChargeManagement;
