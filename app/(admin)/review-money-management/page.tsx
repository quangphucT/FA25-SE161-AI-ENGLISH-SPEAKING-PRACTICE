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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions
interface ReviewRecord {
  id: string;
  question: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerAvatar: string;
  learnerName: string;
  learnerEmail: string;
  learnerAvatar: string;
  score: number;
  maxScore: number;
  createdAt: string;
  reviewTime: string; // Time spent on review
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

const sampleReviewRecords: ReviewRecord[] = [
  {
    id: "R001",
    question: "Describe your favorite hobby and explain why you enjoy it.",
    reviewerName: "Dr. Sarah Johnson",
    reviewerEmail: "sarah.johnson@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Nguyễn Văn An",
    learnerEmail: "an.nguyen@example.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 8,
    maxScore: 10,
    createdAt: "2024-01-15",
    reviewTime: "15 phút",
    difficulty: "Medium",
    category: "Speaking",
  },
  {
    id: "R002",
    question:
      "What are the advantages and disadvantages of living in a big city?",
    reviewerName: "Prof. Michael Chen",
    reviewerEmail: "michael.chen@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Trần Thị Bình",
    learnerEmail: "binh.tran@example.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 7,
    maxScore: 10,
    createdAt: "2024-01-14",
    reviewTime: "12 phút",
    difficulty: "Hard",
    category: "Speaking",
  },
  {
    id: "R003",
    question: "Explain the process of photosynthesis in plants.",
    reviewerName: "Ms. Emily Davis",
    reviewerEmail: "emily.davis@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Lê Minh Cường",
    learnerEmail: "cuong.le@example.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 9,
    maxScore: 10,
    createdAt: "2024-01-13",
    reviewTime: "18 phút",
    difficulty: "Hard",
    category: "Academic",
  },
  {
    id: "R004",
    question: "What is your opinion about social media's impact on society?",
    reviewerName: "Dr. James Rodriguez",
    reviewerEmail: "james.rodriguez@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Phạm Thu Dung",
    learnerEmail: "dung.pham@example.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 6,
    maxScore: 10,
    createdAt: "2024-01-12",
    reviewTime: "10 phút",
    difficulty: "Medium",
    category: "Speaking",
  },
  {
    id: "R005",
    question: "Describe a memorable trip you have taken.",
    reviewerName: "Ms. Lisa Wang",
    reviewerEmail: "lisa.wang@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Hoàng Văn Minh",
    learnerEmail: "minh.hoang@example.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 8,
    maxScore: 10,
    createdAt: "2024-01-11",
    reviewTime: "14 phút",
    difficulty: "Easy",
    category: "Speaking",
  },
  {
    id: "R006",
    question:
      "Compare and contrast traditional education with online learning.",
    reviewerName: "Dr. Robert Kim",
    reviewerEmail: "robert.kim@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Lê Văn Tài",
    learnerEmail: "tai.le@example.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 7,
    maxScore: 10,
    createdAt: "2024-01-10",
    reviewTime: "20 phút",
    difficulty: "Hard",
    category: "Academic",
  },
  {
    id: "R007",
    question: "What are the benefits of learning a second language?",
    reviewerName: "Ms. Anna Smith",
    reviewerEmail: "anna.smith@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Nguyễn Thị Mai",
    learnerEmail: "mai.nguyen@example.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 9,
    maxScore: 10,
    createdAt: "2024-01-09",
    reviewTime: "16 phút",
    difficulty: "Medium",
    category: "Speaking",
  },
  {
    id: "R008",
    question: "Explain the importance of environmental conservation.",
    reviewerName: "Dr. David Wilson",
    reviewerEmail: "david.wilson@example.com",
    reviewerAvatar: "https://via.placeholder.com/150",
    learnerName: "Bác sĩ Trần Văn An",
    learnerEmail: "bs.tran@hospital.com",
    learnerAvatar: "https://via.placeholder.com/150",
    score: 8,
    maxScore: 10,
    createdAt: "2024-01-08",
    reviewTime: "22 phút",
    difficulty: "Hard",
    category: "Academic",
  },
];

const ReviewMoneyManagement = () => {
  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [endDate, setEndDate] = useState<string>("2024-01-31");
  const [filteredRecords, setFilteredRecords] = useState<ReviewRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showReviewerDetails, setShowReviewerDetails] =
    useState<boolean>(false);
  const [selectedReviewerEmail, setSelectedReviewerEmail] =
    useState<string>("");
  const [selectedReviewerName, setSelectedReviewerName] = useState<string>("");

