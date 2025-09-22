
"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

// Type definitions
interface Package {
  name: string;
  duration: string;
  price: string;
  status: 'Active' | 'Completed' | 'Expired';
}

interface Achievement {
  name: string;
  description: string;
  points: number;
  icon: string;
  date: string;
  requirement: string;
}

interface Learner {
  id: string;
  fullName: string;
  email: string;
  pronunciationScore: number;
  favouriteLevelGoal: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  totalLessons: number;
  purchasedPackages: Package[];
  achievements: Achievement[];
}

const sampleLearners: Learner[] = [
  {
    id: "L001",
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    pronunciationScore: 8.5,
    favouriteLevelGoal: "Intermediate",
    status: "Active",
    joinedDate: "2024-01-15",
    totalLessons: 45,
    purchasedPackages: [
      { name: "Premium", duration: "60 days", price: "1,000,000 VND", status: "Active" },
      { name: "IELTS Preparation", duration: "30 days", price: "800,000 VND", status: "Completed" }
    ],
    achievements: [
      { name: "Good Pronunciation", description: "Achieved 70%+ accuracy in 5 lessons", points: 40, icon: "�", date: "2025-09-30", requirement: "5 lessons ≥70% accuracy" },
      { name: "Great Pronunciation", description: "Achieved 80%+ accuracy in 5 lessons", points: 60, icon: "⭐", date: "2025-08-25", requirement: "5 lessons ≥80% accuracy" },
      { name: "Perfect Pronunciation", description: "Achieved 90%+ accuracy in 5 lessons", points: 80, icon: "🎯", date: "2025-08-15", requirement: "5 lessons ≥90% accuracy" }
    ]
  },
  {
    id: "L002",
    fullName: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    pronunciationScore: 7.2,
    favouriteLevelGoal: "Advanced",
    status: "Active",
    joinedDate: "2024-02-20",
    totalLessons: 32,
    purchasedPackages: [
      { name: "Starter", duration: "30 days", price: "500,000 VND", status: "Active" }
    ],
    achievements: [
      { name: "First Steps", description: "Completed first 10 lessons", points: 30, icon: "🌟", date: "2025-07-10", requirement: "Complete 10 lessons" },
      { name: "Good Pronunciation", description: "Achieved 70%+ accuracy in 5 lessons", points: 50, icon: "🗣️", date: "2025-08-05", requirement: "5 lessons ≥70% accuracy" }
    ]
  },
  {
    id: "L003",
    fullName: "Lê Minh Cường",
    email: "leminhcuong@yahoo.com",
    pronunciationScore: 6.8,
    favouriteLevelGoal: "Beginner",
    status: "Inactive",
    joinedDate: "2023-12-05",
    totalLessons: 18,
    purchasedPackages: [
      { name: "Basic English", duration: "15 days", price: "300,000 VND", status: "Expired" }
    ],
    achievements: []
  },
  {
    id: "L004",
    fullName: "Phạm Thu Dung",
    email: "phamthudung@hotmail.com",
    pronunciationScore: 9.1,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-03-10",
    totalLessons: 67,
    purchasedPackages: [
      { name: "Premium Plus", duration: "90 days", price: "1,500,000 VND", status: "Active" },
      { name: "Business English", duration: "45 days", price: "900,000 VND", status: "Completed" }
    ],
    achievements: [
      { name: "Expert Speaker", description: "Achieved 95%+ accuracy in 10 lessons", points: 100, icon: "🎓", date: "2025-09-01", requirement: "10 lessons ≥95% accuracy (Native Speaker Level)" },
      { name: "Consistency King", description: "Completed lessons for 30 days straight", points: 75, icon: "📚", date: "2025-08-20", requirement: "30 consecutive days learning" },
      { name: "Perfect Pronunciation", description: "Achieved 90%+ accuracy in 5 lessons", points: 80, icon: "🎯", date: "2025-07-15", requirement: "5 lessons ≥90% accuracy" }
    ]
  },
  {
    id: "L005",
    fullName: "Hoàng Văn Em",
    email: "hoangvanem@gmail.com",
    pronunciationScore: 5.9,
    favouriteLevelGoal: "Intermediate",
    status: "Inactive",
    joinedDate: "2024-01-30",
    totalLessons: 12,
    purchasedPackages: [],
    achievements: []
  },
  {
    id: "L006",
    fullName: "Đỗ Thị Hoa",
    email: "dothihoa@gmail.com",
    pronunciationScore: 7.8,
    favouriteLevelGoal: "Advanced",
    status: "Active",
    joinedDate: "2024-04-12",
    totalLessons: 38,
    purchasedPackages: [
      { name: "IELTS Premium", duration: "60 days", price: "1,200,000 VND", status: "Active" }
    ],
    achievements: [
      { name: "Good Pronunciation", description: "Achieved 70%+ accuracy in 5 lessons", points: 40, icon: "🌟", date: "2025-06-15", requirement: "5 lessons ≥70% accuracy" },
      { name: "Weekly Warrior", description: "Completed 7 days streak", points: 35, icon: "🔥", date: "2025-07-20", requirement: "7 consecutive days learning" }
    ]
  },
  {
    id: "L007",
    fullName: "Vũ Minh Khôi",
    email: "vuminhkhoi@yahoo.com",
    pronunciationScore: 8.9,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-05-08",
    totalLessons: 52,
    purchasedPackages: [
      { name: "Business Pro", duration: "90 days", price: "1,800,000 VND", status: "Active" },
      { name: "Speaking Mastery", duration: "45 days", price: "750,000 VND", status: "Completed" }
    ],
    achievements: [
      { name: "Perfect Pronunciation", description: "Achieved 90%+ accuracy in 5 lessons", points: 80, icon: "🎯", date: "2025-08-10", requirement: "5 lessons ≥90% accuracy" },
      { name: "Speed Learner", description: "Completed 20 lessons in 10 days", points: 65, icon: "⚡", date: "2025-07-25", requirement: "High learning velocity" }
    ]
  },
  {
    id: "L008",
    fullName: "Bùi Thị Lan",
    email: "buithilan@outlook.com",
    pronunciationScore: 6.3,
    favouriteLevelGoal: "Intermediate",
    status: "Active",
    joinedDate: "2024-06-20",
    totalLessons: 24,
    purchasedPackages: [
      { name: "Standard", duration: "30 days", price: "600,000 VND", status: "Active" }
    ],
    achievements: [
      { name: "First Steps", description: "Completed first 10 lessons", points: 30, icon: "🌟", date: "2025-08-01", requirement: "Complete 10 lessons" }
    ]
  },
  {
    id: "L009",
    fullName: "Ngô Văn Minh",
    email: "ngovanminh@gmail.com",
    pronunciationScore: 9.3,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-02-14",
    totalLessons: 78,
    purchasedPackages: [
      { name: "Ultimate", duration: "120 days", price: "2,200,000 VND", status: "Active" },
      { name: "TOEFL Prep", duration: "60 days", price: "1,100,000 VND", status: "Completed" },
      { name: "Advanced Grammar", duration: "30 days", price: "500,000 VND", status: "Completed" }
    ],
    achievements: [
      { name: "Expert Speaker", description: "Achieved 95%+ accuracy in 10 lessons", points: 100, icon: "🎓", date: "2025-09-05", requirement: "10 lessons ≥95% accuracy (Native Speaker Level)" },
      { name: "Perfect Pronunciation", description: "Achieved 90%+ accuracy in 5 lessons", points: 80, icon: "🎯", date: "2025-08-01", requirement: "5 lessons ≥90% accuracy" },
      { name: "Marathon Runner", description: "Completed 50+ lessons", points: 90, icon: "🏃‍♂️", date: "2025-09-10", requirement: "Complete 50+ lessons" }
    ]
  },
  {
    id: "L010",
    fullName: "Lương Thị Phương",
    email: "luongthiphuong@hotmail.com",
    pronunciationScore: 5.4,
    favouriteLevelGoal: "Beginner",
    status: "Inactive",
    joinedDate: "2024-03-25",
    totalLessons: 8,
    purchasedPackages: [
      { name: "Basic Starter", duration: "15 days", price: "250,000 VND", status: "Expired" }
    ],
    achievements: []
  },
  {
    id: "L011",
    fullName: "Trịnh Văn Đức",
    email: "trinhvanduc@gmail.com",
    pronunciationScore: 7.5,
    favouriteLevelGoal: "Advanced",
    status: "Active",
    joinedDate: "2024-07-10",
    totalLessons: 29,
    purchasedPackages: [
      { name: "Intensive", duration: "45 days", price: "850,000 VND", status: "Active" }
    ],
    achievements: [
      { name: "Good Pronunciation", description: "Achieved 70%+ accuracy in 5 lessons", points: 40, icon: "🌟", date: "2025-08-15", requirement: "5 lessons ≥70% accuracy" },
      { name: "Dedicated Learner", description: "Logged in 15 consecutive days", points: 45, icon: "💪", date: "2025-09-01", requirement: "15 consecutive days active" }
    ]
  },
  {
    id: "L012",
    fullName: "Phạm Thị Mai",
    email: "phamthimai@yahoo.com",
    pronunciationScore: 8.2,
    favouriteLevelGoal: "Advanced",
    status: "Active",
    joinedDate: "2024-08-05",
    totalLessons: 41,
    purchasedPackages: [
      { name: "Premium", duration: "60 days", price: "1,000,000 VND", status: "Active" },
      { name: "Conversation Plus", duration: "30 days", price: "650,000 VND", status: "Active" }
    ],
    achievements: [
      { name: "Great Pronunciation", description: "Achieved 80%+ accuracy in 5 lessons", points: 60, icon: "⭐", date: "2025-09-12", requirement: "5 lessons ≥80% accuracy" },
      { name: "Social Butterfly", description: "Participated in 20+ conversations", points: 55, icon: "🦋", date: "2025-09-18", requirement: "20+ conversation sessions" }
    ]
  },
  {
    id: "L013",
    fullName: "Đinh Văn Hùng",
    email: "dinhvanhung@outlook.com",
    pronunciationScore: 6.9,
    favouriteLevelGoal: "Intermediate",
    status: "Inactive",
    joinedDate: "2023-11-18",
    totalLessons: 15,
    purchasedPackages: [
      { name: "Standard", duration: "30 days", price: "600,000 VND", status: "Expired" }
    ],
    achievements: [
      { name: "First Steps", description: "Completed first 10 lessons", points: 30, icon: "🌟", date: "2024-01-05", requirement: "Complete 10 lessons" }
    ]
  },
  {
    id: "L014",
    fullName: "Võ Thị Thu",
    email: "vothithu@gmail.com",
    pronunciationScore: 8.7,
    favouriteLevelGoal: "Expert",
    status: "Active",
    joinedDate: "2024-09-01",
    totalLessons: 19,
    purchasedPackages: [
      { name: "Fast Track", duration: "30 days", price: "900,000 VND", status: "Active" }
    ],
    achievements: [
      { name: "Quick Start", description: "Completed 15 lessons in first week", points: 50, icon: "🚀", date: "2025-09-08", requirement: "15 lessons in 7 days" }
    ]
  },
  {
    id: "L015",
    fullName: "Hồ Văn Tài",
    email: "hovantai@hotmail.com",
    pronunciationScore: 7.1,
    favouriteLevelGoal: "Intermediate",
    status: "Active",
    joinedDate: "2024-04-28",
    totalLessons: 33,
    purchasedPackages: [
      { name: "Regular", duration: "45 days", price: "700,000 VND", status: "Active" }
    ],
    achievements: [
      { name: "Good Pronunciation", description: "Achieved 70%+ accuracy in 5 lessons", points: 40, icon: "🌟", date: "2025-07-12", requirement: "5 lessons ≥70% accuracy" },
      { name: "Steady Progress", description: "Consistent learning for 20 days", points: 40, icon: "📈", date: "2025-08-28", requirement: "20 days consistent learning" }
    ]
  }
];

const LearnerManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'block' | 'unblock'>('block');
  const [learnerToAction, setLearnerToAction] = useState<Learner | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter learners by search
  const filteredLearners = sampleLearners.filter(
    learner => 
      learner.fullName.toLowerCase().includes(search.toLowerCase()) || 
      learner.email.toLowerCase().includes(search.toLowerCase()) ||
      learner.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredLearners.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredLearners.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (learner: Learner) => {
    setSelectedLearner(learner);
    setShowDetailsModal(true);
  };

  const handleBlockUnblock = (learner: Learner, action: 'block' | 'unblock') => {
    setLearnerToAction(learner);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    // Here you would make the API call to block/unblock the user
    console.log(`${actionType}ing user:`, learnerToAction);
    setShowConfirmDialog(false);
    setLearnerToAction(null);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </Button>
          <Input
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[300px]"
          />
        </div>
       
      </div>
      
      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>
                <Checkbox
                  checked={selectedRows.length === filteredLearners.length && filteredLearners.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Learner ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pronunciation Score</TableHead>
              <TableHead>Level Goal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLearners.map((learner, idx) => (
              <TableRow key={learner.id} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{learner.id}</TableCell>
                <TableCell className="font-medium">{learner.fullName}</TableCell>
                <TableCell className="text-gray-600">{learner.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${learner.pronunciationScore >= 8 ? 'text-green-600' : learner.pronunciationScore >= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {learner.pronunciationScore}/10
                    </span>
                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${learner.pronunciationScore >= 8 ? 'bg-green-500' : learner.pronunciationScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${learner.pronunciationScore * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {learner.favouriteLevelGoal}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={learner.status === "Active" ? "default" : "secondary"} 
                    className={learner.status === "Active" ? "bg-green-600 text-white" : "bg-gray-400 text-white"}
                  >
                    {learner.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdownId(openDropdownId === learner.id ? null : learner.id)}
                      className="p-1 h-8 w-8 cursor-pointer"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </Button>
                    
                    {openDropdownId === learner.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 ">
                        <div className="py-1 ">
                          <button
                            onClick={() => {
                              handleViewDetails(learner);
                              setOpenDropdownId(null);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              handleBlockUnblock(learner, learner.status === 'Active' ? 'block' : 'unblock');
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              learner.status === 'Active' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {learner.status === 'Active' ? (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                                  <circle cx="12" cy="16" r="1"/>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Block User
                              </>
                            ) : (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Unblock User
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>ACTIVE LEARNERS: {filteredLearners.filter(l => l.status === "Active").length}/{filteredLearners.length}</div>
        <div>Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10 of {filteredLearners.length}</div>
      </div>

      {/* Learner Details Modal */}
      {showDetailsModal && selectedLearner && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Learner Details Information</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div><span className="font-medium">ID:</span> {selectedLearner.id}</div>
                    <div><span className="font-medium">Full Name:</span> {selectedLearner.fullName}</div>
                    <div><span className="font-medium">Email:</span> {selectedLearner.email}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${selectedLearner.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}>
                        {selectedLearner.status}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Joined:</span> {selectedLearner.joinedDate}</div>
                    <div><span className="font-medium">Total Lessons:</span> {selectedLearner.totalLessons}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Pronunciation Score:</span>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xl font-bold text-blue-600">{selectedLearner.pronunciationScore}/10</span>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full">
                          <div 
                            className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                            style={{ width: `${selectedLearner.pronunciationScore * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div><span className="font-medium">Level Goal:</span> 
                      <Badge variant="outline" className="ml-2">{selectedLearner.favouriteLevelGoal}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchased Packages */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Các gói dịch vụ đã mua (Purchase)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedLearner.purchasedPackages.map((pkg: Package, index: number) => (
                    <Card key={index} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-lg ${pkg.name === 'Premium' ? 'text-blue-600' : 'text-orange-500'}`}>
                            {pkg.name}
                          </CardTitle>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${pkg.status === 'Active' ? 'bg-blue-500' : 'bg-gray-400'}`}>
                            {pkg.status === 'Active' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                        </div>
                        <CardDescription>{pkg.duration}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-center py-2 px-4 rounded text-white font-semibold ${pkg.name === 'Premium' ? 'bg-orange-500' : 'bg-purple-600'}`}>
                          {pkg.price}
                        </div>
                        <div className="text-center mt-2 text-sm text-gray-600">
                          {pkg.status === 'Active' ? '2 Months' : '1 Month'}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {selectedLearner.purchasedPackages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No packages purchased yet</div>
                )}
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Danh sách thành tích learner đã đạt được</h3>
                <div className="text-sm text-gray-600 mb-4">Tổng số lượng thành tích đã đạt được: {selectedLearner.achievements.length}</div>
                
                {selectedLearner.achievements.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Requirements</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Icon</TableHead>
                          <TableHead>Earned Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLearner.achievements.map((achievement: Achievement, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{achievement.name}</TableCell>
                            <TableCell className="text-sm">{achievement.description}</TableCell>
                            <TableCell className="text-xs text-blue-600 font-medium">{achievement.requirement}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                {achievement.points} pts
                              </Badge>
                            </TableCell>
                            <TableCell className="text-2xl">{achievement.icon}</TableCell>
                            <TableCell className="text-sm text-gray-500">{achievement.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    No achievements yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && learnerToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {actionType === 'block' ? 'Block' : 'Unblock'} User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} <strong>{learnerToAction.fullName}</strong>? 
              {actionType === 'block' 
                ? ' This will prevent them from accessing the platform.' 
                : ' This will restore their access to the platform.'}
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)} className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction}
                className={actionType === 'block' ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}
              >
                {actionType === 'block' ? 'Block User' : 'Unblock User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerManagement;
