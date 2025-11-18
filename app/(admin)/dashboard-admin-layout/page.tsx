"use client";
import React from "react";
import { useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  LogOutIcon,
  PackageIcon,
  User2Icon,
  BarChart3,
  GraduationCap,
  CreditCard,
  Star,
} from "lucide-react";
import PageStatistics from "../statistics/page";
import ReviewerManagement from "../reviewers-management/page";
import ServicePackageManagement from "../packages/page";
import LearnerManagement from "../learners-management/page";
import PurchasesManagement from "../purchases-management/page";
import FeedbacksCommentsManagement from "../feedbacks-comments-management/page";
import ManagerManagement from "../managers-management/page";
import WithdrawRequest from "../withdraw-request/page";
import ReviewMoneyManagement from "../review-money-management/page";
import PurchasesItemManagement from "../purchases-item-management/page";
import AiConversationPackageManagement from "../ai-conversation-package-service/page";
import { handleLogout } from "@/utils/auth";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => (
  <aside className="hidden md:flex flex-col w-72 h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl fixed left-0 top-0 z-10 overflow-y-auto">
    <div className="flex items-center gap-3 font-bold text-xl mb-12 px-6 pt-8">
      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white text-lg font-extrabold">S</span>
      </div>
      <div className="flex flex-col">
        <span className="text-white text-2xl font-extrabold">SpeakAI</span>
        <span className="text-slate-400 text-xs font-medium">
          Bảng quản trị
        </span>
      </div>
    </div>
    <nav className="flex-1 px-6 pb-6 flex flex-col">
      <div className="mb-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Menu chính
        </p>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("dashboard")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "dashboard"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "dashboard"
                    ? "bg-white/20"
                    : "bg-blue-500/20 group-hover:bg-blue-500/30"
                }`}
              >
                <BarChart3 size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Bảng điều khiển</span>
                <span className="text-xs opacity-70">
                  Tổng quan & phân tích
                </span>
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("learner")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "learner"
                  ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "learner"
                    ? "bg-white/20"
                    : "bg-violet-500/20 group-hover:bg-violet-500/30"
                }`}
              >
                <User2Icon size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Người học</span>
                <span className="text-xs opacity-70">Quản lí người học</span>
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("reviewer")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "reviewer"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "reviewer"
                    ? "bg-white/20"
                    : "bg-emerald-500/20 group-hover:bg-emerald-500/30"
                }`}
              >
                <GraduationCap size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Người đánh giá</span>
                <span className="text-xs opacity-70">
                  Quản lí người đánh giá
                </span>
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("manager")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "manager"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "learner"
                    ? "bg-white/20"
                    : "bg-ora-500/20 group-hover:bg-ora-500/30"
                }`}
              >
                <User2Icon size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Người quản lý</span>
                <span className="text-xs opacity-70">
                  Quản lí người quản lý
                </span>
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("reviewMoney")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "reviewMoney"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "reviewMoney"
                    ? "bg-white/20"
                    : "bg-pink-500/20 group-hover:bg-pink-500/30"
                }`}
              >
                <CreditCard size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Tiền đánh giá</span>
                <span className="text-xs opacity-70">Quản lí tiền đánh giá.</span>
              </div>
            </button>
          </li>


          
        </ul>
      </div>

      <div className="mb-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Dịch vụ
        </p>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("package")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "package"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "package"
                    ? "bg-white/20"
                    : "bg-amber-500/20 group-hover:bg-amber-500/30"
                }`}
              >
                <PackageIcon size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Gói dịch vụ</span>
                <span className="text-xs opacity-70">Quản lí gói dịch vụ</span>
              </div>
            </button>
          </li>

           <li>
            <button
              type="button"
              onClick={() => setActiveMenu("aiConversationPackages")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "aiConversationPackages"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "aiConversationPackages"
                    ? "bg-white/20"
                    : "bg-pink-500/20 group-hover:bg-pink-500/30"
                }`}
              >
                <CreditCard size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Gói hội thoại AI</span>
                <span className="text-xs opacity-70">Quản lí gói hội thoại AI.</span>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Kinh doanh
        </p>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("purchase")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "purchase"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "purchase"
                    ? "bg-white/20"
                    : "bg-pink-500/20 group-hover:bg-pink-500/30"
                }`}
              >
                <CreditCard size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Quản lí mua gói </span>
                <span className="text-xs opacity-70">Lịch sử mua gói</span>
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("purchaseItem")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "purchaseItem"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "purchaseItem"
                    ? "bg-white/20"
                    : "bg-pink-500/20 group-hover:bg-pink-500/30"
                }`}
              >
                <CreditCard size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Quản lí mua gói vật phẩm</span>
                <span className="text-xs opacity-70">Lịch sử mua vật phẩm</span>
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("feedback")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "feedback"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "feedback"
                    ? "bg-white/20"
                    : "bg-orange-500/20 group-hover:bg-orange-500/30"
                }`}
              >
                <Star size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Đánh giá</span>
                <span className="text-xs opacity-70">Phản hồi & bình luận</span>
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActiveMenu("withdraw")}
              className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
                activeMenu === "withdraw"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105"
              }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeMenu === "withdraw"
                    ? "bg-white/20"
                    : "bg-green-500/20 group-hover:bg-green-500/30"
                }`}
              >
                <CreditCard size={20} />
              </span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-semibold text-sm">Yêu cầu rút tiền</span>
                <span className="text-xs opacity-70">
                  Quản lí yêu cầu rút tiền.
                </span>
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-700 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className={`group flex items-center gap-4 cursor-pointer px-4 py-3 rounded-xl font-medium w-full transition-all duration-200 ${
            activeMenu === "logout"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-red-400"
          }`}
        >
          <span
            className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
              activeMenu === "logout"
                ? "bg-white/20"
                : "bg-red-500/20 group-hover:bg-red-500/30"
            }`}
          >
            <LogOutIcon size={20} />
          </span>
          <div className="flex flex-col items-start justify-center">
            <span className="font-semibold text-sm">Đăng xuất</span>
            <span className="text-xs opacity-70">Thoát</span>
          </div>
        </button>
      </div>
    </nav>
  </aside>
);