  // Filter records by date range
  useEffect(() => {
    const filtered = sampleReviewRecords.filter((record) => {
      const recordDate = new Date(record.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return recordDate >= start && recordDate <= end;
    });
    setFilteredRecords(filtered);
  }, [startDate, endDate]);

  // Additional filtering by search and category
  const finalFilteredRecords = filteredRecords.filter((record) => {
    const matchesSearch =
      record.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.learnerName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate statistics
  const totalReviews = finalFilteredRecords.length;
  const totalEarnings = totalReviews * 3000; // 3000 VND per review

  // Group by reviewer
  const reviewerStats = finalFilteredRecords.reduce(
    (acc, record) => {
      const reviewerId = record.reviewerEmail;
      if (!acc[reviewerId]) {
        acc[reviewerId] = {
          name: record.reviewerName,
          email: record.reviewerEmail,
          avatar: record.reviewerAvatar,
          reviews: 0,
          earnings: 0,
          averageScore: 0,
        };
      }
      acc[reviewerId].reviews += 1;
      acc[reviewerId].earnings += 3000;
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        email: string;
        avatar: string;
        reviews: number;
        earnings: number;
        averageScore: number;
      }
    >
  );

  // Calculate average scores for each reviewer
  Object.keys(reviewerStats).forEach((reviewerId) => {
    const reviewerRecords = finalFilteredRecords.filter(
      (r) => r.reviewerEmail === reviewerId
    );
    reviewerStats[reviewerId].averageScore =
      reviewerRecords.length > 0
        ? parseFloat(
            (
              reviewerRecords.reduce((sum, r) => sum + r.score, 0) /
              reviewerRecords.length
            ).toFixed(1)
          )
        : 0;
  });

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleViewReviewerDetails = (
    reviewerEmail: string,
    reviewerName: string
  ) => {
    setSelectedReviewerEmail(reviewerEmail);
    setSelectedReviewerName(reviewerName);
    setShowReviewerDetails(true);
  };

  // Get records for selected reviewer
  const selectedReviewerRecords = finalFilteredRecords.filter(
    (record) => record.reviewerEmail === selectedReviewerEmail
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý thu nhập review
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi số lần review và thu nhập trong khoảng thời gian
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng số review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalReviews}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng thu nhập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalEarnings)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Số reviewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(reviewerStats).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {/* <div className="flex justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm theo câu hỏi, reviewer hoặc learner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Từ ngày:
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Đến ngày:
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button
            onClick={() => {
              setStartDate("2024-01-01");
              setEndDate("2024-01-31");
              setSearchTerm("");
            }}
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </div> */}

      {/* Review Records Table */}
      {/* <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
              <TableHead className="text-gray-700 font-semibold">
                Câu hỏi
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Reviewer
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Learner
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Điểm
              </TableHead>

              <TableHead className="text-gray-700 font-semibold">
                Ngày tạo
              </TableHead>
              <TableHead className="text-center text-gray-700 font-semibold">
                Thu nhập
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalFilteredRecords.map((record) => (
              <TableRow
                key={record.id}
                className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
              >
                <TableCell className="max-w-xs">
                  <div className="font-medium text-gray-900 line-clamp-2">
                    {record.question}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {record.id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={record.reviewerAvatar}
                        alt={record.reviewerName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                        {getInitials(record.reviewerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {record.reviewerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.reviewerEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={record.learnerAvatar}
                        alt={record.learnerName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs">
                        {getInitials(record.learnerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {record.learnerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.learnerEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`font-semibold ${getScoreColor(
                      record.score,
                      record.maxScore
                    )}`}
                  >
                    {record.score}/{record.maxScore}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-gray-600">
                    {record.createdAt}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-semibold text-green-600">
                    {formatCurrency(3000)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}

      {/* Reviewer Statistics */}
      {Object.keys(reviewerStats).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Thống kê theo Reviewer</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters for Reviewer Statistics */}
            <div className="flex justify-between gap-4 mb-4">
              <Input
                placeholder="Tìm kiếm theo tên reviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Từ ngày:
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Đến ngày:
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>

                <Button
                  onClick={() => {
                    setStartDate("2024-01-01");
                    setEndDate("2024-01-31");
                    setSearchTerm("");
                  }}
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 font-semibold">
                      Reviewer
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      Số review
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      Thu nhập
                    </TableHead>
                    <TableHead className="text-center text-gray-700 font-semibold">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(reviewerStats).map((reviewer, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={reviewer.avatar}
                              alt={reviewer.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                              {getInitials(reviewer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {reviewer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reviewer.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-blue-600">
                          {reviewer.reviews}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(reviewer.earnings)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleViewReviewerDetails(
                              reviewer.email,
                              reviewer.name
                            )
                          }
                          className="text-xs"
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          Hiển thị 1-{finalFilteredRecords.length} trong tổng số{" "}
          {finalFilteredRecords.length} review
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Sau
          </Button>
        </div>
      </div>

      {/* Reviewer Details Modal */}
      {showReviewerDetails && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Chi tiết review của {selectedReviewerName}
                    </h2>
                    <p className="text-blue-100">
                      {selectedReviewerEmail} • {selectedReviewerRecords.length}{" "}
                      review
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowReviewerDetails(false)}
                  className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full"
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

            {/* Content */}
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-4  md:grid-cols-2   gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Tổng số review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedReviewerRecords.length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Tổng thu nhập
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedReviewerRecords.length * 3000)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review Records Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                      <TableHead className="text-gray-700 font-semibold">
                        Câu hỏi
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Learner
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Điểm
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Ngày tạo
                      </TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">
                        Thu nhập
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReviewerRecords.map((record) => (
                      <TableRow
                        key={record.id}
                        className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <TableCell className="max-w-xs">
                          <div className="font-medium text-gray-900 line-clamp-2">
                            {record.question}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {record.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={record.learnerAvatar}
                                alt={record.learnerName}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs">
                                {getInitials(record.learnerName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {record.learnerName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {record.learnerEmail}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-semibold ${getScoreColor(
                              record.score,
                              record.maxScore
                            )}`}
                          >
                            {record.score}/{record.maxScore}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {record.createdAt}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-semibold text-green-600">
                            {formatCurrency(3000)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedReviewerRecords.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <div className="text-gray-500 text-lg font-medium">
                    Chưa có review nào
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Reviewer này chưa thực hiện review nào trong khoảng thời
                    gian đã chọn
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewMoneyManagement;
