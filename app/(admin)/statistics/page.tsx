"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  useAdminPackages,
  useAdminRegisteredReviewer,
  useAdminRevenue,
  useAdminSummary,
} from "@/features/admin/hooks/useAdminSummary";
import {
  useAdminReviewerApprove,
  useAdminReviewerLevel,
  useAdminReviewerReject,
} from "@/features/admin/hooks/useAdminReviewer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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
  status: string;
  joinedDate: string;
  certificates?: Certificate[];
}

const PageStatistics = () => {
const [selectedPackageYear, setSelectedPackageYear] = useState(2025);
const [selectedRevenueYear, setSelectedRevenueYear] = useState(2025);
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, idx) => currentYear - idx
  );

  const queryClient = useQueryClient();
  const { data: adminSummary } = useAdminSummary();
const { data: adminPackages } = useAdminPackages(selectedPackageYear.toString());
const { data: adminRevenue } = useAdminRevenue(selectedRevenueYear.toString());

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: adminRegisteredReviewer, refetch: refetchReviewers } = useAdminRegisteredReviewer(
    currentPage,
    pageSize
  );

  console.log(adminRegisteredReviewer);

  // Dữ liệu từ API cho biểu đồ cột theo từng năm
const packageData =
  adminPackages?.data?.reduce((acc, item) => {
    acc[item.month - 1] = item.count;
    return acc;
  }, new Array(12).fill(0)) ?? new Array(12).fill(0);



  // Dữ liệu doanh thu từ API theo tháng (đơn vị: K)
  const revenueData =
    adminRevenue?.data?.reduce((acc, item) => {
      if (!acc[selectedPackageYear]) {
        acc[selectedPackageYear] = new Array(12).fill(0);
      }
      acc[selectedPackageYear][item.month - 1] = Math.round(item.revenue / 1000); // Convert to K
      return acc;
    }, {} as { [key: number]: number[] }) || {};

  // Tính toán động trục Y dựa trên dữ liệu của năm đang chọn
