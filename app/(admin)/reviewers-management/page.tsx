"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions
interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  status: "Open" | "Booked" | "Completed";
  date: string;
}

interface ContentLibrary {
  id: string;
  title: string;
  type: "E-Book" | "VIDEO" | "PDF";
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

interface Certificate {
  id: string;
  name: string;
  imageUrl: string;
}

interface Reviewer {
  id: string;
  fullName: string;
  email: string;
  status: "Active" | "Inactive" | "IsBanned";
  experience: number;
  phone: string;
  avatar: string;
  rating: number;
  level: string;
  joinedDate: string;
  specializations: string[];
  primarySkills?: string[]; // Skill điểm mạnh của Reviewer (optional)
  schedules: Schedule[];
  contentLibrary: ContentLibrary[];
  feedbacks: Feedback[];
  certificates?: Certificate[];
}

const sampleReviewers: Reviewer[] = [
  {
    id: "M001",
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    status: "Active",
    avatar: "https://via.placeholder.com/150",
    experience: 8,
    rating: 4.8,
    phone: "0335785100",
    level: "C1",

    joinedDate: "2024-01-15",
    specializations: ["IELTS Preparation", "Business English", "Pronunciation"],
    primarySkills: ["IELTS Preparation", "Business English"], // Skill điểm mạnh
    schedules: [
      {
        id: 1,
        startTime: "09:00",
        endTime: "10:00",
        status: "Open",
        date: "2025-09-21",
      },
      {
        id: 2,
        startTime: "14:00",
        endTime: "15:00",
        status: "Booked",
        date: "2025-09-22",
      },
    ],
    contentLibrary: [
      {
        id: "ghd-123",
        title: "Introduction to Machine Learning",
        type: "E-Book",
        url: "http://example.com/ml-intro",
      },
      {
        id: "abc-12fg",
        title: "Advanced English Grammar",
        type: "VIDEO",
        url: "http://example.com/grammar-video",
      },
    ],
    feedbacks: [
      {
        id: 1,
        fullName: "Trần Quang Phúc",
        email: "phuc@gmail.com",
        phone: "0335785100",
        content: "Good",
        rating: 5,
        createdAt: "2025-09-30",
      },
    ],
    certificates: [
      {
        id: "cert-ielts-trainer",
        name: "IELTS Trainer Certification",
        imageUrl:
          "https://sununi.edu.vn/wp-content/uploads/2023/05/Ha-Phuong-723x1024.png",
      },
      {
        id: "cert-tesol",
        name: "TESOL Advanced",
        imageUrl:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M002",
    fullName: "Prof. Michael Chen",
    avatar: "https://via.placeholder.com/150",
    phone: "0123456789",
    level: "C2",
    email: "michael.chen@example.com",
    status: "IsBanned",
    experience: 12,
    rating: 4.9,

    joinedDate: "2023-11-20",
    specializations: ["TOEFL", "Academic Writing", "Speaking Skills"],
    primarySkills: ["TOEFL", "Academic Writing"],
    schedules: [
      {
        id: 3,
        startTime: "10:00",
        endTime: "11:00",
        status: "Completed",
        date: "2025-09-20",
      },
      {
        id: 4,
        startTime: "16:00",
        endTime: "17:00",
        status: "Open",
        date: "2025-09-25",
      },
    ],
    contentLibrary: [
      {
        id: "def-456",
        title: "TOEFL Speaking Strategies",
        type: "PDF",
        url: "http://example.com/toefl-speaking",
      },
      {
        id: "xyz-789",
        title: "Academic Writing Masterclass",
        type: "VIDEO",
        url: "http://example.com/academic-writing",
      },
    ],
    feedbacks: [
      {
        id: 2,
        fullName: "Nguyễn Văn An",
        email: "an@email.com",
        phone: "0123456789",
        content: "Excellent teaching",
        rating: 5,
        createdAt: "2025-09-25",
      },
      {
        id: 3,
        fullName: "Lê Thị Hoa",
        email: "hoa@gmail.com",
        phone: "0987654321",
        content: "Very helpful",
        rating: 4,
        createdAt: "2025-09-20",
      },
    ],
    certificates: [
      {
        id: "cert-toefl-expert",
        name: "TOEFL Expert Instructor",
        imageUrl:
          "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=400&auto=format&fit=crop&q=60",
      },
      {
        id: "cert-writing-pro",
        name: "Academic Writing Pro",
        imageUrl:
          "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M003",
    fullName: "Ms. Emma Wilson",
    avatar: "https://via.placeholder.com/150",
    phone: "0987654321",
    level: "C1",
    email: "emma.wilson@example.com",
    status: "Inactive",
    experience: 5,
    rating: 4.3,
    joinedDate: "2024-03-10",
    specializations: ["Conversational English", "Grammar"],
    primarySkills: ["Conversational English"],
    schedules: [],
    contentLibrary: [
      {
        id: "conv-101",
        title: "Daily Conversation Guide",
        type: "E-Book",
        url: "http://example.com/conversation",
      },
    ],
    feedbacks: [],
    certificates: [
      {
        id: "cert-conv",
        name: "Conversational English Coach",
        imageUrl:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M004",
    fullName: "Dr. James Rodriguez",
    avatar: "https://via.placeholder.com/150",
    phone: "0987654321",
    level: "C2",
    email: "james.rodriguez@example.com",
    status: "Active",
    experience: 10,
    rating: 4.7,
    joinedDate: "2023-08-05",
    specializations: [
      "Business English",
      "Presentation Skills",
      "Interview Preparation",
    ],
    primarySkills: ["Business English", "Interview Preparation"],
    schedules: [
      {
        id: 5,
        startTime: "13:00",
        endTime: "14:00",
        status: "Open",
        date: "2025-09-23",
      },
      {
        id: 6,
        startTime: "15:00",
        endTime: "16:00",
        status: "Open",
        date: "2025-09-23",
      },
      {
        id: 7,
        startTime: "09:00",
        endTime: "10:00",
        status: "Booked",
        date: "2025-09-24",
      },
    ],
    contentLibrary: [
      {
        id: "biz-100",
        title: "Business Communication Essentials",
        type: "VIDEO",
        url: "http://example.com/business-comm",
      },
      {
        id: "interview-200",
        title: "Interview Success Guide",
        type: "PDF",
        url: "http://example.com/interview",
      },
    ],
    feedbacks: [
      {
        id: 4,
        fullName: "Lê Thị Mai",
        email: "mai@yahoo.com",
        phone: "0987654321",
        content: "Very helpful",
        rating: 4,
        createdAt: "2025-09-20",
      },
      {
        id: 5,
        fullName: "Phạm Văn Đức",
        email: "duc@outlook.com",
        phone: "0123789456",
        content: "Great Reviewer",
        rating: 5,
        createdAt: "2025-09-15",
      },
    ],
    certificates: [
      {
        id: "cert-business",
        name: "Business English Specialist",
        imageUrl:
          "https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M005",
    fullName: "Ms. Lisa Anderson",
    avatar: "https://via.placeholder.com/150",
    level: "C1",
    phone: "0987654321",
    email: "lisa.anderson@example.com",
    status: "Active",
    experience: 6,
    rating: 4.5,
    joinedDate: "2024-02-28",
    specializations: ["Pronunciation", "Accent Reduction", "Phonetics"],
    primarySkills: ["Pronunciation", "Accent Reduction"],
    schedules: [
      {
        id: 8,
        startTime: "11:00",
        endTime: "12:00",
        status: "Open",
        date: "2025-09-24",
      },
      {
        id: 9,
        startTime: "14:00",
        endTime: "15:00",
        status: "Completed",
        date: "2025-09-18",
      },
    ],
    contentLibrary: [
      {
        id: "pron-300",
        title: "Pronunciation Practice Guide",
        type: "E-Book",
        url: "http://example.com/pronunciation",
      },
      {
        id: "accent-400",
        title: "Accent Reduction Techniques",
        type: "VIDEO",
        url: "http://example.com/accent",
      },
    ],
    feedbacks: [
      {
        id: 6,
        fullName: "Võ Thị Lan",
        email: "lan@gmail.com",
        phone: "0345678912",
        content: "Improved my pronunciation significantly",
        rating: 5,
        createdAt: "2025-09-10",
      },
    ],
    certificates: [
      {
        id: "cert-phonetics",
        name: "Phonetics Certification",
        imageUrl:
          "https://images.unsplash.com/photo-1517976487492-576ea6b2936d?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M006",
    fullName: "Dr. David Kim",
    avatar: "https://via.placeholder.com/150",
    level: "C2",
    phone: "0987654321",
    email: "david.kim@example.com",
    status: "Active",
    experience: 15,
    rating: 4.9,
    joinedDate: "2022-05-12",
    specializations: [
      "IELTS",
      "Academic English",
      "Test Preparation",
      "Writing Skills",
    ],
    primarySkills: ["IELTS", "Academic English"],
    schedules: [
      {
        id: 10,
        startTime: "08:00",
        endTime: "09:00",
        status: "Booked",
        date: "2025-09-26",
      },
      {
        id: 11,
        startTime: "10:00",
        endTime: "11:00",
        status: "Booked",
        date: "2025-09-26",
      },
      {
        id: 12,
        startTime: "15:00",
        endTime: "16:00",
        status: "Open",
        date: "2025-09-27",
      },
    ],
    contentLibrary: [
      {
        id: "ielts-500",
        title: "IELTS Complete Guide",
        type: "E-Book",
        url: "http://example.com/ielts-guide",
      },
      {
        id: "write-600",
        title: "Academic Writing Mastery",
        type: "PDF",
        url: "http://example.com/academic-writing",
      },
      {
        id: "test-700",
        title: "Test Taking Strategies",
        type: "VIDEO",
        url: "http://example.com/test-strategies",
      },
    ],
    feedbacks: [
      {
        id: 7,
        fullName: "Nguyễn Thị Bình",
        email: "binh@yahoo.com",
        phone: "0912345678",
        content: "Excellent IELTS preparation",
        rating: 5,
        createdAt: "2025-09-12",
      },
      {
        id: 8,
        fullName: "Trần Văn Hưng",
        email: "hung@gmail.com",
        phone: "0123456780",
        content: "Very thorough teaching",
        rating: 5,
        createdAt: "2025-09-08",
      },
    ],
    certificates: [
      {
        id: "cert-ielts-master",
        name: "IELTS Master Trainer",
        imageUrl:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop&q=60",
      },
      {
        id: "cert-academic",
        name: "Academic English Certification",
        imageUrl:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M007",
    fullName: "Ms. Sophie Martinez",
    avatar: "https://via.placeholder.com/150",
    level: "C1",
    phone: "0987654321",
    email: "sophie.martinez@example.com",
    status: "Active",
    experience: 7,
    rating: 4.6,
    joinedDate: "2023-09-18",
    specializations: ["Conversation", "Cultural English", "Travel English"],
    schedules: [
      {
        id: 13,
        startTime: "12:00",
        endTime: "13:00",
        status: "Open",
        date: "2025-09-25",
      },
      {
        id: 14,
        startTime: "17:00",
        endTime: "18:00",
        status: "Open",
        date: "2025-09-25",
      },
    ],
    contentLibrary: [
      {
        id: "conv-800",
        title: "Everyday Conversations",
        type: "VIDEO",
        url: "http://example.com/conversations",
      },
      {
        id: "travel-900",
        title: "English for Travelers",
        type: "E-Book",
        url: "http://example.com/travel-english",
      },
    ],
    feedbacks: [
      {
        id: 9,
        fullName: "Hoàng Văn Minh",
        email: "minh@outlook.com",
        phone: "0987123456",
        content: "Fun and engaging lessons",
        rating: 4,
        createdAt: "2025-09-05",
      },
    ],
    certificates: [
      {
        id: "cert-travel",
        name: "Travel English Coach",
        imageUrl:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M008",
    fullName: "Prof. Robert Taylor",
    avatar: "https://via.placeholder.com/150",
    level: "C1",
    phone: "0987654321",
    email: "robert.taylor@example.com",
    status: "Active",
    experience: 20,
    rating: 4.8,
    joinedDate: "2021-11-30",
    specializations: [
      "Advanced Grammar",
      "Literature",
      "Essay Writing",
      "Critical Thinking",
    ],
    schedules: [
      {
        id: 15,
        startTime: "09:00",
        endTime: "10:00",
        status: "Completed",
        date: "2025-09-19",
      },
      {
        id: 16,
        startTime: "14:00",
        endTime: "15:00",
        status: "Open",
        date: "2025-09-28",
      },
      {
        id: 17,
        startTime: "16:00",
        endTime: "17:00",
        status: "Open",
        date: "2025-09-28",
      },
    ],
    contentLibrary: [
      {
        id: "gram-1000",
        title: "Advanced Grammar Rules",
        type: "PDF",
        url: "http://example.com/advanced-grammar",
      },
      {
        id: "lit-1100",
        title: "English Literature Analysis",
        type: "E-Book",
        url: "http://example.com/literature",
      },
      {
        id: "essay-1200",
        title: "Essay Writing Techniques",
        type: "VIDEO",
        url: "http://example.com/essay-writing",
      },
    ],
    feedbacks: [
      {
        id: 10,
        fullName: "Lê Văn Tài",
        email: "tai@gmail.com",
        phone: "0345612789",
        content: "Deep knowledge and great teaching",
        rating: 5,
        createdAt: "2025-09-03",
      },
      {
        id: 11,
        fullName: "Phạm Thị Thu",
        email: "thu@yahoo.com",
        phone: "0789123456",
        content: "Challenging but rewarding",
        rating: 4,
        createdAt: "2025-08-28",
      },
    ],
    certificates: [
      {
        id: "cert-grammar",
        name: "Advanced Grammar Expert",
        imageUrl:
          "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M009",
    fullName: "Ms. Anna Thompson",
    avatar: "https://via.placeholder.com/150",
    level: "C1",
    phone: "0987654321",
    email: "anna.thompson@example.com",
    status: "Inactive",
    experience: 4,
    rating: 4.2,
    joinedDate: "2024-06-15",
    specializations: ["Basic English", "Kids English"],
    schedules: [],
    contentLibrary: [
      {
        id: "kids-1300",
        title: "English for Children",
        type: "VIDEO",
        url: "http://example.com/kids-english",
      },
    ],
    feedbacks: [
      {
        id: 12,
        fullName: "Nguyễn Thị Mai",
        email: "mai.nguyen@gmail.com",
        phone: "0912678345",
        content: "Good with beginners",
        rating: 4,
        createdAt: "2025-08-20",
      },
    ],
    certificates: [
      {
        id: "cert-kids",
        name: "Kids English Educator",
        imageUrl:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M010",
    fullName: "Dr. William Foster",
    avatar: "https://via.placeholder.com/150",
    level: "C2",
    phone: "0987654321",
    email: "william.foster@example.com",
    status: "Active",
    experience: 14,
    rating: 4.7,
    joinedDate: "2022-12-08",
    specializations: [
      "Medical English",
      "Technical English",
      "Scientific Writing",
    ],
    schedules: [
      {
        id: 18,
        startTime: "07:00",
        endTime: "08:00",
        status: "Booked",
        date: "2025-09-29",
      },
      {
        id: 19,
        startTime: "18:00",
        endTime: "19:00",
        status: "Booked",
        date: "2025-09-29",
      },
    ],
    contentLibrary: [
      {
        id: "med-1400",
        title: "Medical English Terminology",
        type: "E-Book",
        url: "http://example.com/medical-english",
      },
      {
        id: "tech-1500",
        title: "Technical Communication",
        type: "PDF",
        url: "http://example.com/technical-comm",
      },
      {
        id: "sci-1600",
        title: "Scientific Writing Guide",
        type: "VIDEO",
        url: "http://example.com/scientific-writing",
      },
    ],
    feedbacks: [
      {
        id: 13,
        fullName: "Bác sĩ Trần Văn An",
        email: "bs.tran@hospital.com",
        phone: "0123987654",
        content: "Perfect for medical professionals",
        rating: 5,
        createdAt: "2025-09-01",
      },
    ],
    certificates: [
      {
        id: "cert-med",
        name: "Medical English Specialist",
        imageUrl:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M011",
    fullName: "Ms. Jennifer Lee",
    avatar: "https://via.placeholder.com/150",
    level: "C1",
    phone: "0987654321",
    email: "jennifer.lee@example.com",
    status: "Active",
    experience: 9,
    rating: 4.5,
    joinedDate: "2023-03-22",
    specializations: [
      "Public Speaking",
      "Presentation Skills",
      "Confidence Building",
    ],
    primarySkills: ["Public Speaking"],
    schedules: [
      {
        id: 20,
        startTime: "11:00",
        endTime: "12:00",
        status: "Open",
        date: "2025-09-30",
      },
      {
        id: 21,
        startTime: "13:00",
        endTime: "14:00",
        status: "Open",
        date: "2025-09-30",
      },
    ],
    contentLibrary: [
      {
        id: "speak-1700",
        title: "Public Speaking Mastery",
        type: "VIDEO",
        url: "http://example.com/public-speaking",
      },
      {
        id: "conf-1800",
        title: "Building Confidence in English",
        type: "E-Book",
        url: "http://example.com/confidence",
      },
    ],
    feedbacks: [
      {
        id: 14,
        fullName: "Võ Minh Khôi",
        email: "khoi@company.com",
        phone: "0987456123",
        content: "Helped me overcome speaking anxiety",
        rating: 5,
        createdAt: "2025-09-07",
      },
      {
        id: 15,
        fullName: "Đỗ Thị Lan",
        email: "lan.do@email.com",
        phone: "0345789012",
        content: "Great presentation tips",
        rating: 4,
        createdAt: "2025-08-25",
      },
    ],
    certificates: [
      {
        id: "cert-speaking",
        name: "Public Speaking Coach",
        imageUrl:
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M012",
    fullName: "Prof. Mark Brown",
    avatar: "https://via.placeholder.com/150",
    level: "C2",
    phone: "0987654321",
    email: "mark.brown@example.com",
    status: "Active",
    experience: 18,
    rating: 4.9,
    joinedDate: "2021-07-14",
    specializations: [
      "Linguistics",
      "Phonetics",
      "Language Teaching Methodology",
    ],
    schedules: [
      {
        id: 22,
        startTime: "08:00",
        endTime: "09:00",
        status: "Open",
        date: "2025-10-01",
      },
      {
        id: 23,
        startTime: "15:00",
        endTime: "16:00",
        status: "Completed",
        date: "2025-09-17",
      },
      {
        id: 24,
        startTime: "17:00",
        endTime: "18:00",
        status: "Open",
        date: "2025-10-02",
      },
    ],
    contentLibrary: [
      {
        id: "ling-1900",
        title: "Introduction to Linguistics",
        type: "E-Book",
        url: "http://example.com/linguistics",
      },
      {
        id: "phon-2000",
        title: "English Phonetics Guide",
        type: "PDF",
        url: "http://example.com/phonetics",
      },
      {
        id: "method-2100",
        title: "Teaching Methodology",
        type: "VIDEO",
        url: "http://example.com/methodology",
      },
    ],
    feedbacks: [
      {
        id: 16,
        fullName: "Giáo viên Lê Thị Hương",
        email: "huong.teacher@school.edu",
        phone: "0912345000",
        content: "Excellent for language teachers",
        rating: 5,
        createdAt: "2025-08-30",
      },
    ],
    certificates: [
      {
        id: "cert-linguistics",
        name: "Linguistics Expert",
        imageUrl:
          "https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M013",
    fullName: "Ms. Rachel Green",
    avatar: "https://via.placeholder.com/150",
    level: "C1",
    phone: "0987654321",
    email: "rachel.green@example.com",
    status: "Active",
    experience: 6,
    rating: 4.4,
    joinedDate: "2023-12-01",
    specializations: [
      "Vocabulary Building",
      "Reading Comprehension",
      "Study Skills",
    ],
    schedules: [
      {
        id: 25,
        startTime: "10:00",
        endTime: "11:00",
        status: "Open",
        date: "2025-10-03",
      },
      {
        id: 26,
        startTime: "14:00",
        endTime: "15:00",
        status: "Booked",
        date: "2025-10-03",
      },
    ],
    contentLibrary: [
      {
        id: "vocab-2200",
        title: "Vocabulary Builder 3000",
        type: "E-Book",
        url: "http://example.com/vocabulary",
      },
      {
        id: "read-2300",
        title: "Reading Strategies",
        type: "VIDEO",
        url: "http://example.com/reading",
      },
    ],
    feedbacks: [
      {
        id: 17,
        fullName: "Nguyễn Văn Đức",
        email: "duc.nguyen@student.edu",
        phone: "0789456123",
        content: "Great vocabulary exercises",
        rating: 4,
        createdAt: "2025-09-14",
      },
    ],
    certificates: [
      {
        id: "cert-reading",
        name: "Reading Specialist",
        imageUrl:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M014",
    fullName: "Dr. Alex Johnson",
    avatar: "https://via.placeholder.com/150",
    level: "C2",
    phone: "0987654321",
    email: "alex.johnson@example.com",
    status: "Active",
    experience: 11,
    rating: 4.6,
    joinedDate: "2022-08-20",
    specializations: ["Cambridge Exams", "FCE", "CAE", "CPE"],
    schedules: [
      {
        id: 27,
        startTime: "09:00",
        endTime: "10:00",
        status: "Booked",
        date: "2025-10-04",
      },
      {
        id: 28,
        startTime: "11:00",
        endTime: "12:00",
        status: "Booked",
        date: "2025-10-04",
      },
      {
        id: 29,
        startTime: "16:00",
        endTime: "17:00",
        status: "Open",
        date: "2025-10-05",
      },
    ],
    contentLibrary: [
      {
        id: "cam-2400",
        title: "Cambridge Exam Preparation",
        type: "PDF",
        url: "http://example.com/cambridge",
      },
      {
        id: "fce-2500",
        title: "FCE Complete Course",
        type: "VIDEO",
        url: "http://example.com/fce",
      },
      {
        id: "cae-2600",
        title: "CAE Advanced Preparation",
        type: "E-Book",
        url: "http://example.com/cae",
      },
    ],
    feedbacks: [
      {
        id: 18,
        fullName: "Trần Thị Linh",
        email: "linh.tran@gmail.com",
        phone: "0123654789",
        content: "Excellent Cambridge exam prep",
        rating: 5,
        createdAt: "2025-09-11",
      },
      {
        id: 19,
        fullName: "Phạm Văn Nam",
        email: "nam.pham@yahoo.com",
        phone: "0987321654",
        content: "Passed FCE thanks to this Reviewer",
        rating: 5,
        createdAt: "2025-08-15",
      },
    ],
    certificates: [
      {
        id: "cert-cambridge",
        name: "Cambridge Exams Trainer",
        imageUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "M015",
    fullName: "Ms. Olivia Davis",
    avatar: "https://via.placeholder.com/150",
    level: "C1",
    phone: "0987654321",
    email: "olivia.davis@example.com",
    status: "Active",
    experience: 8,
    rating: 4.3,
    joinedDate: "2023-04-10",
    specializations: [
      "Creative Writing",
      "Storytelling",
      "Literature Appreciation",
    ],
    schedules: [
      {
        id: 30,
        startTime: "13:00",
        endTime: "14:00",
        status: "Open",
        date: "2025-10-06",
      },
      {
        id: 31,
        startTime: "15:00",
        endTime: "16:00",
        status: "Open",
        date: "2025-10-06",
      },
    ],
    contentLibrary: [
      {
        id: "write-2700",
        title: "Creative Writing Workshop",
        type: "VIDEO",
        url: "http://example.com/creative-writing",
      },
      {
        id: "story-2800",
        title: "Storytelling Techniques",
        type: "E-Book",
        url: "http://example.com/storytelling",
      },
      {
        id: "lit-2900",
        title: "Literature Appreciation Guide",
        type: "PDF",
        url: "http://example.com/literature-guide",
      },
    ],
    feedbacks: [
      {
        id: 20,
        fullName: "Lê Thị Mỹ",
        email: "my.le@writer.com",
        phone: "0345123789",
        content: "Inspiring creative writing sessions",
        rating: 4,
        createdAt: "2025-09-02",
      },
      {
        id: 21,
        fullName: "Hoàng Văn Tùng",
        email: "tung.hoang@gmail.com",
        phone: "0789654321",
        content: "Helped me love literature",
        rating: 5,
        createdAt: "2025-08-18",
      },
    ],
    certificates: [
      {
        id: "cert-writing",
        name: "Creative Writing Coach",
        imageUrl:
          "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&auto=format&fit=crop&q=60",
      },
    ],
  },
];

const ReviewerManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedReviewer, setSelectedReviewer] = useState<Reviewer | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");
  const [ReviewerToAction, setReviewerToAction] = useState<Reviewer | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [previewOffset, setPreviewOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastPanPos, setLastPanPos] = useState<{ x: number; y: number } | null>(
    null
  );

  // Filter Reviewers by search and status
  const filteredReviewers = sampleReviewers.filter((Reviewer) => {
    const matchesName = Reviewer.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || Reviewer.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const handleViewDetails = (Reviewer: Reviewer) => {
    setSelectedReviewer(Reviewer);
    setShowDetailsModal(true);
  };

  const handleBlockUnblock = (
    Reviewer: Reviewer,
    action: "block" | "unblock"
  ) => {
    setReviewerToAction(Reviewer);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    // Here you would make the API call to block/unblock the Reviewer
    console.log(`${actionType}ing Reviewer:`, ReviewerToAction);
    setShowConfirmDialog(false);
    setReviewerToAction(null);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setOpenDropdownId(null);
    }
  };
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-lg"
          />
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="Active">Hoạt động</TabsTrigger>
              <TabsTrigger value="Inactive">Ngưng hoạt động</TabsTrigger>
              <TabsTrigger value="IsBanned">Bị chặn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead className="text-gray-700 font-semibold">
                Thông tin
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Họ tên
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Liên hệ
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Trình độ
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Kinh nghiệm
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Trạng thái
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Đánh giá
              </TableHead>

              <TableHead className="ext-center text-gray-700 font-semibold">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviewers.map((Reviewer) => (
              <TableRow key={Reviewer.id} className="hover:bg-[#f0f7e6]">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 shadow-sm">
                        <AvatarImage
                          src={Reviewer.avatar}
                          alt={Reviewer.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                          {getInitials(Reviewer.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                          Reviewer.status === "Active"
                            ? "bg-green-500"
                            :  Reviewer.status === "Inactive"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-semibold text-sm">
                        {Reviewer.id}
                      </div>
                      {/* <div className="text-gray-500 text-xs">Learner</div> */}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {Reviewer.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  <div className="flex flex-col">
                    <span className="text-sm">{Reviewer.email}</span>
                    <span className="text-xs text-gray-500">
                      {Reviewer.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{Reviewer.level}</TableCell>
                <TableCell>{Reviewer.experience} năm</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      Reviewer.status === "Active" ? "default" :  Reviewer.status === "Inactive" ? "secondary" : "destructive"
                    }
                    className={
                      Reviewer.status === "Active"
                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                        : Reviewer.status === "Inactive"
                        ? "bg-gray-100 text-gray-600 border-gray-200"
                        : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                    }
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          Reviewer.status === "Active"
                            ? "bg-green-500"
                            : Reviewer.status === "Inactive"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                      ></div>
                      {Reviewer.status === "Active"
                        ? "Hoạt động"
                        : Reviewer.status === "Inactive"
                        ? "Ngưng hoạt động"
                        : "Bị chặn"}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-yellow-600">
                      {Reviewer.rating}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === Reviewer.id ? null : Reviewer.id
                        )
                      }
                      className="p-1 h-8 w-8 cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </Button>

                    {openDropdownId === Reviewer.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleViewDetails(Reviewer);
                              setOpenDropdownId(null);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <svg
                              width="16"
                              height="16"
                              className="inline mr-2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Xem chi tiết
                          </button>
                          <button
                            onClick={() => {
                              handleBlockUnblock(
                                Reviewer,
                                Reviewer.status === "Active"
                                  ? "block"
                                  : "unblock"
                              );
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              Reviewer.status === "Active" || Reviewer.status === "Inactive"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {Reviewer.status === "Active" || Reviewer.status === "Inactive" ? (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  className="inline mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="10"
                                    rx="2"
                                  />
                                  <circle cx="12" cy="16" r="1" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Chặn
                              </>
                            ) : (
                              <>
                                <svg
                                  width="16"
                                  height="16"
                                  className="inline mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="10"
                                    rx="2"
                                  />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Bỏ chặn
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
        <div>
          ACTIVE ReviewerS:{" "}
          {filteredReviewers.filter((m) => m.status === "Active").length}/
          {filteredReviewers.length}
        </div>
        <div>
          Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10
          of {filteredReviewers.length}
        </div>
      </div>

      {/* Reviewer Details Modal */}
      {showDetailsModal && selectedReviewer && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedReviewer.fullName}
                    </h2>
                    <p className="text-blue-100">{selectedReviewer.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
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
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Kinh nghiệm
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedReviewer.experience}
                        <span className="text-sm font-normal"> năm</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="text-white"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-600">
                        Điểm đánh giá
                      </p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {selectedReviewer.rating}
                        <span className="text-sm font-normal">/5.0</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600">
                        Ngày tham gia
                      </p>
                      <p className="text-sm font-bold text-purple-900">
                        {new Date(
                          selectedReviewer.joinedDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="text-white"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Levels
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {selectedReviewer.level}
                        <span className="text-sm font-normal"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trạng thái tài khoản */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Mã người đánh giá
                      </span>
                      <span className="text-blue-600 font-mono">
                        {selectedReviewer.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Trạng thái tài khoản
                      </span>
                      <Badge
                        className={
                          selectedReviewer.status === "Active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {selectedReviewer.status === "Active"
                          ? "Hoạt động"
                          : "Ngưng hoạt động"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Địa chỉ email
                      </span>
                      <span className="text-gray-600 text-sm">
                        {selectedReviewer.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium text-gray-700">
                        Ngày tham gia
                      </span>
                      <span className="text-gray-600">
                        {selectedReviewer.joinedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Certificates Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 17l-3 3-3-3m3 3V10m6-6H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  </svg>
                  Chứng chỉ (Certificates)
                </h3>

                {selectedReviewer.certificates &&
                selectedReviewer.certificates.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedReviewer.certificates.map((cert) => (
                      <div key={cert.id} className="group">
                        <div
                          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border cursor-zoom-in"
                          onClick={() => {
                            setPreviewZoom(1);
                            setPreviewOffset({ x: 0, y: 0 });
                            setPreviewImageUrl(cert.imageUrl);
                          }}
                          role="button"
                          aria-label={`Xem lớn ${cert.name}`}
                        >
                          <Image
                            src={cert.imageUrl}
                            alt={cert.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-800 line-clamp-2">
                          {cert.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Chưa có chứng chỉ.
                  </div>
                )}
              </div>
              {/* Feedbacks Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 17l-3 3-3-3m3 3V10m6-6H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    </svg>
                    Đánh giá từ học viên ({selectedReviewer.feedbacks.length})
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Đánh giá cao (4-5⭐)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Đánh giá trung bình (3⭐)
                      </span>
                    </div>
                  </div>
                </div>

                {selectedReviewer.feedbacks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                          <TableHead className="text-gray-700 font-semibold">
                            Học viên
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Đánh giá
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Nội dung
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Ngày gửi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedReviewer.feedbacks.map((feedback) => (
                          <TableRow
                            key={feedback.id}
                            className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {feedback.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {feedback.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {feedback.email}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {feedback.phone}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < feedback.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <Badge
                                  className={`text-xs font-medium ${
                                    feedback.rating >= 4
                                      ? "bg-green-100 text-green-700 border-green-300"
                                      : feedback.rating >= 3
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                      : "bg-red-100 text-red-700 border-red-300"
                                  }`}
                                >
                                  {feedback.rating}/5
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {feedback.content}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {feedback.createdAt}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💬</div>
                    <div className="text-gray-500 text-lg font-medium">
                      Chưa có đánh giá
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                      Học viên chưa gửi đánh giá nào cho reviewer này
                    </div>
                  </div>
                )}

                {selectedReviewer.feedbacks.length > 0 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Hiển thị {selectedReviewer.feedbacks.length} đánh giá
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Trước
                      </Button>
                      <Button variant="default" size="sm">
                        1
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hộp thoại xác nhận */}
      {showConfirmDialog && ReviewerToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận {actionType === "block" ? "chặn" : "bỏ chặn"} người đánh
              giá
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn {actionType === "block" ? "chặn" : "bỏ chặn"}{" "}
              <strong>{ReviewerToAction.fullName}</strong>?
              {actionType === "block"
                ? " Thao tác này sẽ ngăn họ truy cập hệ thống."
                : " Thao tác này sẽ khôi phục quyền truy cập của họ."}
            </p>
            <div className="text-gray-600 mb-6 mb-6">
              <Input placeholder="Lí do chặn " />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={confirmAction}
                className={
                  actionType === "block"
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }
              >
                {actionType === "block" ? "Chặn" : "Bỏ chặn"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 select-none"
          onClick={() => setPreviewImageUrl(null)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="relative w-screen h-screen bg-black rounded-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              onClick={() => setPreviewImageUrl(null)}
              aria-label="Đóng xem ảnh"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {/* Zoom Controls */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <button
                className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                onClick={() =>
                  setPreviewZoom((z) =>
                    Math.max(0.5, parseFloat((z - 0.25).toFixed(2)))
                  )
                }
                aria-label="Thu nhỏ"
              >
                -
              </button>
              <div className="h-10 px-3 rounded-lg bg-white/10 text-white flex items-center">
                {(previewZoom * 100).toFixed(0)}%
              </div>
              <button
                className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                onClick={() =>
                  setPreviewZoom((z) =>
                    Math.min(3, parseFloat((z + 0.25).toFixed(2)))
                  )
                }
                aria-label="Phóng to"
              >
                +
              </button>
              <button
                className="h-10 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                onClick={() => setPreviewZoom(1)}
                aria-label="Đặt lại"
              >
                Đặt lại
              </button>
            </div>
            {/* Scroll-to-pan area (no scrollbars, right-click drag to pan, wheel to zoom) */}
            <div
              className="relative w-full h-screen overflow-hidden cursor-default"
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setPreviewZoom((z) => {
                  const next = Math.min(
                    4,
                    Math.max(0.5, parseFloat((z + delta).toFixed(2)))
                  );
                  return next;
                });
              }}
              onMouseDown={(e) => {
                // Right-click to start panning
                if (e.button === 0) {
                  setIsPanning(true);
                  setLastPanPos({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseMove={(e) => {
                if (isPanning && lastPanPos) {
                  const dx = e.clientX - lastPanPos.x;
                  const dy = e.clientY - lastPanPos.y;
                  setPreviewOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
                  setLastPanPos({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseUp={() => {
                setIsPanning(false);
                setLastPanPos(null);
              }}
              onMouseLeave={() => {
                setIsPanning(false);
                setLastPanPos(null);
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div
                  className="relative w-full h-full"
                  style={{
                    transform: `translate(${previewOffset.x}px, ${previewOffset.y}px) scale(${previewZoom})`,
                    transformOrigin: "center center",
                    transition: isPanning ? "none" : "transform 120ms ease",
                    cursor: isPanning ? "grabbing" : "default",
                  }}
                >
                  <Image
                    src={previewImageUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerManagement;
