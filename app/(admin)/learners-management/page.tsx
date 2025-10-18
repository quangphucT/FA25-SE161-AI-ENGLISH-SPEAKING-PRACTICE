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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Type definitions
interface Package {
  name: string;
  duration: string;
  price: string;
  status: "Active" | "Completed" | "Expired";
}

interface Achievement {
  name: string;
  description: string;
  points: number;
  icon: string;
  date: string;
  requirement: string;
}

interface Learner {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  pronunciationScore: number;
  favouriteLevelGoal: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  status: "Active" | "Inactive" | "IsBanned";
  joinedDate: string;
  phoneNumber: string;
  totalLessons: number;
  purchasedPackages: Package[];
  achievements: Achievement[];
}

const sampleLearners: Learner[] = [
  {
    id: "L001",
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 8.5,
    favouriteLevelGoal: "Intermediate",
    status: "Active",
    joinedDate: "2024-01-15",
    phoneNumber: "0909090909",
    totalLessons: 45,
    purchasedPackages: [
      {
        name: "Premium",
        duration: "60 days",
        price: "1,000,000 VND",
        status: "Active",
      },
      {
        name: "IELTS Preparation",
        duration: "30 days",
        price: "800,000 VND",
        status: "Completed",
      },
      {
        name: "IELTS Preparation",
        duration: "30 days",
        price: "800,000 VND",
        status: "Completed",
      },  
    ],
    achievements: [
      {
        name: "Good Pronunciation",
        description: "Achieved 70%+ accuracy in 5 lessons",
        points: 40,
        icon: "�",
        date: "2025-09-30",
        requirement: "5 lessons ≥70% accuracy",
      },
      {
        name: "Great Pronunciation",
        description: "Achieved 80%+ accuracy in 5 lessons",
        points: 60,
        icon: "⭐",
        date: "2025-08-25",
        requirement: "5 lessons ≥80% accuracy",
      },
      {
        name: "Perfect Pronunciation",
        description: "Achieved 90%+ accuracy in 5 lessons",
        points: 80,
        icon: "🎯",
        date: "2025-08-15",
        requirement: "5 lessons ≥90% accuracy",
      },
    ],
  },
  {
    id: "L002",
    fullName: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 7.2,
    favouriteLevelGoal: "Advanced",
    status: "IsBanned",
    joinedDate: "2024-02-20",
    phoneNumber: "0909090909",
    totalLessons: 32,
    purchasedPackages: [
      {
        name: "Starter",
        duration: "30 days",
        price: "500,000 VND",
        status: "Active",
      },
    ],
    achievements: [
      {
        name: "First Steps",
        description: "Completed first 10 lessons",
        points: 30,
        icon: "🌟",
        date: "2025-07-10",
        requirement: "Complete 10 lessons",
      },
      {
        name: "Good Pronunciation",
        description: "Achieved 70%+ accuracy in 5 lessons",
        points: 50,
        icon: "🗣️",
        date: "2025-08-05",
        requirement: "5 lessons ≥70% accuracy",
      },
    ],
  },
  {
    id: "L003",
    fullName: "Lê Minh Cường",
    email: "leminhcuong@yahoo.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 6.8,
    favouriteLevelGoal: "Beginner",
    status: "Inactive",
    joinedDate: "2023-12-05",
    phoneNumber: "0909090909",
    totalLessons: 18,
    purchasedPackages: [
      {
        name: "Basic English",
        duration: "15 days",
        price: "300,000 VND",
        status: "Expired",
      },
    ],
    achievements: [],
  },
  {
    id: "L004",
    fullName: "Phạm Thu Dung",
    email: "phamthudung@hotmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 9.1,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-03-10",
    phoneNumber: "0909090909",
    totalLessons: 67,
    purchasedPackages: [
      {
        name: "Premium Plus",
        duration: "90 days",
        price: "1,500,000 VND",
        status: "Active",
      },
      {
        name: "Business English",
        duration: "45 days",
        price: "900,000 VND",
        status: "Completed",
      },
    ],
    achievements: [
      {
        name: "Expert Speaker",
        description: "Achieved 95%+ accuracy in 10 lessons",
        points: 100,
        icon: "🎓",
        date: "2025-09-01",
        requirement: "10 lessons ≥95% accuracy (Native Speaker Level)",
      },
      {
        name: "Consistency King",
        description: "Completed lessons for 30 days straight",
        points: 75,
        icon: "📚",
        date: "2025-08-20",
        requirement: "30 consecutive days learning",
      },
      {
        name: "Perfect Pronunciation",
        description: "Achieved 90%+ accuracy in 5 lessons",
        points: 80,
        icon: "🎯",
        date: "2025-07-15",
        requirement: "5 lessons ≥90% accuracy",
      },
    ],
  },
  {
    id: "L005",
    fullName: "Hoàng Văn Em",
    email: "hoangvanem@gmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 5.9,
    favouriteLevelGoal: "Intermediate",
    status: "Inactive",
    joinedDate: "2024-01-30",
    phoneNumber: "0909090909",
    totalLessons: 12,
    purchasedPackages: [],
    achievements: [],
  },
  {
    id: "L006",
    fullName: "Đỗ Thị Hoa",
    email: "dothihoa@gmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 7.8,
    favouriteLevelGoal: "Advanced",
    status: "Active",
    joinedDate: "2024-04-12",
    phoneNumber: "0909090909",
    totalLessons: 38,
    purchasedPackages: [
      {
        name: "IELTS Premium",
        duration: "60 days",
        price: "1,200,000 VND",
        status: "Active",
      },
    ],
    achievements: [
      {
        name: "Good Pronunciation",
        description: "Achieved 70%+ accuracy in 5 lessons",
        points: 40,
        icon: "🌟",
        date: "2025-06-15",
        requirement: "5 lessons ≥70% accuracy",
      },
      {
        name: "Weekly Warrior",
        description: "Completed 7 days streak",
        points: 35,
        icon: "🔥",
        date: "2025-07-20",
        requirement: "7 consecutive days learning",
      },
    ],
  },
  {
    id: "L007",
    fullName: "Vũ Minh Khôi",
    email: "vuminhkhoi@yahoo.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 8.9,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-05-08",
    phoneNumber: "0909090909",
    totalLessons: 52,
    purchasedPackages: [
      {
        name: "Business Pro",
        duration: "90 days",
        price: "1,800,000 VND",
        status: "Active",
      },
      {
        name: "Speaking Mastery",
        duration: "45 days",
        price: "750,000 VND",
        status: "Completed",
      },
    ],
    achievements: [
      {
        name: "Perfect Pronunciation",
        description: "Achieved 90%+ accuracy in 5 lessons",
        points: 80,
        icon: "🎯",
        date: "2025-08-10",
        requirement: "5 lessons ≥90% accuracy",
      },
      {
        name: "Speed Learner",
        description: "Completed 20 lessons in 10 days",
        points: 65,
        icon: "⚡",
        date: "2025-07-25",
        requirement: "High learning velocity",
      },
    ],
  },
  {
    id: "L008",
    fullName: "Bùi Thị Lan",
    email: "buithilan@outlook.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 6.3,
    favouriteLevelGoal: "Intermediate",
    status: "Active",
    joinedDate: "2024-06-20",
    phoneNumber: "0909090909",
    totalLessons: 24,
    purchasedPackages: [
      {
        name: "Standard",
        duration: "30 days",
        price: "600,000 VND",
        status: "Active",
      },
    ],
    achievements: [
      {
        name: "First Steps",
        description: "Completed first 10 lessons",
        points: 30,
        icon: "🌟",
        date: "2025-08-01",
        requirement: "Complete 10 lessons",
      },
    ],
  },
  {
    id: "L009",
    fullName: "Ngô Văn Minh",
    email: "ngovanminh@gmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 9.3,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-02-14",
    phoneNumber: "0909090909",
    totalLessons: 78,
    purchasedPackages: [
      {
        name: "Ultimate",
        duration: "120 days",
        price: "2,200,000 VND",
        status: "Active",
      },
      {
        name: "TOEFL Prep",
        duration: "60 days",
        price: "1,100,000 VND",
        status: "Completed",
      },
      {
        name: "Advanced Grammar",
        duration: "30 days",
        price: "500,000 VND",
        status: "Completed",
      },
    ],
    achievements: [
      {
        name: "Expert Speaker",
        description: "Achieved 95%+ accuracy in 10 lessons",
        points: 100,
        icon: "🎓",
        date: "2025-09-05",
        requirement: "10 lessons ≥95% accuracy (Native Speaker Level)",
      },
      {
        name: "Perfect Pronunciation",
        description: "Achieved 90%+ accuracy in 5 lessons",
        points: 80,
        icon: "🎯",
        date: "2025-08-01",
        requirement: "5 lessons ≥90% accuracy",
      },
      {
        name: "Marathon Runner",
        description: "Completed 50+ lessons",
        points: 90,
        icon: "🏃‍♂️",
        date: "2025-09-10",
        requirement: "Complete 50+ lessons",
      },
    ],
  },
  {
    id: "L010",
    fullName: "Lương Thị Phương",
    email: "luongthiphuong@hotmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 5.4,
    favouriteLevelGoal: "Beginner",
    status: "Inactive",
    joinedDate: "2024-03-25",
    phoneNumber: "0909090909",
    totalLessons: 8,
    purchasedPackages: [
      {
        name: "Basic Starter",
        duration: "15 days",
        price: "250,000 VND",
        status: "Expired",
      },
    ],
    achievements: [],
  },
  {
    id: "L011",
    fullName: "Trịnh Văn Đức",
    email: "trinhvanduc@gmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 7.5,
    favouriteLevelGoal: "Advanced",
    status: "Active",
    joinedDate: "2024-07-10",
    phoneNumber: "0909090909",
    totalLessons: 29,
    purchasedPackages: [
      {
        name: "Intensive",
        duration: "45 days",
        price: "850,000 VND",
        status: "Active",
      },
    ],
    achievements: [
      {
        name: "Good Pronunciation",
        description: "Achieved 70%+ accuracy in 5 lessons",
        points: 40,
        icon: "🌟",
        date: "2025-08-15",
        requirement: "5 lessons ≥70% accuracy",
      },
      {
        name: "Dedicated Learner",
        description: "Logged in 15 consecutive days",
        points: 45,
        icon: "💪",
        date: "2025-09-01",
        requirement: "15 consecutive days active",
      },
    ],
  },
  {
    id: "L012",
    fullName: "Phạm Thị Mai",
    email: "phamthimai@yahoo.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 8.2,
    favouriteLevelGoal: "Advanced",
    status: "Active",
    joinedDate: "2024-08-05",
    phoneNumber: "0909090909",
    totalLessons: 41,
    purchasedPackages: [
      {
        name: "Premium",
        duration: "60 days",
        price: "1,000,000 VND",
        status: "Active",
      },
      {
        name: "Conversation Plus",
        duration: "30 days",
        price: "650,000 VND",
        status: "Active",
      },
    ],
    achievements: [
      {
        name: "Great Pronunciation",
        description: "Achieved 80%+ accuracy in 5 lessons",
        points: 60,
        icon: "⭐",
        date: "2025-09-12",
        requirement: "5 lessons ≥80% accuracy",
      },
      {
        name: "Social Butterfly",
        description: "Participated in 20+ conversations",
        points: 55,
        icon: "🦋",
        date: "2025-09-18",
        requirement: "20+ conversation sessions",
      },
    ],
  },
  {
    id: "L013",
    fullName: "Đinh Văn Hùng",
    email: "dinhvanhung@outlook.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 6.9,
    favouriteLevelGoal: "Intermediate",
    status: "Inactive",
    joinedDate: "2023-11-18",
    phoneNumber: "0909090909",
    totalLessons: 15,
    purchasedPackages: [
      {
        name: "Standard",
        duration: "30 days",
        price: "600,000 VND",
        status: "Expired",
      },
    ],
    achievements: [
      {
        name: "First Steps",
        description: "Completed first 10 lessons",
        points: 30,
        icon: "🌟",
        date: "2024-01-05",
        requirement: "Complete 10 lessons",
      },
    ],
  },
  {
    id: "L014",
    fullName: "Võ Thị Thu",
    email: "vothithu@gmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 8.7,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-09-01",
    phoneNumber: "0909090909",
    totalLessons: 19,
    purchasedPackages: [
      {
        name: "Fast Track",
        duration: "30 days",
        price: "900,000 VND",
        status: "Active",
      },
    ],
    achievements: [
      {
        name: "Quick Start",
        description: "Completed 15 lessons in first week",
        points: 50,
        icon: "🚀",
        date: "2025-09-08",
        requirement: "15 lessons in 7 days",
      },
    ],
  },
  {
    id: "L015",
    fullName: "Hồ Văn Tài",
    email: "hovantai@hotmail.com",
    avatar: "https://via.placeholder.com/150",
    pronunciationScore: 7.1,
    favouriteLevelGoal: "Intermediate",
    status: "Active",
    joinedDate: "2024-04-28",
    phoneNumber: "0909090909",
    totalLessons: 33,
    purchasedPackages: [
      {
        name: "Regular",
        duration: "45 days",
        price: "700,000 VND",
        status: "Active",
      },
    ],
    achievements: [
      {
        name: "Good Pronunciation",
        description: "Achieved 70%+ accuracy in 5 lessons",
        points: 40,
        icon: "🌟",
        date: "2025-07-12",
        requirement: "5 lessons ≥70% accuracy",
      },
      {
        name: "Steady Progress",
        description: "Consistent learning for 20 days",
        points: 40,
        icon: "📈",
        date: "2025-08-28",
        requirement: "20 days consistent learning",
      },
    ],
  },
];

const LearnerManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");
  const [learnerToAction, setLearnerToAction] = useState<Learner | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter learners by search and status
  const filteredLearners = sampleLearners.filter((learner) => {
    const matchesName = learner.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = learner.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(
      selectedRows.includes(idx)
        ? selectedRows.filter((i) => i !== idx)
        : [...selectedRows, idx]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredLearners.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredLearners.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (learner: Learner) => {
    setSelectedLearner(learner);
    setShowDetailsModal(true);
  };

  const handleBlockUnblock = (
    learner: Learner,
    action: "block" | "unblock"
  ) => {
    setLearnerToAction(learner);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    // Here you would make the API call to block/unblock the user
    console.log(`${actionType}ing user:`, learnerToAction);
    setShowConfirmDialog(false);
    setLearnerToAction(null);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setOpenDropdownId(null);
    }
  };
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            placeholder="Tìm theo mã, họ tên, email hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-lg"
          />
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="Active">Hoạt động</TabsTrigger>
              <TabsTrigger value="Inactive">Ngưng hoạt động</TabsTrigger>
              <TabsTrigger value="IsBanned">Bị chặn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
              
              <TableHead className="text-gray-700 font-semibold">
                Thông tin
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Họ tên
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Liên hệ
              </TableHead>

              <TableHead className="text-gray-700 font-semibold">
                Trạng thái
              </TableHead>
              <TableHead className="text-center text-gray-700 font-semibold">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLearners.map((learner, idx) => (
              <TableRow
                key={learner.id}
                className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
              >
                
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                        <AvatarImage
                          src={learner.avatar}
                          alt={learner.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                          {getInitials(learner.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                          learner.status === "Active"
                            ? "bg-green-500"
                            : learner.status === "Inactive"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-semibold text-sm">
                        {learner.id}
                      </div>
                      {/* <div className="text-gray-500 text-xs">Learner</div> */}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {learner.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  <div className="flex flex-col">
                    <span className="text-sm">{learner.email}</span>
                    <span className="text-xs text-gray-500">
                      {learner.phoneNumber}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      learner.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      learner.status === "Active"
                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                        : learner.status === "Inactive"
                        ? "bg-gray-100 text-gray-600 border-gray-200"
                        : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                        
                    }
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          learner.status === "Active"
                            ? "bg-green-500"
                            : learner.status === "Inactive"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                      ></div>
                      {learner.status === "Active"
                        ? "Hoạt động"
                        : learner.status === "Inactive"
                        ? "Ngưng hoạt động"
                        : "Bị chặn"}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === learner.id ? null : learner.id
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

                    {openDropdownId === learner.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 ">
                        <div className="py-1 ">
                          <button
                            onClick={() => {
                              handleViewDetails(learner);
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
                              handleBlockUnblock(
                                learner,
                                learner.status === "Active" || learner.status === "Inactive" 
                                  ? "block"
                                  : "unblock"
                              );
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              learner.status === "Active" || learner.status === "Inactive" 
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {learner.status === "Active" || learner.status === "Inactive" ? (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  className="inline mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="10"
                                    rx="2"
                                  />
                                  <circle cx="12" cy="16" r="1" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Chặn người dùng
                              </>
                            ) : (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  className="inline mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="10"
                                    rx="2"
                                  />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Bỏ chặn người dùng
                              </>
                            )}
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

      {/* Phân trang & Thông tin */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>
          NGƯỜI HỌC HOẠT ĐỘNG:{" "}
          {filteredLearners.filter((l) => l.status === "Active").length}/
          {filteredLearners.length}
        </div>
        <div>
          Hàng mỗi trang: <span className="font-semibold">10</span> &nbsp; 1-10
          trên {filteredLearners.length}
        </div>
      </div>

      {/* Chi tiết người học */}
      {showDetailsModal && selectedLearner && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thông tin chi tiết người học
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

            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Mã:</span>{" "}
                      {selectedLearner.id}
                    </div>
                    <div>
                      <span className="font-medium">Họ tên:</span>{" "}
                      {selectedLearner.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedLearner.email}
                    </div>
                    <div>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {selectedLearner.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <Badge
                        className={`ml-2 ${
                          selectedLearner.status === "Active" || selectedLearner.status === "Inactive" || selectedLearner.status === "IsBanned"
                            ? "bg-green-600"
                            : selectedLearner.status === "Inactive"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                      >
                        {selectedLearner.status === "Active" || selectedLearner.status === "Inactive" || selectedLearner.status === "IsBanned"
                          ? "Hoạt động"
                          : selectedLearner.status === "Inactive" || selectedLearner.status === "IsBanned"
                          ? "Ngưng hoạt động"
                          : "Bị chặn"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Ngày tham gia:</span>{" "}
                      {selectedLearner.joinedDate}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    {/* Mục tiêu cấp độ */}
                    <div>
                      <span className="font-medium">Trình độ phát âm:</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          {selectedLearner.favouriteLevelGoal}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {selectedLearner.favouriteLevelGoal === "Beginner" &&
                            "(Mới bắt đầu)"}
                          {selectedLearner.favouriteLevelGoal ===
                            "Intermediate" && "(Trung bình)"}
                          {selectedLearner.favouriteLevelGoal === "Advanced" &&
                            "(Nâng cao)"}
                          {selectedLearner.favouriteLevelGoal === "Expert" &&
                            "(Chuyên gia)"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Điểm đánh giá:</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          {selectedLearner.pronunciationScore}
                        </Badge>
                      </div>
                    </div>
                    {/* Trạng thái gói */}
                    <div>
                      <span className="font-medium">Gói học hiện tại:</span>
                      <div className="mt-2">
                        {selectedLearner.purchasedPackages.filter(
                          (pkg) => pkg.status === "Active"
                        ).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedLearner.purchasedPackages
                              .filter((pkg) => pkg.status === "Active")
                              .map((pkg, index) => (
                                <Badge
                                  key={index}
                                  className="bg-green-100 text-green-800 border-green-300"
                                >
                                  ✅ {pkg.name}
                                </Badge>
                              ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Không có gói hoạt động
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchased Packages */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Các gói dịch vụ đã mua
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{selectedLearner.purchasedPackages.length} gói</span>
                    <span>•</span>
                    <span>
                      {
                        selectedLearner.purchasedPackages.filter(
                          (pkg) => pkg.status === "Active"
                        ).length
                      }{" "}
                      đang học
                    </span>
                  </div>
                </div>

                {selectedLearner.purchasedPackages.length > 0 ? (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {selectedLearner.purchasedPackages.map(
                        (pkg: Package, index: number) => (
                          <CarouselItem
                            key={index}
                            className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                          >
                            <Card
                              className={`border-2 shadow-lg transition-all duration-300 hover:shadow-xl h-full ${
                                pkg.status === "Active"
                                  ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                                  : pkg.status === "Completed"
                                  ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                                  : "border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50"
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle
                                    className={`text-lg font-bold ${
                                      pkg.status === "Active"
                                        ? "text-green-700"
                                        : pkg.status === "Completed"
                                        ? "text-blue-700"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {pkg.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        pkg.status === "Active"
                                          ? "bg-green-500 animate-pulse"
                                          : pkg.status === "Completed"
                                          ? "bg-blue-500"
                                          : "bg-gray-400"
                                      }`}
                                    ></div>
                                    <Badge
                                      className={`text-xs font-medium ${
                                        pkg.status === "Active"
                                          ? "bg-green-100 text-green-700 border-green-300"
                                          : pkg.status === "Completed"
                                          ? "bg-blue-100 text-blue-700 border-blue-300"
                                          : "bg-gray-100 text-gray-600 border-gray-300"
                                      }`}
                                    >
                                      {pkg.status === "Active"
                                        ? "Đang học"
                                        : pkg.status === "Completed"
                                        ? "Hoàn thành"
                                        : "Hết hạn"}
                                    </Badge>
                                  </div>
                                </div>
                                <CardDescription className="text-sm text-gray-600">
                                  {pkg.duration} • {pkg.price}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                {pkg.status === "Active" ? (
                                  <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg text-center">
                                      <div className="text-2xl font-bold">
                                        25
                                      </div>
                                      <div className="text-sm opacity-90">
                                        ngày còn lại
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                          Tiến độ
                                        </span>
                                        <span className="font-semibold text-green-600">
                                          83%
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                          style={{ width: "83%" }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <span>Bắt đầu: 15/01/2024</span>
                                      <span>Kết thúc: 15/03/2024</span>
                                    </div>
                                  </div>
                                ) : pkg.status === "Completed" ? (
                                  <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg text-center">
                                      <div className="text-lg font-bold">
                                        ✅ Hoàn thành
                                      </div>
                                      <div className="text-sm opacity-90">
                                        Đã kết thúc
                                      </div>
                                    </div>
                                    <div className="text-center text-sm text-gray-600">
                                      Gói đã được hoàn thành thành công
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-4 rounded-lg text-center">
                                      <div className="text-lg font-bold">
                                        ⏰ Hết hạn
                                      </div>
                                      <div className="text-sm opacity-90">
                                        Đã kết thúc
                                      </div>
                                    </div>
                                    <div className="text-center text-sm text-gray-600">
                                      Gói đã hết hạn, cần gia hạn
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 bg-white/80 hover:bg-white shadow-lg" />
                    <CarouselNext className="right-4 bg-white/80 hover:bg-white shadow-lg" />
                  </Carousel>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <div className="text-gray-500 text-lg font-medium">
                      Chưa mua gói nào
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                      Học viên chưa đăng ký gói học nào
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && learnerToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận {actionType === "block" ? "Block" : "Unblock"} Người dùng
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn {actionType}{" "}
              <strong>{learnerToAction.fullName}</strong> không?
              {actionType === "block"
                ? " Thao tác này sẽ ngăn họ truy cập vào nền tảng."
                : " Thao tác này sẽ khôi phục quyền truy cập vào nền tảng của họ."}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                className={
                  actionType === "block"
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }
              >
                {actionType === "block" ? "Block User" : "Unblock User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerManagement;
