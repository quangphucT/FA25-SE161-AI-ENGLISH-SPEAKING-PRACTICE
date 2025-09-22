"use client";
import { Card } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";
import { FaBox, FaChartLine, FaClock, FaUser } from "react-icons/fa";
import { useState } from "react";
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
} from 'chart.js';

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

const PageStatistics = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  
  // Dữ liệu mẫu cho biểu đồ cột theo từng năm
  const packageData: { [key: number]: number[] } = {
    2025: [20, 40, 35, 50, 64, 30, 45, 60, 55, 48, 42, 38],
    2024: [15, 35, 30, 45, 58, 25, 40, 55, 50, 43, 37, 33],
    2023: [18, 38, 32, 47, 61, 28, 42, 58, 52, 45, 39, 35],
  };

  // Dữ liệu doanh thu theo tháng (đơn vị: K)
  const revenueData: { [key: number]: number[] } = {
    2025: [14, 8, 12, 16, 26, 22, 19, 24, 21, 17, 15, 23],
    2024: [12, 7, 10, 14, 24, 20, 17, 22, 19, 15, 13, 21],
    2023: [15, 9, 13, 17, 28, 24, 21, 26, 23, 19, 17, 25],
  };

  // Dữ liệu top 5 mentor được đánh giá cao nhất
  const topMentors = [
    {
      name: "Nguyễn Văn An",
      avatar: "/avatars/mentor1.jpg",
      totalStars: 485,
      totalFeedbacks: 98,
      rating: 4.95,
      speciality: "Business English"
    },
    {
      name: "Trần Thị Bình",
      avatar: "/avatars/mentor2.jpg", 
      totalStars: 456,
      totalFeedbacks: 95,
      rating: 4.8,
      speciality: "IELTS Preparation"
    },
    {
      name: "Lê Minh Cường",
      avatar: "/avatars/mentor3.jpg",
      totalStars: 438,
      totalFeedbacks: 92,
      rating: 4.76,
      speciality: "Conversation Practice"
    },
    {
      name: "Phạm Thu Dung",
      avatar: "/avatars/mentor4.jpg",
      totalStars: 425,
      totalFeedbacks: 90,
      rating: 4.72,
      speciality: "Grammar & Writing"
    },
    {
      name: "Hoàng Văn Em",
      avatar: "/avatars/mentor5.jpg",
      totalStars: 410,
      totalFeedbacks: 88,
      rating: 4.66,
      speciality: "Pronunciation"
    }
  ];

  // Dữ liệu top 3 gói được mua nhiều nhất
  const topPackages = [
    {
      name: "AI Speaking - Monthly",
      description: "Practice English speaking with AI for 30 days.",
      price: "1,200,000 VND",
      totalPurchases: 156,
      growthRate: "+12%",
      category: "AI-only Practice"
    },
    {
      name: "Mentor Guided - Monthly", 
      description: "1-on-1 mentor support with AI practice.",
      price: "980,000 VND",
      totalPurchases: 134,
      growthRate: "+8%",
      category: "Mentor-guided"
    },
    {
      name: "Business English Hybrid",
      description: "AI practice + mentor sessions focused on business scenarios",
      price: "750,000 VND", 
      totalPurchases: 98,
      growthRate: "+15%",
      category: "Business English"
    }
  ];
  
  const stats = [
    {
      label: "Total Learners",
      value: "489",
      icon: <FaUser />,
      color: "bg-violet-100",
      iconBg: "bg-violet-500",
      change: "+8.5% Up from yesterday",
      trendColor: "text-green-500",
    },
    {
      label: "Total Mentors",
      value: "293",
      icon: <FaBox />,
      color: "bg-yellow-100",
      iconBg: "bg-yellow-500",
      change: "+1.3% Up from yesterday",
      trendColor: "text-green-500",
    },
    {
      label: "Total Services Packages",
      value: "10",
      icon: <FaChartLine />,
      color: "bg-green-100",
      iconBg: "bg-green-500",
      change: "-4.3% Down from yesterday",
      trendColor: "text-red-500",
    },
    {
      label: "Total Revenue",
      value: "1,000,000 VND",
      icon: <FaClock />,
      color: "bg-red-100",
      iconBg: "bg-red-500",
      change: "+1.8% Up from yesterday",
      trendColor: "text-green-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Statistics</h1>
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
            <span className={`text-xs mt-1 ${stat.trendColor}`}>
              {stat.change}
            </span>
          </Card>
        ))}
      </div>

  {/* Top 3 gói được mua nhiều nhất */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Top 3 Most Popular Packages</h2>
          <span className="text-sm text-gray-500">Based on total purchases</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topPackages.map((pkg, index) => (
            <div key={pkg.name} className="relative p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              {/* Ranking Badge */}
              <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                index === 0 ? 'bg-yellow-500' :
                index === 1 ? 'bg-gray-400' :
                'bg-orange-500'
              }`}>
                #{index + 1}
              </div>

              {/* Package Category */}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                pkg.category === 'Premium' ? 'bg-purple-100 text-purple-700' :
                pkg.category === 'IELTS' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {pkg.category}
              </div>

              {/* Package Info */}
              <h3 className="font-bold text-gray-800 mb-2">{pkg.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
              
              {/* Price */}
              <div className="text-lg font-bold text-blue-600 mb-3">{pkg.price}</div>
              
              {/* Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{pkg.totalPurchases}</div>
                  <div className="text-xs text-gray-500">Total purchases</div>
                </div>
                <div className={`text-sm font-semibold ${pkg.growthRate.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {pkg.growthRate}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${(pkg.totalPurchases / 156) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Statistics of packages sold per month</h2>

          <select 
            className="border rounded px-3 py-2 text-sm bg-white"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2025, 2024, 2023].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="h-96">
          <Bar
            data={{
              labels: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              datasets: [
                {
                  label: "Packages Sold",
                  data: packageData[selectedYear],
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
                    title: function(context) {
                      return context[0].label;
                    },
                    label: function(context) {
                      return `Packages sold: ${context.parsed.y}`;
                    }
                  }
                },
              },
              scales: {
                y: { 
                  beginAtZero: true, 
                  grid: { color: "#e5e7eb" },
                  ticks: {
                    stepSize: 100,
                  }
                },
                x: { 
                  grid: { display: false },
                },
              },
              onHover: (event, activeElements) => {
                if (activeElements.length > 0) {
                  // Hiển thị cursor pointer khi hover vào cột
                  if (event.native?.target) {
                    (event.native.target as HTMLElement).style.cursor = 'pointer';
                  }
                } else {
                  if (event.native?.target) {
                    (event.native.target as HTMLElement).style.cursor = 'default';
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
          <h2 className="text-xl font-semibold">Monthly Revenue Statistics</h2>

          <select 
            className="border rounded px-3 py-2 text-sm bg-white"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2025, 2024, 2023].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="h-96">
          <Line
            data={{
              labels: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              datasets: [
                {
                  label: "Revenue",
                  data: revenueData[selectedYear],
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
                    weight: 'bold',
                  },
                  bodyFont: {
                    size: 13,
                  },
                  callbacks: {
                    title: function(context) {
                      return context[0].label + ' 2025';
                    },
                    label: function(context) {
                      return `Revenue: ${context.parsed.y}K VND`;
                    }
                  },
                  filter: function(tooltipItem) {
                    return tooltipItem.datasetIndex === 0;
                  },
                },
              },
              scales: {
                y: { 
                  beginAtZero: true,
                  max: 30,
                  grid: { 
                    color: "#F3F4F6",
                  },
                  border: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  }
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
                    (event.native.target as HTMLElement).style.cursor = 'pointer';
                  }
                } else {
                  if (event.native?.target) {
                    (event.native.target as HTMLElement).style.cursor = 'default';
                  }
                }
              },
            }}
          />
        </div>
      </div>

      {/* Top 5 Mentors với rating cao nhất */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Top 5 Highest Rated Mentors</h2>
          <span className="text-sm text-gray-500">Based on average rating</span>
        </div>
        <div className="space-y-4">
          {topMentors.map((mentor, index) => (
            <div key={mentor.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    #{index + 1}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold">
                  {mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{mentor.name}</h3>
                  <p className="text-sm text-gray-500">{mentor.speciality}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-gray-800">{mentor.rating.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {mentor.totalStars} stars • {mentor.totalFeedbacks} reviews
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default PageStatistics;
