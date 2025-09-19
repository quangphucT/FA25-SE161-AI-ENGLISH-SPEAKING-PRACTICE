"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import homeIcon from "../../../public/icons/homeIcon.svg";
import mountIcon from "../../../public/icons/mountIcon.svg";
import rankIcon from '../../../public/icons/rankIcon.svg';
import treasureIcon from '../../../public/icons/treasureIcon.svg';
import profileIcon from '../../../public/icons/profileIcon.png'
import { getTabValue } from "./_tabMap";
import PracticeMainLayout from "../practice/page";
const sidebarMenu = [
  { label: "Học", icon: homeIcon },
  { label: "Phát âm", icon: mountIcon },
  { label: "Bảng xếp hạng", icon: rankIcon },
  { label: "Nhiệm vụ", icon: treasureIcon },
  { label: "Hồ sơ", icon: profileIcon },
];

const learningPackages = [
  {
    name: "Gói AI",
    price: "Miễn phí",
    features: [
      "Luyện nói với AI",
      "Phản hồi phát âm tự động",
      "Báo cáo tiến độ",
    ],
  },
  {
    name: "Gói Mentor",
    price: "499.000đ/tháng",
    features: [
      "Luyện nói với AI & Mentor",
      "Lộ trình cá nhân hóa",
      "Feedback trực tiếp",
      "Báo cáo chuyên sâu",
    ],
  },
];

