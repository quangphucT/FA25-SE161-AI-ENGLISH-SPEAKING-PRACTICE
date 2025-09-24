
"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

// Type definitions
interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  status: 'Open' | 'Booked' | 'Completed';
  date: string;
}

interface ContentLibrary {
  id: string;
  title: string;
  type: 'E-Book' | 'VIDEO' | 'PDF';
  url: string;
}

interface Feedback {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface Mentor {
  id: string;
  fullName: string;
  email: string;
  status: 'Active' | 'Inactive';
  experience: number;
  rating: number;
  mentorStatus: 'Available' | 'Busy' | 'Offline';
  joinedDate: string;
  specializations: string[];
  schedules: Schedule[];
  contentLibrary: ContentLibrary[];
  feedbacks: Feedback[];
}

const sampleMentors: Mentor[] = [
  {
    id: "M001",
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    status: "Active",
    experience: 8,
    rating: 4.8,
    mentorStatus: "Available",
    joinedDate: "2024-01-15",
    specializations: ["IELTS Preparation", "Business English", "Pronunciation"],
    schedules: [
      { id: 1, startTime: "09:00", endTime: "10:00", status: "Open", date: "2025-09-21" },
      { id: 2, startTime: "14:00", endTime: "15:00", status: "Booked", date: "2025-09-22" }
    ],
    contentLibrary: [
      { id: "ghd-123", title: "Introduction to Machine Learning", type: "E-Book", url: "http://example.com/ml-intro" },
      { id: "abc-12fg", title: "Advanced English Grammar", type: "VIDEO", url: "http://example.com/grammar-video" }
    ],
    feedbacks: [
      { id: 1, fullName: "Trần Quang Phúc", email: "phuc@gmail.com", phone: "0335785100", content: "Good", rating: 5, createdAt: "2025-09-30" }
    ]
  },
  {
    id: "M002",
    fullName: "Prof. Michael Chen",
    email: "michael.chen@example.com",
    status: "Active",
    experience: 12,
    rating: 4.9,
    mentorStatus: "Busy",
    joinedDate: "2023-11-20",
    specializations: ["TOEFL", "Academic Writing", "Speaking Skills"],
    schedules: [
      { id: 3, startTime: "10:00", endTime: "11:00", status: "Completed", date: "2025-09-20" },
      { id: 4, startTime: "16:00", endTime: "17:00", status: "Open", date: "2025-09-25" }
    ],
    contentLibrary: [
      { id: "def-456", title: "TOEFL Speaking Strategies", type: "PDF", url: "http://example.com/toefl-speaking" },
      { id: "xyz-789", title: "Academic Writing Masterclass", type: "VIDEO", url: "http://example.com/academic-writing" }
    ],
    feedbacks: [
      { id: 2, fullName: "Nguyễn Văn An", email: "an@email.com", phone: "0123456789", content: "Excellent teaching", rating: 5, createdAt: "2025-09-25" },
      { id: 3, fullName: "Lê Thị Hoa", email: "hoa@gmail.com", phone: "0987654321", content: "Very helpful", rating: 4, createdAt: "2025-09-20" }
    ]
  },
  {
    id: "M003",
    fullName: "Ms. Emma Wilson",
    email: "emma.wilson@example.com",
    status: "Inactive",
    experience: 5,
    rating: 4.3,
    mentorStatus: "Offline",
    joinedDate: "2024-03-10",
    specializations: ["Conversational English", "Grammar"],
    schedules: [],
    contentLibrary: [
      { id: "conv-101", title: "Daily Conversation Guide", type: "E-Book", url: "http://example.com/conversation" }
    ],
    feedbacks: []
  },
  {
    id: "M004",
    fullName: "Dr. James Rodriguez",
    email: "james.rodriguez@example.com",
    status: "Active",
    experience: 10,
    rating: 4.7,
    mentorStatus: "Available",
    joinedDate: "2023-08-05",
    specializations: ["Business English", "Presentation Skills", "Interview Preparation"],
    schedules: [
      { id: 5, startTime: "13:00", endTime: "14:00", status: "Open", date: "2025-09-23" },
      { id: 6, startTime: "15:00", endTime: "16:00", status: "Open", date: "2025-09-23" },
      { id: 7, startTime: "09:00", endTime: "10:00", status: "Booked", date: "2025-09-24" }
    ],
    contentLibrary: [
      { id: "biz-100", title: "Business Communication Essentials", type: "VIDEO", url: "http://example.com/business-comm" },
      { id: "interview-200", title: "Interview Success Guide", type: "PDF", url: "http://example.com/interview" }
    ],
    feedbacks: [
      { id: 4, fullName: "Lê Thị Mai", email: "mai@yahoo.com", phone: "0987654321", content: "Very helpful", rating: 4, createdAt: "2025-09-20" },
      { id: 5, fullName: "Phạm Văn Đức", email: "duc@outlook.com", phone: "0123789456", content: "Great mentor", rating: 5, createdAt: "2025-09-15" }
    ]
  },
  {
    id: "M005",
    fullName: "Ms. Lisa Anderson",
    email: "lisa.anderson@example.com",
    status: "Active",
    experience: 6,
    rating: 4.5,
    mentorStatus: "Available",
    joinedDate: "2024-02-28",
    specializations: ["Pronunciation", "Accent Reduction", "Phonetics"],
    schedules: [
      { id: 8, startTime: "11:00", endTime: "12:00", status: "Open", date: "2025-09-24" },
      { id: 9, startTime: "14:00", endTime: "15:00", status: "Completed", date: "2025-09-18" }
    ],
    contentLibrary: [
      { id: "pron-300", title: "Pronunciation Practice Guide", type: "E-Book", url: "http://example.com/pronunciation" },
      { id: "accent-400", title: "Accent Reduction Techniques", type: "VIDEO", url: "http://example.com/accent" }
    ],
    feedbacks: [
      { id: 6, fullName: "Võ Thị Lan", email: "lan@gmail.com", phone: "0345678912", content: "Improved my pronunciation significantly", rating: 5, createdAt: "2025-09-10" }
    ]
  },
  {
    id: "M006",
    fullName: "Dr. David Kim",
    email: "david.kim@example.com",
    status: "Active",
    experience: 15,
    rating: 4.9,
    mentorStatus: "Busy",
    joinedDate: "2022-05-12",
    specializations: ["IELTS", "Academic English", "Test Preparation", "Writing Skills"],
    schedules: [
      { id: 10, startTime: "08:00", endTime: "09:00", status: "Booked", date: "2025-09-26" },
      { id: 11, startTime: "10:00", endTime: "11:00", status: "Booked", date: "2025-09-26" },
      { id: 12, startTime: "15:00", endTime: "16:00", status: "Open", date: "2025-09-27" }
    ],
    contentLibrary: [
      { id: "ielts-500", title: "IELTS Complete Guide", type: "E-Book", url: "http://example.com/ielts-guide" },
      { id: "write-600", title: "Academic Writing Mastery", type: "PDF", url: "http://example.com/academic-writing" },
      { id: "test-700", title: "Test Taking Strategies", type: "VIDEO", url: "http://example.com/test-strategies" }
    ],
    feedbacks: [
      { id: 7, fullName: "Nguyễn Thị Bình", email: "binh@yahoo.com", phone: "0912345678", content: "Excellent IELTS preparation", rating: 5, createdAt: "2025-09-12" },
      { id: 8, fullName: "Trần Văn Hưng", email: "hung@gmail.com", phone: "0123456780", content: "Very thorough teaching", rating: 5, createdAt: "2025-09-08" }
    ]
  },
  {
    id: "M007",
    fullName: "Ms. Sophie Martinez",
    email: "sophie.martinez@example.com",
    status: "Active",
    experience: 7,
    rating: 4.6,
    mentorStatus: "Available",
    joinedDate: "2023-09-18",
    specializations: ["Conversation", "Cultural English", "Travel English"],
    schedules: [
      { id: 13, startTime: "12:00", endTime: "13:00", status: "Open", date: "2025-09-25" },
      { id: 14, startTime: "17:00", endTime: "18:00", status: "Open", date: "2025-09-25" }
    ],
    contentLibrary: [
      { id: "conv-800", title: "Everyday Conversations", type: "VIDEO", url: "http://example.com/conversations" },
      { id: "travel-900", title: "English for Travelers", type: "E-Book", url: "http://example.com/travel-english" }
    ],
    feedbacks: [
      { id: 9, fullName: "Hoàng Văn Minh", email: "minh@outlook.com", phone: "0987123456", content: "Fun and engaging lessons", rating: 4, createdAt: "2025-09-05" }
    ]
  },
  {
    id: "M008",
    fullName: "Prof. Robert Taylor",
    email: "robert.taylor@example.com",
    status: "Active",
    experience: 20,
    rating: 4.8,
    mentorStatus: "Available",
    joinedDate: "2021-11-30",
    specializations: ["Advanced Grammar", "Literature", "Essay Writing", "Critical Thinking"],
    schedules: [
      { id: 15, startTime: "09:00", endTime: "10:00", status: "Completed", date: "2025-09-19" },
      { id: 16, startTime: "14:00", endTime: "15:00", status: "Open", date: "2025-09-28" },
      { id: 17, startTime: "16:00", endTime: "17:00", status: "Open", date: "2025-09-28" }
    ],
    contentLibrary: [
      { id: "gram-1000", title: "Advanced Grammar Rules", type: "PDF", url: "http://example.com/advanced-grammar" },
      { id: "lit-1100", title: "English Literature Analysis", type: "E-Book", url: "http://example.com/literature" },
      { id: "essay-1200", title: "Essay Writing Techniques", type: "VIDEO", url: "http://example.com/essay-writing" }
    ],
    feedbacks: [
      { id: 10, fullName: "Lê Văn Tài", email: "tai@gmail.com", phone: "0345612789", content: "Deep knowledge and great teaching", rating: 5, createdAt: "2025-09-03" },
      { id: 11, fullName: "Phạm Thị Thu", email: "thu@yahoo.com", phone: "0789123456", content: "Challenging but rewarding", rating: 4, createdAt: "2025-08-28" }
    ]
  },
  {
    id: "M009",
    fullName: "Ms. Anna Thompson",
    email: "anna.thompson@example.com",
    status: "Inactive",
    experience: 4,
    rating: 4.2,
    mentorStatus: "Offline",
    joinedDate: "2024-06-15",
    specializations: ["Basic English", "Kids English"],
    schedules: [],
    contentLibrary: [
      { id: "kids-1300", title: "English for Children", type: "VIDEO", url: "http://example.com/kids-english" }
    ],
    feedbacks: [
      { id: 12, fullName: "Nguyễn Thị Mai", email: "mai.nguyen@gmail.com", phone: "0912678345", content: "Good with beginners", rating: 4, createdAt: "2025-08-20" }
    ]
  },
  {
    id: "M010",
    fullName: "Dr. William Foster",
    email: "william.foster@example.com",
    status: "Active",
    experience: 14,
    rating: 4.7,
    mentorStatus: "Busy",
    joinedDate: "2022-12-08",
    specializations: ["Medical English", "Technical English", "Scientific Writing"],
    schedules: [
      { id: 18, startTime: "07:00", endTime: "08:00", status: "Booked", date: "2025-09-29" },
      { id: 19, startTime: "18:00", endTime: "19:00", status: "Booked", date: "2025-09-29" }
    ],
    contentLibrary: [
      { id: "med-1400", title: "Medical English Terminology", type: "E-Book", url: "http://example.com/medical-english" },
      { id: "tech-1500", title: "Technical Communication", type: "PDF", url: "http://example.com/technical-comm" },
      { id: "sci-1600", title: "Scientific Writing Guide", type: "VIDEO", url: "http://example.com/scientific-writing" }
    ],
    feedbacks: [
      { id: 13, fullName: "Bác sĩ Trần Văn An", email: "bs.tran@hospital.com", phone: "0123987654", content: "Perfect for medical professionals", rating: 5, createdAt: "2025-09-01" }
    ]
  },
  {
    id: "M011",
    fullName: "Ms. Jennifer Lee",
    email: "jennifer.lee@example.com",
    status: "Active",
    experience: 9,
    rating: 4.5,
    mentorStatus: "Available",
    joinedDate: "2023-03-22",
    specializations: ["Public Speaking", "Presentation Skills", "Confidence Building"],
    schedules: [
      { id: 20, startTime: "11:00", endTime: "12:00", status: "Open", date: "2025-09-30" },
      { id: 21, startTime: "13:00", endTime: "14:00", status: "Open", date: "2025-09-30" }
    ],
    contentLibrary: [
      { id: "speak-1700", title: "Public Speaking Mastery", type: "VIDEO", url: "http://example.com/public-speaking" },
      { id: "conf-1800", title: "Building Confidence in English", type: "E-Book", url: "http://example.com/confidence" }
    ],
    feedbacks: [
      { id: 14, fullName: "Võ Minh Khôi", email: "khoi@company.com", phone: "0987456123", content: "Helped me overcome speaking anxiety", rating: 5, createdAt: "2025-09-07" },
      { id: 15, fullName: "Đỗ Thị Lan", email: "lan.do@email.com", phone: "0345789012", content: "Great presentation tips", rating: 4, createdAt: "2025-08-25" }
    ]
  },
  {
    id: "M012",
    fullName: "Prof. Mark Brown",
    email: "mark.brown@example.com",
    status: "Active",
    experience: 18,
    rating: 4.9,
    mentorStatus: "Available",
    joinedDate: "2021-07-14",
    specializations: ["Linguistics", "Phonetics", "Language Teaching Methodology"],
    schedules: [
      { id: 22, startTime: "08:00", endTime: "09:00", status: "Open", date: "2025-10-01" },
      { id: 23, startTime: "15:00", endTime: "16:00", status: "Completed", date: "2025-09-17" },
      { id: 24, startTime: "17:00", endTime: "18:00", status: "Open", date: "2025-10-02" }
    ],
    contentLibrary: [
      { id: "ling-1900", title: "Introduction to Linguistics", type: "E-Book", url: "http://example.com/linguistics" },
      { id: "phon-2000", title: "English Phonetics Guide", type: "PDF", url: "http://example.com/phonetics" },
      { id: "method-2100", title: "Teaching Methodology", type: "VIDEO", url: "http://example.com/methodology" }
    ],
    feedbacks: [
      { id: 16, fullName: "Giáo viên Lê Thị Hương", email: "huong.teacher@school.edu", phone: "0912345000", content: "Excellent for language teachers", rating: 5, createdAt: "2025-08-30" }
    ]
  },
  {
    id: "M013",
    fullName: "Ms. Rachel Green",
    email: "rachel.green@example.com",
    status: "Active",
    experience: 6,
    rating: 4.4,
    mentorStatus: "Available",
    joinedDate: "2023-12-01",
    specializations: ["Vocabulary Building", "Reading Comprehension", "Study Skills"],
    schedules: [
      { id: 25, startTime: "10:00", endTime: "11:00", status: "Open", date: "2025-10-03" },
      { id: 26, startTime: "14:00", endTime: "15:00", status: "Booked", date: "2025-10-03" }
    ],
    contentLibrary: [
      { id: "vocab-2200", title: "Vocabulary Builder 3000", type: "E-Book", url: "http://example.com/vocabulary" },
      { id: "read-2300", title: "Reading Strategies", type: "VIDEO", url: "http://example.com/reading" }
    ],
    feedbacks: [
      { id: 17, fullName: "Nguyễn Văn Đức", email: "duc.nguyen@student.edu", phone: "0789456123", content: "Great vocabulary exercises", rating: 4, createdAt: "2025-09-14" }
    ]
  },
  {
    id: "M014",
    fullName: "Dr. Alex Johnson",
    email: "alex.johnson@example.com",
    status: "Active",
    experience: 11,
    rating: 4.6,
    mentorStatus: "Busy",
    joinedDate: "2022-08-20",
    specializations: ["Cambridge Exams", "FCE", "CAE", "CPE"],
    schedules: [
      { id: 27, startTime: "09:00", endTime: "10:00", status: "Booked", date: "2025-10-04" },
      { id: 28, startTime: "11:00", endTime: "12:00", status: "Booked", date: "2025-10-04" },
      { id: 29, startTime: "16:00", endTime: "17:00", status: "Open", date: "2025-10-05" }
    ],
    contentLibrary: [
      { id: "cam-2400", title: "Cambridge Exam Preparation", type: "PDF", url: "http://example.com/cambridge" },
      { id: "fce-2500", title: "FCE Complete Course", type: "VIDEO", url: "http://example.com/fce" },
      { id: "cae-2600", title: "CAE Advanced Preparation", type: "E-Book", url: "http://example.com/cae" }
    ],
    feedbacks: [
      { id: 18, fullName: "Trần Thị Linh", email: "linh.tran@gmail.com", phone: "0123654789", content: "Excellent Cambridge exam prep", rating: 5, createdAt: "2025-09-11" },
      { id: 19, fullName: "Phạm Văn Nam", email: "nam.pham@yahoo.com", phone: "0987321654", content: "Passed FCE thanks to this mentor", rating: 5, createdAt: "2025-08-15" }
    ]
  },
  {
    id: "M015",
    fullName: "Ms. Olivia Davis",
    email: "olivia.davis@example.com",
    status: "Active",
    experience: 8,
    rating: 4.3,
    mentorStatus: "Available",
    joinedDate: "2023-04-10",
    specializations: ["Creative Writing", "Storytelling", "Literature Appreciation"],
    schedules: [
      { id: 30, startTime: "13:00", endTime: "14:00", status: "Open", date: "2025-10-06" },
      { id: 31, startTime: "15:00", endTime: "16:00", status: "Open", date: "2025-10-06" }
    ],
    contentLibrary: [
      { id: "write-2700", title: "Creative Writing Workshop", type: "VIDEO", url: "http://example.com/creative-writing" },
      { id: "story-2800", title: "Storytelling Techniques", type: "E-Book", url: "http://example.com/storytelling" },
      { id: "lit-2900", title: "Literature Appreciation Guide", type: "PDF", url: "http://example.com/literature-guide" }
    ],
    feedbacks: [
      { id: 20, fullName: "Lê Thị Mỹ", email: "my.le@writer.com", phone: "0345123789", content: "Inspiring creative writing sessions", rating: 4, createdAt: "2025-09-02" },
      { id: 21, fullName: "Hoàng Văn Tùng", email: "tung.hoang@gmail.com", phone: "0789654321", content: "Helped me love literature", rating: 5, createdAt: "2025-08-18" }
    ]
  }
];

const MentorManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'block' | 'unblock'>('block');
  const [mentorToAction, setMentorToAction] = useState<Mentor | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter mentors by search
  const filteredMentors = sampleMentors.filter(
    mentor => 
      mentor.fullName.toLowerCase().includes(search.toLowerCase()) || 
      mentor.email.toLowerCase().includes(search.toLowerCase()) ||
      mentor.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredMentors.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredMentors.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowDetailsModal(true);
  };