const Header = ({ activeMenu }: { activeMenu: string }) => {
  const getMenuTitle = (menu: string) => {
    const titles: { [key: string]: { title: string; subtitle: string } } = {
      dashboard: { title: "Bảng điều khiển", subtitle: "Chào mừng trở lại!" },
      learner: {
        title: "Quản lí người học",
        subtitle: "Quản lí tài khoản và tiến độ học tập.",
      },
      reviewer: {
        title: "Quản lí người đánh giá",
        subtitle: "Theo dõi hoạt động của người đánh giá.",
      },
      //skill: { title: "Quản lí kĩ năng", subtitle: "Cấu hình kĩ năng và cấp độ." },

      package: {
        title: "Gói dịch vụ",
        subtitle: "Quản lí các gói học và giá.",
      },
      //topic: { title: "Quản lí chủ đề", subtitle: "Tổ chức các chủ đề hội thoại." },
      purchase: {
        title: "Giao dịch",
        subtitle: "Theo dõi thanh toán và mua hàng.",
      },
      feedback: {
        title: "Đánh giá & Phản hồi",
        subtitle: "Quản lí phản hồi và bình luận.",
      },
      manager: {
        title: "Quản lí quản trị viên",
        subtitle: "Quản lí tài khoản quản trị và hoạt động.",
      },
      withdraw: {
        title: "Yêu cầu rút tiền",
        subtitle: "Quản lí yêu cầu rút tiền.",
      },
        reviewMoney: {
          title: "Quản lí tiền đánh giá",
          subtitle: "Quản lí tiền đánh giá.",
        },
        purchaseItem: {
          title: "Quản lí mua gói vật phẩm",
          subtitle: "Quản lí mua gói vật phẩm.",
        },
      //soldpackages: { title: "Gói đã bán", subtitle: "Quản lí gói đã bán và hoạt động." },
    };
    return (
      titles[menu] || {
        title: "Bảng điều khiển",
        subtitle: "Chào mừng trở lại!",
      }
    );
  };

  const currentMenu = getMenuTitle(activeMenu);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentMenu.title}
          </h1>
          <p className="text-gray-600 text-sm mt-1">{currentMenu.subtitle}</p>
        </div>
      </div>
    </header>
  );
};

const DashboardAdmin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <PageStatistics />;
      case "learner":
        return <LearnerManagement />;
      case "reviewer":
        return <ReviewerManagement />;
      //    case "topic":
      //   return <TopicConversationManagement />;
      // case "skill":
      //   return <SkillManagement />;
      case "package":
        return <ServicePackageManagement />;
      case "purchase":
        return <PurchasesManagement />;
      case "feedback":
        return <FeedbacksCommentsManagement />;
      case "manager":
        return <ManagerManagement />;
      case "withdraw":
        return <WithdrawRequest />;
      case "reviewMoney":
        return <ReviewMoneyManagement />;
      // case "soldpackages":
      //   return <SoldPackagesManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="md:ml-72">
        <Header activeMenu={activeMenu} />
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
