import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { FaBox, FaChartLine, FaClock, FaUser } from "react-icons/fa";

const PageStatistics = () => {
  const stats = [
    {
      label: "Total Users",
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
      change: "+1.3% Up from past week",
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
      value: "$2,040",
      icon: <FaClock />,
      color: "bg-red-100",
      iconBg: "bg-red-500",
      change: "+1.8% Up from yesterday",
      trendColor: "text-green-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Learner Package Purchases</h2>

          <select className="border rounded px-2 py-1 text-sm">
            {Array.from({ length: 10 }, (_, i) => {
              const year = 2025 + i; // Ví dụ từ 2025 đến 2034
              return <option key={year}>{year}</option>;
            })}
          </select>
        </div>
        <div className="h-164">
          <Line
            data={{
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
              ],
              datasets: [
                {
                  label: "Sales",
                  data: [20, 40, 35, 50, 64, 30, 45, 60, 55, 48],
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(99,102,241,0.1)",
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: "#6366f1",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
                x: { grid: { color: "#e5e7eb" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageStatistics;
