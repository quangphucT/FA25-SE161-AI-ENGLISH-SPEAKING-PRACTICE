"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, Line } from "react-chartjs-2";
import Image from "next/image";
import { FaBox, FaChartLine, FaClock, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
interface Certificate {
  id: string;
  name: string;
  imageUrl: string;
}
interface ReviewerApplicant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  level: string;
  experienceYears: number;
  status: "Chờ duyệt" | "Đã duyệt" | "Không duyệt";
  joinedDate: string;
  certificates?: Certificate[];
}

const PageStatistics = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, idx) => currentYear - idx
  );

  // Dữ liệu mẫu cho biểu đồ cột theo từng năm
  const packageData: { [key: number]: number[] } = {
    2025: [20, 40, 35, 50, 64, 30, 45, 60, 55, 122, 42, 38],
    2024: [15, 35, 30, 45, 58, 25, 40, 55, 50, 43, 37, 33],
    2023: [18, 38, 32, 47, 61, 28, 42, 58, 52, 45, 39, 35],
  };

  // Dữ liệu doanh thu theo tháng (đơn vị: K)
  const revenueData: { [key: number]: number[] } = {
    2025: [104, 82, 120, 36, 62, 22, 19, 24, 21, 17, 15, 23],
    2024: [12, 7, 10, 14, 24, 20, 17, 22, 19, 15, 13, 21],
    2023: [15, 9, 13, 17, 28, 24, 21, 26, 23, 19, 17, 25],
  };

  // Tính toán động trục Y dựa trên dữ liệu của năm đang chọn
  const currentPackages = packageData[selectedYear] || new Array(12).fill(0);
  const currentRevenue = revenueData[selectedYear] || new Array(12).fill(0);
  const maxPackages = Math.max(...currentPackages);
  const maxRevenue = Math.max(...currentRevenue);
  const packagesYMax = Math.max(10, Math.ceil((maxPackages || 0) * 1.2));
  const revenueYMax = Math.max(10, Math.ceil((maxRevenue || 0) * 1.2));
  const packagesStep = Math.max(1, Math.ceil(packagesYMax / 5));
  const revenueStep = Math.max(1, Math.ceil(revenueYMax / 5));

  // Reviewers awaiting participation approval
  const [reviewerApplicants, setReviewerApplicants] = useState<
    ReviewerApplicant[]
  >([
    {
      id: "MN-1001",
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      level: "C1",
      experienceYears: 5,
      status: "Chờ duyệt",
      joinedDate: "2025-09-15",
      certificates: [
        {
          id: "cert-ielts-trainer",
          name: "IELTS Trainer Certification",
          imageUrl:
            "https://sununi.edu.vn/wp-content/uploads/2023/05/Ha-Phuong-723x1024.png",
        },
        {
          id: "cert-tesol",
          name: "TESOL Advanced",
          imageUrl:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=60",
        },
      ],
    },
    {
      id: "MN-1002",
      fullName: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0912345678",
      level: "C2",
      experienceYears: 8,
      status: "Chờ duyệt",
      joinedDate: "2025-09-18",
    },
  ]);

  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedReviewer, setSelectedReviewer] =
    useState<ReviewerApplicant | null>(null);

  const openReviewerDetails = (reviewer: ReviewerApplicant) => {
    setSelectedReviewer(reviewer);
    setShowDetailsModal(true);
  };

  const approveReviewer = (id: string) => {
    setReviewerApplicants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Đã duyệt" } : m))
    );
    setShowDetailsModal(false);
  };

  const rejectReviewer = (id: string) => {
    setReviewerApplicants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Không duyệt" } : m))
    );
    setShowDetailsModal(false);
  };

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
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

  // Image preview state for certificates
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [previewOffset, setPreviewOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastPanPos, setLastPanPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const stats = [
    {
      label: "Tổng người học",
      value: "489",
      icon: <FaUser />,
      color: "bg-violet-100",
      iconBg: "bg-violet-500",
      change: "+8.5% so với hôm qua",
      trendColor: "text-green-500",
    },
    {
      label: "Tổng số người đang theo học",
      value: "293",
      icon: <FaBox />,
      color: "bg-yellow-100",
      iconBg: "bg-yellow-500",
      change: "+1.3% so với hôm qua",
      trendColor: "text-green-500",
    },
    {
      label: "Tổng gói dịch vụ",
      value: "10",
      icon: <FaChartLine />,
      color: "bg-green-100",
      iconBg: "bg-green-500",
      change: "-4.3% so với hôm qua",
      trendColor: "text-red-500",
    },
    {
      label: "Tổng doanh thu",
      value: "1,000,000 VND",
      icon: <FaClock />,
      color: "bg-red-100",
      iconBg: "bg-red-500",
      change: "+1.8% so với hôm qua",
      trendColor: "text-green-500",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`p-6 flex flex-col gap-2 ${stat.color} shadow cursor-pointer hover:shadow-lg transition`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full p-3 text-white text-xl ${stat.iconBg}`}
              >
                {stat.icon}
              </span>
              <span className="font-semibold text-gray-600">{stat.label}</span>
            </div>
            <span className="text-3xl font-bold mt-2">{stat.value}</span>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Thống kê số gói bán theo tháng
          </h2>

          <select
            className="border rounded px-3 py-2 text-sm bg-white w-32"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="h-96">
          <Bar
            data={{
              labels: [
                "Th1",
                "Th2",
                "Th3",
                "Th4",
                "Th5",
                "Th6",
                "Th7",
                "Th8",
                "Th9",
                "Th10",
                "Th11",
                "Th12",
              ],
              datasets: [
                {
                  label: "Gói bán ra",
                  data: currentPackages,
                  backgroundColor: "#C8A8E9",
                  borderColor: "#B794E6",
                  borderWidth: 1,
                  borderRadius: 8,
                  borderSkipped: false,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: "#4A5568",
                  titleColor: "#FFFFFF",
                  bodyColor: "#FFFFFF",
                  borderColor: "#B794E6",
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: false,
                  callbacks: {
                    title: function (context) {
                      return context[0].label + " " + selectedYear;
                    },
                    label: function (context) {
                      return `Gói bán ra: ${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  title: { display: true, text: "Gói đã bán được" },
                  beginAtZero: true,
                  grid: { color: "#e5e7eb" },
                  ticks: {
                    stepSize: packagesStep,
                    display: true,
                  },
                  suggestedMax: packagesYMax,
                },
                x: {
                  grid: { display: false },
                },
              },
              onHover: (event, activeElements) => {
                if (activeElements.length > 0) {
                  // Hiển thị cursor pointer khi hover vào cột
                  if (event.native?.target) {
                    (event.native.target as HTMLElement).style.cursor =
                      "pointer";
                  }
                } else {
                  if (event.native?.target) {
                    (event.native.target as HTMLElement).style.cursor =
                      "default";
                  }
                }
              },
            }}
          />
        </div>
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Thống kê doanh thu theo tháng
          </h2>

          <select
            className="border rounded px-3 py-2 text-sm bg-white w-32"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="h-96">
          <Line
            data={{
              labels: [
                "Th1",
                "Th2",
                "Th3",
                "Th4",
                "Th5",
                "Th6",
                "Th7",
                "Th8",
                "Th9",
                "Th10",
                "Th11",
                "Th12",
              ],
              datasets: [
                {
                  label: "Doanh thu",
                  data: currentRevenue,
                  borderColor: "#A855F7",
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 6,
                  pointBackgroundColor: "#A855F7",
                  pointBorderColor: "#FFFFFF",
                  pointBorderWidth: 3,
                  pointHoverRadius: 8,
                  pointHoverBackgroundColor: "#A855F7",
                  pointHoverBorderColor: "#FFFFFF",
                  pointHoverBorderWidth: 3,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: "#FFFFFF",
                  titleColor: "#374151",
                  bodyColor: "#374151",
                  borderColor: "#A855F7",
                  borderWidth: 2,
                  cornerRadius: 12,
                  displayColors: false,
                  padding: 12,
                  titleFont: {
                    size: 14,
                    weight: "bold",
                  },
                  bodyFont: {
                    size: 13,
                  },
                  callbacks: {
                    title: function (context) {
                      return context[0].label + " " + selectedYear;
                    },
                    label: function (context) {
                      return `Doanh thu: ${context.parsed.y}K VND`;
                    },
                  },
                  filter: function (tooltipItem) {
                    return tooltipItem.datasetIndex === 0;
                  },
                },
              },
              scales: {
                y: {
                  title: { display: true, text: "Doanh thu" },
                  beginAtZero: true,
                  suggestedMax: revenueYMax,
                  grid: {
                    color: "#F3F4F6",
                  },
                  border: {
                    display: false,
                  },
                  ticks: {
                    stepSize: revenueStep,
                    display: true,
                  },
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    color: "#9CA3AF",
                    font: {
                      size: 12,
                    },
                  },
                  border: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 2,
                },
              },
              onHover: (event, activeElements) => {
                if (activeElements.length > 0) {
                  if (event.native?.target) {
                    (event.native.target as HTMLElement).style.cursor =
                      "pointer";
                  }
                } else {
                  if (event.native?.target) {
                    (event.native.target as HTMLElement).style.cursor =
                      "default";
                  }
                }
              },
            }}
          />
        </div>
      </div>

      {/* Danh sách Reviewer đăng ký tham gia */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Danh sách Reviewer đăng ký tham gia
          </h2>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f7f9fa]">
                <TableHead>Mã</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trình độ</TableHead>
                <TableHead>Kinh nghiệm</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewerApplicants.map((m) => (
                <TableRow key={m.id} className="hover:bg-[#f0f7e6]">
                  <TableCell className="font-medium text-blue-600">
                    {m.id}
                  </TableCell>
                  <TableCell className="font-medium">{m.fullName}</TableCell>
                  <TableCell className="text-gray-600">{m.email}</TableCell>
                  <TableCell className="text-gray-600">{m.phone}</TableCell>
                  <TableCell>{m.level}</TableCell>
                  <TableCell>{m.experienceYears} năm</TableCell>
                  <TableCell>{m.joinedDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        m.status === "Đã duyệt"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : m.status === "Không duyệt"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative dropdown-container">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === m.id ? null : m.id
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
                      {openDropdownId === m.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                openReviewerDetails(m);
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
      </div>

      {/* Reviewer Details Modal */}
      {showDetailsModal && selectedReviewer && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Header with gradient (sticky) */}
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
                      {selectedReviewer.fullName}
                    </h2>
                    <p className="text-blue-100">{selectedReviewer.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailsModal(false)}
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
            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Kinh nghiệm
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedReviewer.experienceYears}
                        <span className="text-sm font-normal"> năm</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="text-white"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-600">
                        Điểm đánh giá
                      </p>
                      <p className="text-sm font-medium text-yellow-900">
                        Đánh giá chưa có
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600">
                        Ngày tham gia
                      </p>
                      <p className="text-sm font-bold text-purple-900">
                        {new Date(
                          selectedReviewer.joinedDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="text-white"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Levels
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {selectedReviewer.level}
                        <span className="text-sm font-normal"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trạng thái tài khoản */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Mã người đánh giá
                      </span>
                      <span className="text-blue-600 font-mono">
                        {selectedReviewer.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Trạng thái tài khoản
                      </span>
                      <Badge
                        className={
                          selectedReviewer.status === "Đã duyệt"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : selectedReviewer.status === "Không duyệt"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {selectedReviewer.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Địa chỉ email
                      </span>
                      <span className="text-gray-600 text-sm">
                        {selectedReviewer.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Ngày tham gia
                      </span>
                      <span className="text-gray-600">
                        {selectedReviewer.joinedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificates Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 17l-3 3-3-3m3 3V10m6-6H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  </svg>
                  Chứng chỉ (Certificates)
                </h3>

                {selectedReviewer.certificates &&
                selectedReviewer.certificates.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedReviewer.certificates.map((cert) => (
                      <div key={cert.id} className="group">
                        <div
                          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border cursor-zoom-in"
                          onClick={() => {
                            setPreviewZoom(1);
                            setPreviewOffset({ x: 0, y: 0 });
                            setPreviewImageUrl(cert.imageUrl);
                          }}
                          role="button"
                          aria-label={`Xem lớn ${cert.name}`}
                        >
                          <Image
                            src={cert.imageUrl}
                            alt={cert.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-800 line-clamp-2">
                          {cert.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Chưa có chứng chỉ.
                  </div>
                )}
              </div>
              {/* Preview Modal for certificates */}
              {previewImageUrl && (
                <div
                  className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 select-none"
                  onClick={() => setPreviewImageUrl(null)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div
                    className="relative w-screen h-screen bg-black rounded-none overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
                      onClick={() => setPreviewImageUrl(null)}
                      aria-label="Đóng xem ảnh"
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
                    </button>
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <button
                        className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                        onClick={() =>
                          setPreviewZoom((z) =>
                            Math.max(0.5, parseFloat((z - 0.25).toFixed(2)))
                          )
                        }
                        aria-label="Thu nhỏ"
                      >
                        -
                      </button>
                      <div className="h-10 px-3 rounded-lg bg-white/10 text-white flex items-center">
                        {(previewZoom * 100).toFixed(0)}%
                      </div>
                      <button
                        className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                        onClick={() =>
                          setPreviewZoom((z) =>
                            Math.min(3, parseFloat((z + 0.25).toFixed(2)))
                          )
                        }
                        aria-label="Phóng to"
                      >
                        +
                      </button>
                      <button
                        className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                        onClick={() => setPreviewZoom(1)}
                        aria-label="Đặt lại"
                      >
                        Đặt lại
                      </button>
                    </div>
                    <div
                      className="relative w-full h-screen overflow-hidden cursor-default"
                      onWheel={(e) => {
                        e.preventDefault();
                        const delta = e.deltaY > 0 ? -0.1 : 0.1;
                        setPreviewZoom((z) => {
                          const next = Math.min(
                            4,
                            Math.max(0.5, parseFloat((z + delta).toFixed(2)))
                          );
                          return next;
                        });
                      }}
                      onMouseDown={(e) => {
                        if (e.button === 0) {
                          setIsPanning(true);
                          setLastPanPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseMove={(e) => {
                        if (isPanning && lastPanPos) {
                          const dx = e.clientX - lastPanPos.x;
                          const dy = e.clientY - lastPanPos.y;
                          setPreviewOffset((o) => ({
                            x: o.x + dx,
                            y: o.y + dy,
                          }));
                          setLastPanPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseUp={() => {
                        setIsPanning(false);
                        setLastPanPos(null);
                      }}
                      onMouseLeave={() => {
                        setIsPanning(false);
                        setLastPanPos(null);
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div
                          className="relative w-full h-full"
                          style={{
                            transform: `translate(${previewOffset.x}px, ${previewOffset.y}px) scale(${previewZoom})`,
                            transformOrigin: "center center",
                            transition: isPanning
                              ? "none"
                              : "transform 120ms ease",
                            cursor: isPanning ? "grabbing" : "default",
                          }}
                        >
                          <Image
                            src={previewImageUrl}
                            alt="Preview"
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="px-6 py-4 border-t flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                  className="cursor-pointer"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => approveReviewer(selectedReviewer.id)}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  Duyệt
                </Button>
                <Button
                  onClick={() => rejectReviewer(selectedReviewer.id)}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer"
                >
                  Không duyệt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageStatistics;
