"use client";

import { Card } from "@/components/ui/card";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import {
  Award,
  BookOpen,
  ChevronRight,
  PlayCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OverviewProps {
  setActiveMenu?: (menu: string) => void;
}

const Overview = ({ setActiveMenu }: OverviewProps) => {
  const { data: userData } = useGetMeQuery();
  const router = useRouter();
  const stats = [
    {
      label: "Khoá học đang học",
      value: "2",
      unit: "/ 6 khoá",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Bài luyện phát âm",
      value: "35",
      unit: "exercises",
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Điểm phát âm",
      value: "88",
      unit: "/ 100",
      icon: Award,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];
  return (
    <div>
      {/* Level Information Banner */}
      <Card className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-indigo-600">
                {userData?.learnerProfile?.level}
              </span>
            </div>
            <div>
              <p className="text-sm text-indigo-100 mb-1">
                Kết quả Test đầu vào: Level {userData?.learnerProfile?.level}
              </p>
              <h3 className="text-2xl font-bold mb-2">
                Luyện Speaking & Pronunciation Level{" "}
                {userData?.learnerProfile?.level}
              </h3>
              <p className="text-indigo-100">
                Hoàn thành 6 khoá luyện nói để lên Level tiếp theo
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                </div>
              </div>
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card 
          onClick={() => {
            if (setActiveMenu) {
              setActiveMenu("courses");
            } else {
              router.push("/dashboard-learner-layout");
            }
          }} 
          className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                Bắt đầu học
              </h4>
              <p className="text-sm text-gray-600">
                Xem lộ trình học Level {userData?.learnerProfile?.level}
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </Card>

        <Card onClick={() => {
            if(setActiveMenu){
                setActiveMenu("progress")
            }else{
                router.push("/dashboard-learner-layout/progress")
            }
        }} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 cursor-pointer hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                Xem tiến độ
              </h4>
              <p className="text-sm text-gray-600">Theo dõi kết quả học tập</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Everyday Conversation Practice
              </p>
              <p className="text-sm text-gray-500">
                Chapter 6 hoàn thành - 2 giờ trước
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Đạt điểm phát âm 88/100
              </p>
              <p className="text-sm text-gray-500">
                Bài luyện At the Restaurant - 1 ngày trước
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Overview;
