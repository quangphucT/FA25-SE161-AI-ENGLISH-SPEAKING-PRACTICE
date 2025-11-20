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
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminTransactions } from "@/features/admin/hooks/useAdminTransactions";
import { Transaction as ApiTransaction } from "@/features/admin/services/adminTransactionsService";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Coins, 
  Search,
  Download,
  Eye,
  FileText
} from "lucide-react";

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


const PurchasesManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null
  );

  const { data: transactionsData, isLoading, error } = useAdminTransactions();

  // Map API data to Transaction format
  const transactions = useMemo(() => {
    if (!transactionsData?.data) return [];
    
    return transactionsData.data.map((item: ApiTransaction) => {
      // Map status: "Pending" -> "Pending", "Success" -> "Success", "Cancelled" -> "Failed", etc.
      let mappedStatus: "Success" | "Pending" | "Failed" | "Refunded" = "Pending";
      if (item.status === "Success" || item.status === "Completed") {
        mappedStatus = "Success";
      } else if (item.status === "Failed" || item.status === "Cancelled") {
        mappedStatus = "Failed";
      } else if (item.status === "Refunded") {
        mappedStatus = "Refunded";
      } else {
        mappedStatus = "Pending";
      }

      return {
        TRANSACTIONS_id: item.orderCode,
        CreatedTransaction: item.createdAt,
       
        Description: item.description,
        Status: mappedStatus,
        amount_coin: item.amountCoin,
      
        OrderCode: item.orderCode,
        servicePackage_id: "", // API doesn't provide this
        user_id: "", // API doesn't provide this
        servicePackage: undefined,
      } as Transaction;
    });
  }, [transactionsData]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.TRANSACTIONS_id.toLowerCase().includes(search.toLowerCase()) ||
        transaction.OrderCode.toLowerCase().includes(search.toLowerCase()) ||
        transaction.user_id.toLowerCase().includes(search.toLowerCase()) ||
        transaction.servicePackage?.Name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || transaction.Status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý giao dịch
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các giao dịch nạp tiền của người dùng
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm theo mã giao dịch, Order Code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[300px] pl-10"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-5 w-[500px]">
              <TabsTrigger value="All">Tất cả</TabsTrigger>
              <TabsTrigger value="Success">Thành công</TabsTrigger>
              <TabsTrigger value="Failed">Thất bại</TabsTrigger>
              <TabsTrigger value="Pending">Đang xử lý</TabsTrigger>
              <TabsTrigger value="Refunded">Hoàn tiền</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={exportToPDF}
              className="cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Xuất PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Giao dịch thành công
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter((t) => t.Status === "Success").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Giao dịch thất bại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {transactions.filter((t) => t.Status === "Failed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Đang xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {transactions.filter((t) => t.Status === "Pending").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Coins className="h-4 w-4 text-blue-500" />
              Tổng coin thành công
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {transactions
                .filter((t) => t.Status === "Success")
                .reduce((sum, t) => sum + t.amount_coin, 0)
                .toLocaleString("vi-VN")}{" "}
              <span className="text-sm font-normal">coin</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng giao dịch */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách giao dịch</CardTitle>
              <CardDescription className="mt-1">
                {isLoading ? (
                  "Đang tải dữ liệu..."
                ) : error ? (
                  `Lỗi: ${error.message}`
                ) : (
                  `Hiển thị ${filteredTransactions.length} trên ${transactions.length} giao dịch`
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-gray-500">
              Đang tải dữ liệu...
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500">
              Lỗi khi tải dữ liệu: {error.message}
            </div>
          )}
          {!isLoading && !error && transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có giao dịch nào
            </div>
          )}
          {!isLoading && !error && transactions.length > 0 && (
            <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Mã giao dịch</TableHead>
                <TableHead className="font-semibold text-gray-700">User ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Gói dịch vụ</TableHead>
                <TableHead className="font-semibold text-gray-700">Số coin</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngân hàng</TableHead>
                <TableHead className="font-semibold text-gray-700">Order Code</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.TRANSACTIONS_id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <span className="font-mono text-sm">
                      {transaction.TRANSACTIONS_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm text-gray-500">
                      {transaction.user_id || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {transaction.servicePackage?.Name || transaction.type || "N/A"}
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
                      <span className="text-sm">{transaction.Bankname || "N/A"}</span>
                      {transaction.AccountNumber !== "N/A" && (
                        <span className="text-xs text-gray-500">
                          {transaction.AccountNumber}
                        </span>
                      )}
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
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal chi tiết giao dịch */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Chi tiết giao dịch</h2>
                  <p className="text-sm text-gray-600 mt-1">Mã giao dịch: {selectedTransaction.OrderCode}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-white/50"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Thông tin giao dịch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Mã giao dịch:</span>
                      <span className="font-mono text-sm font-medium">{selectedTransaction.TRANSACTIONS_id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Order Code:</span>
                      <span className="font-mono text-sm font-medium">{selectedTransaction.OrderCode}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Ngày tạo:</span>
                      <span className="text-sm">{formatDate(selectedTransaction.CreatedTransaction)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Loại:</span>
                      <span className="text-sm font-medium">{selectedTransaction.type}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
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
                      >
                        {selectedTransaction.Status}
                      </Badge>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm text-gray-600 block mb-1">Mô tả:</span>
                      <p className="text-sm">{selectedTransaction.Description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Thông tin thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Số coin:</span>
                      <span className="text-lg font-semibold text-green-600">
                        {selectedTransaction.amount_coin.toLocaleString("vi-VN")} coin
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Ngân hàng:</span>
                      <span className="text-sm">{selectedTransaction.Bankname || "N/A"}</span>
                    </div>
                    {selectedTransaction.AccountNumber !== "N/A" && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">Số tài khoản:</span>
                        <span className="font-mono text-sm">{selectedTransaction.AccountNumber}</span>
                      </div>
                    )}
                    {selectedTransaction.user_id && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">User ID:</span>
                        <span className="font-mono text-sm">{selectedTransaction.user_id}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Service Package Information */}
                {selectedTransaction.servicePackage && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Gói dịch vụ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Service Package ID:</span>
                          <span className="font-mono text-sm">{selectedTransaction.servicePackage.servicePackage_id}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Tên gói:</span>
                          <span className="text-sm font-medium">{selectedTransaction.servicePackage.Name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Giá:</span>
                          <span className="text-sm font-medium">{formatPrice(selectedTransaction.servicePackage.Price)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Số coin:</span>
                          <span className="text-sm font-medium">{selectedTransaction.servicePackage.NumberOfCoin} coin</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Bonus:</span>
                          <span className="text-sm font-medium">{selectedTransaction.servicePackage.bonus_percent}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Trạng thái:</span>
                          <Badge variant={selectedTransaction.servicePackage.status === "Active" ? "default" : "secondary"}>
                            {selectedTransaction.servicePackage.status}
                          </Badge>
                        </div>
                        <div className="col-span-2 pt-2">
                          <span className="text-sm text-gray-600 block mb-1">Mô tả:</span>
                          <p className="text-sm">{selectedTransaction.servicePackage.Description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesManagement;
