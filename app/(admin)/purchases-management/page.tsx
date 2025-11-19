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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type definitions
interface ServicePackage {
  servicePackage_id: string;
  Name: string;
  Description: string;
  Price: number;
  status: string;
  NumberOfCoin: number;
  bonus_percent: number;
  created_at: string;
}

interface Transaction {
  TRANSACTIONS_id: string;
  CreatedTransaction: string;
  Bankname: string;
  AccountNumber: string;
  Description: string;
  Status: "Success" | "Pending" | "Failed" | "Refunded";
  amount_coin: number;
  type: string;
  OrderCode: string;
  servicePackage_id: string;
  user_id: string;
  // Related data
  servicePackage?: ServicePackage;
}

// Fake Service Packages
const fakeServicePackages: ServicePackage[] = [
  {
    servicePackage_id: "PKG001",
    Name: "Basic English Conversation",
    Description: "Khóa học tiếng Anh giao tiếp cơ bản",
    Price: 500000,
    status: "Active",
    NumberOfCoin: 500,
    bonus_percent: 10,
    created_at: "2025-01-01T00:00:00",
  },
  {
    servicePackage_id: "PKG002",
    Name: "IELTS Preparation Premium",
    Description: "Khóa học luyện thi IELTS chuyên sâu",
    Price: 1200000,
    status: "Active",
    NumberOfCoin: 1200,
    bonus_percent: 15,
    created_at: "2025-01-01T00:00:00",
  },
  {
    servicePackage_id: "PKG003",
    Name: "Business English Mastery",
    Description: "Tiếng Anh thương mại chuyên nghiệp",
    Price: 800000,
    status: "Active",
    NumberOfCoin: 800,
    bonus_percent: 12,
    created_at: "2025-01-01T00:00:00",
  },
  {
    servicePackage_id: "PKG004",
    Name: "Pronunciation Mastery",
    Description: "Luyện phát âm chuẩn",
    Price: 600000,
    status: "Active",
    NumberOfCoin: 600,
    bonus_percent: 8,
    created_at: "2025-01-01T00:00:00",
  },
];

const sampleTransactions: Transaction[] = [
  {
    TRANSACTIONS_id: "TXN001",
    CreatedTransaction: "2025-01-15T10:00:00",
    Bankname: "Vietcombank",
    AccountNumber: "1234567890",
    Description: "Thanh toán gói Basic English Conversation",
    Status: "Success",
    amount_coin: 500,
    type: "Purchase",
    OrderCode: "ORD001",
    servicePackage_id: "PKG001",
    user_id: "USER001",
    servicePackage: fakeServicePackages[0],
  },
  {
    TRANSACTIONS_id: "TXN002",
    CreatedTransaction: "2025-01-16T11:00:00",
    Bankname: "Techcombank",
    AccountNumber: "0987654321",
    Description: "Thanh toán gói IELTS Preparation Premium",
    Status: "Success",
    amount_coin: 1200,
    type: "Purchase",
    OrderCode: "ORD002",
    servicePackage_id: "PKG002",
    user_id: "USER002",
    servicePackage: fakeServicePackages[1],
  },
  {
    TRANSACTIONS_id: "TXN003",
    CreatedTransaction: "2025-01-17T14:00:00",
    Bankname: "BIDV",
    AccountNumber: "1122334455",
    Description: "Thanh toán gói Business English Mastery",
    Status: "Success",
    amount_coin: 800,
    type: "Purchase",
    OrderCode: "ORD003",
    servicePackage_id: "PKG003",
    user_id: "USER003",
    servicePackage: fakeServicePackages[2],
  },
  {
    TRANSACTIONS_id: "TXN004",
    CreatedTransaction: "2025-01-18T09:00:00",
    Bankname: "Vietinbank",
    AccountNumber: "5566778899",
    Description: "Thanh toán gói Pronunciation Mastery",
    Status: "Failed",
    amount_coin: 600,
    type: "Purchase",
    OrderCode: "ORD004",
    servicePackage_id: "PKG004",
    user_id: "USER004",
    servicePackage: fakeServicePackages[3],
  },
  {
    TRANSACTIONS_id: "TXN005",
    CreatedTransaction: "2025-01-19T15:00:00",
    Bankname: "ACB",
    AccountNumber: "9988776655",
    Description: "Thanh toán gói Basic English Conversation",
    Status: "Pending",
    amount_coin: 500,
    type: "Purchase",
    OrderCode: "ORD005",
    servicePackage_id: "PKG001",
    user_id: "USER005",
    servicePackage: fakeServicePackages[0],
  },
  {
    TRANSACTIONS_id: "TXN006",
    CreatedTransaction: "2025-01-20T10:30:00",
    Bankname: "Vietcombank",
    AccountNumber: "1234567890",
    Description: "Thanh toán gói IELTS Preparation Premium",
    Status: "Success",
    amount_coin: 1200,
    type: "Purchase",
    OrderCode: "ORD006",
    servicePackage_id: "PKG002",
    user_id: "USER006",
    servicePackage: fakeServicePackages[1],
  },
  {
    TRANSACTIONS_id: "TXN007",
    CreatedTransaction: "2025-01-21T13:00:00",
    Bankname: "Techcombank",
    AccountNumber: "0987654321",
    Description: "Thanh toán gói Business English Mastery",
    Status: "Refunded",
    amount_coin: 800,
    type: "Purchase",
    OrderCode: "ORD007",
    servicePackage_id: "PKG003",
    user_id: "USER007",
    servicePackage: fakeServicePackages[2],
  },
  {
    TRANSACTIONS_id: "TXN008",
    CreatedTransaction: "2025-01-22T16:00:00",
    Bankname: "BIDV",
    AccountNumber: "1122334455",
    Description: "Thanh toán gói Pronunciation Mastery",
    Status: "Success",
    amount_coin: 600,
    type: "Purchase",
    OrderCode: "ORD008",
    servicePackage_id: "PKG004",
    user_id: "USER008",
    servicePackage: fakeServicePackages[3],
  },
];

const PurchasesManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null
  );

  // Filter transactions
  const filteredTransactions = sampleTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.TRANSACTIONS_id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.OrderCode.toLowerCase().includes(search.toLowerCase()) ||
      transaction.user_id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.servicePackage?.Name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || transaction.Status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // const handleSelectRow = (idx: number) => {
  //   setSelectedRows(
  //     selectedRows.includes(idx)
  //       ? selectedRows.filter((i) => i !== idx)
  //       : [...selectedRows, idx]
  //   );
  // };

  // const handleSelectAll = () => {
  //   if (selectedRows.length === filteredPurchases.length) {
  //     setSelectedRows([]);
  //   } else {
  //     setSelectedRows(filteredPurchases.map((_, idx) => idx));
  //   }
  // };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <p><strong>Total Records:</strong> ${filteredTransactions.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User ID</th>
              <th>Service Package</th>
              <th>Amount Coin</th>
              <th>Bank</th>
              <th>Order Code</th>
              <th>Created Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTransactions
              .map(
                (transaction) => `
              <tr>
                <td>${transaction.TRANSACTIONS_id}</td>
                <td>${transaction.user_id}</td>
                <td>${transaction.servicePackage?.Name || "N/A"}</td>
                <td>${transaction.amount_coin}</td>
                <td>${transaction.Bankname}</td>
                <td>${transaction.OrderCode}</td>
                <td>${formatDate(transaction.CreatedTransaction)}</td>
                <td class="status-${transaction.Status.toLowerCase()}">${
                  transaction.Status
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


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          
          <Input
            placeholder="Tìm theo mã giao dịch, Order Code, User ID..."
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
            <option value="Success">Thành công</option>
            <option value="Failed">Thất bại</option>
            <option value="Pending">Đang xử lý</option>
            <option value="Refunded">Hoàn tiền</option>
          </select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer">
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
              Xuất báo cáo
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={exportToPDF}
              className="cursor-pointer"
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
              Xuất PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {sampleTransactions.filter((t) => t.Status === "Success").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Giao dịch thành công
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {sampleTransactions.filter((t) => t.Status === "Failed").length}
            </div>
            <p className="text-xs text-muted-foreground">Giao dịch thất bại</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {sampleTransactions.filter((t) => t.Status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Đang xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {sampleTransactions
                .filter((t) => t.Status === "Success")
                .reduce((sum, t) => sum + t.amount_coin, 0)
                .toLocaleString("vi-VN")}{" "}
              coin
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng coin thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bảng giao dịch */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lí giao dịch</CardTitle>
          <CardDescription>
            Hiển thị {filteredTransactions.length} trên {sampleTransactions.length}{" "}
            giao dịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Gói dịch vụ</TableHead>
                <TableHead>Số coin</TableHead>
                <TableHead>Ngân hàng</TableHead>
                <TableHead>Order Code</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.TRANSACTIONS_id}>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {transaction.TRANSACTIONS_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{transaction.user_id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {transaction.servicePackage?.Name || "N/A"}
                      </span>
                      {transaction.servicePackage && (
                        <span className="text-xs text-gray-500">
                          {formatPrice(transaction.servicePackage.Price)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {transaction.amount_coin.toLocaleString("vi-VN")} coin
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{transaction.Bankname}</span>
                      <span className="text-xs text-gray-500">
                        {transaction.AccountNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {transaction.OrderCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(transaction.CreatedTransaction)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.Status === "Success"
                          ? "default"
                          : transaction.Status === "Failed"
                          ? "destructive"
                          : transaction.Status === "Pending"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {transaction.Status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
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
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(transaction)}
                          className="cursor-pointer"
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
                          Xem chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal chi tiết giao dịch */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Chi tiết giao dịch</h2>
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
                {/* Transaction Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông tin giao dịch</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Mã giao dịch:</strong>{" "}
                      {selectedTransaction.TRANSACTIONS_id}
                    </div>
                    <div>
                      <strong>Order Code:</strong>{" "}
                      {selectedTransaction.OrderCode}
                    </div>
                    <div>
                      <strong>Ngày tạo:</strong>{" "}
                      {formatDate(selectedTransaction.CreatedTransaction)}
                    </div>
                    <div>
                      <strong>Loại:</strong> {selectedTransaction.type}
                    </div>
                    <div>
                      <strong>Trạng thái:</strong>
                      <Badge
                        variant={
                          selectedTransaction.Status === "Success"
                            ? "default"
                            : selectedTransaction.Status === "Failed"
                            ? "destructive"
                            : selectedTransaction.Status === "Pending"
                            ? "secondary"
                            : "outline"
                        }
                        className="ml-2"
                      >
                        {selectedTransaction.Status}
                      </Badge>
                    </div>
                    <div>
                      <strong>Mô tả:</strong> {selectedTransaction.Description}
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông tin người dùng</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>User ID:</strong> {selectedTransaction.user_id}
                    </div>
                  </div>
                </div>

                {/* Service Package Information */}
                {selectedTransaction.servicePackage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Gói dịch vụ</h3>
                    <div className="space-y-2">
                      <div>
                        <strong>Service Package ID:</strong>{" "}
                        {selectedTransaction.servicePackage.servicePackage_id}
                      </div>
                      <div>
                        <strong>Tên gói:</strong>{" "}
                        {selectedTransaction.servicePackage.Name}
                      </div>
                      <div>
                        <strong>Mô tả:</strong>{" "}
                        {selectedTransaction.servicePackage.Description}
                      </div>
                      <div>
                        <strong>Giá:</strong>{" "}
                        {formatPrice(selectedTransaction.servicePackage.Price)}
                      </div>
                      <div>
                        <strong>Số coin:</strong>{" "}
                        {selectedTransaction.servicePackage.NumberOfCoin} coin
                      </div>
                      <div>
                        <strong>Bonus:</strong>{" "}
                        {selectedTransaction.servicePackage.bonus_percent}%
                      </div>
                      <div>
                        <strong>Trạng thái gói:</strong>{" "}
                        {selectedTransaction.servicePackage.status}
                      </div>
                      <div>
                        <strong>Ngày tạo gói:</strong>{" "}
                        {formatDate(selectedTransaction.servicePackage.created_at)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông tin thanh toán</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Ngân hàng:</strong>{" "}
                      {selectedTransaction.Bankname}
                    </div>
                    <div>
                      <strong>Số tài khoản:</strong>{" "}
                      {selectedTransaction.AccountNumber}
                    </div>
                    <div>
                      <strong>Số coin:</strong>{" "}
                      <span className="text-lg font-semibold text-green-600">
                        {selectedTransaction.amount_coin.toLocaleString("vi-VN")}{" "}
                        coin
                      </span>
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
