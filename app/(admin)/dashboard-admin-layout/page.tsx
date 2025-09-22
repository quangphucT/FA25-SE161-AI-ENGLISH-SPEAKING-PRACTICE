"use client";
import React from "react";
import { useState } from "react";
import { FaBox, FaBars, FaListAlt } from "react-icons/fa";

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
import PageStatistics from "../statistics/page";
import AccountManagement from "../learners-management/page";
import MentorManagement from "../mentors-management/page";
import ServicePackageManagement from "../packages/page";
import LearnerManagement from "../learners-management/page";
import SkillManagement from "../skills-management/page";
import PurchasesManagement from "../purchases-management/page";
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
            onClick={() => setActiveMenu("learner")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "learner" ? "bg-violet-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-violet-400 text-white p-2 rounded-full flex items-center justify-center"><User2Icon size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Learner</span>
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
            onClick={() => setActiveMenu("skill")}
            className={`flex items-center gap-4 cursor-pointer px-3 py-2 rounded w-full ${
              activeMenu === "skill" ? "bg-green-100" : "hover:bg-gray-100"
            }`}
          >
              <span className="bg-green-400 text-white p-2 rounded-full flex items-center justify-center"><User size={22} /></span>
              <div className="flex flex-col items-start justify-center">
                <span>Skill</span>
                <span>Mentor</span>
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
                <span>Transactions</span>
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


const DashboardAdmin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <PageStatistics />;
      case "learner":
        return  <LearnerManagement />;
      case "mentor":
        return <MentorManagement />;
        case "skill":
        return <SkillManagement />;
      case "package":
        return <ServicePackageManagement/>;
      case "purchase":
        return <PurchasesManagement/>;
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
      
        <main className="p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
