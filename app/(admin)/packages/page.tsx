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
import { useState, useEffect } from "react";
import { useGetServicePackages, useGetServicePackageBuyers } from "@/features/admin/hooks/getServicePackages";
import { ServicePackage } from "@/types/servicePackage/servicePackage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useCreateCoinServicePackage } from "@/features/admin/hooks/createNewCoinServicePackage";
import { deleteCoinServicePackageMutation } from "@/features/admin/hooks/deleteCoinServicePackageMutation";
import { useUpdateCoinServicePackage } from "@/features/admin/hooks/updateCoinServicePackage";
import { CreateCoinServicePackageRequest } from "@/types/coin_servicePackage";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ServicePackageManagement = () => {
  const [pageNumber, setPageNumber] = useState(1);
const [pageSize] = useState(10);

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // call hooks
  const {
    data: servicePackagesData,
    isLoading,
    error,
    refetch
  } = useGetServicePackages(
  String(pageNumber),
  String(pageSize),
  search,
  statusFilter === "All" ? "" : statusFilter
);

  const totalItems = servicePackagesData?.data?.totalItems ?? 0;
const totalPages = Math.ceil(totalItems / pageSize);
  const {mutateAsync: createServicePackage} = useCreateCoinServicePackage();
  const {mutateAsync: deleteServicePackage} = deleteCoinServicePackageMutation();
  const {mutateAsync: updateServicePackage} = useUpdateCoinServicePackage();
  
  const createPackageSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên gói"),
    description: z.string().min(1, "Vui lòng nhập mô tả"),
    price: z.number().min(1, "Giá phải lớn hơn 0"),
    numberOfCoin: z.number().min(1, "Phải có ít nhất 1 xu"),
    bonusPercent: z.number().min(0).max(100, "Bonus trong khoảng 0 - 100"),
    status: z.enum(["Active", "Inactive"]),
  });

  type CreatePackageFormData = z.infer<typeof createPackageSchema>;

  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      numberOfCoin: 0,
      bonusPercent: 0,
      status: "Active",
    },
  });

  // Watch numberOfCoin and bonusPercent to auto-calculate price and total coins
  const numberOfCoin = form.watch("numberOfCoin");
  const bonusPercent = form.watch("bonusPercent");

  // Auto-calculate price when numberOfCoin changes: price = numberOfCoin * 1000
  useEffect(() => {
    if (numberOfCoin > 0) {
      form.setValue("price", numberOfCoin * 1000);
    }
  }, [numberOfCoin, form]);

  // Calculate total coins received (must be integer)
  const totalCoinsReceivedRaw = numberOfCoin + (numberOfCoin * bonusPercent) / 100;
  const totalCoinsReceived = Math.floor(totalCoinsReceivedRaw);
  const isTotalCoinsInteger = Number.isInteger(totalCoinsReceivedRaw);

  const onSubmit = async (values: z.infer<typeof createPackageSchema>) => {
    try {
      await createServicePackage(values);
      setShowCreateModal(false);
      form.reset();
      // Refetch data after successful creation
      await refetch();
    } catch (error) {
      // Error is handled in hook via toast
    }
  };
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [packageToUpdate, setPackageToUpdate] = useState<ServicePackage | null>(
    null
  );
  const [updateForm, setUpdateForm] = useState<CreateCoinServicePackageRequest>({
    name: "",
    description: "",
    price: 0,
    numberOfCoin: 0,
    bonusPercent: 0,
    status: "Active",
  });

  // Calculate for update form
  const updateTotalCoinsReceivedRaw = updateForm.numberOfCoin + (updateForm.numberOfCoin * updateForm.bonusPercent) / 100;
  const updateTotalCoinsReceived = Math.floor(updateTotalCoinsReceivedRaw);
  const isUpdateTotalCoinsInteger = Number.isInteger(updateTotalCoinsReceivedRaw);

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [packageToAction, setPackageToAction] = useState<ServicePackage | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);

  // Get packages from API (already filtered by API)
  const packages = servicePackagesData?.isSucess && servicePackagesData.data?.items
    ? servicePackagesData.data.items
    : [];

  const handleUpdate = (pkg: ServicePackage) => {
    setPackageToUpdate(pkg);
    // prefill update form
    setUpdateForm({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      numberOfCoin: pkg.numberOfCoin,
      bonusPercent: pkg.bonusPercent,
      status: pkg.status as "Active" | "Inactive",
    });
    setShowUpdateModal(true);
  };

  const handleViewDetails = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowDetailModal(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAction = (pkg: ServicePackage, action: "delete") => {
    setPackageToAction(pkg);
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    try {
      await deleteServicePackage(packageToAction!.servicePackageId);
      setShowConfirmDialog(false);
      setPackageToAction(null);
      // Refetch data after successful deletion
      await refetch();
    } catch (error) {
      // Error is handled in hook via toast
    }
  };

  const handleUpdateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!packageToUpdate) return;
    try {
      await updateServicePackage({
        servicePackageId: packageToUpdate.servicePackageId,
        ...updateForm,
      });
      setShowUpdateModal(false);
      setPackageToUpdate(null);
      // Refetch data after successful update
      await refetch();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // errors are handled in hook via toast
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  return (
    <div className="p-6"> 
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 w-full">
          <Input
            placeholder="Tìm kiếm gói dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[280px]"
          />
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 md:w-[420px]">
              <TabsTrigger value="All">Tất cả</TabsTrigger>
              <TabsTrigger value="Active">Hoạt động</TabsTrigger>
              <TabsTrigger value="Inactive">Ngưng hoạt động</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-700 cursor-pointer"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="inline mr-2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Thêm gói
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
             
              <TableHead className="text-gray-700 font-semibold">Tên gói</TableHead>
              <TableHead className="text-gray-700 font-semibold">Mô tả</TableHead>
              <TableHead className="text-gray-700 font-semibold">Giá</TableHead>
              <TableHead className="text-gray-700 font-semibold">Số lượng xu</TableHead>
              <TableHead className="text-gray-700 font-semibold">% Bonus</TableHead>
              <TableHead className="text-gray-700 font-semibold">Số xu nhận</TableHead>
              <TableHead className="text-gray-700 font-semibold">Số lượt mua</TableHead>
              <TableHead className="text-gray-700 font-semibold">Trạng thái</TableHead>
              <TableHead className="text-center text-gray-700 font-semibold">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-gray-500">Đang tải...</div>
                </TableCell>
              </TableRow>
            ) : error || servicePackagesData?.isSucess === false ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-red-500">
                    {error?.message || servicePackagesData?.message || "Không thể tải dữ liệu"}
                  </div>
                </TableCell>
              </TableRow>
            ) : packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-gray-500">Không có gói dịch vụ nào</div>
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow
                  key={pkg.servicePackageId}
                  className="hover:bg-[#f0f7e6] transition-colors"
                >
               
                  <TableCell className="font-semibold text-gray-900">{pkg.name}</TableCell>
                  <TableCell
                    className="text-gray-600 max-w-[220px] truncate"
                    title={pkg.description}
                  >
                    {pkg.description}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900">{formatPrice(pkg.price)}</span>
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium">
                    {Math.trunc(pkg.numberOfCoin)}
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium">
                    {pkg.bonusPercent}%
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium">
                    {Math.trunc(pkg.numberOfCoin + (pkg.numberOfCoin * pkg.bonusPercent / 100))}
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium">
                    {pkg.totalBuyer}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border ${
                        pkg.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            pkg.status === "Active" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {pkg.status === "Active" ? "Hoạt động" : "Ngưng hoạt động"}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
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
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(pkg)}
                          className="cursor-pointer"
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
                        <DropdownMenuItem
                          onClick={() => handleUpdate(pkg)}
                          className="cursor-pointer"
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
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Cập nhật
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction(pkg, "delete")}
                          className="cursor-pointer text-red-600"
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
                            <path d="M3 6h18" />
                            <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
                          </svg>
                          Xoá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
       {packages.length > 0 && (
  <div className="flex items-center justify-between mt-6">
    {/* Text */}
    <div className="text-sm text-gray-600">
      Hiển thị{" "}
      <span className="font-semibold">{(pageNumber - 1) * pageSize + 1}</span>{" "}
      đến{" "}
      <span className="font-semibold">
        {Math.min(pageNumber * pageSize, totalItems)}
      </span>{" "}
      của <span className="font-semibold">{totalItems}</span> gói dịch vụ
    </div>

    {/* Pagination */}
    <div className="flex items-center gap-2">
      {/* Prev */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
        disabled={pageNumber === 1}
      >
        Trước
      </Button>

      {/* Page Numbers */}
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let page;

        if (totalPages <= 5) {
          page = i + 1;
        } else if (pageNumber <= 3) {
          page = i + 1;
        } else if (pageNumber >= totalPages - 2) {
          page = totalPages - 4 + i;
        } else {
          page = pageNumber - 2 + i;
        }

        return (
          <Button
            key={page}
            size="sm"
            variant={page === pageNumber ? "default" : "outline"}
            onClick={() => setPageNumber(page)}
            className={
              page === pageNumber
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-pointer hover:bg-gray-50"
            }
          >
            {page}
          </Button>
        );
      })}

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
        disabled={pageNumber === totalPages}
      >
        Sau
      </Button>
    </div>
  </div>
)}


      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && packageToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xoá gói</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xoá{" "}
              <strong>{packageToAction.name}</strong>? Hành động này
              không thể hoàn tác.
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
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                Xoá gói
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thêm gói mới
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Thông tin gói
                    </h3>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên gói</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="VD: Khóa Tiếng Anh Nâng Cao"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
                              placeholder="Mô tả nội dung và mục tiêu của gói..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Giá & Số lượng xu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="numberOfCoin"
                        render={({ field }) => (
                          <FormItem className="flex flex-col h-full">
                            <FormLabel>Số lượng xu *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="VD: 30"
                                {...field}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  field.onChange(value);
                                  // Auto-calculate price: numberOfCoin * 1000
                                  if (value > 0) {
                                    form.setValue("price", value * 1000);
                                  }
                                }}
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="min-h-[20px] mt-1">
                              <p className="text-xs text-gray-500">
                                Giá tự động: {numberOfCoin > 0 ? (numberOfCoin * 1000).toLocaleString("vi-VN") : 0} VND
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="flex flex-col h-full">
                            <FormLabel>Giá (VND)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Tự động tính"
                                {...field}
                                value={field.value || 0}
                                readOnly
                                className="bg-gray-50 cursor-not-allowed h-10"
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="min-h-[20px] mt-1">
                              <p className="text-xs text-gray-500">
                                = Số lượng xu × 1,000
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bonusPercent"
                        render={({ field }) => (
                          <FormItem className="flex flex-col h-full">
                            <FormLabel>Phần trăm bonus (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="VD: 10"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="min-h-[20px] mt-1">
                              <p className="text-xs text-gray-500">
                                &nbsp;
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormItem className="flex flex-col h-full">
                        <FormLabel>Số xu nhận</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={totalCoinsReceived}
                            readOnly
                            className={`bg-gray-50 cursor-not-allowed font-semibold h-10 ${
                              !isTotalCoinsInteger && totalCoinsReceivedRaw > 0
                                ? "border-yellow-500 border-2"
                                : ""
                            }`}
                          />
                        </FormControl>
                        <div className="min-h-[20px] mt-1">
                          {!isTotalCoinsInteger && totalCoinsReceivedRaw > 0 && (
                            <p className="text-xs text-yellow-600 font-medium">
                              ⚠️ Cảnh báo: Kết quả tính toán ({totalCoinsReceivedRaw.toFixed(2)}) không phải số nguyên. Đã làm tròn xuống: {totalCoinsReceived}
                            </p>
                          )}
                          {isTotalCoinsInteger && totalCoinsReceivedRaw > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              ✓ Kết quả là số nguyên
                            </p>
                          )}
                          {totalCoinsReceivedRaw === 0 && (
                            <p className="text-xs text-gray-500">
                              = Số lượng xu + (Số lượng xu × % Bonus)
                            </p>
                          )}
                        </div>
                      </FormItem>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                      className="cursor-pointer"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 cursor-pointer"
                    >
                      Tạo gói
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}

      {/* Update Package Modal */}
      {showUpdateModal && packageToUpdate && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Cập nhật gói</h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-6" onSubmit={handleUpdateSubmit}>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin gói
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên gói
                      </label>
                      <input
                        type="text"
                        value={updateForm.name}
                        onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                        placeholder="Nhập tên gói"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        rows={3}
                        value={updateForm.description}
                        onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mô tả nội dung và mục tiêu của gói..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Giá & Số lượng xu
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col h-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng xu *
                      </label>
                      <input
                        type="number"
                        value={updateForm.numberOfCoin}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setUpdateForm({ 
                            ...updateForm, 
                            numberOfCoin: value,
                            price: value > 0 ? value * 1000 : updateForm.price
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                        placeholder="VD: 30"
                        min="0"
                      />
                      <div className="min-h-[20px] mt-1">
                        <p className="text-xs text-gray-500">
                          Giá tự động: {updateForm.numberOfCoin > 0 ? (updateForm.numberOfCoin * 1000).toLocaleString("vi-VN") : 0} VND
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col h-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá (VND)
                      </label>
                      <input
                        type="number"
                        value={updateForm.price}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed h-10"
                        placeholder="Tự động tính"
                      />
                      <div className="min-h-[20px] mt-1">
                        <p className="text-xs text-gray-500">
                          = Số lượng xu × 1,000
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col h-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phần trăm bonus (%)
                      </label>
                      <input
                        type="number"
                        value={updateForm.bonusPercent}
                        onChange={(e) => setUpdateForm({ ...updateForm, bonusPercent: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                        placeholder="VD: 10"
                        min="0"
                      />
                      <div className="min-h-[20px] mt-1">
                        <p className="text-xs text-gray-500">
                          &nbsp;
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col h-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số xu nhận
                      </label>
                      <input
                        type="number"
                        value={updateTotalCoinsReceived}
                        readOnly
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed font-semibold h-10 ${
                          !isUpdateTotalCoinsInteger && updateTotalCoinsReceivedRaw > 0
                            ? "border-yellow-500 border-2"
                            : ""
                        }`}
                      />
                      <div className="min-h-[20px] mt-1">
                        {!isUpdateTotalCoinsInteger && updateTotalCoinsReceivedRaw > 0 && (
                          <p className="text-xs text-yellow-600 font-medium">
                            ⚠️ Cảnh báo: Kết quả tính toán ({updateTotalCoinsReceivedRaw.toFixed(2)}) không phải số nguyên. Đã làm tròn xuống: {updateTotalCoinsReceived}
                          </p>
                        )}
                        {isUpdateTotalCoinsInteger && updateTotalCoinsReceivedRaw > 0 && (
                          <p className="text-xs text-green-600 font-medium">
                            ✓ Kết quả là số nguyên
                          </p>
                        )}
                        {updateTotalCoinsReceivedRaw === 0 && (
                          <p className="text-xs text-gray-500">
                            = Số lượng xu + (Số lượng xu × % Bonus)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Trạng thái
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value as "Active" | "Inactive" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                    >
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Ngưng hoạt động</option>
                    </select>
                  </div>
                </div>

                <div className="flex  justify-end space-x-3 pt-4 border-t">
                  <Button className="cursor-pointer"
                    type="button"
                    variant="outline"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                  >
                    Cập nhật gói
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPackage && (
        <PackageDetailModal
          package={selectedPackage}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
};

// Package Detail Modal Component
const PackageDetailModal = ({
  package: pkg,
  onClose,
}: {
  package: ServicePackage;
  onClose: () => void;
}) => {
  const [buyerPageNumber, setBuyerPageNumber] = useState(1);
  const [buyerPageSize] = useState(10);
  const [buyerSearch, setBuyerSearch] = useState("");
  
  const { data: buyersData, isLoading: isLoadingBuyers, error: buyersError } = useGetServicePackageBuyers(
    pkg.servicePackageId,
    String(buyerPageNumber),
    String(buyerPageSize),
    buyerSearch
  );
  
  // API returns data with items array
  const isSuccess = buyersData?.isSucess;
  const buyers = isSuccess && buyersData?.data?.items 
    ? buyersData.data.items 
    : [];
  
  const totalBuyers = buyersData?.data?.totalItems ?? 0;
  const totalBuyerPages = Math.ceil(totalBuyers / buyerPageSize);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết gói dịch vụ: {pkg.name}
            </h2>
            <Button
              variant="ghost"
              onClick={onClose}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng người mua
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {pkg.totalBuyer || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng doanh thu (Coin)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {pkg.totalRevenueCoin?.toLocaleString("vi-VN") || 0} Coin
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng doanh thu (VND)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {formatPrice(pkg.totalRevenueMoney || 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Buyers Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Danh sách người mua</h3>
              <Input
                placeholder="Tìm kiếm theo tên, email, mã đơn hàng..."
                value={buyerSearch}
                onChange={(e) => {
                  setBuyerSearch(e.target.value);
                  setBuyerPageNumber(1);
                }}
                className="w-full md:w-[300px]"
              />
            </div>
            <div className="overflow-x-auto rounded-xl border shadow">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7f9fa]">
                    <TableHead className="text-gray-700 font-semibold">Họ tên</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Số tiền (VND)</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Số coin</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Mã đơn hàng</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Ngày mua</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingBuyers ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-gray-500">Đang tải...</div>
                      </TableCell>
                    </TableRow>
                  ) : buyersError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-red-500">
                          Lỗi: {buyersError.message || "Không thể tải dữ liệu"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : buyers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-gray-500">Chưa có người mua nào</div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    buyers.map((buyer) => (
                      <TableRow key={buyer.userId} className="hover:bg-[#f0f7e6]">
                        <TableCell className="font-medium">{buyer.buyerName || "N/A"}</TableCell>
                        <TableCell className="text-gray-600">{buyer.buyerEmail || "N/A"}</TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {formatPrice(buyer.amountMoney)}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {buyer.amountCoin?.toLocaleString("vi-VN") || 0} Coin
                        </TableCell>
                        <TableCell className="font-mono text-blue-600 text-sm">
                          {buyer.orderCode}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(buyer.createdTransaction)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination for Buyers */}
            {!isLoadingBuyers && buyers.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Hiển thị{" "}
                  <span className="font-semibold">{(buyerPageNumber - 1) * buyerPageSize + 1}</span>{" "}
                  đến{" "}
                  <span className="font-semibold">
                    {Math.min(buyerPageNumber * buyerPageSize, totalBuyers)}
                  </span>{" "}
                  của <span className="font-semibold">{totalBuyers}</span> người mua
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBuyerPageNumber((p) => Math.max(1, p - 1))}
                    disabled={buyerPageNumber === 1 || isLoadingBuyers}
                    className="cursor-pointer"
                  >
                    Trước
                  </Button>

                  {Array.from({ length: Math.min(5, totalBuyerPages) }, (_, i) => {
                    let page;

                    if (totalBuyerPages <= 5) {
                      page = i + 1;
                    } else if (buyerPageNumber <= 3) {
                      page = i + 1;
                    } else if (buyerPageNumber >= totalBuyerPages - 2) {
                      page = totalBuyerPages - 4 + i;
                    } else {
                      page = buyerPageNumber - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        size="sm"
                        variant={page === buyerPageNumber ? "default" : "outline"}
                        onClick={() => setBuyerPageNumber(page)}
                        className={
                          page === buyerPageNumber
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "cursor-pointer hover:bg-gray-50"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBuyerPageNumber((p) => Math.min(totalBuyerPages, p + 1))}
                    disabled={buyerPageNumber === totalBuyerPages || isLoadingBuyers}
                    className="cursor-pointer"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePackageManagement;
