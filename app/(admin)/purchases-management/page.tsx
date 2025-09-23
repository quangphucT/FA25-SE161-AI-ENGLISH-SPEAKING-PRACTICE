"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  originalPrice: number;
  discountedPrice?: number;
}

interface PaymentHistory {
  transactionId: string;
  amount: number;
  method: 'PayOS QR';
  status: 'Success' | 'Failed' | 'Pending';
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
  paymentMethod: 'PayOS QR';
  purchaseDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Cancelled';
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
      phone: "0901234567"
    },
    servicePackage: {
      packageId: "PKG001",
      packageName: "Basic English Conversation",
      originalPrice: 600000,
      discountedPrice: 500000
    },
    finalPrice: 500000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-15",
    expiryDate: "2025-09-14",
    status: "Active",
    paymentHistory: [
      {
        transactionId: "TXN001",
        amount: 500000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-15"
      }
    ],
    supportServices: [
      { serviceName: "Daily Pronunciation Practice", description: "20-minute daily pronunciation exercises", included: true },
      { serviceName: "Vocabulary Flashcards", description: "Interactive digital flashcards with 500+ words", included: true }
    ]
  },
  {
    purchaseId: "PUR002",
    learner: {
      id: "L002",
      fullName: "Trần Thị Bình",
      email: "binh@email.com",
      phone: "0912345678"
    },
    servicePackage: {
      packageId: "PKG002",
      packageName: "IELTS Preparation Premium",
      originalPrice: 1500000,
      discountedPrice: 1200000
    },
    finalPrice: 1200000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-20",
    expiryDate: "2025-10-19",
    status: "Active",
    paymentHistory: [
      {
        transactionId: "TXN002",
        amount: 1200000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-20"
      }
    ],
    supportServices: [
      { serviceName: "IELTS Mock Tests", description: "Unlimited access to full-length IELTS practice tests", included: true },
      { serviceName: "Speaking Practice Sessions", description: "AI-powered speaking practice", included: true },
      { serviceName: "Writing Task Reviews", description: "Expert review of writing tasks", included: true }
    ]
  },
  {
    purchaseId: "PUR003",
    learner: {
      id: "L004",
      fullName: "Phạm Thu Dung",
      email: "dung@hotmail.com",
      phone: "0923456789"
    },
    servicePackage: {
      packageId: "PKG003",
      packageName: "Business English Mastery",
      originalPrice: 2000000,
      discountedPrice: 1800000
    },
    finalPrice: 1800000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-07-25",
    expiryDate: "2025-10-23",
    status: "Active",
    paymentHistory: [
      {
        transactionId: "TXN003",
        amount: 1800000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-07-25"
      }
    ],
    supportServices: [
      { serviceName: "Business Email Templates", description: "Professional email templates", included: true },
      { serviceName: "Presentation Skills Workshop", description: "Video tutorials on presentations", included: true }
    ]
  },
  {
    purchaseId: "PUR004",
    learner: {
      id: "L007",
      fullName: "Vũ Minh Khôi",
      email: "khoi@yahoo.com",
      phone: "0934567890"
    },
    servicePackage: {
      packageId: "PKG005",
      packageName: "Pronunciation Mastery",
      originalPrice: 900000,
      discountedPrice: 800000
    },
    finalPrice: 800000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-15",
    expiryDate: "2025-09-14",
    status: "Expired",
    paymentHistory: [
      {
        transactionId: "TXN004",
        amount: 800000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-15"
      }
    ],
    supportServices: [
      { serviceName: "Phonetics Training", description: "Advanced phonetics and accent training", included: true }
    ]
  },
  {
    purchaseId: "PUR005",
    learner: {
      id: "L010",
      fullName: "Lương Thị Phương",
      email: "phuong@hotmail.com",
      phone: "0945678901"
    },
    servicePackage: {
      packageId: "PKG006",
      packageName: "Self-Study Vocabulary Builder",
      originalPrice: 350000,
      discountedPrice: 300000
    },
    finalPrice: 300000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-10",
    expiryDate: "2025-10-09",
    status: "Expired",
    paymentHistory: [
      {
        transactionId: "TXN005",
        amount: 300000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-10"
      }
    ],
    supportServices: [
      { serviceName: "Interactive Quizzes", description: "Gamified vocabulary learning", included: true }
    ]
  },
  {
    purchaseId: "PUR006",
    learner: {
      id: "L012",
      fullName: "Phạm Thị Mai",
      email: "mai@yahoo.com",
      phone: "0956789012"
    },
    servicePackage: {
      packageId: "PKG007",
      packageName: "Cambridge Exam Preparation",
      originalPrice: 1700000,
      discountedPrice: 1500000
    },
    finalPrice: 1500000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-08-25",
    expiryDate: "2025-11-08",
    status: "Active",
    paymentHistory: [
      {
        transactionId: "TXN006",
        amount: 1500000,
        method: "PayOS QR",
        status: "Success",
        date: "2025-08-25"
      }
    ],
    supportServices: [
      { serviceName: "Cambridge Mock Tests", description: "Official Cambridge practice tests", included: true }
    ]
  },
  {
    purchaseId: "PUR007",
    learner: {
      id: "L015",
      fullName: "Hoàng Văn Tùng",
      email: "tung@gmail.com",
      phone: "0967890123"
    },
    servicePackage: {
      packageId: "PKG004",
      packageName: "TOEFL Complete Course",
      originalPrice: 1000000
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
        date: "2025-09-15"
      }
    ],
    supportServices: [
      { serviceName: "TOEFL Mock Tests", description: "Full-length TOEFL practice tests", included: true }
    ]
  },
  {
    purchaseId: "PUR008",
    learner: {
      id: "L016",
      fullName: "Đặng Thị Hạnh",
      email: "hanh@outlook.com",
      phone: "0978901234"
    },
    servicePackage: {
      packageId: "PKG008",
      packageName: "Medical English Specialist",
      originalPrice: 2500000,
      discountedPrice: 2200000
    },
    finalPrice: 2200000,
    paymentMethod: "PayOS QR",
    purchaseDate: "2025-09-01",
    expiryDate: "2025-12-30",
    status: "Cancelled",
    paymentHistory: [
      {
        transactionId: "TXN008",
        amount: 2200000,
        method: "PayOS QR",
        status: "Failed",
        date: "2025-09-01"
      }
    ],
    supportServices: [
      { serviceName: "Medical Terminology Library", description: "Comprehensive medical terms database", included: true }
    ],
    notes: "Payment failed - bank declined transaction"
  }
];

const PurchasesManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'cancel'>('cancel');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);

  // Filter purchases
  const filteredPurchases = samplePurchases.filter(purchase => {
    const matchesSearch = purchase.learner.fullName.toLowerCase().includes(search.toLowerCase()) ||
                         purchase.learner.email.toLowerCase().includes(search.toLowerCase()) ||
                         purchase.servicePackage.packageName.toLowerCase().includes(search.toLowerCase()) ||
                         purchase.purchaseId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || purchase.status === statusFilter;
    const matchesPayment = paymentMethodFilter === "All" || purchase.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
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

  const handleAction = (purchase: Purchase, action: 'cancel') => {
    setSelectedPurchase(purchase);
    setActionType(action);
    setShowActionModal(true);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const exportToCSV = () => {
    const headers = ['Purchase ID', 'Learner Name', 'Email', 'Package', 'Price', 'Payment Method', 'Purchase Date', 'Expiry Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredPurchases.map(purchase => [
        purchase.purchaseId,
        purchase.learner.fullName,
        purchase.learner.email,
        purchase.servicePackage.packageName,
        purchase.finalPrice,
        purchase.paymentMethod,
        purchase.purchaseDate,
        purchase.expiryDate,
        purchase.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchases-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Tạo dữ liệu cho Excel
    const excelData = [
      ['Purchase Report - Generated on ' + new Date().toLocaleDateString('vi-VN')],
      [],
      ['Purchase ID', 'Learner Name', 'Email', 'Phone', 'Package', 'Price', 'Payment Method', 'Purchase Date', 'Expiry Date', 'Status', 'Notes'],
      ...filteredPurchases.map(purchase => [
        purchase.purchaseId,
        purchase.learner.fullName,
        purchase.learner.email,
        purchase.learner.phone,
        purchase.servicePackage.packageName,
        purchase.finalPrice.toLocaleString('vi-VN') + ' VND',
        purchase.paymentMethod,
        formatDate(purchase.purchaseDate),
        formatDate(purchase.expiryDate),
        purchase.status,
        purchase.notes || ''
      ])
    ];

    // Tạo workbook và worksheet
    const worksheet = excelData.map(row => row.join('\t')).join('\n');
    const blob = new Blob([worksheet], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchases-report.xls';
    a.click();
    URL.revokeObjectURL(url);
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
          .status-active { color: #16a34a; }
          .status-expired { color: #dc2626; }
          .status-pending { color: #ca8a04; }
          .status-cancelled { color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>Purchase Management Report</h1>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</p>
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
              <th>Expiry Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPurchases.map(purchase => `
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
                <td class="status-${purchase.status.toLowerCase()}">${purchase.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Tạo và mở cửa sổ mới để in PDF
    const printWindow = window.open('', '_blank');
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
    if (!target.closest('.dropdown-container')) {
      setOpenDropdownId(null);
      setShowExportDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </Button>
          <Input
            placeholder="Search by learner, package, or purchase ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[350px]"
          />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select 
            value={paymentMethodFilter}
            onChange={e => setPaymentMethodFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">All Payment Methods</option>
            <option value="PayOS QR">PayOS QR</option>
          </select>
        </div>
        <div className="dropdown-container relative">
          <Button 
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Report
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline ml-2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </Button>
          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    exportToCSV();
                    setShowExportDropdown(false);
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Export as CSV
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    exportToExcel();
                    setShowExportDropdown(false);
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  Export as Excel
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    exportToPDF();
                    setShowExportDropdown(false);
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
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
            <div className="text-2xl font-bold">{samplePurchases.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Active Purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{samplePurchases.filter(p => p.status === 'Expired').length}</div>
            <p className="text-xs text-muted-foreground">Expired Purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{samplePurchases.filter(p => p.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">Pending Purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatPrice(samplePurchases.filter(p => p.status === 'Active').reduce((sum, p) => sum + p.finalPrice, 0))}</div>
            <p className="text-xs text-muted-foreground">Total Active Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchases Management</CardTitle>
          <CardDescription>
            Showing {filteredPurchases.length} of {samplePurchases.length} purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox 
                    checked={selectedRows.length === filteredPurchases.length && filteredPurchases.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Purchase ID</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead>Service Package</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Expiry Date</TableHead>
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
                    <span className="font-mono text-sm">{purchase.purchaseId}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{purchase.learner.fullName}</span>
                      <span className="text-sm text-gray-500">{purchase.learner.email}</span>
                      <span className="text-sm text-gray-400">{purchase.learner.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{purchase.servicePackage.packageName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{formatPrice(purchase.finalPrice)}</span>
                      {purchase.servicePackage.discountedPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(purchase.servicePackage.originalPrice)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {purchase.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(purchase.purchaseDate)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(purchase.expiryDate)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        purchase.status === 'Active' ? 'default' : 
                        purchase.status === 'Expired' ? 'destructive' :
                        purchase.status === 'Pending' ? 'secondary' :
                        'outline'
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
                          setOpenDropdownId(openDropdownId === purchase.purchaseId ? null : purchase.purchaseId);
                        }}
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="19" cy="12" r="1"/>
                          <circle cx="5" cy="12" r="1"/>
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
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                              View Details
                            </button>
                            {(purchase.status === 'Active' || purchase.status === 'Pending') && (
                              <button
                                className="block cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                onClick={() => {
                                  handleAction(purchase, 'cancel');
                                  setOpenDropdownId(null);
                                }}
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
                                  <circle cx="12" cy="12" r="10"/>
                                  <line x1="15" y1="9" x2="9" y2="15"/>
                                  <line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                                Cancel Purchase
                              </button>
                            )}
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
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
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
                    <div><strong>Purchase ID:</strong> {selectedPurchase.purchaseId}</div>
                    <div><strong>Purchase Date:</strong> {formatDate(selectedPurchase.purchaseDate)}</div>
                    <div><strong>Expiry Date:</strong> {formatDate(selectedPurchase.expiryDate)}</div>
                    <div><strong>Status:</strong> 
                      <Badge 
                        variant={
                          selectedPurchase.status === 'Active' ? 'default' : 
                          selectedPurchase.status === 'Expired' ? 'destructive' :
                          selectedPurchase.status === 'Pending' ? 'secondary' :
                          'outline'
                        }
                        className="ml-2"
                      >
                        {selectedPurchase.status}
                      </Badge>
                    </div>
                    {selectedPurchase.notes && (
                      <div><strong>Notes:</strong> {selectedPurchase.notes}</div>
                    )}
                  </div>
                </div>

                {/* Learner Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Learner Information</h3>
                  <div className="space-y-2">
                    <div><strong>Name:</strong> {selectedPurchase.learner.fullName}</div>
                    <div><strong>Email:</strong> {selectedPurchase.learner.email}</div>
                    <div><strong>Phone:</strong> {selectedPurchase.learner.phone}</div>
                    <div><strong>Learner ID:</strong> {selectedPurchase.learner.id}</div>
                  </div>
                </div>

                {/* Package Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Service Package</h3>
                  <div className="space-y-2">
                    <div><strong>Package Name:</strong> {selectedPurchase.servicePackage.packageName}</div>
                    <div><strong>Original Price:</strong> {formatPrice(selectedPurchase.servicePackage.originalPrice)}</div>
                    {selectedPurchase.servicePackage.discountedPrice && (
                      <div><strong>Discounted Price:</strong> {formatPrice(selectedPurchase.servicePackage.discountedPrice)}</div>
                    )}
                    <div><strong>Final Price:</strong> <span className="text-lg font-semibold text-green-600">{formatPrice(selectedPurchase.finalPrice)}</span></div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  <div className="space-y-2">
                    <div><strong>Payment Method:</strong> <Badge variant="secondary">{selectedPurchase.paymentMethod}</Badge></div>
                    <div><strong>Payment History:</strong></div>
                    <div className="pl-4 space-y-2">
                      {selectedPurchase.paymentHistory.map((payment, idx) => (
                        <div key={idx} className="border-l-2 border-gray-200 pl-4 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{payment.transactionId}</span>
                            <Badge 
                              variant={
                                payment.status === 'Success' ? 'default' :
                                payment.status === 'Failed' ? 'destructive' :
                                'secondary'
                              }
                              className="text-xs"
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(payment.amount)} - {formatDate(payment.date)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Services */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Support Services</h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedPurchase.supportServices.map((service, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {service.included ? (
                          <svg width="16" height="16" fill="currentColor" className="text-green-600" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" fill="currentColor" className="text-gray-400" viewBox="0 0 24 24">
                            <path d="M18.3 5.71L12 12.01 5.7 5.71 4.29 7.12 10.59 13.42 4.29 19.72 5.7 21.13 12 14.83 18.3 21.13 19.71 19.72 13.41 13.42 19.71 7.12 18.3 5.71z"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{service.serviceName}</div>
                        <div className="text-sm text-gray-600">{service.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Management Action Modal */}
      {showActionModal && selectedPurchase && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Cancel Purchase
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowActionModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <strong>Purchase ID:</strong> {selectedPurchase.purchaseId}
              </div>
              <div className="mb-4">
                <strong>Learner:</strong> {selectedPurchase.learner.fullName}
              </div>
              <div className="mb-4">
                <strong>Package:</strong> {selectedPurchase.servicePackage.packageName}
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-red-600 font-medium">⚠️ Warning: This action cannot be undone.</p>
                <p className="text-sm text-gray-600">Cancelling this purchase will immediately revoke the learner&apos;s access. No refunds will be processed as per company policy.</p>
                <div>
                    <label className="block text-sm font-medium mb-2">Cancellation Reason</label>
                    <textarea className="w-full px-3 py-2 border rounded-md" rows={3} placeholder="Enter reason for cancellation..."></textarea>
                  </div>
                </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowActionModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    // Handle the action here
                    console.log(`${actionType} action for purchase ${selectedPurchase.purchaseId}`);
                    setShowActionModal(false);
                  }}
                >
                  Cancel Purchase
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesManagement;
