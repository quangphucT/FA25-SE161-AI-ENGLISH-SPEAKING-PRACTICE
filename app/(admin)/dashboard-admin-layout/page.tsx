"use client";
import React from "react";
import { useState } from "react";
import { FaBox, FaSearch, FaBell, FaBars, FaListAlt } from "react-icons/fa";

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
import { LogOutIcon, PackageIcon, User, User2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageStatistics from "../statistics/page";
import AccountManagement from "../accounts-management/page";
import MentorManagement from "../mentors/page";
import ServicePackageManagement from "../packages/page";
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
  <aside className="hidden md:flex flex-col w-68 h-screen bg-white border-r px-6 py-8 fixed left-0 top-0 z-10">
    <div className="flex items-center gap-2 font-bold text-xl mb-8">
      <span className="text-violet-400 text-[35px]">Speak</span>
      <span className="text-gray-800 text-3xl">AI</span>
    </div>
    <nav className="flex-1">
      <ul className="space-y-2 ">
        <li>
          <button
            type="button"
            onClick={() => setActiveMenu("dashboard")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded font-semibold w-full ${
              activeMenu === "dashboard" ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-blue-400 text-white p-2 rounded-full flex items-center justify-center"><FaBars size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span className="font-bold">Dashboard</span>
              </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setActiveMenu("account")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "account" ? "bg-violet-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-violet-400 text-white p-2 rounded-full flex items-center justify-center"><User2Icon size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Account</span>
                <span>Management</span>
              </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setActiveMenu("mentor")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "mentor" ? "bg-green-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-green-400 text-white p-2 rounded-full flex items-center justify-center"><User size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Mentor</span>
                <span>Management</span>
              </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setActiveMenu("package")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "package" ? "bg-yellow-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-yellow-400 text-white p-2 rounded-full flex items-center justify-center"><PackageIcon size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Service</span>
                <span>Packages</span>
              </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setActiveMenu("purchase")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "purchase" ? "bg-pink-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-pink-400 text-white p-2 rounded-full flex items-center justify-center"><FaListAlt size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Purchases</span>
              </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setActiveMenu("feedback")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "feedback" ? "bg-orange-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-orange-400 text-white p-2 rounded-full flex items-center justify-center"><FaBox size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Feedback &</span>
                <span>Comments</span>
              </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setActiveMenu("logout")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "logout" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-gray-400 text-white p-2 rounded-full flex items-center justify-center"><LogOutIcon size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Logout</span>
              </div>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
);

const Header = () => (
  <header className="flex items-center justify-between px-8 py-6 bg-white border-b sticky top-0 z-10 ml-0 md:ml-64">
    <div className="flex items-center gap-4">
      <form className="flex items-center gap-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            className="border rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition"
          >
            <FaSearch className="text-lg" />
      
          </Button>
        </div>
      </form>
    </div>
    <div className="flex items-center gap-6">
      <FaBell className="text-xl text-gray-500" />
      <div className="flex items-center gap-2">
        <img
          src="/images/imageLanding.avif"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <div className="font-semibold">Moni Roy</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>
      </div>
    </div>
  </header>
);

const DashboardAdmin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <PageStatistics />;
      case "account":
        return  <AccountManagement />;
      case "mentor":
        return <MentorManagement />;
      case "package":
        return <ServicePackageManagement/>;
      case "purchase":
        return <h1 className="text-2xl font-bold">Purchases</h1>;
      case "feedback":
        return <h1 className="text-2xl font-bold">Feedback & Comments</h1>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="md:ml-64">
        <Header />
        <main className="p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