const topics = [
  "Du lịch",
  "Kinh doanh",
  "Đời sống",
  "Y tế",
  "Công nghệ",
  "Khách sạn",
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("progress");
  return (
    <div className="min-h-screen flex bg-[#181f2a] text-[#e3e8ee]">
      {/* Sidebar */}
      <aside className="w-[260px] border-r border-[#232b3a] bg-[#181f2a] flex flex-col py-8 px-4">
        <div className="text-3xl font-extrabold text-[#58cc02] mb-8">
          SpeakAI
        </div>
        {sidebarMenu.map((item, idx) => (
          <Button
            key={item.label}
            variant={activeTab === getTabValue(idx) ? "default" : "ghost"}
            className={`w-full h-13 cursor-pointer rounded-[12px] justify-start text-lg mb-3 ${
              activeTab === getTabValue(idx)
                ? "bg-[#232b3a] border-2 border-[#abb8e6] text-[#58cc02]"
                : "text-[#e3e8ee]"
            }`}
            onClick={() => setActiveTab(getTabValue(idx))}
          >
            <span className="mr-3 text-2xl">
              <img src={item.icon.src} alt={item.label} width={34} height={34} />
            </span>
            {item.label}
          </Button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 py-8 px-10">
        {/* Assessment & Learning Path */}
        {/* <Card className="bg-[#232b3a] p-6 mb-4 flex flex-col md:flex-row items-center justify-between border border-[#263043]">
          <div>
            <div className="text-lg font-semibold mb-2 text-[#e3e8ee]">
              Phần 1, Cửa 1
            </div>
            <div className="text-2xl font-bold mb-2 text-[#fff]">
              Mời khách xơi nước
            </div>
            <Badge className="bg-[#58cc02] text-[#181f2a] px-4 py-2 text-lg font-bold">
              Bắt đầu
            </Badge>
          </div>
          <Button className="bg-[#58cc02] text-[#181f2a] font-bold px-6 py-3 rounded-xl shadow hover:bg-[#47b800]">
            Hướng dẫn
          </Button>
        </Card> */}

        {/* Tabs for features */}
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Ẩn TabsList, chỉ điều khiển qua sidebar */}
          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card className="bg-[#232b3a] p-6 mb-4 border border-[#263043]">
              <div className="font-bold text-xl mb-2 text-[#fff]">
                Tiến độ học tập
              </div>
              <div className="flex items-center gap-4 mb-2">
                <Progress value={70} className="w-1/2 h-4 bg-[#263043]" />
                <span className="text-lg text-[#fff]">70%</span>
              </div>
              <div className="text-sm text-[#cbe7ff]">
                Hoàn thành 7/10 bài kiểm tra đầu vào (FE-01)
              </div>
            </Card>
          </TabsContent>
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-[#232b3a] p-6 mb-4 border border-[#263043]">
              <div className="font-bold text-xl mb-2 text-[#fff]">
                Hồ sơ học tập
              </div>
              <div className="mb-2 text-[#e3e8ee]">Tên: Nguyễn Văn A</div>
              <div className="mb-2 text-[#e3e8ee]">
                Mục tiêu: Nói tiếng Anh lưu loát
              </div>
              <div className="mb-2 text-[#e3e8ee]">
                Sở thích: Du lịch, Kinh doanh
              </div>
              <Button
                variant="secondary"
                className="mt-2 text-[#181f2a] bg-[#fff]"
              >
                Tùy chỉnh hồ sơ & mục tiêu (FE-02)
              </Button>
            </Card>
          </TabsContent>
          {/* Packages Tab */}
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPackages.map((pkg) => (
                <Card
                  key={pkg.name}
                  className="bg-[#232b3a] p-6 border border-[#263043]"
                >
                  <div className="font-bold text-xl mb-2 text-[#fff]">
                    {pkg.name}
                  </div>
                  <div className="text-[#58cc02] font-bold mb-2">
                    {pkg.price}
                  </div>
                  <ul className="mb-2 list-disc ml-4 text-[#e3e8ee]">
                    {pkg.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button className="bg-[#4fc3f7] text-[#181f2a] font-bold mt-2">
                    Chọn gói này (FE-03, FE-04, FE-05)
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
          {/* Practice Tab */}
          <TabsContent value="practice">
            {/* <Card className="bg-[#232b3a] p-6 mb-4 border border-[#263043]">
              <div className="font-bold text-xl mb-2 text-[#fff]">
                Luyện nói với AI & Learner khác
              </div>
              <Button className="bg-[#4fc3f7] text-[#181f2a] font-bold mb-2">
                Bắt đầu luyện nói (FE-07)
              </Button>
              <div className="text-sm text-[#cbe7ff]">
                Chọn mentor hoặc luyện với AI, nhận phản hồi phát âm, điểm số,
                sửa lỗi ngữ pháp (FE-09)
              </div>
            </Card> */}
            <PracticeMainLayout/>
          </TabsContent>
          {/* Topics Tab */}
          <TabsContent value="topics">
            <Card className="bg-[#232b3a] p-6 mb-4 border border-[#263043]">
              <div className="font-bold text-xl mb-2 text-[#fff]">
                Chủ đề hội thoại
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge
                    key={topic}
                    className="bg-[#4fc3f7] text-[#181f2a] px-4 py-2 text-lg font-bold cursor-pointer"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-[#cbe7ff] mt-2">
                Chọn chủ đề để luyện nói hoặc thực hành với AI/mentor (FE-08,
                FE-11)
              </div>
            </Card>
          </TabsContent>
          {/* Report Tab */}
          <TabsContent value="report">
            <Card className="bg-[#232b3a] p-6 mb-4 border border-[#263043]">
              <div className="font-bold text-xl mb-2 text-[#fff]">
                Báo cáo & Phân tích tiến độ
              </div>
              <div className="mb-2 text-[#e3e8ee]">
                Điểm phát âm:{" "}
                <span className="font-bold text-[#4fc3f7]">85/100</span>
              </div>
              <div className="mb-2 text-[#e3e8ee]">
                Điểm ngữ pháp:{" "}
                <span className="font-bold text-[#4fc3f7]">90/100</span>
              </div>
              <div className="mb-2 text-[#e3e8ee]">
                Heatmap học tập, xu hướng tiến bộ (FE-10)
              </div>
              <Button
                variant="secondary"
                className="mt-2 text-[#181f2a] bg-[#fff]"
              >
                Xem báo cáo tuần/tháng (FE-12)
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      {/* Right Sidebar: Info, Upgrade, Missions */}
      <aside className="w-[340px] border-l border-[#232b3a] bg-[#181f2a] flex flex-col gap-6 py-8 px-6">
        <Card className="bg-[#232b3a] p-4 mb-2 border border-[#263043]">
          <div className="font-bold text-lg mb-1 text-[#fff]">
            Thử Super miễn phí
          </div>
          <div className="text-[#cbe7ff] mb-2">
            Không quảng cáo, mentor riêng, báo cáo chuyên sâu
          </div>
          <Button className="bg-[#4fc3f7] text-[#181f2a] font-bold w-full">
            Thử 2 tuần miễn phí
          </Button>
        </Card>
        <Card className="bg-[#232b3a] p-4 mb-2 border border-[#263043]">
          <div className="font-bold text-lg mb-1 text-[#fff]">
            Nhiệm vụ hàng ngày
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-yellow-400 text-[#181f2a] px-3 py-1 font-bold">
              Kiếm 10 KN
            </Badge>
            <span className="text-xs text-[#cbe7ff]">0 / 10</span>
          </div>
          <Progress value={0} className="h-2 bg-[#263043]" />
          <Button variant="ghost" className="mt-2 text-[#4fc3f7]">
            Xem tất cả
          </Button>
        </Card>
        <Card className="bg-[#232b3a] p-4 mb-2 border border-[#263043]">
          <div className="font-bold text-lg mb-1 text-[#fff]">
            Mở khóa bảng xếp hạng!
          </div>
          <div className="text-[#cbe7ff] mb-2">
            Hoàn thành thêm 10 bài học để bắt đầu thi đua
          </div>
          <Button variant="ghost" className="text-[#4fc3f7]">
            Xem chi tiết
          </Button>
        </Card>
      </aside>
    </div>
  );
};

export default Page;
