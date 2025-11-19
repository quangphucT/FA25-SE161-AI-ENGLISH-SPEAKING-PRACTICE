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
interface Course {
  CourseID: string;
  Title: string;
  numberOfChapter: number;
  orderIndex: number;
  level: string;
  price: number;
}

interface ReviewFee {
  ReviewFeeID: string;
  price: number;
  numberOfReview: number;
}

interface AIConversationCharge {
  AIConversationChargeID: string;
  user_id: string;
  amount_coin: number;
  allowed_minutes: number;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  roomid: string;
  content_json: string;
}

interface PurchaseItem {
  purchase_id: string;
  userId: string;
  course_id: string | null;
  ReviewFeeID: string | null;
  AIConversationChargeID: string | null;
  status: "Success" | "Pending" | "Failed" | "Refunded";
  amount_coin: number;
  created_at: string;
  // Related data
  course?: Course;
  reviewFee?: ReviewFee;
  aiConversationCharge?: AIConversationCharge;
}

// Fake data
const fakeCourses: Course[] = [
  {
    CourseID: "COURSE001",
    Title: "Basic English Conversation",
    numberOfChapter: 10,
    orderIndex: 1,
    level: "Beginner",
    price: 500000,
  },
  {
    CourseID: "COURSE002",
    Title: "IELTS Preparation Premium",
    numberOfChapter: 15,
    orderIndex: 2,
    level: "Advanced",
    price: 1200000,
  },
  {
    CourseID: "COURSE003",
    Title: "Business English Mastery",
    numberOfChapter: 12,
    orderIndex: 3,
    level: "Intermediate",
    price: 800000,
  },
  {
    CourseID: "COURSE004",
    Title: "Pronunciation Mastery",
    numberOfChapter: 8,
    orderIndex: 4,
    level: "Beginner",
    price: 600000,
  },
];

const fakeReviewFees: ReviewFee[] = [
  {
    ReviewFeeID: "REVIEW001",
    price: 100000,
    numberOfReview: 5,
  },
  {
    ReviewFeeID: "REVIEW002",
    price: 200000,
    numberOfReview: 10,
  },
  {
    ReviewFeeID: "REVIEW003",
    price: 300000,
    numberOfReview: 20,
  },
];

const fakeAIConversationCharges: AIConversationCharge[] = [
  {
    AIConversationChargeID: "AICONV001",
    user_id: "USER001",
    amount_coin: 50000,
    allowed_minutes: 30,
    start_time: "2025-01-15T09:00:00",
    end_time: "2025-01-15T09:30:00",
    status: "Active",
    created_at: "2025-01-15T08:50:00",
    roomid: "ROOM001",
    content_json: '{"messages": 15}',
  },
  {
    AIConversationChargeID: "AICONV002",
    user_id: "USER002",
    amount_coin: 100000,
    allowed_minutes: 60,
    start_time: "2025-01-16T10:00:00",
    end_time: "2025-01-16T11:00:00",
    status: "Completed",
    created_at: "2025-01-16T09:50:00",
    roomid: "ROOM002",
    content_json: '{"messages": 30}',
  },
  {
    AIConversationChargeID: "AICONV003",
    user_id: "USER003",
    amount_coin: 75000,
    allowed_minutes: 45,
    start_time: "2025-01-17T14:00:00",
    end_time: "2025-01-17T14:45:00",
    status: "Active",
    created_at: "2025-01-17T13:50:00",
    roomid: "ROOM003",
    content_json: '{"messages": 22}',
  },
];

