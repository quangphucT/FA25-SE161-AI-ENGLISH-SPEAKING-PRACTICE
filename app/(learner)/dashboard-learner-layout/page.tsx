"use client";

import { Card } from "@/components/ui/card";
import {
  Home,
  BookOpen,
  Wallet,
  BarChart3,
  User,
  ChevronRight,
  PlayCircle,
  BookMarked,
  Coins,
  LogOut,
} from "lucide-react";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import Overview from "../overview/page";
import WalletCoinPurchase from "../Wallet_coinPurchase/page";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LearningPath from "../learningPath/page";
import { handleLogout } from "@/utils/auth";
import ConversationWithAI from "../coversation-withAI/page";
import EnrollingCourse from "../enrolling-courses/page";
import SendingAudioToReviewer from "../sendingAudioToReviewer/page";


export default function LearnerDashboard() {
  const searchParams = useSearchParams();
  const menuParam = searchParams?.get("menu");
  const [activeMenu, setActiveMenu] = useState(menuParam || "overview");
  const { data: userData } = useGetMeQuery();
  
  // Update active menu when URL param changes
  useEffect(() => {
    if (menuParam) {
      setActiveMenu(menuParam);
    }
  }, [menuParam]);
  const sidebarMenu = [
    { id: "overview", label: "Tổng quan", icon: Home, description: "Bảng điều khiển chính" },
    { id: "learningPath", label: "Lộ trình học", icon: BookOpen, description: "Xem và học theo lộ trình" },
    { id: "enrollingCourses", label: "Khoá học", icon: BookMarked, description: "Tham gia các khoá học" },
    { id: "wallet", label: "Ví Coin", icon: Wallet, description: "Quản lý và nạp Coin" },
    { id: "conversationWithAI", label: "Trò chuyện với AI", icon: PlayCircle, description: "Giao tiếp và luyện tập" },
    { id: "learnerSendingAudioToReviewer", label: "Đánh giá audio", icon: BarChart3, description: "Được đánh giá bởi reviewer" },
    { id: "profile", label: "Hồ sơ", icon: User, description: "Thông tin cá nhân" },
  ];



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* SIDEBAR - Professional White Design */}
      <aside className="w-77 bg-white shadow-xl flex flex-col border-r border-gray-300">
        {/* Logo Section */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                SEWAI
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                English Platform
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-6 space-y-2">
  
          {sidebarMenu.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full rounded-xl flex items-center gap-3 px-4 py-3.5 transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 transition-all duration-200 flex-shrink-0 ${
                  isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                }`} />
                <div className="flex-1 text-left">
                  <div className={`font-medium text-sm ${
                    isActive ? "text-white font-semibold" : ""
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${
                    isActive ? "text-blue-100" : "text-gray-400 group-hover:text-gray-600"
                  }`}>
                    {item.description}
                  </div>
                </div>
                
                {isActive && (
                  <ChevronRight className="w-4 h-4 flex-shrink-0 text-white" />
                )}
              </button>
            );
          })}

          {/* Logout Button */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl flex items-center gap-3 px-4 py-3.5 transition-all duration-200 group cursor-pointer text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all duration-200" />
              <span className="font-medium text-sm">Đăng xuất</span>
            </button>
          </div>
        </nav>

  
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-white">
        {/* Modern Header */}
        <header className="border-b border-gray-200 px-8 py-2 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Chào mừng trở lại, {userData?.fullName}!
              </h2>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Tiếp tục hành trình học tiếng Anh của bạn
              </p>
            </div>
            
            {/* Coin Balance Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative flex items-center gap-4 bg-gradient-to-r from-yellow-50 to-amber-50 pl-5 pr-6 py-1 rounded-2xl border-1 border-yellow-200 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <Coins className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-yellow-700 uppercase tracking-wide">Số dư Coin</p>
                  <p className="text-[18px] font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {userData?.coinBalance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* OVERVIEW PAGE */}
          {activeMenu === "overview" && (
              <Overview setActiveMenu={setActiveMenu} />
          )}

          {/* COURSES PAGE */}
          {activeMenu === "learningPath" && (
           <LearningPath setActiveMenu={setActiveMenu} />
          )}
          {/* ENROLLING COURSES PAGE */}
          {activeMenu === "enrollingCourses" && (
           <EnrollingCourse setActiveMenu={setActiveMenu} />
          )}

          {/* WALLET PAGE */}
          {activeMenu === "conversationWithAI" && (
           <ConversationWithAI  />
          )}


          {/* WALLET PAGE */}
          {activeMenu === "wallet" && (
           <WalletCoinPurchase  />
          )}

          {/* PROGRESS PAGE */}
          {activeMenu === "learnerSendingAudioToReviewer" && (
            <SendingAudioToReviewer setActiveMenu={setActiveMenu} />
          )}

          {/* PROFILE PAGE */}
          {activeMenu === "profile" && (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">👤 Hồ sơ cá nhân</h3>
                <p className="text-gray-500 mt-1">
                  Quản lý thông tin tài khoản của bạn
                </p>
              </div>

              <Card className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Đang phát triển...</h4>
                <p className="text-gray-600">Tính năng này sẽ sớm được cập nhật.</p>
              </Card>
            </>
          )}
        </div>
      </main>

    
    </div>
  );
}