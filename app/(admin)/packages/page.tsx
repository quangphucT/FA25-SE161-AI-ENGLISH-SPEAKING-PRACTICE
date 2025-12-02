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
import { useGetServicePackages } from "@/features/admin/hooks/getServicePackages";
import { ServicePackage } from "@/types/servicePackage/servicePackage";
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
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [packageToAction, setPackageToAction] = useState<ServicePackage | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setOpenDropdownId(null);
    }
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
            placeholder="Tìm kiếm gói dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
           <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-2 w-[300px]">
              <TabsTrigger value="Actived">Hoạt động</TabsTrigger>
              <TabsTrigger value="InActived">Ngưng hoạt động</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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

      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>Mã gói</TableHead>
              <TableHead>Tên gói</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Số lượng xu</TableHead>
              <TableHead>Phần trăm bonus</TableHead>
              <TableHead>Số xu đươc nhận</TableHead>
              <TableHead>Trạng thái</TableHead>

              <TableHead className="text-center">Hành động</TableHead>
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
              packages.map((pkg, idx) => (
                <TableRow
                  key={pkg.servicePackageId}
                  className="hover:bg-[#f0f7e6]"
                >
                <TableCell className="font-medium text-blue-600 truncate max-w-[100px]">
                  {pkg.servicePackageId}
                </TableCell>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell
                  className="text-gray-600 max-w-[200px] truncate"
                  title={pkg.description}
                >
                  {pkg.description}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{formatPrice(pkg.price)}</div>
                </TableCell>
                <TableCell>{Math.trunc(pkg.numberOfCoin)}</TableCell>
                <TableCell>{pkg.bonusPercent}</TableCell>
<TableCell>
  {Math.trunc(pkg.numberOfCoin + (pkg.numberOfCoin * pkg.bonusPercent / 100))}
</TableCell>
                <TableCell>
                  <Badge
                    variant={pkg.status === "Active" ? "default" : "secondary"}
                    className={
                      pkg.status === "Active"
                        ? "bg-green-600 text-white"
                        : "bg-red-400 text-white"
                    }
                  >
                    {pkg.status === "Active" ? "Hoạt động" : "Ngưng hoạt động"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === pkg.servicePackageId
                            ? null
                            : pkg.servicePackageId
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

                    {openDropdownId === pkg.servicePackageId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleUpdate(pkg);
                              setOpenDropdownId(null);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
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
                          </button>
                          <button
                            onClick={() => {
                              handleAction(pkg, "delete");
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
                              <path d="M3 6h18" />
                              <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
                            </svg>
                            Xoá
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá (VND)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="VD: 1000000"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numberOfCoin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số lượng xu</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="VD: 30"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bonusPercent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phần trăm bonus (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="VD: 10"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
              <form className="space-y-4" onSubmit={handleUpdateSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên gói
                  </label>
                  <input
                    type="text"
                    value={updateForm.name}
                    onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên gói"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phần trăm bonus (%)
                    </label>
                    <input
                      type="number"
                      value={updateForm.bonusPercent}
                      onChange={(e) => setUpdateForm({ ...updateForm, bonusPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 8"
                      min="0"
                    />
                  </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng xu
                    </label>
                    <input
                      type="number"
                      value={updateForm.numberOfCoin}
                      onChange={(e) => setUpdateForm({ ...updateForm, numberOfCoin: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 8"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá
                    </label>
                    <input
                      type="number"
                      value={updateForm.price}
                      onChange={(e) => setUpdateForm({ ...updateForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value as "Active" | "Inactive" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Ngưng hoạt động</option>
                    </select>
                  </div>
                </div>

                <div></div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    rows={4}
                    value={updateForm.description}
                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả gói"
                  />
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
    </div>
  );
};

export default ServicePackageManagement;
