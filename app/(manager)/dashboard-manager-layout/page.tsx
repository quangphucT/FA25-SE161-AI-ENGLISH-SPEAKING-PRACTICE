"use client";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaBook } from "react-icons/fa";
import AssesmentManagement from "../assesment-management/page";
import StatisticsForManagers from "../statistics-for-managers/page";
import CurriculumManagementPage from "../curriculum-management/page";
import QuestionForAssessmentPage from "../question-for-assessment/page";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import CourseFollowingLevelManagement from "../manage-courses/courses-following-level/page";
import ChapterCoursesManagement from "../manage-courses/chapter-list/page";
import QuestionsCoursesManagement from "../manage-courses/question-course/page";

const DashboardManagerLayout = () => {
  const [activeTab, setActiveTab] = useState("statisticsForManagers");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { data: getMe } = useGetMeQuery();

  const navigationItems = [
    {
      id: "statisticsForManagers",
      label: "Statistics",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 3v5h5M21 21v-5h-5" />
          <path d="M21 12A9 9 0 0 0 3 12a9 9 0 0 0 18 0" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      path: "/statistics-for-managers",
    },
    {
      id: "assesmentManagement",
      label: "Assesment Management",
      icon: <FaBook />,
      path: "/assesment-management",
    },
    {
      id: "curriculumManagement",
      label: "Curriculum Management",
      icon: <FaBook />,
      path: "/curriculum-management",
    },
    {
      id: "questionForAssessment",
      label: "Question For Assessment",
      icon: <FaBook />,
      path: "/question-for-assessment",
    },
    {
      id: "courseFollowingLevel",
      label: "Course Following Level",
      icon: <FaBook />,
      // 👇 Thêm menu con ở đây
      children: [
        {
          id: "courseList",
          label: "Course List",
          path: "/courses-following-level",
        },
        { id: "chapterList", label: "Chapter List", path: "/chapter-list" },
        {
          id: "questionCourse",
          label: "Question Course",
          path: "/question-course",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Dark Gradient Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-white">Manager Hub</h1>
                  <p className="text-xs text-slate-400">{getMe?.email}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-2"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Section */}
            <div>
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                  Main Menu
                </h3>
              )}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (item.children) {
                          setOpenSubmenu(
                            openSubmenu === item.id ? null : item.id
                          ); // toggle submenu
                        } else {
                          setActiveTab(item.id);
                          setOpenSubmenu(null);
                        }
                      }}
                      className={`w-full flex items-center transition-all duration-200 rounded-xl ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      } ${
                        sidebarOpen
                          ? "px-4 py-3 space-x-3"
                          : "px-3 py-3 justify-center"
                      }`}
                      title={!sidebarOpen ? item.label : ""}
                    >
                      <span
                        className={
                          activeTab === item.id
                            ? "text-white"
                            : "text-slate-400"
                        }
                      >
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                      )}
                      {item.children && sidebarOpen && (
                        <span className="ml-auto text-xs">
                          {openSubmenu === item.id ? "▲" : "▼"}
                        </span>
                      )}
                    </button>

                    {/* 👇 Render submenu nếu có */}
                    {item.children &&
                      openSubmenu === item.id &&
                      sidebarOpen && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                setActiveTab(child.id);

                                setOpenSubmenu(null);
                              }}
                              className={`w-full text-left text-sm rounded-lg px-3 py-2 transition-all duration-150 ${
                                activeTab === child.id
                                  ? "bg-blue-600 text-white"
                                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                              }`}
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50">
          <div
            className={`flex items-center ${
              sidebarOpen ? "space-x-3" : "justify-center"
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-medium text-sm">SM</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {getMe?.fullName}
                </p>
                <p className="text-xs text-slate-400 truncate">{getMe?.role}</p>
              </div>
            )}
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {navigationItems.find((item) => item.id === activeTab)
                        ?.label || "Dashboard"}
                    </h1>
                    <div className="h-6 w-px bg-gradient-to-b from-slate-200 to-transparent"></div>
                    <span className="text-sm text-slate-500 font-medium">
                      Reviewer Hub
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Welcome back, Sarah! Here&apos;s what&apos;s happening
                    today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-white">
          <div className="p-6 h-full">
            {activeTab === "statisticsForManagers" && (
              <div className="h-full">
                <StatisticsForManagers />
              </div>
            )}

            {activeTab === "assesmentManagement" && (
              <div className="h-full">
                <AssesmentManagement />
              </div>
            )}
            {activeTab === "curriculumManagement" && (
              <div className="h-full">
                <CurriculumManagementPage />
              </div>
            )}
            {activeTab === "questionForAssessment" && (
              <div className="h-full">
                <QuestionForAssessmentPage />
              </div>
            )}
            {activeTab === "courseList" && (
              <div className="h-full">
                <CourseFollowingLevelManagement />
              </div>
            )}

            {activeTab === "chapterList" && (
              <div className="h-full">
                  <ChapterCoursesManagement/>
              </div>
            )}

            {activeTab === "questionCourse" && (
              <div className="h-full">
                <QuestionsCoursesManagement />
                
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardManagerLayout;
