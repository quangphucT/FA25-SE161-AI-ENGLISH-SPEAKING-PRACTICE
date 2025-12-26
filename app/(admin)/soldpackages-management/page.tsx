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

interface SupportService {
  serviceName: string;
  description: string;
  included: boolean;
}

interface Purchaser {
  id: string;
  fullName: string;
  email: string;
  status: "Active" | "Inactive";
  phoneNumber: string;
}

interface SoldPackages {
  packageId: string;
  packageName: string;
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

const samplePackages: SoldPackages[] = [
  {
    packageId: "PKG001",
    packageName: "Basic English Conversation",
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
        status: "Active",
        phoneNumber: "0901000001",
      },
      {
        id: "L004",
        fullName: "Phạm Thu Dung",
        email: "dung.pham@example.com",
        status: "Active",
        phoneNumber: "0901000004",
      },
      {
        id: "L007",
        fullName: "Vũ Minh Khôi",
        email: "khoi.vu@example.com",
        status: "Inactive",
        phoneNumber: "0901000007",
      },
    ],
  },
  {
    packageId: "PKG002",
    packageName: "IELTS Preparation Premium",
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
    purchasers: [
      {
        id: "L006",
        fullName: "Đỗ Thị Hoa",
        email: "hoa.do@example.com",
        status: "Active",
        phoneNumber: "0902000006",
      },
      {
        id: "L012",
        fullName: "Phạm Thị Mai",
        email: "mai.pham@example.com",
        status: "Active",
        phoneNumber: "0902000012",
      },
      {
        id: "L015",
        fullName: "Hồ Văn Tài",
        email: "tai.ho@example.com",
        status: "Inactive",
        phoneNumber: "0902000015",
      },
    ],
  },
  {
    packageId: "PKG003",
    packageName: "Business English Mastery",
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
    purchasers: [
      {
        id: "L007",
        fullName: "Vũ Minh Khôi",
        email: "khoi.vu@example.com",
        status: "Active",
        phoneNumber: "0903000007",
      },
      {
        id: "L011",
        fullName: "Trịnh Văn Đức",
        email: "duc.trinh@example.com",
        status: "Active",
        phoneNumber: "0903000011",
      },
    ],
  },
  {
    packageId: "PKG004",
    packageName: "TOEFL Complete Course",

    price: 1000000,
    duration: "45 days",
    numberOfReview: 10,
    level: "B2",
    status: "Active",
    purchasedCount: 52,
    createdDate: "2024-04-05",
    updatedDate: "2025-09-12",
    purchasers: [
      {
        id: "L009",
        fullName: "Ngô Văn Minh",
        email: "minh.ngo@example.com",
        status: "Active",
        phoneNumber: "0904000009",
      },
      {
        id: "L002",
        fullName: "Trần Thị Bình",
        email: "binh.tran@example.com",
        status: "Inactive",
        phoneNumber: "0904000002",
      },
    ],
  },
  {
    packageId: "PKG005",
    packageName: "Pronunciation Mastery",

    price: 800000,
    duration: "30 days",
    numberOfReview: 8,
    level: "C1",
    status: "Active",
    purchasedCount: 123,
    createdDate: "2024-05-12",
    updatedDate: "2025-09-10",
    purchasers: [
      {
        id: "L001",
        fullName: "Nguyễn Văn An",
        email: "an.nguyen@example.com",
        status: "Active",
        phoneNumber: "0905000001",
      },
      {
        id: "L010",
        fullName: "Lương Thị Phương",
        email: "phuong.luong@example.com",
        status: "Inactive",
        phoneNumber: "0905000010",
      },
    ],
  },
  {
    packageId: "PKG006",
    packageName: "Self-Study Vocabulary Builder",

    price: 300000,
    duration: "60 days",
    numberOfReview: 0,
    level: "C2",
    status: "Active",
    purchasedCount: 267,
    createdDate: "2024-06-18",
    updatedDate: "2025-09-08",
    purchasers: [
      {
        id: "L008",
        fullName: "Bùi Thị Lan",
        email: "lan.bui@example.com",
        status: "Active",
        phoneNumber: "0906000008",
      },
      {
        id: "L013",
        fullName: "Đinh Văn Hùng",
        email: "hung.dinh@example.com",
        status: "Inactive",
        phoneNumber: "0906000013",
      },
      {
        id: "L005",
        fullName: "Hoàng Văn Em",
        email: "em.hoang@example.com",
        status: "Inactive",
        phoneNumber: "0906000005",
      },
    ],
  },
  {
    packageId: "PKG007",
    packageName: "Cambridge Exam Preparation",

    price: 1500000,
    duration: "75 days",
    numberOfReview: 14,
    level: "C2",
    status: "Active",
    purchasedCount: 34,
    createdDate: "2024-07-22",
    updatedDate: "2025-09-05",
    purchasers: [
      {
        id: "L014",
        fullName: "Võ Thị Thu",
        email: "thu.vo@example.com",
        status: "Active",
        phoneNumber: "0907000014",
      },
    ],
  },
  {
    packageId: "PKG008",
    packageName: "Medical English Specialist",

    price: 2200000,
    duration: "120 days",
    numberOfReview: 20,
    level: "C2",
    status: "Active",
    purchasedCount: 18,
    createdDate: "2024-08-15",
    updatedDate: "2025-09-02",
    purchasers: [
      {
        id: "L004",
        fullName: "Phạm Thu Dung",
        email: "dung.pham@example.com",
        status: "Active",
        phoneNumber: "0908000004",
      },
    ],
  },
  {
    packageId: "PKG009",
    packageName: "Public Speaking Confidence",

    price: 1100000,
    duration: "45 days",
    numberOfReview: 10,
    level: "C2",
    status: "Inactive",
    purchasedCount: 78,
    createdDate: "2024-09-01",
    updatedDate: "2025-08-30",
    purchasers: [
      {
        id: "L003",
        fullName: "Lê Minh Cường",
        email: "cuong.le@example.com",
        status: "Inactive",
        phoneNumber: "0909000003",
      },
      {
        id: "L015",
        fullName: "Hồ Văn Tài",
        email: "tai.ho@example.com",
        status: "Active",
        phoneNumber: "0909000015",
      },
    ],
  },
  {
    packageId: "PKG010",
    packageName: "Creative Writing Workshop",

    price: 900000,
    duration: "60 days",
    numberOfReview: 8,
    level: "C2",
    status: "Active",
    purchasedCount: 42,
    createdDate: "2024-10-12",
    updatedDate: "2025-08-28",
    purchasers: [
      {
        id: "L002",
        fullName: "Trần Thị Bình",
        email: "binh.tran@example.com",
        status: "Active",
        phoneNumber: "0910000002",
      },
    ],
  },
  {
    packageId: "PKG011",
    packageName: "Basic IT English Fundamentals",

    price: 750000,
    duration: "45 days",
    numberOfReview: 6,
    level: "C2",
    status: "Inactive",
    purchasedCount: 25,
    createdDate: "2024-03-20",
    updatedDate: "2025-07-15",
    purchasers: [
      {
        id: "L010",
        fullName: "Lương Thị Phương",
        email: "phuong.luong@example.com",
        status: "Inactive",
        phoneNumber: "0911000010",
      },
    ],
  },
];

const SoldPackagesManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  const [selectedPackage, setSelectedPackage] = useState<SoldPackages | null>(
    null
  );

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter packages
  const filteredPackages = samplePackages.filter((pkg) => {
    const matchesSearch =
      pkg.packageName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.packageId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || pkg.status === statusFilter;

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
    if (selectedRows.length === filteredPackages.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPackages.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (pkg: SoldPackages) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
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
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>
                <Checkbox
                  checked={
                    selectedRows.length === filteredPackages.length &&
                    filteredPackages.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Package ID</TableHead>
              <TableHead>Package Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Purchased Count</TableHead>
              <TableHead>Duration</TableHead>   
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
            
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg, idx) => (
              <TableRow key={pkg.packageId} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {pkg.packageId}
                </TableCell>
                <TableCell className="font-medium">{pkg.packageName}</TableCell>
                <TableCell>
                  <div className="font-semibold">{formatPrice(pkg.price)}</div>
                </TableCell>
                <TableCell>{pkg.purchasedCount}</TableCell>
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
                    {pkg.status}
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
                            View Details
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
        Số dòng trên mỗi trang:  <span className="font-semibold">10</span> &nbsp; 1-10
        trong số {filteredPackages.length}
        </div>
      </div>

      {/* Package Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Package Details
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
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Package ID:</span>{" "}
                      {selectedPackage.packageId}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedPackage.packageName}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={`ml-2 ${
                          selectedPackage.status === "Active"
                            ? "bg-green-600"
                            : "bg-red-400"
                        }`}
                      >
                        {selectedPackage.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Package Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {selectedPackage.duration}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span>{" "}
                      {selectedPackage.level}
                    </div>
                    <div>
                      <span className="font-medium">Number of Review:</span>{" "}
                      {selectedPackage.numberOfReview}
                    </div>
                    <div>
                      <span className="font-medium">Purchased Count:</span>
                      <span className="ml-2 font-bold text-blue-600">
                        {selectedPackage.purchasedCount} learners
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {selectedPackage.createdDate}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{" "}
                      {selectedPackage.updatedDate}
                    </div>
                  </div>
                </div>
              </div>
              {/* Learners who have bought this package */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Những người học đã mua gói này
                </h3>
                {selectedPackage.purchasers &&
                selectedPackage.purchasers.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f7f9fa]">
                          <TableHead>Learner ID</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Phone Number</TableHead>
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
                                {learner.status}
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
    </div>
  );
};

export default SoldPackagesManagement;
