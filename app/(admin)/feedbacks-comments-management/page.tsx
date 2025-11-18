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
import { useState, useEffect } from "react";

// Type definitions
interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  userType: "learner" | "mentor";
}

interface FeedbackTarget {
  type: "mentor" | "package";
  id: string;
  name: string;
}

interface Feedback {
  feedbackId: string;
  reviewer: User;
  target: FeedbackTarget;
  rating: number; // 1-5 stars
  content: string;
  createdAt: string;
  status: "approved" | "rejected";
  type: "feedback" | "comment";
}

const sampleFeedbacks: Feedback[] = [
  {
    feedbackId: "FB001",
    reviewer: {
      id: "L001",
      fullName: "Nguyễn Văn An",
      email: "an@gmail.com",
      userType: "learner",
    },
    target: {
      type: "mentor",
      id: "M001",
      name: "Ms. Sarah Johnson",
    },
    rating: 5,
    content:
      "Cô Sarah dạy rất tốt, phát âm chuẩn và nhiệt tình hướng dẫn. Tôi đã cải thiện được rất nhiều sau 1 tháng học.",
    createdAt: "2025-09-20T10:30:00Z",
    status: "approved",
    type: "feedback",
  },
  {
    feedbackId: "FB002",
    reviewer: {
      id: "L002",
      fullName: "Trần Thị Bình",
      email: "binh@email.com",
      userType: "learner",
    },
    target: {
      type: "mentor",
      id: "M002",
      name: "Mr. David Wilson",
    },
    rating: 2,
    content:
      "Mentor này không professional lắm, hay cancel class và attitude không tốt. Tôi không recommend.",
    createdAt: "2025-09-19T14:20:00Z",
    status: "rejected",
    type: "feedback",
  },
  {
    feedbackId: "FB003",
    reviewer: {
      id: "L003",
      fullName: "Lê Minh Hoàng",
      email: "hoang@yahoo.com",
      userType: "learner",
    },
    target: {
      type: "package",
      id: "PKG001",
      name: "Basic English Conversation",
    },
    rating: 4,
    content:
      "Package khá ổn, content phong phú. Chỉ có điều giá hơi cao so với thị trường.",
    createdAt: "2025-09-18T09:15:00Z",
    status: "approved",
    type: "feedback",
  },
  {
    feedbackId: "FB004",
    reviewer: {
      id: "L004",
      fullName: "Phạm Thu Dung",
      email: "dung@hotmail.com",
      userType: "learner",
    },
    target: {
      type: "mentor",
      id: "M003",
      name: "Ms. Emily Chen",
    },
    rating: 1,
    content:
      "This mentor is completely unprofessional and rude. Waste of money and time!",
    createdAt: "2025-09-17T20:45:00Z",
    status: "rejected",
    type: "feedback",
  },
  {
    feedbackId: "FB005",
    reviewer: {
      id: "L006",
      fullName: "Nguyễn Thị Lan",
      email: "lan@outlook.com",
      userType: "learner",
    },
    target: {
      type: "package",
      id: "PKG003",
      name: "IELTS Preparation Package",
    },
    rating: 5,
    content:
      "Excellent course! Very comprehensive materials and the practice tests are exactly like the real IELTS exam. Highly recommended!",
    createdAt: "2025-09-16T11:30:00Z",
    status: "approved",
    type: "comment",
  },
  {
    feedbackId: "FB006",
    reviewer: {
      id: "L007",
      fullName: "Vũ Minh Khôi",
      email: "khoi@yahoo.com",
      userType: "learner",
    },
    target: {
      type: "mentor",
      id: "M001",
      name: "Ms. Sarah Johnson",
    },
    rating: 3,
    content:
      "Okay mentor but sometimes hard to understand her accent. Teaching method is good though.",
    createdAt: "2025-09-15T16:20:00Z",
    status: "approved",
    type: "comment",
  },
  {
    feedbackId: "FB007",
    reviewer: {
      id: "L008",
      fullName: "Đặng Thị Hạnh",
      email: "hanh@gmail.com",
      userType: "learner",
    },
    target: {
      type: "package",
      id: "PKG002",
      name: "Business English Premium",
    },
    rating: 4,
    content:
      "Great package for business professionals. The role-play sessions are very practical and useful for real-world scenarios.",
    createdAt: "2025-09-14T13:45:00Z",
    status: "approved",
    type: "feedback",
  },
  {
    feedbackId: "FB008",
    reviewer: {
      id: "L009",
      fullName: "Trần Văn Tùng",
      email: "tung@hotmail.com",
      userType: "learner",
    },
    target: {
      type: "mentor",
      id: "M005",
      name: "Ms. Lisa Wang",
    },
    rating: 5,
    content:
      "Amazing mentor! Very patient and always explains things clearly. My speaking confidence has improved dramatically.",
    createdAt: "2025-09-13T10:15:00Z",
    status: "approved",
    type: "feedback",
  },
  {
    feedbackId: "FB009",
    reviewer: {
      id: "L010",
      fullName: "Lê Thị Mai",
      email: "mai@gmail.com",
      userType: "learner",
    },
    target: {
      type: "package",
      id: "PKG004",
      name: "Advanced Speaking Package",
    },
    rating: 4,
    content:
      "The speaking exercises are very challenging and helpful. Good value for money but could use more interactive elements.",
    createdAt: "2025-09-12T14:30:00Z",
    status: "approved",
    type: "feedback",
  },
  {
    feedbackId: "FB010",
    reviewer: {
      id: "L011",
      fullName: "Nguyễn Quang Minh",
      email: "minh@yahoo.com",
      userType: "learner",
    },
    target: {
      type: "mentor",
      id: "M006",
      name: "Mr. James Smith",
    },
    rating: 2,
    content:
      "Mentor often comes late to sessions and doesn't prepare well. Not satisfied with the service quality.",
    createdAt: "2025-09-11T09:45:00Z",
    status: "rejected",
    type: "comment",
  },
];

const FeedbacksCommentsManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter feedbacks
  const filteredFeedbacks = sampleFeedbacks.filter((feedback) => {
    const matchesSearch = feedback.content
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || feedback.status === statusFilter;

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
  //   if (selectedRows.length === filteredFeedbacks.length) {
  //     setSelectedRows([]);
  //   } else {
  //     setSelectedRows(filteredFeedbacks.map((_, idx) => idx));
  //   }
  // };

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailsModal(true);
  };

  const handleAction = (feedback: Feedback, _action: "reject") => {
    setSelectedFeedback(feedback);
    setShowActionModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        fill={i < rating ? "#fbbf24" : "#e5e7eb"}
        viewBox="0 0 24 24"
        className="inline"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString("vi-VN") +
      " " +
      new Date(dateString).toLocaleTimeString("vi-VN")
    );
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
          
          <Input
            placeholder="Tìm theo nội dung..."
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
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </select>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{sampleFeedbacks.length}</div>
            <p className="text-xs text-muted-foreground">Tổng số phản hồi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {sampleFeedbacks.filter((f) => f.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Đã duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {sampleFeedbacks.filter((f) => f.status === "rejected").length}
            </div>
            <p className="text-xs text-muted-foreground">Bị từ chối</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {(
                sampleFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
                sampleFeedbacks.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Điểm trung bình</p>
          </CardContent>
        </Card>
      </div>

      {/* Bảng phản hồi */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lí phản hồi & bình luận</CardTitle>
          <CardDescription>
            Hiển thị {filteredFeedbacks.length} trên {sampleFeedbacks.length}{" "}
            phản hồi và bình luận
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                
                <TableHead>ID</TableHead>
                <TableHead>Người đánh giá</TableHead>
                <TableHead>Mục tiêu</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedbacks.map((feedback) => (
                <TableRow key={feedback.feedbackId}>
                  
                  <TableCell>
                    <span className="font-mono text-sm">
                      {feedback.feedbackId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {feedback.reviewer.fullName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {feedback.reviewer.email}
                      </span>
                      <Badge variant="outline" className="w-fit text-xs mt-1">
                        {feedback.reviewer.userType === "learner"
                          ? "người học"
                          : "người hướng dẫn"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {feedback.target.name}
                      </span>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {feedback.target.type === "mentor"
                          ? "người hướng dẫn"
                          : "gói dịch vụ"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                      <span className="ml-2 text-sm font-medium">
                        ({feedback.rating})
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm">
                    {formatDate(feedback.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        feedback.status === "approved"
                          ? "default"
                          : feedback.status === "rejected"
                          ? "destructive"
                          : feedback.status === "pending"
                          ? "secondary"
                          : feedback.status === "hidden"
                          ? "outline"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {feedback.status === "approved"
                        ? "đã duyệt"
                        : feedback.status === "rejected"
                        ? "bị từ chối"
                        : feedback.status}
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
                            openDropdownId === feedback.feedbackId
                              ? null
                              : feedback.feedbackId
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
                      {openDropdownId === feedback.feedbackId && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => {
                                handleViewDetails(feedback);
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
                              Xem chi tiết
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              onClick={() => {
                                handleAction(feedback, "reject");
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
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Từ chối
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

      {/* Modal xác nhận từ chối */}
      {showActionModal && selectedFeedback && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-red-600"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Từ chối phản hồi
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc muốn từ chối phản hồi này? Hành động này không thể
                  hoàn tác.
                </p>
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Người dùng:</strong>{" "}
                    {selectedFeedback.reviewer.fullName}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Nội dung:</strong>{" "}
                    {selectedFeedback.content.length > 100
                      ? `${selectedFeedback.content.substring(0, 100)}...`
                      : selectedFeedback.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center px-4 py-3 gap-3">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedFeedback(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-auto hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    // Handle reject logic here
                    console.log(
                      "Rejecting feedback:",
                      selectedFeedback.feedbackId
                    );
                    setShowActionModal(false);
                    setSelectedFeedback(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết */}
      {showDetailsModal && selectedFeedback && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Chi tiết phản hồi
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedFeedback(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người dùng
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900">
                      {selectedFeedback.reviewer.fullName}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điểm
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          fill={
                            i < selectedFeedback.rating
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          className="text-yellow-500"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({selectedFeedback.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedFeedback.type === "feedback"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedFeedback.type === "feedback"
                        ? "Phản hồi"
                        : "Bình luận"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedFeedback.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedFeedback.status === "approved"
                        ? "Đã duyệt"
                        : "Bị từ chối"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <div className="p-3 bg-gray-50 rounded-md max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedFeedback.content}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày gửi
                </label>
                <div className="p-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900">
                    {new Date(selectedFeedback.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedFeedback(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbacksCommentsManagement;
