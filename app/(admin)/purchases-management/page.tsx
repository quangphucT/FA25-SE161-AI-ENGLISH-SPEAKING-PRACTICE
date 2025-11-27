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
import { useState, useMemo, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminTransactions } from "@/features/admin/hooks/useAdminTransactions";
import { TransactionAdmin } from "@/features/admin/services/adminTransactionsService";
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
  UserName: string;
  CreatedTransaction: string;
  Bankname: string;
  AccountNumber: string;
  Description: string;
  Status: "Approved" | "Pending" | "Failed" ;
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
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when search or status filter changes
  useEffect(() => {
    setPageNumber(1);
  }, [debouncedSearch, statusFilter]);

  const { data: transactionsData, isLoading, error } = useAdminTransactions(
    pageNumber,
    pageSize,
    debouncedSearch,
    statusFilter === "All" ? "" : statusFilter
  );

  // Map API data to Transaction format
  const transactions = useMemo(() => {
    if (!transactionsData) return [];
    
    // Handle the actual response structure: { data: { items: [...], pageNumber, pageSize, totalItems, totalPages } }
    let dataArray: TransactionAdmin[] = [];
    
    // Check if data.items exists (paginated response structure)
    if (transactionsData.data && typeof transactionsData.data === 'object' && 'items' in transactionsData.data) {
      const paginatedData = transactionsData.data as { items?: TransactionAdmin[] };
      if (Array.isArray(paginatedData.items)) {
        dataArray = paginatedData.items;
      }
    } else if (transactionsData.data && Array.isArray(transactionsData.data)) {
      // Fallback: if data is directly an array
      dataArray = transactionsData.data;
    } else if (Array.isArray(transactionsData)) {
      // Fallback: if the response is directly an array
      dataArray = transactionsData as unknown as TransactionAdmin[];
    } else {
      // If data exists but is not in expected format, return empty
      console.warn("Unexpected data structure:", transactionsData);
      return [];
    }
    
    return dataArray.map((item: TransactionAdmin) => {
      // Map status: "Pending" -> "Pending", "Success" -> "Success", "Cancelled" -> "Failed", etc.
      let mappedStatus: "Approved" | "Pending" | "Failed" | "Refunded" = "Pending";
      if (item.status === "Success" || item.status === "Approved") {
        mappedStatus = "Approved";
      } else if (item.status === "Failed" || item.status === "Cancelled") {
        mappedStatus = "Failed";
      } else if (item.status === "Refunded") {
        mappedStatus = "Refunded";
      } else {
        mappedStatus = "Pending";
      }

      let mappedType: string = "Không xác định";
      if (item.type === "Deposit") {
        mappedType = "Nạp tiền";
      } else if (item.type === "Withdrawal") {
        mappedType = "Rút tiền";
      } else {
        mappedType = "Không xác định";
      }
      return {
        TRANSACTIONS_id: item.transactionId,
        UserName: item.userName || "N/A",
        CreatedTransaction: item.createdTransaction,
        Bankname: item.bankName || "N/A",
        AccountNumber: item.accountNumber || "N/A",
        Description: item.description,
        Status: mappedStatus,
        amount_coin: item.amountCoin,
        type: mappedType,
        OrderCode: item.orderCode,
        servicePackage_id: item.servicePackageId || "",
        user_id: item.userId,
        servicePackage: item.servicePackageName && item.servicePackageId ? {
          servicePackage_id: item.servicePackageId,
          Name: item.servicePackageName,
          Description: item.description,
          Price: item.amountMoney,
          status: "Active",
          NumberOfCoin: item.amountCoin,
          bonus_percent: 0,
          created_at: item.createdTransaction,
        } : undefined,
      } as Transaction;
    });
  }, [transactionsData]);

  // Transactions are already filtered by the API, so we just use them directly
  const filteredTransactions = transactions;

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
  // Mở popup NGAY LẬP TỨC khi user nhấn nút
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Trình duyệt đang chặn cửa sổ bật lên (popup). Hãy bật popup cho trang này.");
    return;
  }

  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Transaction Report</title>
        <style>
          body { font-family: Arial; margin: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>Transaction Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString("vi-VN")}</p>
        <table>
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Người dùng</th>
              <th>Số coin</th>
              <th>Loại</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTransactions.map(t => `
              <tr>
                <td>${t.TRANSACTIONS_id}</td>
                <td>${t.UserName}</td>
                <td>${t.amount_coin}</td>
                <td>${t.type}</td>
                <td>${formatDate(t.CreatedTransaction)}</td>
                <td>${t.Status}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();   // mở dialog Save PDF
    printWindow.close();
  };
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
            <TabsList className="grid grid-cols-4 w-[500px]">
              <TabsTrigger value="All">Tất cả</TabsTrigger>
              <TabsTrigger value="Approved">Thành công</TabsTrigger>
              <TabsTrigger value="Failed">Thất bại</TabsTrigger>
              <TabsTrigger value="Pending">Đang xử lý</TabsTrigger>
              
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Giao dịch thành công
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter((t) => t.Status === "Approved").length}
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
                  `Hiển thị ${filteredTransactions.length} giao dịch`
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
                <TableHead className="font-semibold text-gray-700">Tên người dùng</TableHead>
              
                <TableHead className="font-semibold text-gray-700">Số coin</TableHead>
               
                <TableHead className="font-semibold text-gray-700">Loại giao dịch</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.TRANSACTIONS_id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <span className="font-mono text-sm truncate max-w-[150px] block">
                      {transaction.TRANSACTIONS_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm text-gray-500 truncate max-w-[150px] block">
                      {transaction.UserName || "N/A"}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-semibold">
                      {transaction.amount_coin.toLocaleString("vi-VN")} coin
                    </span>
                  </TableCell>
                 
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "Nạp tiền"
                          ? "default"
                          : transaction.type === "Rút tiền"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs font-medium"
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(transaction.CreatedTransaction)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.Status === "Approved"
                          ? "default"
                          : transaction.Status === "Failed"
                          ? "destructive"
                          : transaction.Status === "Pending"
                          ? "secondary"
                          : "outline"
                      }
                      className={`text-xs font-medium ${
                        transaction.Status === "Approved"
                          ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                          : transaction.Status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300"
                          : ""
                      }`}
                    >
                      {transaction.Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100"
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
                    </div>
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
                          selectedTransaction.Status === "Approved"
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
