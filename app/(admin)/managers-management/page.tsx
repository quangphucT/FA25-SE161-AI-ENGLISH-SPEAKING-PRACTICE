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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAdminManagerCreateMutation, useAdminManagerList, useAdminManagerDetail } from "@/features/admin/hooks/useAdminSummary";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { Manager } from "@/features/admin/services/adminManagerService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const formSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập tên đầy đủ").max(100),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ").max(15),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
const ManagerManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");
  const [ManagerToAction, setManagerToAction] = useState<Manager | null>(null);
  const [showPasswordCreate, setShowPasswordCreate] = useState<boolean>(false);
  const [showPasswordDetail, setShowPasswordDetail] = useState<boolean>(false);
  const [copiedPassword, setCopiedPassword] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data: managerList, isLoading, refetch } = useAdminManagerList(pageNumber, pageSize, search);
  
  // Fetch manager detail when viewing details
  const { data: managerDetailData, isLoading: isLoadingDetail } = useAdminManagerDetail(
    selectedManager?.userId || ""
  );
  
  // Get managers from API
  const managers = managerList?.data?.items || [];
  const totalItems = managerList?.data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });
  const { mutate, isPending } = useAdminManagerCreateMutation();
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        toast.success(
          "Tạo người quản lý thành công!"
        );
        form.reset();
        setShowPasswordCreate(false);
        setShowCreateModal(false);
        refetch(); // Refetch manager list after successful creation
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  }
  // Filter Managers by status (if status field exists in API)
  // Since API doesn't provide status, we'll show all managers
  const filteredManagers = managers.filter((manager) => {
    const managerStatus = manager.status || "Active";
    const matchesStatus =
      statusFilter === "All" || managerStatus === statusFilter;
    return matchesStatus;
  });


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

  // Reset to page 1 when search changes
  useEffect(() => {
    setPageNumber(1);
  }, [search]);

  const handleViewDetails = (Manager: Manager) => {
    setSelectedManager(Manager);
    setShowDetailsModal(true);
    setShowPasswordDetail(false); // Reset password visibility when opening modal
    setCopiedPassword(false); // Reset copy state
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedPassword(true);
      toast.success("Đã sao chép mật khẩu!");
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch (error) {
      toast.error("Không thể sao chép mật khẩu");
    }
  };

  const handleBlockUnblock = (
    Manager: Manager,
    action: "block" | "unblock"
  ) => {
    setManagerToAction(Manager);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    // Here you would make the API call to block/unblock the user
    console.log(`${actionType}ing user:`, ManagerToAction);
    setShowConfirmDialog(false);
    setManagerToAction(null);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[250px]"
          />
          {/* <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-3 w-[500px]">
              <TabsTrigger value="All">Tất cả</TabsTrigger>
              <TabsTrigger value="Active">Hoạt động</TabsTrigger>
              <TabsTrigger value="Inactive">Ngưng hoạt động</TabsTrigger>
            </TabsList>
          </Tabs> */}
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
          Thêm người quản lý
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead className="text-gray-700 font-semibold">
                Thông tin
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Họ tên
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Liên hệ
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
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredManagers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredManagers.map((Manager, idx) => {
                const managerStatus = Manager.status || "Active";
                return (
                  <TableRow key={Manager.userId} className="hover:bg-[#f0f7e6]">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="size-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                            <AvatarImage
                              src={undefined}
                              alt={Manager.fullName}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                              {getInitials(Manager.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                              managerStatus === "Active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <div className="text-blue-600 font-semibold text-sm">
                            {Manager.userId.slice(0, 8)}...
                          </div>
                          {/* <div className="text-gray-500 text-xs">Manager</div> */}
                        </div>
                      </div>
                    </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {Manager.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  <div className="flex flex-col">
                    <span className="text-sm">{Manager.email}</span>
                    <span className="text-xs text-gray-500">
                      {Manager.phoneNumber}
                    </span>
                  </div>
                </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          managerStatus === "Active" ? "default" : "secondary"
                        }
                        className={
                          managerStatus === "Active"
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              managerStatus === "Active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          {managerStatus === "Active"
                            ? "Hoạt động"
                            : "Ngưng hoạt động"}
                        </div>
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
                            onClick={() => handleViewDetails(Manager)}
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
                            onClick={() =>
                              handleBlockUnblock(
                                Manager,
                                managerStatus === "Active"
                                  ? "block"
                                  : "unblock"
                              )
                            }
                            className={`cursor-pointer ${
                              managerStatus === "Active"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {managerStatus === "Active" ? (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  className="inline mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="10"
                                    rx="2"
                                  />
                                  <circle cx="12" cy="16" r="1" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Chặn
                              </>
                            ) : (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  className="inline mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="10"
                                    rx="2"
                                  />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Bỏ chặn
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          ACTIVE ManagerS:{" "}
          {filteredManagers.filter((l) => l.status === "Active").length}/
          {totalItems}
        </div>
        <div className="flex items-center gap-4">
          <div>
            Rows per page: <span className="font-semibold">{pageSize}</span> &nbsp; 
            {totalItems > 0 ? `${(pageNumber - 1) * pageSize + 1}-${Math.min(pageNumber * pageSize, totalItems)}` : "0-0"}
            {" "}of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1}
              className="cursor-pointer"
            >
              Previous
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
                    className="cursor-pointer"
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
              disabled={pageNumber >= totalPages}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Chi tiết người quản lý */}
      {showDetailsModal && selectedManager && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thông tin chi tiết người quản lý
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedManager(null);
                    setShowPasswordDetail(false);
                  }}
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

            <div className="p-6 space-y-8">
              {isLoadingDetail ? (
                <div className="text-center py-8 text-gray-500">
                  Đang tải thông tin chi tiết...
                </div>
              ) : managerDetailData?.data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Thông tin cơ bản
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Mã:</span>{" "}
                        {managerDetailData.data.userId}
                      </div>
                      <div>
                        <span className="font-medium">Họ tên:</span>{" "}
                        {managerDetailData.data.fullName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {managerDetailData.data.email}
                      </div>
                      <div>
                        <span className="font-medium">Số điện thoại:</span>{" "}
                        {managerDetailData.data.phoneNumber}
                      </div>
                      <div>
                        <span className="font-medium">Vai trò:</span>{" "}
                        {managerDetailData.data.role || "MANAGER"}
                      </div>
                      <div>
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {new Date(managerDetailData.data.createdAt).toLocaleString("vi-VN")}
                      </div>
                      <div>
                        <span className="font-medium">Trạng thái:</span>
                        <Badge
                          className={`ml-2 ${
                            (managerDetailData.data.status || "Active") === "Active"
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }`}
                        >
                          {(managerDetailData.data.status || "Active") === "Active"
                            ? "Hoạt động"
                            : "Ngưng hoạt động"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Mật khẩu:</span>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                            <span className="flex-1 text-gray-700 font-mono text-sm">
                              {showPasswordDetail
                                ? managerDetailData.data.password
                                : "••••••••"}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setShowPasswordDetail(!showPasswordDetail)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                                title={showPasswordDetail ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                              >
                                {showPasswordDetail ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                              {showPasswordDetail && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyPassword(managerDetailData.data.password)}
                                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                                  title="Sao chép mật khẩu"
                                >
                                  {copiedPassword ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-red-500">
                  Không thể tải thông tin chi tiết
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && ManagerToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {actionType === "block" ? "Block" : "Unblock"} User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType}{" "}
              <strong>{ManagerToAction.fullName}</strong>?
              {actionType === "block"
                ? " This will prevent them from accessing the platform."
                : " This will restore their access to the platform."}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                className={
                  actionType === "block"
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }
              >
                {actionType === "block" ? "Block User" : "Unblock User"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Create Manager Modal */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thêm người quản lý mới
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Thông tin người quản lý */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Thông tin người quản lý
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên người quản lý *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="VD: Nguyễn Văn A"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="VD: nguyenvana@gmail.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại *</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="VD: 0909090909"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPasswordCreate ? "text" : "password"}
                                  placeholder="VD: 123456"
                                  {...field}
                                  className="pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswordCreate(!showPasswordCreate)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                  {showPasswordCreate ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Nút thao tác */}
                  <div className="flex gap-3 justify-end pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setShowPasswordCreate(false);
                        setShowCreateModal(false);
                      }}
                      className="cursor-pointer"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}  
                      className="bg-green-600 hover:bg-green-700 cursor-pointer"
                    >
                      {isPending ? "Đang tạo..." : "Tạo người quản lý"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerManagement;
