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

const ServicePackageManagement = () => {
  // call hooks
  const {
    data: servicePackagesData,
    isLoading,
    isError,
    refetch,
  } = useGetServicePackages();

const createPackageSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên gói"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  price: z.number().min(1, "Giá phải lớn hơn 0"),
  numberOfCoin: z.number().min(1, "Phải có ít nhất 1 xu"),
  bonusPercent: z.number().min(0).max(100, "Bonus trong khoảng 0 - 100"),
  status: z.enum(["Active", "InActive"]),
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


  const onSubmit = (values: z.infer<typeof createPackageSchema>) => {
    console.log("📦 Tạo gói mới:", values);
    // TODO: gọi API tạo gói
    setShowCreateModal(false);
  };

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [packageToUpdate, setPackageToUpdate] = useState<ServicePackage | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"delete">("delete");
  const [packageToAction, setPackageToAction] = useState<ServicePackage | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter packages
  const filteredPackages = servicePackagesData?.data?.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.servicePackageId.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || pkg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdate = (pkg: ServicePackage) => {
    setPackageToUpdate(pkg);
    setShowUpdateModal(true);
  };

  const handleAction = (pkg: ServicePackage, action: "delete") => {
    setPackageToAction(pkg);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  // const confirmAction = () => {
  //   console.log(`${actionType}ing package:`, packageToAction);
  //   setShowConfirmDialog(false);
  //   setPackageToAction(null);
  // };

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
          <Button variant="outline" size="sm">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </Button>
          <Input
            placeholder="Tìm kiếm gói dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
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
              <TableHead>Trạng thái</TableHead>

              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages?.map((pkg, idx) => (
              <TableRow
                key={pkg.servicePackageId}
                className="hover:bg-[#f0f7e6]"
              >
                <TableCell className="font-medium text-blue-600">
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
                <TableCell>{pkg.numberOfCoin}</TableCell>
                <TableCell>{pkg.bonusPercent}</TableCell>
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
                            // onClick={() => {
                            //   handleUpdate(pkg);
                            //   setOpenDropdownId(null);
                            // }}
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
                            // onClick={() => {
                            //   handleAction(pkg, "delete");
                            //   setOpenDropdownId(null);
                            // }}
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirm Dialog */}
      {/* {showConfirmDialog && packageToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xoá gói</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xoá{" "}
              <strong>{packageToAction.packageName}</strong>? Hành động này
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
      )} */}

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
      {/* {showUpdateModal && packageToUpdate && (
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
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên gói
                  </label>
                  <input
                    type="text"
                    defaultValue={packageToUpdate.packageName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên gói"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số buổi review
                    </label>
                    <input
                      type="number"
                      defaultValue={packageToUpdate.numberOfReview}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 8"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời hạn
                    </label>
                    <select
                      defaultValue={packageToUpdate.duration}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1 Month">1 tháng</option>
                      <option value="3 Months">3 tháng</option>
                      <option value="6 Months">6 tháng</option>
                      <option value="12 Months">12 tháng</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá
                    </label>
                    <input
                      type="number"
                      defaultValue={packageToUpdate.price}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      defaultValue={packageToUpdate.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Ngưng hoạt động</option>
                      <option value="Pending">Đang xử lý</option>
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
                    defaultValue={packageToUpdate.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả gói"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Cập nhật gói
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ServicePackageManagement;
