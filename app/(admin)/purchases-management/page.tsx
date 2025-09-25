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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";

// Type definitions
interface Learner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface ServicePackage {
  packageId: string;
  packageName: string;
  price: number;
}

interface PaymentHistory {
  transactionId: string;
  amount: number;
  method: "PayOS QR";
  status: "Success" | "Pending" | "Failed" | "Refunded";
  date: string;
}

interface SupportService {
  serviceName: string;
  description: string;
  included: boolean;
}

interface Purchase {
  purchaseId: string;
  learner: Learner;
  servicePackage: ServicePackage;
  finalPrice: number;
  paymentMethod: "PayOS QR";
  purchaseDate: string;
  expiryDate: string;
  status: "Success" | "Failed" | "Pending" | "Refunded";
  paymentHistory: PaymentHistory[];
  supportServices: SupportService[];
  notes?: string;
}

const samplePurchases: Purchase[] = [
  {
    purchaseId: "PUR001",
    learner: {
      id: "L001",
      fullName: "Nguyễn Văn An",
      email: "an@gmail.com",
      phone: "0901234567",
    },
    servicePackage: {
      packageId: "PKG001",
      packageName: "Basic English Conversation",
      price: 500000,
    },
    finalPrice: 500000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-15",
    expiryDate: "2025-09-14",
    status: "Success",
    paymentHistory: [
      {
        transactionId: "TXN001",
        amount: 500000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-15",
      },
    ],
    supportServices: [
      {
        serviceName: "Daily Pronunciation Practice",
        description: "20-minute daily pronunciation exercises",
        included: true,
      },
      {
        serviceName: "Vocabulary Flashcards",
        description: "Interactive digital flashcards with 500+ words",
        included: true,
      },
    ],
  },
  {
    purchaseId: "PUR002",
    learner: {
      id: "L002",
      fullName: "Trần Thị Bình",
      email: "binh@email.com",
      phone: "0912345678",
    },
    servicePackage: {
      packageId: "PKG002",
      packageName: "IELTS Preparation Premium",
      price: 1200000,
    },
    finalPrice: 1200000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-20",
    expiryDate: "2025-10-19",
    status: "Success",
    paymentHistory: [
      {
        transactionId: "TXN002",
        amount: 1200000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-20",
      },
    ],
    supportServices: [
      {
        serviceName: "IELTS Mock Tests",
        description: "Unlimited access to full-length IELTS practice tests",
        included: true,
      },
      {
        serviceName: "Speaking Practice Sessions",
        description: "AI-powered speaking practice",
        included: true,
      },
      {
        serviceName: "Writing Task Reviews",
        description: "Expert review of writing tasks",
        included: true,
      },
    ],
  },
  {
    purchaseId: "PUR003",
    learner: {
      id: "L004",
      fullName: "Phạm Thu Dung",
      email: "dung@hotmail.com",
      phone: "0923456789",
    },
    servicePackage: {
      packageId: "PKG003",
      packageName: "Business English Mastery",
      price: 1800000,
    },
    finalPrice: 1800000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-07-25",
    expiryDate: "2025-10-23",
    status: "Success",
    paymentHistory: [
      {
        transactionId: "TXN003",
        amount: 1800000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-07-25",
      },
    ],
    supportServices: [
      {
        serviceName: "Business Email Templates",
        description: "Professional email templates",
        included: true,
      },
      {
        serviceName: "Presentation Skills Workshop",
        description: "Video tutorials on presentations",
        included: true,
      },
    ],
  },
  {
    purchaseId: "PUR004",
    learner: {
      id: "L007",
      fullName: "Vũ Minh Khôi",
      email: "khoi@yahoo.com",
      phone: "0934567890",
    },
    servicePackage: {
      packageId: "PKG005",
      packageName: "Pronunciation Mastery",
      price: 800000,
    },
    finalPrice: 800000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-15",
    expiryDate: "2025-09-14",
    status: "Failed",
    paymentHistory: [
      {
        transactionId: "TXN004",
        amount: 800000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-15",
      },
    ],
    supportServices: [
      {
        serviceName: "Phonetics Training",
        description: "Advanced phonetics and accent training",
        included: true,
      },
    ],
  },
  {
    purchaseId: "PUR005",
    learner: {
      id: "L010",
      fullName: "Lương Thị Phương",
      email: "phuong@hotmail.com",
      phone: "0945678901",
    },
    servicePackage: {
      packageId: "PKG006",
      packageName: "Self-Study Vocabulary Builder",
      price: 300000,
    },
    finalPrice: 300000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-10",
    expiryDate: "2025-10-09",
    status: "Failed",
    paymentHistory: [
      {
        transactionId: "TXN005",
        amount: 300000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-10",
      },
    ],
    supportServices: [
      {
        serviceName: "Interactive Quizzes",
        description: "Gamified vocabulary learning",
        included: true,
      },
    ],
  },
  {
    purchaseId: "PUR006",
    learner: {
      id: "L012",
      fullName: "Phạm Thị Mai",
      email: "mai@yahoo.com",
      phone: "0956789012",
    },
    servicePackage: {
      packageId: "PKG007",
      packageName: "Cambridge Exam Preparation",
      price: 1500000,
    },
    finalPrice: 1500000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-25",
    expiryDate: "2025-11-08",
    status: "Success",
    paymentHistory: [
      {
        transactionId: "TXN006",
        amount: 1500000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-25",
      },
    ],
    supportServices: [
      {
        serviceName: "Cambridge Mock Tests",
        description: "Official Cambridge practice tests",
        included: true,
      },
    ],
  },
  {
    purchaseId: "PUR007",
    learner: {
      id: "L015",
      fullName: "Hoàng Văn Tùng",
      email: "tung@gmail.com",
      phone: "0967890123",
    },
    servicePackage: {
      packageId: "PKG004",
      packageName: "TOEFL Complete Course",
      price: 1000000,
    },
    finalPrice: 1000000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-09-15",
    expiryDate: "2025-10-30",
    status: "Pending",
    paymentHistory: [
      {
        transactionId: "TXN007",
        amount: 1000000,
        method: "PayOS QR",
        status: "Pending",
        date: "2025-09-15",
      },
    ],
    supportServices: [
      {
        serviceName: "TOEFL Mock Tests",
        description: "Full-length TOEFL practice tests",
        included: true,
      },
    ],
  },
  {
    purchaseId: "PUR008",
    learner: {
      id: "L016",
      fullName: "Đặng Thị Hạnh",
      email: "hanh@outlook.com",
      phone: "0978901234",
    },
    servicePackage: {
      packageId: "PKG008",
      packageName: "Medical English Specialist",
      price: 2200000,
    },
    finalPrice: 2200000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-09-01",
    expiryDate: "2025-12-30",
    status: "Refunded",
    paymentHistory: [
      {
        transactionId: "TXN008",
        amount: 2200000,
        method: "PayOS QR",
        status: "Refunded",
        date: "2025-09-01",
      },
    ],
    supportServices: [
      {
        serviceName: "Medical Terminology Library",
        description: "Comprehensive medical terms database",
        included: true,
      },
    ],
    notes: "Payment failed - bank declined transaction",
  },
];

const PurchasesManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);

  // Filter purchases
  const filteredPurchases = samplePurchases.filter((purchase) => {
    const matchesSearch = purchase.learner.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || purchase.status === statusFilter;

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
    if (selectedRows.length === filteredPurchases.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPurchases.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailsModal(true);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const exportToPDF = () => {
    // Tạo nội dung HTML cho PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .status-success { color: #16a34a; }
          .status-failed { color: #dc2626; }
          .status-pending { color: #ca8a04; }
          .status-refunded { color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>Purchase Management Report</h1>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString(
          "vi-VN"
        )} ${new Date().toLocaleTimeString("vi-VN")}</p>
        <p><strong>Total Records:</strong> ${filteredPurchases.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Purchase ID</th>
              <th>Learner</th>
              <th>Package</th>
              <th>Price</th>
              <th>Payment</th>
              <th>Purchase Date</th>
             
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPurchases
              .map(
                (purchase) => `
              <tr>
                <td>${purchase.purchaseId}</td>
                <td>
                  ${purchase.learner.fullName}<br>
                  <small>${purchase.learner.email}</small>
                </td>
                <td>${purchase.servicePackage.packageName}</td>
                <td>${formatPrice(purchase.finalPrice)}</td>
                <td>${purchase.paymentMethod}</td>
                <td>${formatDate(purchase.purchaseDate)}</td>
                <td>${formatDate(purchase.expiryDate)}</td>
                <td class="status-${purchase.status.toLowerCase()}">${
                  purchase.status
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Tạo và mở cửa sổ mới để in PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setOpenDropdownId(null);
      setShowExportDropdown(false);
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
            placeholder="Search by learner name..."
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
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
        <div className="dropdown-container relative">
          <Button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer"
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Report
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="inline ml-2"
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </Button>
          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    exportToPDF();
                    setShowExportDropdown(false);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="inline mr-2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                  Export as PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {samplePurchases.filter((p) => p.status === "Success").length}
            </div>
            <p className="text-xs text-muted-foreground">Success Purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {samplePurchases.filter((p) => p.status === "Failed").length}
            </div>
            <p className="text-xs text-muted-foreground">Failed Purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {samplePurchases.filter((p) => p.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Pending Purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatPrice(
                samplePurchases
                  .filter((p) => p.status === "Success")
                  .reduce((sum, p) => sum + p.finalPrice, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total Success Revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchases Management</CardTitle>
          <CardDescription>
            Showing {filteredPurchases.length} of {samplePurchases.length}{" "}
            purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedRows.length === filteredPurchases.length &&
                      filteredPurchases.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Purchase ID</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead>Service Package</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Payment Method</TableHead>
               
              
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase, idx) => (
                <TableRow key={purchase.purchaseId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(idx)}
                      onCheckedChange={() => handleSelectRow(idx)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {purchase.purchaseId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {purchase.learner.fullName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {purchase.learner.email}
                      </span>
                      <span className="text-sm text-gray-400">
                        {purchase.learner.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {purchase.servicePackage.packageName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {formatPrice(purchase.finalPrice)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {purchase.paymentMethod}
                    </Badge>
                  </TableCell>
               
                
                  <TableCell>
                    <Badge
                      variant={
                        purchase.status === "Success"
                          ? "default"
                          : purchase.status === "Failed"
                          ? "destructive"
                          : purchase.status === "Pending"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="dropdown-container relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(
                            openDropdownId === purchase.purchaseId
                              ? null
                              : purchase.purchaseId
                          );
                        }}
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </Button>
                      {openDropdownId === purchase.purchaseId && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => {
                                handleViewDetails(purchase);
                                setOpenDropdownId(null);
                              }}
                            >
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                className="inline mr-2"
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
        </CardContent>
      </Card>

      {/* Purchase Details Modal */}
      {showDetailsModal && selectedPurchase && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Purchase Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Purchase Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Purchase Information</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Purchase ID:</strong>{" "}
                      {selectedPurchase.purchaseId}
                    </div>
                    <div>
                      <strong>Purchase Date:</strong>{" "}
                      {formatDate(selectedPurchase.purchaseDate)}
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <Badge
                        variant={
                          selectedPurchase.status === "Success"
                            ? "default"
                            : selectedPurchase.status === "Failed"
                            ? "destructive"
                            : selectedPurchase.status === "Pending"
                            ? "secondary"
                            : "outline"
                        }
                        className="ml-2"
                      >
                        {selectedPurchase.status}
                      </Badge>
                    </div>
                    {selectedPurchase.notes && (
                      <div>
                        <strong>Notes:</strong> {selectedPurchase.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Learner Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Learner Information</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Name:</strong> {selectedPurchase.learner.fullName}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedPurchase.learner.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedPurchase.learner.phone}
                    </div>
                    <div>
                      <strong>Learner ID:</strong> {selectedPurchase.learner.id}
                    </div>
                  </div>
                </div>

                {/* Package Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Service Package</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Package Name:</strong>{" "}
                      {selectedPurchase.servicePackage.packageName}
                    </div>
                    <div>
                      <strong>Package Price:</strong>{" "}
                      {formatPrice(selectedPurchase.servicePackage.price)}
                    </div>
                    <div>
                      <strong>Final Price:</strong>{" "}
                      <span className="text-lg font-semibold text-green-600">
                        {formatPrice(selectedPurchase.finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Payment Method:</strong>{" "}
                      <Badge variant="secondary">
                        {selectedPurchase.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesManagement;
