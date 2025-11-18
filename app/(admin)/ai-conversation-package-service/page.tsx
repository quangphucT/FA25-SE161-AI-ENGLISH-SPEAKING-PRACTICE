"use client";

import { useState } from "react";
import { 
  useDeleteAIConversationPackage, 
  getAIConversationPackages, 
  useCreateAIConversationPackages,
  useUpdateAIConversationPackage
} from "@/features/admin/hooks/aiConversationPackagesHooks/packages";
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
  Clock, 
  Coins, 
  Loader2,
  MessageCircle,
  AlertCircle,
  Edit
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

const AiConversationPackageManagement = () => {
  const { mutate: createPackage, isPending: isCreating } = useCreateAIConversationPackages();
  const { mutate: deletePackage } = useDeleteAIConversationPackage();
  const { mutate: updatePackage, isPending: isUpdating } = useUpdateAIConversationPackage();
  const { data: packagesData, isPending: isLoading } = getAIConversationPackages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<{
    aiConversationChargeId: string;
    amountCoin: number;
    allowedMinutes: number;
  } | null>(null);
  
  // Form state
  const [amountCoin, setAmountCoin] = useState<number>(0);
  const [allowedMinutes, setAllowedMinutes] = useState<number>(0);

  const handleCreate = () => {
    if (amountCoin <= 0) {
      toast.error("Số coin phải lớn hơn 0");
      return;
    }
    if (allowedMinutes <= 0) {
      toast.error("Số phút phải lớn hơn 0");
      return;
    }

    createPackage(
      { amountCoin, allowedMinutes },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setAmountCoin(0);
          setAllowedMinutes(0);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deletePackage(id, {
      onSuccess: () => {
        setDeleteId(null);
      },
      onError: () => {
        setDeleteId(null);
      },
    });
  };

  const handleEdit = (pkg: {
    aiConversationChargeId: string;
    amountCoin: number;
    allowedMinutes: number;
  }) => {
    setEditingPackage(pkg);
    setAmountCoin(pkg.amountCoin);
    setAllowedMinutes(pkg.allowedMinutes);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdate = () => {
    if (amountCoin <= 0) {
      toast.error("Số coin phải lớn hơn 0");
      return;
    }
    if (allowedMinutes <= 0) {
      toast.error("Số phút phải lớn hơn 0");
      return;
    }
    if (!editingPackage) return;

    updatePackage(
      {
        aiConversationPackageId: editingPackage.aiConversationChargeId,
        amountCoin,
        allowedMinutes,
      },
      {
        onSuccess: () => {
          setIsUpdateDialogOpen(false);
          setEditingPackage(null);
          setAmountCoin(0);
          setAllowedMinutes(0);
        },
      }
    );
  };

  const packages = packagesData?.data?.items || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              Quản lý Gói AI Conversation
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các gói coin cho tính năng trò chuyện với AI
            </p>
          </div>

          {/* Create Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Tạo gói mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo Gói AI Conversation Mới</DialogTitle>
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

                {/* Allowed Minutes Input */}
                <div className="space-y-2">
                  <Label htmlFor="allowedMinutes" className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Số Phút
                  </Label>
                  <Input
                    id="allowedMinutes"
                    type="number"
                    placeholder="VD: 10"
                    value={allowedMinutes || ""}
                    onChange={(e) => setAllowedMinutes(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-gray-500">
                    Thời gian trò chuyện được phép (phút)
                  </p>
                </div>

                {/* Preview */}
                {amountCoin > 0 && allowedMinutes > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Tỷ lệ: {amountCoin / allowedMinutes} coin/phút
                    </p>
                    <p className="text-xs text-blue-700">
                      {allowedMinutes} phút sẽ tốn {amountCoin} coin
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 cursor-pointer"
                  disabled={isCreating}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  disabled={isCreating}
                >
                  {isCreating ? (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số gói</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gói hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.filter(p => p.status === "Active").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng phút</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.reduce((sum, p) => sum + p.allowedMinutes, 0)}
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
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : packages.length === 0 ? (
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
                    <TableHead>Số Phút</TableHead>
                    <TableHead>Tỷ lệ (coin/phút)</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg, index) => (
                    <TableRow key={pkg.aiConversationChargeId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-700">
                            {pkg.amountCoin}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-700">
                            {pkg.allowedMinutes}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-700">
                          {(pkg.amountCoin / pkg.allowedMinutes).toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            pkg.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {pkg.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {dayjs(pkg.createdAt).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pkg)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(pkg.aiConversationChargeId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật Gói AI Conversation</DialogTitle>
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

            {/* Allowed Minutes Input */}
            <div className="space-y-2">
              <Label htmlFor="updateAllowedMinutes" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Số Phút
              </Label>
              <Input
                id="updateAllowedMinutes"
                type="number"
                placeholder="VD: 10"
                value={allowedMinutes || ""}
                onChange={(e) => setAllowedMinutes(Number(e.target.value))}
                min={0}
              />
              <p className="text-xs text-gray-500">
                Thời gian trò chuyện được phép (phút)
              </p>
            </div>

            {/* Preview */}
            {amountCoin > 0 && allowedMinutes > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Tỷ lệ: {amountCoin / allowedMinutes} coin/phút
                </p>
                <p className="text-xs text-blue-700">
                  {allowedMinutes} phút sẽ tốn {amountCoin} coin
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateDialogOpen(false);
                setEditingPackage(null);
                setAmountCoin(0);
                setAllowedMinutes(0);
              }}
              className="flex-1 cursor-pointer"
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={isUpdating}
            >
              {isUpdating ? (
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

export default AiConversationPackageManagement;