  const handleBlockUnblock = (mentor: Mentor, action: 'block' | 'unblock') => {
    setMentorToAction(mentor);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    // Here you would make the API call to block/unblock the mentor
    console.log(`${actionType}ing mentor:`, mentorToAction);
    setShowConfirmDialog(false);
    setMentorToAction(null);
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
                  checked={selectedRows.length === filteredMentors.length && filteredMentors.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Mentor ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Mentor Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMentors.map((mentor, idx) => (
              <TableRow key={mentor.id} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{mentor.id}</TableCell>
                <TableCell className="font-medium">{mentor.fullName}</TableCell>
                <TableCell className="text-gray-600">{mentor.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant={mentor.status === "Active" ? "default" : "secondary"} 
                    className={mentor.status === "Active" ? "bg-green-600 text-white" : "bg-gray-400 text-white"}
                  >
                    {mentor.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{mentor.experience} years</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-yellow-600">{mentor.rating}</span>
                    <svg width="16" height="16" fill="currentColor" className="text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${
                      mentor.mentorStatus === 'Available' ? 'text-green-600 border-green-300 bg-green-50' :
                      mentor.mentorStatus === 'Busy' ? 'text-orange-600 border-orange-300 bg-orange-50' :
                      'text-gray-600 border-gray-300 bg-gray-50'
                    }`}
                  >
                    {mentor.mentorStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdownId(openDropdownId === mentor.id ? null : mentor.id)}
                      className="p-1 h-8 w-8 cursor-pointer"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </Button>
                    
                    {openDropdownId === mentor.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleViewDetails(mentor);
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
                              handleBlockUnblock(mentor, mentor.status === 'Active' ? 'block' : 'unblock');
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              mentor.status === 'Active' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {mentor.status === 'Active' ? (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                                  <circle cx="12" cy="16" r="1"/>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Block Mentor
                              </>
                            ) : (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Unblock Mentor
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
        <div>ACTIVE MENTORS: {filteredMentors.filter(m => m.status === "Active").length}/{filteredMentors.length}</div>
        <div>Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10 of {filteredMentors.length}</div>
      </div>

      {/* Mentor Details Modal */}
      {showDetailsModal && selectedMentor && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMentor.fullName}</h2>
                    <p className="text-blue-100">{selectedMentor.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white">
                        <path d="M12 2v20M2 12h20"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">Experience</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedMentor.experience}<span className="text-sm font-normal"> years</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20" className="text-white">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Rating</p>
                      <p className="text-2xl font-bold text-yellow-900">{selectedMentor.rating}<span className="text-sm font-normal">/5.0</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Status</p>
                      <p className="text-lg font-bold text-green-900">{selectedMentor.mentorStatus}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600">Joined</p>
                      <p className="text-sm font-bold text-purple-900">{new Date(selectedMentor.joinedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">Mentor ID</span>
                      <span className="text-blue-600 font-mono">{selectedMentor.id}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">Account Status</span>
                      <Badge className={selectedMentor.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                        {selectedMentor.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">Email Address</span>
                      <span className="text-gray-600 text-sm">{selectedMentor.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">Join Date</span>
                      <span className="text-gray-600">{selectedMentor.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  Skills của mentor
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.specializations.map((spec, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetailsModal(false)}
                    className="hover:bg-gray-100"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      handleBlockUnblock(selectedMentor, selectedMentor.status === 'Active' ? 'block' : 'unblock');
                      setShowDetailsModal(false);
                    }}
                    className={selectedMentor.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {selectedMentor.status === 'Active' ? 'Block Mentor' : 'Unblock Mentor'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && mentorToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {actionType === 'block' ? 'Block' : 'Unblock'} Mentor
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} <strong>{mentorToAction.fullName}</strong>? 
              {actionType === 'block' 
                ? ' This will prevent them from accessing the platform.' 
                : ' This will restore their access to the platform.'}
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
                className={actionType === 'block' ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}
              >
                {actionType === 'block' ? 'Block Mentor' : 'Unblock Mentor'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;
