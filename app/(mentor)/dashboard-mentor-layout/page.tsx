
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ScheduleMentor from "../schedule-mentor/page";
import StatisticsForMentor from "../statistics-for-mentor/page";
import MentorProfile from "../mentor-profile/page";
import ContentLibrary from "../content-library/page";

const DashboardMentorLayout = () => {
  const [activeTab, setActiveTab] = useState("statisticsForMentor");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    {
      id: "statisticsForMentor",
      label: "Statistics",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 3v5h5M21 21v-5h-5"/>
          <path d="M21 12A9 9 0 0 0 3 12a9 9 0 0 0 18 0"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      path: "/statistics-for-mentor"
    },
    {
      id: "profileMentor", 
      label: "Profile",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      path: "/mentor-profile"
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      path: "/schedule-mentor"
    },

    {
      id: "contentLibrary",
      label: "Content Library",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      path: "/content-library"
    },
  
  ];

 
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Dark Gradient Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-72' : 'w-20'
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-white">Mentor Hub</h1>
                  <p className="text-xs text-slate-400">Teaching Excellence</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-2"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
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
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center transition-all duration-200 rounded-xl ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    } ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'px-3 py-3 justify-center'}`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <span className={activeTab === item.id ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-medium text-sm">SM</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Sarah Miller</p>
                <p className="text-xs text-slate-400 truncate">Senior Mentor</p>
              </div>
            )}
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
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
                      {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                    </h1>
                    <div className="h-6 w-px bg-gradient-to-b from-slate-200 to-transparent"></div>
                    <span className="text-sm text-slate-500 font-medium">Mentor Hub</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Welcome back, Sarah! Here&apos;s what&apos;s happening today.
                  </p>
                </div>
              </div>
             
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-white">
          <div className="p-6 h-full">
            {activeTab === 'statisticsForMentor' && (
              <div className="h-full">
                <StatisticsForMentor />
              </div>
            )}
            
            {activeTab === 'profileMentor' && (
              <div className="h-full">
                <MentorProfile />
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="h-full">
                <ScheduleMentor />
              </div>
            )}

            {activeTab === 'contentLibrary' && (
              <div className="h-full">
                <ContentLibrary />
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMentorLayout;