const samplePurchaseItems: PurchaseItem[] = [
  {
    purchase_id: "PURCH001",
    userId: "USER001",
    course_id: "COURSE001",
    ReviewFeeID: null,
    AIConversationChargeID: null,
    status: "Success",
    amount_coin: 500000,
    created_at: "2025-01-15T10:00:00",
    course: fakeCourses[0],
  },
  {
    purchase_id: "PURCH002",
    userId: "USER002",
    course_id: null,
    ReviewFeeID: "REVIEW001",
    AIConversationChargeID: null,
    status: "Success",
    amount_coin: 100000,
    created_at: "2025-01-16T11:00:00",
    reviewFee: fakeReviewFees[0],
  },
  {
    purchase_id: "PURCH003",
    userId: "USER003",
    course_id: null,
    ReviewFeeID: null,
    AIConversationChargeID: "AICONV001",
    status: "Success",
    amount_coin: 50000,
    created_at: "2025-01-15T08:50:00",
    aiConversationCharge: fakeAIConversationCharges[0],
  },
  {
    purchase_id: "PURCH004",
    userId: "USER004",
    course_id: "COURSE002",
    ReviewFeeID: null,
    AIConversationChargeID: null,
    status: "Pending",
    amount_coin: 1200000,
    created_at: "2025-01-20T09:00:00",
    course: fakeCourses[1],
  },
  {
    purchase_id: "PURCH005",
    userId: "USER005",
    course_id: null,
    ReviewFeeID: "REVIEW002",
    AIConversationChargeID: null,
    status: "Success",
    amount_coin: 200000,
    created_at: "2025-01-18T14:00:00",
    reviewFee: fakeReviewFees[1],
  },
  {
    purchase_id: "PURCH006",
    userId: "USER006",
    course_id: "COURSE003",
    ReviewFeeID: null,
    AIConversationChargeID: null,
    status: "Failed",
    amount_coin: 800000,
    created_at: "2025-01-19T10:00:00",
    course: fakeCourses[2],
  },
  {
    purchase_id: "PURCH007",
    userId: "USER007",
    course_id: null,
    ReviewFeeID: null,
    AIConversationChargeID: "AICONV002",
    status: "Success",
    amount_coin: 100000,
    created_at: "2025-01-16T09:50:00",
    aiConversationCharge: fakeAIConversationCharges[1],
  },
  {
    purchase_id: "PURCH008",
    userId: "USER008",
    course_id: "COURSE004",
    ReviewFeeID: null,
    AIConversationChargeID: null,
    status: "Refunded",
    amount_coin: 600000,
    created_at: "2025-01-17T15:00:00",
    course: fakeCourses[3],
  },
  {
    purchase_id: "PURCH009",
    userId: "USER009",
    course_id: null,
    ReviewFeeID: "REVIEW003",
    AIConversationChargeID: null,
    status: "Success",
    amount_coin: 300000,
    created_at: "2025-01-21T11:00:00",
    reviewFee: fakeReviewFees[2],
  },
  {
    purchase_id: "PURCH010",
    userId: "USER010",
    course_id: null,
    ReviewFeeID: null,
    AIConversationChargeID: "AICONV003",
    status: "Pending",
    amount_coin: 75000,
    created_at: "2025-01-17T13:50:00",
    aiConversationCharge: fakeAIConversationCharges[2],
  },
];

const PurchasesItemManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(
    null
  );

  // Filter purchases
  const filteredPurchases = samplePurchaseItems.filter((purchase) => {
    const matchesSearch =
      purchase.purchase_id.toLowerCase().includes(search.toLowerCase()) ||
      purchase.userId.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "All" || purchase.status === statusFilter;
    
    const matchesItemType =
      itemTypeFilter === "All" ||
      (itemTypeFilter === "Course" && purchase.course_id !== null) ||
      (itemTypeFilter === "ReviewFee" && purchase.ReviewFeeID !== null) ||
      (itemTypeFilter === "AIConversation" &&
        purchase.AIConversationChargeID !== null);

    return matchesSearch && matchesStatus && matchesItemType;
  });

  const handleViewDetails = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
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

  const getItemType = (purchase: PurchaseItem): string => {
    if (purchase.course_id) return "Course";
    if (purchase.ReviewFeeID) return "Review Fee";
    if (purchase.AIConversationChargeID) return "AI Conversation";
    return "Unknown";
  };

  const getItemName = (purchase: PurchaseItem): string => {
    if (purchase.course) return purchase.course.Title;
    if (purchase.reviewFee)
      return `Review Fee - ${purchase.reviewFee.numberOfReview} reviews`;
    if (purchase.aiConversationCharge)
      return `AI Conversation - ${purchase.aiConversationCharge.allowed_minutes} minutes`;
    return "N/A";
  };

  const exportToPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Items Report</title>
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
        <h1>Purchase Items Management Report</h1>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString(
          "vi-VN"
        )} ${new Date().toLocaleTimeString("vi-VN")}</p>
        <p><strong>Total Records:</strong> ${filteredPurchases.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Purchase ID</th>
              <th>User ID</th>
              <th>Item Type</th>
              <th>Item Name</th>
              <th>Amount (Coin)</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPurchases
              .map(
                (purchase) => `
              <tr>
                <td>${purchase.purchase_id}</td>
                <td>${purchase.userId}</td>
                <td>${getItemType(purchase)}</td>
                <td>${getItemName(purchase)}</td>
                <td>${formatPrice(purchase.amount_coin)}</td>
                <td class="status-${purchase.status.toLowerCase()}">${
                  purchase.status
                }</td>
                <td>${formatDate(purchase.created_at)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

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
            placeholder="Tìm theo mã giao dịch hoặc User ID..."
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
          <select
            value={itemTypeFilter}
            onChange={(e) => setItemTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">Tất cả loại</option>
            <option value="Course">Khóa học</option>
            <option value="ReviewFee">Phí đánh giá</option>
            <option value="AIConversation">AI Conversation</option>
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
              {samplePurchaseItems.filter((p) => p.status === "Success").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Giao dịch thành công
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {samplePurchaseItems.filter((p) => p.status === "Failed").length}
            </div>
            <p className="text-xs text-muted-foreground">Giao dịch thất bại</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {samplePurchaseItems.filter((p) => p.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Đang xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatPrice(
                samplePurchaseItems
                  .filter((p) => p.status === "Success")
                  .reduce((sum, p) => sum + p.amount_coin, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng doanh thu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bảng giao dịch */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý gói dịch vụ</CardTitle>
          <CardDescription>
            Hiển thị {filteredPurchases.length} trên {samplePurchaseItems.length}{" "}
            giao dịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Loại item</TableHead>
                <TableHead>Tên item</TableHead>
                <TableHead>Số coin</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.purchase_id}>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {purchase.purchase_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{purchase.userId}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        purchase.course_id
                          ? "default"
                          : purchase.ReviewFeeID
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {getItemType(purchase)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{getItemName(purchase)}</span>
                      {purchase.course && (
                        <span className="text-xs text-gray-500">
                          Level: {purchase.course.level} | Chapters:{" "}
                          {purchase.course.numberOfChapter}
                        </span>
                      )}
                      {purchase.reviewFee && (
                        <span className="text-xs text-gray-500">
                          Price: {formatPrice(purchase.reviewFee.price)}
                        </span>
                      )}
                      {purchase.aiConversationCharge && (
                        <span className="text-xs text-gray-500">
                          Room: {purchase.aiConversationCharge.roomid} | Status:{" "}
                          {purchase.aiConversationCharge.status}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {purchase.amount_coin.toLocaleString("vi-VN")} coin
                    </span>
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
                    <span className="text-sm text-gray-600">
                      {formatDate(purchase.created_at)}
                    </span>
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
                          onClick={() => handleViewDetails(purchase)}
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
      {showDetailsModal && selectedPurchase && (
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
                {/* Purchase Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông tin giao dịch</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Mã giao dịch:</strong>{" "}
                      {selectedPurchase.purchase_id}
                    </div>
                    <div>
                      <strong>User ID:</strong> {selectedPurchase.userId}
                    </div>
                    <div>
                      <strong>Loại item:</strong>{" "}
                      <Badge
                        variant={
                          selectedPurchase.course_id
                            ? "default"
                            : selectedPurchase.ReviewFeeID
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {getItemType(selectedPurchase)}
                      </Badge>
                    </div>
                    <div>
                      <strong>Số coin:</strong>{" "}
                      <span className="text-lg font-semibold text-green-600">
                        {selectedPurchase.amount_coin.toLocaleString("vi-VN")}{" "}
                        coin
                      </span>
                    </div>
                    <div>
                      <strong>Trạng thái:</strong>
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
                    <div>
                      <strong>Ngày tạo:</strong>{" "}
                      {formatDate(selectedPurchase.created_at)}
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Chi tiết item</h3>
                  <div className="space-y-2">
                    {selectedPurchase.course && (
                      <>
                        <div>
                          <strong>Course ID:</strong>{" "}
                          {selectedPurchase.course.CourseID}
                        </div>
                        <div>
                          <strong>Title:</strong>{" "}
                          {selectedPurchase.course.Title}
                        </div>
                        <div>
                          <strong>Level:</strong>{" "}
                          {selectedPurchase.course.level}
                        </div>
                        <div>
                          <strong>Số chương:</strong>{" "}
                          {selectedPurchase.course.numberOfChapter}
                        </div>
                        <div>
                          <strong>Order Index:</strong>{" "}
                          {selectedPurchase.course.orderIndex}
                        </div>
                        <div>
                          <strong>Price:</strong>{" "}
                          {formatPrice(selectedPurchase.course.price)}
                        </div>
                      </>
                    )}
                    {selectedPurchase.reviewFee && (
                      <>
                        <div>
                          <strong>Review Fee ID:</strong>{" "}
                          {selectedPurchase.reviewFee.ReviewFeeID}
                        </div>
                        <div>
                          <strong>Price:</strong>{" "}
                          {formatPrice(selectedPurchase.reviewFee.price)}
                        </div>
                        <div>
                          <strong>Số lượt đánh giá:</strong>{" "}
                          {selectedPurchase.reviewFee.numberOfReview}
                        </div>
                      </>
                    )}
                    {selectedPurchase.aiConversationCharge && (
                      <>
                        <div>
                          <strong>AI Conversation Charge ID:</strong>{" "}
                          {
                            selectedPurchase.aiConversationCharge
                              .AIConversationChargeID
                          }
                        </div>
                        <div>
                          <strong>User ID:</strong>{" "}
                          {selectedPurchase.aiConversationCharge.user_id}
                        </div>
                        <div>
                          <strong>Số coin:</strong>{" "}
                          {selectedPurchase.aiConversationCharge.amount_coin.toLocaleString(
                            "vi-VN"
                          )}{" "}
                          coin
                        </div>
                        <div>
                          <strong>Số phút cho phép:</strong>{" "}
                          {selectedPurchase.aiConversationCharge.allowed_minutes}{" "}
                          phút
                        </div>
                        <div>
                          <strong>Thời gian bắt đầu:</strong>{" "}
                          {formatDate(
                            selectedPurchase.aiConversationCharge.start_time
                          )}
                        </div>
                        <div>
                          <strong>Thời gian kết thúc:</strong>{" "}
                          {formatDate(
                            selectedPurchase.aiConversationCharge.end_time
                          )}
                        </div>
                        <div>
                          <strong>Status:</strong>{" "}
                          {selectedPurchase.aiConversationCharge.status}
                        </div>
                        <div>
                          <strong>Room ID:</strong>{" "}
                          {selectedPurchase.aiConversationCharge.roomid}
                        </div>
                        <div>
                          <strong>Ngày tạo:</strong>{" "}
                          {formatDate(
                            selectedPurchase.aiConversationCharge.created_at
                          )}
                        </div>
                      </>
                    )}
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

export default PurchasesItemManagement;