const currentPackages = packageData;
const currentRevenue = revenueData[selectedRevenueYear] || new Array(12).fill(0);
  const maxPackages = Math.max(...currentPackages);
  const maxRevenue = Math.max(...currentRevenue);
  const packagesYMax = Math.max(10, Math.ceil((maxPackages || 0) * 1.2));
  const revenueYMax = Math.max(10, Math.ceil((maxRevenue || 0) * 1.2));
  const packagesStep = Math.max(1, Math.ceil(packagesYMax / 5));
  const revenueStep = Math.max(1, Math.ceil(revenueYMax / 5));

  // Reviewers awaiting participation approval - now using API data

  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showUpdateLevelModal, setShowUpdateLevelModal] = useState<boolean>(false);
  const [selectedReviewer, setSelectedReviewer] =
    useState<ReviewerApplicant | null>(null);

  // Form schema for updating reviewer level
  const updateLevelSchema = z.object({
    level: z.string().min(1, "Vui lòng nhập level"),
  });

  const updateLevelForm = useForm<z.infer<typeof updateLevelSchema>>({
    resolver: zodResolver(updateLevelSchema),
    defaultValues: {
      level: "",
    },
  });
  
  const { mutate: updateLevel, isPending: isUpdatingLevel } = useAdminReviewerLevel();
  const { mutateAsync: approveReviewerMutation } = useAdminReviewerApprove();
  const { mutateAsync: rejectReviewerMutation } = useAdminReviewerReject();

  // Helper function to map status to Vietnamese
  const getStatusText = (status: string): "Chờ duyệt" | "Đã duyệt" | "Không duyệt" => {
    const statusMap: Record<string, "Chờ duyệt" | "Đã duyệt" | "Không duyệt"> = {
      "Approved": "Đã duyệt",
      "Rejected": "Không duyệt",
      "Pending": "Chờ duyệt",
      "Chờ duyệt": "Chờ duyệt",
      "Đã duyệt": "Đã duyệt",
      "Không duyệt": "Không duyệt",
    };
    return statusMap[status] || "Chờ duyệt";
  };

  const openReviewerDetails = (reviewer: ReviewerApplicant) => {
    setSelectedReviewer(reviewer);
    setShowDetailsModal(true);
  };

  const approveReviewer = async (id: string) => {
    try {
      const response = await approveReviewerMutation(id);
      const isSuccess =
        response?.isSucess ?? response?.isSuccess ?? response?.success ?? true;

      if (isSuccess) {
        if (selectedReviewer) {
          setSelectedReviewer({
            ...selectedReviewer,
            certificates: selectedReviewer.certificates?.filter(
              (cert) => cert.id !== id
            ),
          });
        }
        setPreviewImageUrl(null);
        setSelectedCertificateId(null);
        await refetchReviewers();
      }
    } catch (error) {
      console.error("Error approving reviewer:", error);
    }
  };

  const rejectReviewer = async (id: string) => {
    try {
      const response = await rejectReviewerMutation(id);
      const isSuccess =
        response?.isSucess ?? response?.isSuccess ?? response?.success ?? true;

      if (isSuccess) {
        if (selectedReviewer) {
          setSelectedReviewer({
            ...selectedReviewer,
            certificates: selectedReviewer.certificates?.filter(
              (cert) => cert.id !== id
            ),
          });
        }
        setPreviewImageUrl(null);
        setSelectedCertificateId(null);
        await refetchReviewers();
      }
    } catch (error) {
      console.error("Error rejecting reviewer:", error);
    }
  };

  const handleUpdateLevel = (values: z.infer<typeof updateLevelSchema>) => {
    if (!selectedReviewer) return;
    
    updateLevel(
      {
        reviewerProfileId: selectedReviewer.id,
        level: values.level,
      },
      {
        onSuccess: () => {
          setShowUpdateLevelModal(false);
          updateLevelForm.reset();
          setShowDetailsModal(false);
          // Refetch data to update the list
          refetchReviewers();
          queryClient.invalidateQueries({ queryKey: ["adminRegisteredReviewer"] });
        },
      }
    );
  };

  const openUpdateLevelModal = () => {
    if (selectedReviewer) {
      updateLevelForm.setValue("level", selectedReviewer.level || "");
      setShowUpdateLevelModal(true);
    }
  };


  // Image preview state for certificates
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
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
      value: adminSummary?.data?.totalLearners?.toString() || "0",
      icon: <FaUser />,
      color: "bg-violet-100",
      iconBg: "bg-violet-500",
     
      trendColor: "text-green-500",
    },
    {
      label: "Tổng số người đang học",
      value: adminSummary?.data?.totalActiveLearners?.toString() || "0",
      icon: <FaBox />,
      color: "bg-yellow-100",
      iconBg: "bg-yellow-500",
     
      trendColor: "text-green-500",
    },
    {
      label: "Tổng gói dịch vụ",
      value: adminSummary?.data?.totalServicePackages?.toString() || "0",
      icon: <FaChartLine />,
      color: "bg-green-100",
      iconBg: "bg-green-500",
    
      trendColor: "text-red-500",
    },
    {
      label: "Tổng doanh thu",
      value: adminSummary?.data?.totalRevenue
        ? `${adminSummary.data.totalRevenue.toLocaleString()} VND`
        : "0 VND",
      icon: <FaClock />,
      color: "bg-red-100",
      iconBg: "bg-red-500",
      
      trendColor: "text-green-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-l-4 border-l-violet-500 hover:shadow-lg transition-all duration-200 overflow-hidden group bg-white"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.label}
                  </p>
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${stat.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  <div className="text-white text-2xl">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Thống kê số gói bán theo tháng
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Biểu đồ thể hiện số lượng gói dịch vụ đã bán theo từng tháng
              </p>
            </div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors cursor-pointer shadow-sm"
value={selectedPackageYear}
onChange={(e) => setSelectedPackageYear(Number(e.target.value))}

            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
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
                     return context[0].label + " " + selectedPackageYear;
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
      </Card>

      {/* Biểu đồ doanh thu theo tháng */}
      <Card className="shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Thống kê doanh thu theo tháng
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Biểu đồ đường thể hiện doanh thu (đơn vị: nghìn VND) theo từng tháng
              </p>
            </div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors cursor-pointer shadow-sm"
           value={selectedRevenueYear}
onChange={(e) => setSelectedRevenueYear(Number(e.target.value))}

            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
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
return context[0].label + " " + selectedRevenueYear;
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
      </Card>

      {/* Danh sách Reviewer đăng ký tham gia */}
      <Card className="shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách Reviewer đăng ký tham gia
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý và duyệt các đơn đăng ký của reviewer mới
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100">
                <TableHead className="text-gray-700 font-bold text-sm">
                  Thông tin
                </TableHead>
                <TableHead className="text-gray-700 font-bold text-sm">
                  Họ tên
                </TableHead>
                <TableHead className="text-gray-700 font-bold text-sm">
                  Liên hệ
                </TableHead>
                <TableHead className="text-gray-700 font-bold text-sm">
                  Trình độ
                </TableHead>
                <TableHead className="text-gray-700 font-bold text-sm">
                  Kinh nghiệm
                </TableHead>
                <TableHead className="text-gray-700 font-bold text-sm">
                  Trạng thái
                </TableHead>
                <TableHead className="text-center text-gray-700 font-bold text-sm">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminRegisteredReviewer?.data?.items?.map((m) => (
                <TableRow
                  key={m.reviewerProfileId}
                  className="hover:bg-emerald-50/50 transition-colors border-b border-gray-100"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="size-12 ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-200 shadow-md rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {m.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-sm ${
                            m.reviewerStatus === "Approved" || m.reviewerStatus === "Active"
                              ? "bg-green-500"
                              : m.reviewerStatus === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold text-xs font-mono">
                          {m.reviewerProfileId.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {m.fullName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-600">
                    <div className="flex flex-col">
                      <span className="text-sm">{m.email}</span>
                      <span className="text-xs text-gray-500">{m.phone}</span>
                    </div>
                  </TableCell>

                  <TableCell>{m.level || "Chưa có"}</TableCell>
                  <TableCell>{m.experience || "0"} năm</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        m.reviewerStatus === "Approved" || m.reviewerStatus === "Active"
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                          : m.reviewerStatus === "Rejected"
                          ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            m.reviewerStatus === "Approved" || m.reviewerStatus === "Active"
                              ? "bg-green-500"
                              : m.reviewerStatus === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        {m.reviewerStatus === "Approved" || m.reviewerStatus === "Active"
                          ? "Đã duyệt"
                          : m.reviewerStatus === "Rejected"
                          ? "Không duyệt"
                          : "Chờ duyệt"}
                        {m.certificates?.some(cert => cert.status === "Pending") && (
                          <span className="ml-1 text-xs">({m.certificates.filter(cert => cert.status === "Pending").length} chứng chỉ chờ duyệt)</span>
                        )}
                      </div>
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8 cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
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
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            openReviewerDetails({
                              id: m.reviewerProfileId,
                              fullName: m.fullName,
                              email: m.email,
                              phone: m.phone,
                              level: m.level || "",
                              experienceYears: Number(m.experience || 0),
                              status: (m.reviewerStatus === "Approved" || m.reviewerStatus === "Active"
                                ? "Đã duyệt"
                                : m.reviewerStatus === "Rejected"
                                ? "Không duyệt"
                                : "Chờ duyệt") as "Chờ duyệt" | "Đã duyệt" | "Không duyệt",
                              joinedDate: new Date()
                                .toISOString()
                                .split("T")[0],
                              certificates: m.certificates?.map((cert) => ({
                                id: cert.certificateId,
                                name: cert.name,
                                imageUrl: cert.url,
                              })) || [],
                            });
                          }}
                          className="cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
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
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        </div>
        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">mục mỗi trang</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Trang <span className="text-emerald-600 font-bold">{currentPage}</span> - Hiển thị{" "}
                <span className="text-emerald-600 font-bold">
                  {adminRegisteredReviewer?.data?.items?.length || 0}
                </span>{" "}
                kết quả
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      Math.ceil(
                        (adminRegisteredReviewer?.data?.items?.length || 0) /
                          pageSize
                      )
                    ),
                  },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 p-0 ${
                          currentPage === pageNum
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700"
                        } transition-colors`}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={
                  !adminRegisteredReviewer?.data?.items?.length ||
                  adminRegisteredReviewer.data.items.length < pageSize
                }
                className="px-4 py-2 border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      </Card>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
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

                <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
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
                <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
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
                        {selectedReviewer.level || "Chưa có"}
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
                      {(() => {
                        const statusText = getStatusText(selectedReviewer.status);
                        const statusConfig = {
                          "Đã duyệt": {
                            bg: "bg-green-100",
                            text: "text-green-800",
                            border: "border-green-200",
                            dot: "bg-green-500",
                          },
                          "Không duyệt": {
                            bg: "bg-red-100",
                            text: "text-red-800",
                            border: "border-red-200",
                            dot: "bg-red-500",
                          },
                          "Chờ duyệt": {
                            bg: "bg-yellow-100",
                            text: "text-yellow-800",
                            border: "border-yellow-200",
                            dot: "bg-yellow-500",
                          },
                        };
                        const config = statusConfig[statusText] || statusConfig["Chờ duyệt"];
                        return (
                          <Badge
                            className={`${config.bg} ${config.text} ${config.border} hover:opacity-80 transition-opacity`}
                          >
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                              <span className="font-medium">{statusText}</span>
                            </div>
                          </Badge>
                        );
                      })()}
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
                            setSelectedCertificateId(cert.id);
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
                  onClick={() => {
                    setPreviewImageUrl(null);
                    setSelectedCertificateId(null);
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div
                    className="relative w-screen h-screen bg-black rounded-none overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
                      onClick={() => {
                        setPreviewImageUrl(null);
                        setSelectedCertificateId(null);
                      }}
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
                    <Button
                  onClick={() => {
                    if (selectedCertificateId) {
                      approveReviewer(selectedCertificateId);
                     
                    }
                  }}
                  className="absolute top-15 right-3 z-10 bg-green-600 hover:bg-green-700 cursor-pointer"
                  disabled={!selectedCertificateId}
                >
                  Duyệt
                </Button>
                <Button
                  onClick={() => {
                    if (selectedCertificateId) {
                      rejectReviewer(selectedCertificateId);
                     
                    }
                  }}
                  className="absolute top-25 right-3 z-10 bg-red-600 hover:bg-red-700 cursor-pointer"
                  disabled={!selectedCertificateId}
                >
                  Không duyệt
                </Button>
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
                  onClick={openUpdateLevelModal}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  Cập nhật Level của reviewer
                </Button>
               
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Level Modal */}
      {showUpdateLevelModal && selectedReviewer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Cập nhật Level Reviewer
                    </h2>
                    <p className="text-sm text-green-100 mt-0.5">
                      {selectedReviewer.fullName}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowUpdateLevelModal(false);
                    updateLevelForm.reset();
                  }}
                  className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full transition-colors"
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

            <div className="p-6 space-y-6">
              <Form {...updateLevelForm}>
                <form
                  onSubmit={updateLevelForm.handleSubmit(handleUpdateLevel)}
                  className="space-y-6"
                >
                  <FormField
                    control={updateLevelForm.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Level *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                              <SelectValue placeholder="Chọn level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A1">A1</SelectItem>
                            <SelectItem value="A2">A2</SelectItem>
                            <SelectItem value="B1">B1</SelectItem>
                            <SelectItem value="B2">B2</SelectItem>
                            <SelectItem value="C1">C1</SelectItem>
                            <SelectItem value="C2">C2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <p className="text-sm text-gray-500 mt-1">
                          Level hiện tại: <span className="font-medium text-gray-700">{selectedReviewer.level || "Chưa có"}</span>
                        </p>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowUpdateLevelModal(false);
                        updateLevelForm.reset();
                      }}
                      className="cursor-pointer border-gray-300 hover:bg-gray-50 px-6"
                      disabled={isUpdatingLevel}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdatingLevel}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white cursor-pointer px-6 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingLevel ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        "Cập nhật Level"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageStatistics;
