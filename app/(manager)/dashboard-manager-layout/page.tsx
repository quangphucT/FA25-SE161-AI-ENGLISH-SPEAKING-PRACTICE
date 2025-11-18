"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AssesmentManagement from "../assesment-management/page";
import StatisticsForManagers from "../statistics-for-managers/page";
import CurriculumManagementPage from "../curriculum-management/page";
import QuestionForAssessmentPage from "../question-for-assessment/page";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import LevelA1 from "../levels/levelA1";

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
          width="20"
          height="20"
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
      label: "Assessment Management",
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      path: "/assesment-management",
    },
    {
      id: "curriculumManagement",
      label: "Curriculum Management",
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      path: "/curriculum-management",
    },

    {
      id: "questionForAssessment",
      label: "Question For Assessment",
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      path: "/question-for-assessment",
    },

    // {
    //   id: "aiConversationPackageService",
    //   label: "AI Conversation Packages",
    //   icon: (
    //     <svg
    //       width="20"
    //       height="20"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       viewBox="0 0 24 24"
    //     >
    //       <circle cx="12" cy="12" r="10" />
    //       <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    //       <line x1="12" y1="17" x2="12.01" y2="17" />
    //     </svg>
    //   ),
    //   path: "/ai-conversation-package-service",
    // },

    {
      id: "levels",
      label: "Levels",
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 3v18h18" />
          <path d="M7 12l4-4 4 4 5-5" />
        </svg>
      ),
      children: [
        {
          id: "level-a1",
          label: "A1 - Beginner",
          level: "A1",
          path: "/levels/a1",
        },
        {
          id: "level-a2",
          label: "A2 - Elementary",
          level: "A2",
          path: "/levels/a2",
        },
        {
          id: "level-b1",
          label: "B1 - Intermediate",
          level: "B1",
          path: "/levels/b1",
        },
        {
          id: "level-b2",
          label: "B2 - Upper Intermediate",
          level: "B2",
          path: "/levels/b2",
        },
        {
          id: "level-c1",
          label: "C1 - Advanced",
          level: "C1",
          path: "/levels/c1",
        },
        {
          id: "level-c2",
          label: "C2 - Mastery",
          level: "C2",
          path: "/levels/c2",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* White Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white text-gray-800 transition-all duration-300 flex flex-col shadow-lg border-r border-gray-200`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
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
                  <h1 className="font-bold text-lg text-gray-800">Manager Hub</h1>
                  <p className="text-xs text-gray-500">{getMe?.email}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
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
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
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
                          );
                        } else {
                          setActiveTab(item.id);
                          setOpenSubmenu(null);
                        }
                      }}
                      className={`w-full cursor-pointer flex items-center transition-all duration-300 rounded-lg group ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                          : openSubmenu === item.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      } ${
                        sidebarOpen
                          ? "px-4 py-3.5 space-x-3"
                          : "px-3 py-3.5 justify-center"
                      }`}
                      title={!sidebarOpen ? item.label : ""}
                    >
                      <span
                        className={`${
                          activeTab === item.id
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        } transition-colors duration-300`}
                      >
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <>
                          <span className="font-medium text-sm flex-1">
                            {item.label}
                          </span>
                          {item.children && (
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className={`transition-transform duration-300 ${
                                openSubmenu === item.id ? "rotate-180" : ""
                              }`}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          )}
                        </>
                      )}
                    </button>

                    {/* Submenu with smooth animation */}
                    {item.children &&
                      openSubmenu === item.id &&
                      sidebarOpen && (
                        <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
                          {item.children.map((child, idx) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                setActiveTab(child.id);
                                // Keep submenu open when clicking child items
                              }}
                              style={{ animationDelay: `${idx * 50}ms` }}
                              className={`w-full cursor-pointer text-left text-sm rounded-lg px-4 py-2.5 transition-all duration-200 flex items-center space-x-3 group ${
                                activeTab === child.id
                                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:pl-5"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                  activeTab === child.id
                                    ? "bg-white"
                                    : "bg-gray-400 group-hover:bg-blue-400"
                                }`}
                              />
                              <span>{child.label}</span>
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
        <div className="p-4 border-t border-gray-200">
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
                <p className="text-sm font-medium text-gray-800 truncate">
                  {getMe?.fullName}
                </p>
                <p className="text-xs text-gray-500 truncate">{getMe?.role}</p>
              </div>
            )}
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1"
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {navigationItems.find((item) => item.id === activeTab)
                        ?.label || "Dashboard"}
                    </h1>
                    <div className="h-6 w-px bg-gradient-to-b from-gray-200 to-transparent"></div>
                    <span className="text-sm text-gray-500 font-medium">
                      Manager Hub
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Welcome back! Here&apos;s what&apos;s happening today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 bg-white">
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

             {/* {activeTab === "aiConversationPackageService" && (
              <div className="h-full">
                <AiConversationPackageManagement />
              </div>
            )} */}

            {/* Level Pages */}
            {activeTab === "level-a1" && <LevelA1 level="A1" />}
            {activeTab === "level-a2" && <LevelA1 level="A2"/>}
            {activeTab === "level-b1" && <LevelA1 level="B1" />}
            {activeTab === "level-b2" && <LevelA1 level="B2"/>}
            {activeTab === "level-c1" && <LevelA1 level="C1"/>}
            {activeTab === "level-c2" && <LevelA1 level="C2" />}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardManagerLayout;
