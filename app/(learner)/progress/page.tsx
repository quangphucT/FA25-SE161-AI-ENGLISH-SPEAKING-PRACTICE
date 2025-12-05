"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

import { Card } from "@/components/ui/card";
import { useGetMyProgressAnalytics } from "@/features/learner/hooks/progressAnalyticsHooks/useGetMyProgressAnalytics";
import { Clock, CheckCircle, Star } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function ProgressPage() {
  const { data, isLoading, error } = useGetMyProgressAnalytics();

  if (isLoading) return <div className="text-gray-500">Đang tải tiến độ...</div>;
  if (error || !data?.data)
    return <div className="text-red-500">Lỗi tải ProgressAnalytics</div>;

  const analytics = data.data;

  // ✅ Chống lỗi null
  const speakingTime = analytics?.speakingTime ?? 0;
  const sessionsCompleted = analytics?.sessionsCompleted ?? 0;
  const pronunciationScoreAvg = analytics?.pronunciationScoreAvg ?? 0;
  // Kiểm tra xem có dữ liệu thật hay không
const hasSkillData =
  speakingTime > 0 || sessionsCompleted > 0 || pronunciationScoreAvg > 0;


  // ✅ Line Chart Data
  const lineChartData = {
    labels: ["Thời gian nói", "Số buổi", "Điểm phát âm"],
    datasets: [
      {
        label: "Tiến độ học tập",
        data: [speakingTime, sessionsCompleted, pronunciationScoreAvg],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.4)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // ✅ Line Chart Options
 const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#1f2937",
        font: {
          size: 14,   // ✅ TO CHỮ LEGEND
          weight: 700,
        },
      },
    },
    tooltip: {
      titleFont: {
        size: 14,   // ✅ TO CHỮ TITLE TOOLTIP
        weight: 700,
      },
      bodyFont: {
        size: 13,   // ✅ TO CHỮ BODY TOOLTIP
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#374151",
        font: {
          size: 14,   // ✅ TO CHỮ TRỤC Y
        },
      },
      title: {
        display: true,
        text: "Giá trị",
        font: {
          size: 14,
          weight: 600,
        },
      },
    },
    x: {
      ticks: {
        color: "#374151",
        font: {
          size: 14,   // ✅ TO CHỮ TRỤC X
        },
      },
      title: {
        display: true,
        text: "Chỉ số đánh giá",
        font: {
          size: 14,
          weight: 600,
        },
      },
    },
  },
};


  // ✅ Doughnut Chart Data
  const doughnutData = {
    labels: ["Thời gian nói", "Số buổi hoàn thành", "Điểm phát âm"],
    datasets: [
      {
        data: [speakingTime, sessionsCompleted, pronunciationScoreAvg],
        backgroundColor: ["#3b82f6", "#22c55e", "#a855f7"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          📊 Tiến độ học tập
        </h2>
        <p className="text-gray-500 mt-1">
          Tổng quan hiệu suất luyện nói của bạn
        </p>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Speaking Time */}
<Card className="p-6 flex flex-col items-center justify-center gap-3 text-center shadow-md hover:shadow-xl transition">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <Clock className="text-blue-600 w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Thời gian luyện nói</p>
            <p className="text-3xl font-bold text-blue-600">
              {speakingTime} phút
            </p>
          </div>
        </Card>

        {/* Sessions Completed */}
<Card className="p-6 flex flex-col items-center justify-center gap-3 text-center shadow-md hover:shadow-xl transition">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600 w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Số buổi hoàn thành</p>
            <p className="text-3xl font-bold text-green-600">
              {sessionsCompleted}
            </p>
          </div>
        </Card>

        {/* Pronunciation Score */}
<Card className="p-6 flex flex-col items-center justify-center gap-3 text-center shadow-md hover:shadow-xl transition">
          <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
            <Star className="text-purple-600 w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Điểm phát âm trung bình</p>
            <p className="text-3xl font-bold text-purple-600">
              {pronunciationScoreAvg}
            </p>
          </div>
        </Card>
      </div>

      {/* CHARTS */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
  {/* LINE CHART */}
  <Card className="p-8 rounded-3xl shadow-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-[460px] flex flex-col">
    {/* TITLE */}
    <div className="flex items-start justify-between mb-8">
      <div>
        <h3 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
          📈 Biểu đồ tiến độ
        </h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Theo dõi sự phát triển kỹ năng qua từng giai đoạn học tập
        </p>
      </div>
      <div className="px-4 py-2 rounded-full text-xs font-semibold bg-blue-200 text-blue-800 shadow">
        Phân tích
      </div>
    </div>

    {/* CHART */}
    <div className="flex-1">
  <div className="w-full h-[400px]">
    <Line data={lineChartData} options={lineChartOptions} />
  </div>
</div>

  </Card>

  {/* DOUGHNUT CHART */}
  <Card className="p-8 rounded-3xl shadow-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-100 min-h-[460px] flex flex-col">
    {/* TITLE */}
    <div className="flex items-start justify-between mb-8">
      <div>
        <h3 className="text-2xl font-extrabold text-purple-700 flex items-center gap-2">
          🧠 Phân bố kỹ năng
        </h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Tỷ trọng mức độ luyện tập từng kỹ năng hiện tại
        </p>
      </div>
      <div className="px-4 py-2 rounded-full text-xs font-semibold bg-purple-200 text-purple-800 shadow">
        Kỹ năng
      </div>
    </div>

    {/* CHART */}
    <div className="flex-1 flex items-center justify-center">
  {hasSkillData ? (
    // ⭐ Có dữ liệu → Hiện Doughnut Chart
    <div className="w-full h-[380px]">
      <Doughnut
        data={doughnutData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  size: 14,
                  weight: 600,
                },
              },
            },
            tooltip: {
              titleFont: { size: 14 },
              bodyFont: { size: 13 },
            },
          },
        }}
      />
    </div>
  ) : (
    // ⭐ Không có dữ liệu → Hiện thông báo
    <div className="flex flex-col items-center justify-center text-center text-gray-500 px-6">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-semibold">Người học chưa có dữ liệu kỹ năng</p>
      <p className="text-sm mt-1">
        Hãy bắt đầu luyện nói để hệ thống ghi nhận tiến độ.
      </p>
    </div>
  )}
</div>

  </Card>
</div>


    </div>
  );
}
