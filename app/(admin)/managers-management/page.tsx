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
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Manager {
  id: string;
  fullName: string;
  email: string;
  status: "Active" | "Inactive";
  avatar: string;
  phoneNumber: string;
  password: string;
}

const sampleManagers: Manager[] = [
  {
    id: "L001",
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L002",
    fullName: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L003",
    fullName: "Lê Minh Cường",
    email: "leminhcuong@yahoo.com",
    status: "Inactive",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L004",
    fullName: "Phạm Thu Dung",
    email: "phamthudung@hotmail.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L005",
    fullName: "Hoàng Văn Em",
    email: "hoangvanem@gmail.com",
    status: "Inactive",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L006",
    fullName: "Đỗ Thị Hoa",
    email: "dothihoa@gmail.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L007",
    fullName: "Vũ Minh Khôi",
    email: "vuminhkhoi@yahoo.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L008",
    fullName: "Bùi Thị Lan",
    email: "buithilan@outlook.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
  {
    id: "L009",
    fullName: "Ngô Văn Minh",
    email: "ngovanminh@gmail.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "0909090909",
    password: "123456",
  },
];

const ManagerManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");
  const [ManagerToAction, setManagerToAction] = useState<Manager | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Filter Managers by search and status
  const filteredManagers = sampleManagers.filter((Manager) => {
    const matchesName = Manager.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || Manager.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(
      selectedRows.includes(idx)
        ? selectedRows.filter((i) => i !== idx)
        : [...selectedRows, idx]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredManagers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredManagers.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (Manager: Manager) => {
    setSelectedManager(Manager);
    setShowDetailsModal(true);
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
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="Active">Hoạt động</TabsTrigger>
              <TabsTrigger value="Inactive">Ngưng hoạt động</TabsTrigger>
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
            {filteredManagers.map((Manager, idx) => (
              <TableRow key={Manager.id} className="hover:bg-[#f0f7e6]">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                        <AvatarImage
                          src={Manager.avatar}
                          alt={Manager.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                          {getInitials(Manager.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                          Manager.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-semibold text-sm">
                        {Manager.id}
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
                      Manager.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      Manager.status === "Active"
                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          Manager.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      {Manager.status === "Active"
                        ? "Hoạt động"
                        : "Ngưng hoạt động"}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === Manager.id ? null : Manager.id
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

                    {openDropdownId === Manager.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 ">
                        <div className="py-1 ">
                          <button
                            onClick={() => {
                              handleViewDetails(Manager);
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
                        </div>
                        <div className="py-1 ">
                          <button
                            onClick={() => {
                              handleBlockUnblock(
                                Manager,
                                Manager.status === "Active"
                                  ? "block"
                                  : "unblock"
                              );
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              Manager.status === "Active"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {Manager.status === "Active" ? (
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
                                Unblock User
                              </>
                            )}
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

      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          ACTIVE ManagerS:{" "}
          {filteredManagers.filter((l) => l.status === "Active").length}/
          {filteredManagers.length}
        </div>
        <div>
          Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10
          of {filteredManagers.length}
        </div>
      </div>

      {/* Chi tiết người học */}
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
                    setShowPassword(false);
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
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Mã:</span>{" "}
                      {selectedManager.id}
                    </div>
                    <div>
                      <span className="font-medium">Họ tên:</span>{" "}
                      {selectedManager.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedManager.email}
                    </div>
                    <div>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {selectedManager.phoneNumber}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Mật khẩu:</span>{" "}
                      <span>
                        {showPassword
                          ? selectedManager.password
                          : "•".repeat(selectedManager.password.length)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="h-7 px-2 cursor-pointer"
                      >
                        {showPassword ? "Ẩn" : "Hiện"}
                      </Button>
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <Badge
                        className={`ml-2 ${
                          selectedManager.status === "Active"
                            ? "bg-green-600"
                            : "bg-gray-400"
                        }`}
                      >
                        {selectedManager.status === "Active"
                          ? "Hoạt động"
                          : "Ngưng hoạt động"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
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
              <form className="space-y-6">
                {/* Thông tin gói */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin người quản lý
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tên người quản lý *
                      </label>
                      <Input
                        placeholder="VD: Nguyễn Văn A"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        placeholder="VD: nguyenvana@gmail.com"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số điện thoại *
                      </label>
                      <Input
                        type="number"
                        placeholder="VD: 0909090909"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mật khẩu *
                      </label>
                      <Input
                        placeholder="VD: 123456"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Nút thao tác */}
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
                    Tạo người quản lý
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

export default ManagerManagement;
