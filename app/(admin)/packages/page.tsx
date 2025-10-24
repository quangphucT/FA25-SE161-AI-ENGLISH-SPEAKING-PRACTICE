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

// Type definitions
interface Purchaser {
  id: string;
  fullName: string;
  email: string;
  purchaseDate: string;
  status: "Active" | "Completed" | "Expired";
  phoneNumber: string;
}

interface SupportService {
  serviceName: string;
  description: string;
  included: boolean;
}

interface ServicePackage {
  packageId: string;
  packageName: string;
  description: string;
  price: number;
  duration: string;
  numberOfReview: number;
  status: "Active" | "Inactive";
  purchasedCount: number;
  createdDate: string;
  updatedDate: string;
  supportPackages?: SupportService[];
  level: string;
  purchasers?: Purchaser[];
}

const samplePackages: ServicePackage[] = [
  {
    packageId: "PKG001",
    packageName: "Basic English Conversation",
    description:
      "Foundation course for English speaking skills with daily conversation practice",
    price: 500000,
    duration: "30 days",
    level: "A1",
    numberOfReview: 8,
    status: "Active",
    purchasedCount: 145,
    createdDate: "2024-01-15",
    updatedDate: "2025-09-20",
    supportPackages: [
      {
        serviceName: "Daily Pronunciation Practice",
        description:
          "20-minute daily pronunciation exercises with voice recognition",
        included: true,
      },
      {
        serviceName: "Vocabulary Flashcards",
        description: "Interactive digital flashcards with 500+ common words",
        included: true,
      },
      {
        serviceName: "Progress Tracking",
        description: "Weekly progress reports and skill assessment",
        included: true,
      },
    ],
    purchasers: [
      {
        id: "L001",
        fullName: "Nguyễn Văn An",
        email: "an.nguyen@example.com",
        purchaseDate: "2025-08-15",
        status: "Active",
        phoneNumber: "0901000001",
      },
      {
        id: "L004",
        fullName: "Phạm Thu Dung",
        email: "dung.pham@example.com",
        purchaseDate: "2025-08-15",
        status: "Active",
        phoneNumber: "0901000004",
      },
      {
        id: "L007",
        fullName: "Vũ Minh Khôi",
        email: "khoi.vu@example.com",
        purchaseDate: "2025-08-15",
        status: "Completed",
        phoneNumber: "0901000007",
      },
    ],
  },
  {
    packageId: "PKG002",
    packageName: "IELTS Preparation Premium",
    description:
      "Comprehensive IELTS preparation with expert mentors and practice tests",
    price: 1200000,
    duration: "60 days",
    numberOfReview: 12,
    level: "A2",
    status: "Active",
    purchasedCount: 89,
    createdDate: "2024-02-20",
    updatedDate: "2025-09-18",
    supportPackages: [
      {
        serviceName: "IELTS Mock Tests",
        description: "Unlimited access to full-length IELTS practice tests",
        included: true,
      },
      {
        serviceName: "Speaking Practice Sessions",
        description: "AI-powered speaking practice with instant feedback",
        included: true,
      },
      {
        serviceName: "Writing Task Reviews",
        description: "Expert review of writing tasks with detailed feedback",
        included: true,
      },
      {
        serviceName: "Vocabulary Builder",
        description:
          "IELTS-specific vocabulary learning with example sentences",
        included: true,
      },
    ],
  },
  {
    packageId: "PKG003",
    packageName: "Business English Mastery",
    description:
      "Professional English for business communication, presentations and meetings",
    price: 1800000,
    duration: "90 days",
    numberOfReview: 16,
    level: "B1",
    status: "Active",
    purchasedCount: 67,
    createdDate: "2024-03-10",
    updatedDate: "2025-09-15",
    supportPackages: [
      {
        serviceName: "Business Email Templates",
        description:
          "Professional email templates for various business situations",
        included: true,
      },
      {
        serviceName: "Presentation Skills Workshop",
        description:
          "Video tutorials on effective business presentation techniques",
        included: true,
      },
      {
        serviceName: "Industry Vocabulary",
        description: "Specialized vocabulary for different business sectors",
        included: true,
      },
    ],
  },
  {
    packageId: "PKG004",
    packageName: "TOEFL Complete Course",
    description:
      "Full TOEFL preparation with academic English focus and test strategies",
    price: 1000000,
    duration: "45 days",
    numberOfReview: 10,
    level: "B2",
    status: "Active",
    purchasedCount: 52,
    createdDate: "2024-04-05",
    updatedDate: "2025-09-12",
  },
  {
    packageId: "PKG005",
    packageName: "Pronunciation Mastery",
    description:
      "Advanced pronunciation training with phonetics and accent reduction",
    price: 800000,
    duration: "30 days",
    numberOfReview: 8,
    level: "C1",
    status: "Active",
    purchasedCount: 123,
    createdDate: "2024-05-12",
    updatedDate: "2025-09-10",
  },
  {
    packageId: "PKG006",
    packageName: "Self-Study Vocabulary Builder",
    description:
      "Independent vocabulary learning with interactive exercises and quizzes",
    price: 300000,
    duration: "60 days",
    numberOfReview: 0,
    level: "C2",
    status: "Active",
    purchasedCount: 267,
    createdDate: "2024-06-18",
    updatedDate: "2025-09-08",
  },
  {
    packageId: "PKG007",
    packageName: "Cambridge Exam Preparation",
    description: "FCE, CAE, CPE exam preparation with certified trainers",
    price: 1500000,
    duration: "75 days",
    numberOfReview: 14,
    level: "C2",
    status: "Active",
    purchasedCount: 34,
    createdDate: "2024-07-22",
    updatedDate: "2025-09-05",
  },
  {
    packageId: "PKG008",
    packageName: "Medical English Specialist",
    description: "English for healthcare professionals and medical terminology",
    price: 2200000,
    duration: "120 days",
    numberOfReview: 20,
    level: "C2",
    status: "Active",
    purchasedCount: 18,
    createdDate: "2024-08-15",
    updatedDate: "2025-09-02",
  },
  {
    packageId: "PKG009",
    packageName: "Public Speaking Confidence",
    description: "Overcome speaking anxiety and master presentation skills",
    price: 1100000,
    duration: "45 days",
    numberOfReview: 10,
    level: "C2",
    status: "Inactive",
    purchasedCount: 78,
    createdDate: "2024-09-01",
    updatedDate: "2025-08-30",
  },
  {
    packageId: "PKG010",
    packageName: "Creative Writing Workshop",
    description: "Develop creative writing skills with storytelling techniques",
    price: 900000,
    duration: "60 days",
    numberOfReview: 8,
    level: "C2",
    status: "Active",
    purchasedCount: 42,
    createdDate: "2024-10-12",
    updatedDate: "2025-08-28",
  },
  {
    packageId: "PKG011",
    packageName: "Basic IT English Fundamentals",
    description:
      "Discontinued course covering basic IT terminology and technical communication",
    price: 750000,
    duration: "45 days",
    numberOfReview: 6,
    level: "C2",
    status: "Inactive",
    purchasedCount: 25,
    createdDate: "2024-03-20",
    updatedDate: "2025-07-15",
  },
];

const ServicePackageManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(
    null
  );
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
  const filteredPackages = samplePackages.filter((pkg) => {
    const matchesSearch =
      pkg.packageName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.packageId.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || pkg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });





  const handleViewDetails = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  const handleUpdate = (pkg: ServicePackage) => {
    setPackageToUpdate(pkg);
    setShowUpdateModal(true);
  };

  const handleAction = (pkg: ServicePackage, action: "delete") => {
    setPackageToAction(pkg);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    console.log(`${actionType}ing package:`, packageToAction);
    setShowConfirmDialog(false);
    setPackageToAction(null);
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
              <TableHead>Thời hạn</TableHead>
              <TableHead>Cấp độ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg, idx) => (
              <TableRow key={pkg.packageId} className="hover:bg-[#f0f7e6]">
                
                <TableCell className="font-medium text-blue-600">
                  {pkg.packageId}
                </TableCell>
                <TableCell className="font-medium">{pkg.packageName}</TableCell>
                <TableCell
                  className="text-gray-600 max-w-[200px] truncate"
                  title={pkg.description}
                >
                  {pkg.description}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{formatPrice(pkg.price)}</div>
                </TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>{pkg.level}</TableCell>
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
                          openDropdownId === pkg.packageId
                            ? null
                            : pkg.packageId
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

                    {openDropdownId === pkg.packageId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleViewDetails(pkg);
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          ACTIVE PACKAGES:{" "}
          {filteredPackages.filter((p) => p.status === "Active").length}/
          {filteredPackages.length} | TOTAL PURCHASES:{" "}
          {filteredPackages.reduce((sum, p) => sum + p.purchasedCount, 0)}
        </div>
        <div>
          Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10
          of {filteredPackages.length}
        </div>
      </div>

      {/* Package Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4 ">
            <div className="p-6 border-b sticky top-0 z-10 bg-white">
              <div className="flex items-center justify-between ">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thông tin gói dịch vụ
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
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Mã gói:</span>{" "}
                      {selectedPackage.packageId}
                    </div>
                    <div>
                      <span className="font-medium">Tên:</span>{" "}
                      {selectedPackage.packageName}
                    </div>
                    <div>
                      <span className="font-medium">Mô tả:</span>{" "}
                      {selectedPackage.description}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <Badge
                        className={`ml-2 ${
                          selectedPackage.status === "Active"
                            ? "bg-green-600"
                            : "bg-red-400"
                        }`}
                      >
                        {selectedPackage.status === "Active"
                          ? "Hoạt động"
                          : "Ngưng hoạt động"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Chi tiết gói</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Thời hạn:</span>{" "}
                      {selectedPackage.duration}
                    </div>
                    <div>
                      <span className="font-medium">Cấp độ:</span>{" "}
                      {selectedPackage.level}
                    </div>
                    <div>
                      <span className="font-medium">Số buổi review:</span>{" "}
                      {selectedPackage.numberOfReview}
                    </div>
                    <div>
                      <span className="font-medium">Số lượt mua:</span>
                      <span className="ml-2 font-bold text-blue-600">
                        {selectedPackage.purchasedCount} người học
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Ngày tạo:</span>{" "}
                      {selectedPackage.createdDate}
                    </div>
                    <div>
                      <span className="font-medium">Cập nhật:</span>{" "}
                      {selectedPackage.updatedDate}
                    </div>
                  </div>
                </div>
              </div>
              {/* Package Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  ⚙️ Tính năng trong gói dịch vụ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Practice Sessions */}
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🤖</span>
                      <h4 className="font-semibold text-blue-700">
                        Phiên luyện AI
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Luyện hội thoại AI không giới hạn với phản hồi tức thì
                    </p>
                  </div>

                  {/* Mentor Sessions */}
                  {selectedPackage.numberOfReview > 0 && (
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">👨‍🏫</span>
                        <h4 className="font-semibold text-green-700">
                          Số lượt đánh giá
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedPackage.numberOfReview} lượt đánh giá bởi
                        người đánh giá
                      </p>
                    </div>
                  )}

                  {/* Speaking Assessment */}
                  <div className="p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🎯</span>
                      <h4 className="font-semibold text-orange-700">
                        Đánh giá kỹ năng nói
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Đánh giá khả năng nói và phát âm tự động
                    </p>
                  </div>

                  {/* Interactive Lessons */}
                  <div className="p-4 border rounded-lg bg-teal-50">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📚</span>
                      <h4 className="font-semibold text-teal-700">
                        Bài học tương tác
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tương tác với đa dạng chủ đề hội thoại
                    </p>
                  </div>
                </div>
              </div>
              {/* Learners who have bought this package */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Danh sách người học đã mua gói 
                </h3>
                {selectedPackage.purchasers &&
                selectedPackage.purchasers.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f7f9fa]">
                          <TableHead>Mã người học</TableHead>
                          <TableHead>Họ tên</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Số điện thoại</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPackage.purchasers.map((learner) => (
                          <TableRow
                            key={learner.id}
                            className="hover:bg-[#f0f7e6]"
                          >
                            <TableCell className="font-medium text-blue-600">
                              {learner.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {learner.fullName}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {learner.email}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  learner.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  learner.status === "Active"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-400 text-white"
                                }
                              >
                                {learner.status === "Active"
                                  ? "Hoạt động"
                                  : learner.status === "Completed"
                                  ? "Hoàn thành"
                                  : "Hết hạn"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {learner.phoneNumber}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    Chưa có người học nào mua gói này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && packageToAction && (
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
              <form className="space-y-6">
                {/* Thông tin gói */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thông tin gói</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tên gói *
                      </label>
                      <Input
                        placeholder="VD: Khóa Tiếng Anh Nâng Cao"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mô tả *
                      </label>
                      <textarea
                        placeholder="Mô tả nội dung và mục tiêu của gói..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Giá & thời hạn */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Giá & thời hạn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Giá (VND) *
                      </label>
                      <Input
                        type="number"
                        placeholder="VD: 1000000"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Thời hạn *
                      </label>
                      <Input
                        placeholder="VD: 30 days"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Cấu hình review */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Cấu hình review
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số buổi review
                      </label>
                      <Input
                        type="number"
                        placeholder="VD: 8"
                        className="w-full"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Để trống hoặc 0 nếu không có buổi review
                      </p>
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
                    Tạo gói
                  </Button>
                </div>
              </form>
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
      )}
    </div>
  );
};

export default ServicePackageManagement;
