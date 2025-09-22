
"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

// Type definitions
interface AssignedMentor {
  id: string;
  name: string;
  specialization: string;
}

interface PurchasedLearner {
  id: string;
  fullName: string;
  email: string;
  purchaseDate: string;
  status: 'Active' | 'Completed' | 'Expired';
}

interface SupportService {
  serviceName: string;
  description: string;
  included: boolean;
}

interface ServicePackage {
  packageId: string;
  packageName: string;
  description: string;
  price: number;
  duration: string;
  withMentor: 'Yes' | 'No';
  numberOfMentorMeeting: number;
  status: 'Active' | 'Inactive';
  category: 'Language' | 'Soft Skills' | 'IT' | 'Career' | 'Business';
  originalPrice: number;
  discountedPrice?: number;
  purchasedCount: number;
  createdDate: string;
  updatedDate: string;
  assignedMentors: AssignedMentor[];
  purchasedLearners: PurchasedLearner[];
  supportPackages?: SupportService[];
}

const samplePackages: ServicePackage[] = [
  {
    packageId: "PKG001",
    packageName: "Basic English Conversation",
    description: "Foundation course for English speaking skills with daily conversation practice",
    price: 500000,
    duration: "30 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 8,
    status: "Active",
    category: "Language",
    originalPrice: 600000,
    discountedPrice: 500000,
    purchasedCount: 145,
    createdDate: "2024-01-15",
    updatedDate: "2025-09-20",
    assignedMentors: [
      { id: "M001", name: "Dr. Sarah Johnson", specialization: "Conversation" },
      { id: "M007", name: "Ms. Sophie Martinez", specialization: "Cultural English" }
    ],
    purchasedLearners: [
      { id: "L001", fullName: "Nguyễn Văn An", email: "an@gmail.com", purchaseDate: "2025-08-15", status: "Active" },
      { id: "L008", fullName: "Bùi Thị Lan", email: "lan@outlook.com", purchaseDate: "2025-09-01", status: "Active" }
    ],
    supportPackages: [
      { serviceName: "Daily Pronunciation Practice", description: "20-minute daily pronunciation exercises with voice recognition", included: true },
      { serviceName: "Vocabulary Flashcards", description: "Interactive digital flashcards with 500+ common words", included: true },
      { serviceName: "Progress Tracking", description: "Weekly progress reports and skill assessment", included: true }
    ]
  },
  {
    packageId: "PKG002", 
    packageName: "IELTS Preparation Premium",
    description: "Comprehensive IELTS preparation with expert mentors and practice tests",
    price: 1200000,
    duration: "60 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 12,
    status: "Active",
    category: "Language",
    originalPrice: 1500000,
    discountedPrice: 1200000,
    purchasedCount: 89,
    createdDate: "2024-02-20",
    updatedDate: "2025-09-18",
    assignedMentors: [
      { id: "M006", name: "Dr. David Kim", specialization: "IELTS" },
      { id: "M001", name: "Dr. Sarah Johnson", specialization: "IELTS Preparation" }
    ],
    purchasedLearners: [
      { id: "L002", fullName: "Trần Thị Bình", email: "binh@email.com", purchaseDate: "2025-08-20", status: "Active" },
      { id: "L006", fullName: "Đỗ Thị Hoa", email: "hoa@gmail.com", purchaseDate: "2025-09-10", status: "Active" }
    ],
    supportPackages: [
      { serviceName: "IELTS Mock Tests", description: "Unlimited access to full-length IELTS practice tests", included: true },
      { serviceName: "Speaking Practice Sessions", description: "AI-powered speaking practice with instant feedback", included: true },
      { serviceName: "Writing Task Reviews", description: "Expert review of writing tasks with detailed feedback", included: true },
      { serviceName: "Vocabulary Builder", description: "IELTS-specific vocabulary learning with example sentences", included: true }
    ]
  },
  {
    packageId: "PKG003",
    packageName: "Business English Mastery",
    description: "Professional English for business communication, presentations and meetings",
    price: 1800000,
    duration: "90 days", 
    withMentor: "Yes",
    numberOfMentorMeeting: 16,
    status: "Active",
    category: "Business",
    originalPrice: 2000000,
    discountedPrice: 1800000,
    purchasedCount: 67,
    createdDate: "2024-03-10",
    updatedDate: "2025-09-15",
    assignedMentors: [
      { id: "M004", name: "Dr. James Rodriguez", specialization: "Business English" },
      { id: "M011", name: "Ms. Jennifer Lee", specialization: "Presentation Skills" }
    ],
    purchasedLearners: [
      { id: "L004", fullName: "Phạm Thu Dung", email: "dung@hotmail.com", purchaseDate: "2025-07-25", status: "Active" },
      { id: "L009", fullName: "Ngô Văn Minh", email: "minh@gmail.com", purchaseDate: "2025-08-30", status: "Active" }
    ],
    supportPackages: [
      { serviceName: "Business Email Templates", description: "Professional email templates for various business situations", included: true },
      { serviceName: "Presentation Skills Workshop", description: "Video tutorials on effective business presentation techniques", included: true },
      { serviceName: "Industry Vocabulary", description: "Specialized vocabulary for different business sectors", included: true }
    ]
  },
  {
    packageId: "PKG004",
    packageName: "TOEFL Complete Course",
    description: "Full TOEFL preparation with academic English focus and test strategies",
    price: 1000000,
    duration: "45 days",
    withMentor: "Yes", 
    numberOfMentorMeeting: 10,
    status: "Active",
    category: "Language",
    originalPrice: 1000000,
    purchasedCount: 52,
    createdDate: "2024-04-05",
    updatedDate: "2025-09-12",
    assignedMentors: [
      { id: "M002", name: "Prof. Michael Chen", specialization: "TOEFL" },
      { id: "M008", name: "Prof. Robert Taylor", specialization: "Academic Writing" }
    ],
    purchasedLearners: [
      { id: "L009", fullName: "Ngô Văn Minh", email: "minh@gmail.com", purchaseDate: "2025-08-01", status: "Completed" }
    ]
  },
  {
    packageId: "PKG005",
    packageName: "Pronunciation Mastery",
    description: "Advanced pronunciation training with phonetics and accent reduction",
    price: 800000,
    duration: "30 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 8,
    status: "Active",
    category: "Language",
    originalPrice: 900000,
    discountedPrice: 800000,
    purchasedCount: 123,
    createdDate: "2024-05-12",
    updatedDate: "2025-09-10",
    assignedMentors: [
      { id: "M005", name: "Ms. Lisa Anderson", specialization: "Pronunciation" },
      { id: "M012", name: "Prof. Mark Brown", specialization: "Phonetics" }
    ],
    purchasedLearners: [
      { id: "L007", fullName: "Vũ Minh Khôi", email: "khoi@yahoo.com", purchaseDate: "2025-08-15", status: "Active" }
    ]
  },
  {
    packageId: "PKG006",
    packageName: "Self-Study Vocabulary Builder",
    description: "Independent vocabulary learning with interactive exercises and quizzes",
    price: 300000,
    duration: "60 days",
    withMentor: "No",
    numberOfMentorMeeting: 0,
    status: "Active", 
    category: "Language",
    originalPrice: 350000,
    discountedPrice: 300000,
    purchasedCount: 267,
    createdDate: "2024-06-18",
    updatedDate: "2025-09-08",
    assignedMentors: [],
    purchasedLearners: [
      { id: "L010", fullName: "Lương Thị Phương", email: "phuong@hotmail.com", purchaseDate: "2025-08-10", status: "Expired" },
      { id: "L013", fullName: "Đinh Văn Hùng", email: "hung@outlook.com", purchaseDate: "2025-09-05", status: "Active" }
    ]
  },
  {
    packageId: "PKG007",
    packageName: "Cambridge Exam Preparation",
    description: "FCE, CAE, CPE exam preparation with certified trainers",
    price: 1500000,
    duration: "75 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 14,
    status: "Active",
    category: "Language", 
    originalPrice: 1700000,
    discountedPrice: 1500000,
    purchasedCount: 34,
    createdDate: "2024-07-22",
    updatedDate: "2025-09-05",
    assignedMentors: [
      { id: "M014", name: "Dr. Alex Johnson", specialization: "Cambridge Exams" }
    ],
    purchasedLearners: [
      { id: "L012", fullName: "Phạm Thị Mai", email: "mai@yahoo.com", purchaseDate: "2025-08-25", status: "Active" }
    ]
  },
  {
    packageId: "PKG008",
    packageName: "Medical English Specialist",
    description: "English for healthcare professionals and medical terminology",
    price: 2200000,
    duration: "120 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 20,
    status: "Active",
    category: "Career",
    originalPrice: 2500000,
    discountedPrice: 2200000,
    purchasedCount: 18,
    createdDate: "2024-08-15",
    updatedDate: "2025-09-02",
    assignedMentors: [
      { id: "M010", name: "Dr. William Foster", specialization: "Medical English" }
    ],
    purchasedLearners: []
  },
  {
    packageId: "PKG009",
    packageName: "Public Speaking Confidence",
    description: "Overcome speaking anxiety and master presentation skills",
    price: 1100000,
    duration: "45 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 10,
    status: "Inactive",
    category: "Soft Skills",
    originalPrice: 1100000,
    purchasedCount: 78,
    createdDate: "2024-09-01",
    updatedDate: "2025-08-30",
    assignedMentors: [
      { id: "M011", name: "Ms. Jennifer Lee", specialization: "Public Speaking" }
    ],
    purchasedLearners: [
      { id: "L011", fullName: "Trịnh Văn Đức", email: "duc@gmail.com", purchaseDate: "2025-07-20", status: "Completed" }
    ]
  },
  {
    packageId: "PKG010",
    packageName: "Creative Writing Workshop",
    description: "Develop creative writing skills with storytelling techniques",
    price: 900000,
    duration: "60 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 8,
    status: "Active",
    category: "Soft Skills",
    originalPrice: 1000000,
    discountedPrice: 900000,
    purchasedCount: 42,
    createdDate: "2024-10-12",
    updatedDate: "2025-08-28",
    assignedMentors: [
      { id: "M015", name: "Ms. Olivia Davis", specialization: "Creative Writing" }
    ],
    purchasedLearners: [
      { id: "L014", fullName: "Võ Thị Thu", email: "thu@gmail.com", purchaseDate: "2025-09-01", status: "Active" }
    ]
  },
  {
    packageId: "PKG011",
    packageName: "Basic IT English Fundamentals",
    description: "Discontinued course covering basic IT terminology and technical communication",
    price: 750000,
    duration: "45 days",
    withMentor: "Yes",
    numberOfMentorMeeting: 6,
    status: "Inactive",
    category: "IT",
    originalPrice: 850000,
    discountedPrice: 750000,
    purchasedCount: 25,
    createdDate: "2024-03-20",
    updatedDate: "2025-07-15",
    assignedMentors: [
      { id: "M013", name: "Mr. Kevin Park", specialization: "Technical English" }
    ],
    purchasedLearners: [
      { id: "L003", fullName: "Lê Minh Cường", email: "cuong@yahoo.com", purchaseDate: "2024-12-10", status: "Expired" },
      { id: "L005", fullName: "Nguyễn Thị Loan", email: "loan@hotmail.com", purchaseDate: "2025-01-20", status: "Completed" }
    ]
  }
];

const ServicePackageManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | 'delete'>('activate');
  const [packageToAction, setPackageToAction] = useState<ServicePackage | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter packages
  const filteredPackages = samplePackages.filter(pkg => {
    const matchesSearch = pkg.packageName.toLowerCase().includes(search.toLowerCase()) ||
                         pkg.packageId.toLowerCase().includes(search.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || pkg.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || pkg.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredPackages.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPackages.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  const handleAction = (pkg: ServicePackage, action: 'activate' | 'deactivate' | 'delete') => {
    setPackageToAction(pkg);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    console.log(`${actionType}ing package:`, packageToAction);
    setShowConfirmDialog(false);
    setPackageToAction(null);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VND';
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </Button>
          <Input
            placeholder="Search packages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[300px]"
          />
          <select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Language">Language</option>
            <option value="Business">Business</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Career">Career</option>
            <option value="IT">IT</option>
          </select>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-700 cursor-pointer"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
          Add Package
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>
                <Checkbox
                  checked={selectedRows.length === filteredPackages.length && filteredPackages.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Package ID</TableHead>
              <TableHead>Package Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>With Mentor</TableHead>
              <TableHead>NumberOfMentorMeeting</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg, idx) => (
              <TableRow key={pkg.packageId} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{pkg.packageId}</TableCell>
                <TableCell className="font-medium">
                  {pkg.packageName}
                  <div className="text-xs text-gray-500">{pkg.category}</div>
                </TableCell>
                <TableCell className="text-gray-600 max-w-[200px] truncate" title={pkg.description}>
                  {pkg.description}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {pkg.discountedPrice ? (
                      <>
                        <div className="text-sm line-through text-gray-400">
                          {formatPrice(pkg.originalPrice)}
                        </div>
                        <div className="text-green-600 font-semibold">
                          {formatPrice(pkg.discountedPrice)}
                        </div>
                      </>
                    ) : (
                      <div className="font-semibold">
                        {formatPrice(pkg.price)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>
                  <Badge 
                    variant={pkg.withMentor === "Yes" ? "default" : "secondary"}
                    className={pkg.withMentor === "Yes" ? "bg-blue-600 text-white" : "bg-gray-400 text-white"}
                  >
                    {pkg.withMentor}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {pkg.withMentor === "Yes" ? pkg.numberOfMentorMeeting : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={pkg.status === "Active" ? "default" : "secondary"}
                    className={pkg.status === "Active" ? "bg-green-600 text-white" : "bg-red-400 text-white"}
                  >
                    {pkg.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdownId(openDropdownId === pkg.packageId ? null : pkg.packageId)}
                      className="p-1 h-8 w-8 cursor-pointer"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </Button>
                    
                    {openDropdownId === pkg.packageId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleViewDetails(pkg);
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
                              handleAction(pkg, pkg.status === 'Active' ? 'deactivate' : 'activate');
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              pkg.status === 'Active' ? 'text-orange-600' : 'text-green-600'
                            }`}
                          >
                            {pkg.status === 'Active' ? (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10"/>
                                  <path d="M8 12l2 2 4-4"/>
                                </svg>
                                Deactivate
                              </>
                            ) : (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10"/>
                                  <path d="M9 12l2 2 4-4"/>
                                </svg>
                                Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              handleAction(pkg, 'delete');
                              setOpenDropdownId(null);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M3 6h18"/>
                              <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/>
                            </svg>
                            Delete
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
        <div>
          ACTIVE PACKAGES: {filteredPackages.filter(p => p.status === "Active").length}/{filteredPackages.length} | 
          TOTAL PURCHASES: {filteredPackages.reduce((sum, p) => sum + p.purchasedCount, 0)}
        </div>
        <div>Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10 of {filteredPackages.length}</div>
      </div>

      {/* Package Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Package Details</h2>
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
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div><span className="font-medium">Package ID:</span> {selectedPackage.packageId}</div>
                    <div><span className="font-medium">Name:</span> {selectedPackage.packageName}</div>
                    <div><span className="font-medium">Category:</span> 
                      <Badge className="ml-2" variant="outline">{selectedPackage.category}</Badge>
                    </div>
                    <div><span className="font-medium">Description:</span> {selectedPackage.description}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${selectedPackage.status === 'Active' ? 'bg-green-600' : 'bg-red-400'}`}>
                        {selectedPackage.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Package Details</h3>
                  <div className="space-y-3">
                    <div><span className="font-medium">Duration:</span> {selectedPackage.duration}</div>
                    <div><span className="font-medium">With Mentor:</span> 
                      <Badge className={`ml-2 ${selectedPackage.withMentor === 'Yes' ? 'bg-blue-600' : 'bg-gray-400'}`}>
                        {selectedPackage.withMentor}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Mentor Meetings:</span> {selectedPackage.numberOfMentorMeeting}</div>
                    <div><span className="font-medium">Purchased Count:</span> 
                      <span className="ml-2 font-bold text-blue-600">{selectedPackage.purchasedCount} learners</span>
                    </div>
                    <div><span className="font-medium">Created:</span> {selectedPackage.createdDate}</div>
                    <div><span className="font-medium">Updated:</span> {selectedPackage.updatedDate}</div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold mb-4">💰 Pricing Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Original Price</span>
                      <div className="text-lg font-semibold">{formatPrice(selectedPackage.originalPrice)}</div>
                    </div>
                    {selectedPackage.discountedPrice && (
                      <div>
                        <span className="text-sm text-gray-600">Discounted Price</span>
                        <div className="text-lg font-semibold text-green-600">{formatPrice(selectedPackage.discountedPrice)}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Current Price</span>
                      <div className="text-lg font-semibold text-blue-600">{formatPrice(selectedPackage.price)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Mentors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">👨‍🏫 Assigned Mentors</h3>
                {selectedPackage.assignedMentors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPackage.assignedMentors.map((mentor) => (
                      <Card key={mentor.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="font-medium">{mentor.name}</div>
                          <div className="text-sm text-gray-600">{mentor.specialization}</div>
                          <div className="text-xs text-blue-600">{mentor.id}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No mentors assigned</div>
                )}
              </div>

              {/* Purchased Learners */}
              <div>
                <h3 className="text-lg font-semibold mb-4">🎓 Purchased Learners</h3>
                {selectedPackage.purchasedLearners.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Learner ID</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Purchase Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPackage.purchasedLearners.map((learner) => (
                          <TableRow key={learner.id}>
                            <TableCell className="font-medium text-blue-600">{learner.id}</TableCell>
                            <TableCell>{learner.fullName}</TableCell>
                            <TableCell className="text-gray-600">{learner.email}</TableCell>
                            <TableCell>{learner.purchaseDate}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={`${
                                  learner.status === 'Active' ? 'text-green-600 border-green-300 bg-green-50' :
                                  learner.status === 'Completed' ? 'text-blue-600 border-blue-300 bg-blue-50' :
                                  'text-red-600 border-red-300 bg-red-50'
                                }`}
                              >
                                {learner.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    No learners have purchased this package yet
                  </div>
                )}
              </div>

              {/* Support Services */}
              <div>
                <h3 className="text-lg font-semibold mb-4">�️ Support Services Included</h3>
                {selectedPackage.supportPackages && selectedPackage.supportPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPackage.supportPackages.map((service, index) => (
                      <Card key={index} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-blue-600">{service.serviceName}</div>
                            <div className={`text-sm px-2 py-1 rounded-full ${
                              service.included ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {service.included ? '✓ Included' : 'Not Included'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{service.description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    No additional support services included with this package
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && packageToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {actionType === 'activate' ? 'Activate' : actionType === 'deactivate' ? 'Deactivate' : 'Delete'} Package
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} <strong>{packageToAction.packageName}</strong>? 
              {actionType === 'delete' 
                ? ' This action cannot be undone.' 
                : actionType === 'deactivate'
                ? ' This will hide the package from learners.'
                : ' This will make the package visible to learners.'}
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)} 
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction}
                className={
                  actionType === 'delete' ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 
                  actionType === 'activate' ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 
                  'bg-orange-600 hover:bg-orange-700 cursor-pointer'
                }
              >
                {actionType === 'activate' ? 'Activate' : actionType === 'deactivate' ? 'Deactivate' : 'Delete'} Package
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Add New Package</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                {/* Package Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Package Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Package Name *</label>
                      <Input 
                        placeholder="e.g., Advanced English Course" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <textarea 
                        placeholder="Describe the package content and objectives..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pricing & Duration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (VND) *</label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 1000000" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration *</label>
                      <Input 
                        placeholder="e.g., 30 days" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Discount Percent (%)</label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 20" 
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Mentor Configuration */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Mentor Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">With Mentor *</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value="">Select Option</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Mentor Meetings</label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 8" 
                        className="w-full"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty or 0 if no mentor meetings</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-6 border-t">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowCreateModal(false)} 
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                  >
                    Create Package
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackageManagement;
