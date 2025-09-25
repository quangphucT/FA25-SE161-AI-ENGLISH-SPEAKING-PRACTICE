

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// Type definitions
interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  studentName?: string;
  studentId?: string;
  sessionType?: string;
  notes?: string;
}

interface StudentTestData {
  studentName: string;
  testDate: string;
  overallScore: number;
  level: string;
  details: {
    [key: string]: {
      score: number;
      level: string;
      notes: string;
    };
  };
  recommendations: string[];
}

interface DayInfo {
  key: string;
  label: string;
  date: string;
  fullDate: string;
  monthName: string;
}

const ScheduleMentor = () => {
  const [selectedWeek, setSelectedWeek] = useState("2025-09-22");
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showEntryTestModal, setShowEntryTestModal] = useState(false);
  const [selectedStudentTest, setSelectedStudentTest] = useState<StudentTestData | null>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

   const router = useRouter();
  // Function to calculate days of the week based on selected week
  const getDaysOfWeek = (weekStartDate: string) => {
    // Validate input date
    if (!weekStartDate) {
      // Default to current week if no date provided
      const today = new Date();
      weekStartDate = today.toISOString().split('T')[0];
    }
    
    const startDate = new Date(weekStartDate);
    
    // Check if date is valid
    if (isNaN(startDate.getTime())) {
      // If invalid date, use current date
      const today = new Date();
      startDate.setTime(today.getTime());
    }
    
    const days = [];
    
    // Find the Monday of the selected week
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days
    const monday = new Date(startDate);
    monday.setDate(startDate.getDate() + mondayOffset);
    
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      
      // Validate currentDay before using it
      if (!isNaN(currentDay.getTime())) {
        days.push({
          key: dayNames[i],
          label: dayLabels[i],
          date: currentDay.getDate().toString(),
          fullDate: currentDay.toISOString().split('T')[0],
          monthName: currentDay.toLocaleDateString('en-US', { month: 'short' })
        });
      }
    }
    
    return days;
  };

  // Function to format date display
  const formatDateDisplay = (day: DayInfo) => {
    if (!day || !day.monthName || !day.date) {
      return 'Invalid Date';
    }
    return `${day.monthName} ${day.date}`;
  };

  const daysOfWeek = getDaysOfWeek(selectedWeek);

  // Function to get week range display
  const getWeekRangeDisplay = () => {
    if (daysOfWeek.length < 7) {
      return 'Invalid Week Range';
    }
    const firstDay = daysOfWeek[0];
    const lastDay = daysOfWeek[6];
    return `${formatDateDisplay(firstDay)} - ${formatDateDisplay(lastDay)}`;
  };

  const timeSlots = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00", "21:00"
  ];

  // Sample schedule data
  const [scheduleData, setScheduleData] = useState<TimeSlot[]>([
    // Monday (Today)
    {
      id: "mon-09-10",
      day: "monday",
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true,
      isBooked: true,
      studentName: "Nguyễn Văn An",
      studentId: "L001",
      sessionType: "Speaking Practice",
      notes: "Focus on pronunciation"
    },
    {
      id: "mon-10-11",
      day: "monday",
      startTime: "10:00",
      endTime: "11:00",
      isAvailable: true,
      isBooked: false
    },
    {
      id: "mon-14-15",
      day: "monday",
      startTime: "14:00",
      endTime: "15:00",
      isAvailable: true,
      isBooked: true,
      studentName: "Trần Thị Bình",
      studentId: "L002",
      sessionType: "IELTS Speaking",
      notes: "Part 2 practice"
    },
    // Tuesday
    {
      id: "tue-09-10",
      day: "tuesday",
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true,
      isBooked: false
    },
    {
      id: "tue-15-16",
      day: "tuesday",
      startTime: "15:00",
      endTime: "16:00",
      isAvailable: true,
      isBooked: true,
      studentName: "Lê Minh Hoàng",
      studentId: "L003",
      sessionType: "Business English",
      notes: "Meeting scenarios"
    },
    // Wednesday
    {
      id: "wed-08-09",
      day: "wednesday",
      startTime: "08:00",
      endTime: "09:00",
      isAvailable: true,
      isBooked: false
    },
    {
      id: "wed-16-17",
      day: "wednesday",
      startTime: "16:00",
      endTime: "17:00",
      isAvailable: true,
      isBooked: true,
      studentName: "Phạm Thu Dung",
      studentId: "L004",
      sessionType: "Conversation Practice",
      notes: "Daily topics"
    },
    // Thursday
    {
      id: "thu-10-11",
      day: "thursday",
      startTime: "10:00",
      endTime: "11:00",
      isAvailable: true,
      isBooked: false
    },
    {
      id: "thu-19-20",
      day: "thursday",
      startTime: "19:00",
      endTime: "20:00",
      isAvailable: true,
      isBooked: true,
      studentName: "Nguyễn Thị Lan",
      studentId: "L005",
      sessionType: "Grammar Review",
      notes: "Tenses practice"
    },
    // Friday
    {
      id: "fri-09-10",
      day: "friday",
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true,
      isBooked: false
    },
    {
      id: "fri-14-15",
      day: "friday",
      startTime: "14:00",
      endTime: "15:00",
      isAvailable: true,
      isBooked: false
    }
  ]);

  // Sample entry test data for students
  const studentTestData = {
    "L001": {
      studentName: "Nguyễn Văn An",
      testDate: "2025-09-15",
      overallScore: 7.5,
      level: "Intermediate",
      details: {
        speaking: { score: 7.0, level: "Intermediate", notes: "Good pronunciation, needs work on fluency" },
        listening: { score: 8.0, level: "Upper-Intermediate", notes: "Strong comprehension skills" },
        grammar: { score: 7.5, level: "Intermediate", notes: "Solid foundation, some complex structures need practice" },
        vocabulary: { score: 7.0, level: "Intermediate", notes: "Good range, could expand academic vocabulary" }
      },
      recommendations: [
        "Focus on speaking fluency exercises",
        "Practice complex sentence structures",
        "Expand academic vocabulary"
      ]
    },
    "L002": {
      studentName: "Trần Thị Bình",
      testDate: "2025-09-16",
      overallScore: 6.0,
      level: "Pre-Intermediate",
      details: {
        speaking: { score: 5.5, level: "Pre-Intermediate", notes: "Limited vocabulary, needs confidence building" },
        listening: { score: 6.5, level: "Intermediate", notes: "Good basic comprehension" },
        grammar: { score: 6.0, level: "Pre-Intermediate", notes: "Basic structures understood, needs practice with tenses" },
        vocabulary: { score: 6.0, level: "Pre-Intermediate", notes: "Limited range, focus on everyday vocabulary" }
      },
      recommendations: [
        "Build basic vocabulary foundation",
        "Practice simple conversation patterns",
        "Focus on present and past tense usage"
      ]
    },
    "L003": {
      studentName: "Lê Minh Hoàng",
      testDate: "2025-09-17",
      overallScore: 8.0,
      level: "Upper-Intermediate",
      details: {
        speaking: { score: 8.0, level: "Upper-Intermediate", notes: "Fluent and confident, minor accuracy issues" },
        listening: { score: 8.5, level: "Advanced", notes: "Excellent comprehension of complex topics" },
        grammar: { score: 7.5, level: "Upper-Intermediate", notes: "Strong command of most structures" },
        vocabulary: { score: 8.0, level: "Upper-Intermediate", notes: "Good range including business terminology" }
      },
      recommendations: [
        "Focus on accuracy in complex structures",
        "Practice formal presentation skills",
        "Expand idiomatic expressions"
      ]
    },
    "L004": {
      studentName: "Phạm Thu Dung",
      testDate: "2025-09-18",
      overallScore: 6.5,
      level: "Intermediate",
      details: {
        speaking: { score: 6.0, level: "Pre-Intermediate", notes: "Hesitant but understandable" },
        listening: { score: 7.0, level: "Intermediate", notes: "Good comprehension of everyday topics" },
        grammar: { score: 6.5, level: "Intermediate", notes: "Generally accurate in simple structures" },
        vocabulary: { score: 7.0, level: "Intermediate", notes: "Adequate range for most topics" }
      },
      recommendations: [
        "Build speaking confidence through practice",
        "Focus on natural conversation flow",
        "Practice expressing opinions clearly"
      ]
    },
    "L005": {
      studentName: "Nguyễn Thị Lan",
      testDate: "2025-09-19",
      overallScore: 8.5,
      level: "Advanced",
      details: {
        speaking: { score: 8.5, level: "Advanced", notes: "Very fluent and natural expression" },
        listening: { score: 8.5, level: "Advanced", notes: "Understands nuanced meanings" },
        grammar: { score: 8.0, level: "Upper-Intermediate", notes: "Accurate use of complex structures" },
        vocabulary: { score: 9.0, level: "Advanced", notes: "Extensive vocabulary range" }
      },
      recommendations: [
        "Focus on native-like expressions",
        "Practice academic and professional contexts",
        "Refine pronunciation for clarity"
      ]
    }
  };


  const handleViewEntryTest = (studentId: string) => {
    const testData = studentTestData[studentId as keyof typeof studentTestData];
    setSelectedStudentTest(testData);
    setShowEntryTestModal(true);
  };

  const handleAddTimeSlot = () => {
    if (selectedDate && startTime && endTime) {
      // Convert selected date to day of week
      const date = new Date(selectedDate);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayOfWeek = dayNames[date.getDay()];
      
      const newSlot: TimeSlot = {
        id: `${dayOfWeek}-${startTime.replace(':', '')}-${endTime.replace(':', '')}-${selectedDate}`,
        day: dayOfWeek,
        startTime,
        endTime,
        isAvailable: true,
        isBooked: false
      };
      setScheduleData([...scheduleData, newSlot]);
      setSelectedDay("");
      setSelectedDate("");
      setStartTime("");
      setEndTime("");
      setShowAddSlotModal(false);
    }
  };

  const handleRemoveTimeSlot = (slotId: string) => {
    setScheduleData(scheduleData.filter(slot => slot.id !== slotId));
  };

  const getSlotsByDay = (day: string) => {
    return scheduleData.filter(slot => slot.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getWeekStats = () => {
    const totalSlots = scheduleData.length;
    const bookedSlots = scheduleData.filter(slot => slot.isBooked).length;
    const availableSlots = totalSlots - bookedSlots;
    return { totalSlots, bookedSlots, availableSlots };
  };

  const stats = getWeekStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Week of {getWeekRangeDisplay()} • Manage your availability and view booked sessions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            type="date"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-48"
          />
          <Button className="cursor-pointer" onClick={() => setShowAddSlotModal(true)}>
            Add Time Slot
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSlots}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-600">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Booked by Learners</p>
                <p className="text-2xl font-bold text-green-600">{stats.bookedSlots}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-600">
                  <path d="M9 11l3 3 8-8"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.34 0 2.6.29 3.74.82"/>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available to Book</p>
                <p className="text-2xl font-bold text-orange-600">{stats.availableSlots}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-orange-600">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {daysOfWeek.map((day) => {
              const daySlots = getSlotsByDay(day.key);
              return (
                <div key={day.key} className="border rounded-lg p-3">
                  <div className="text-center mb-3">
                    <h3 className="font-semibold text-gray-900">{day.label}</h3>
                    <p className="text-sm text-gray-500">{formatDateDisplay(day)}</p>
                  </div>
                  <div className="space-y-2">
                    {daySlots.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center">No slots</p>
                    ) : (
                      daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2 rounded text-xs border relative ${
                            slot.isBooked
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-blue-50 border-blue-200 text-blue-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <button
                              onClick={() => handleRemoveTimeSlot(slot.id)}
                              className="text-red-500 hover:text-red-700 opacity-60 hover:opacity-100"
                            >
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                          {slot.isBooked && (
                            <div className="mt-1">
                              <p className="font-medium">{slot.studentName}</p>
                              <p className="text-xs opacity-75">{slot.sessionType}</p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Booked Sessions List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>My Upcoming Classes</CardTitle>
          <p className="text-sm text-gray-500">
            Sessions that learners have booked with you this week
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleData.filter(slot => slot.isBooked).map((slot) => {
              const day = daysOfWeek.find(d => d.key === slot.day);
              return (
                <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium text-sm">
                        {slot.studentName?.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{slot.studentName}</h4>
                      <p className="text-sm text-gray-500">
                        {day?.label}, {day && formatDateDisplay(day)} • {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-xs text-gray-400">{slot.sessionType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="default">Confirmed</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewEntryTest(slot.studentId!)}
                    >
                      Xem kết quả test
                    </Button>

                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {router.push("/onboarding-meeting")}}
                    >
                       Meeting
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Time Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Add Time Slot
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn ngày
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end px-4 py-3 mt-6 space-x-3">
                <Button className="cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    setShowAddSlotModal(false);
                    setSelectedDay("");
                    setSelectedDate("");
                    setStartTime("");
                    setEndTime("");
                  }}
                >
                  Cancel
                </Button>
                <Button className="cursor-pointer" onClick={handleAddTimeSlot}>
                  Add Slot
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entry Test Results Modal */}
      {showEntryTestModal && selectedStudentTest && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl leading-6 font-bold text-gray-900">
                  Entry Test Results - {selectedStudentTest.studentName}
                </h3>
                <button
                  onClick={() => {
                    setShowEntryTestModal(false);
                    setSelectedStudentTest(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Overall Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-3 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Tổng điểm</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{selectedStudentTest.overallScore}/10</p>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full mb-3 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Trình độ</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">{selectedStudentTest.level}</p>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mb-3 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Ngày test</p>
                  <p className="text-lg font-semibold text-slate-700">{selectedStudentTest.testDate}</p>
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="mb-8">
                <div className="flex items-center mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></div>
                  <h3 className="text-2xl font-bold text-slate-800">Chi tiết đánh giá</h3>
                </div>
                
                <div className="space-y-5">
                  {Object.entries(selectedStudentTest.details)
                    .filter(([skill]) => skill === 'speaking')
                    .map(([skill, data]: [string, { score: number; level: string; notes: string }], index) => (
                    <div 
                      key={skill} 
                      className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Skill Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-gradient-to-br from-rose-100 to-pink-100">
                            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-slate-800 capitalize mb-1">Speaking</h4>
                            <p className="text-sm text-slate-500">Kỹ năng nói</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {data.score}
                            </p>
                            <p className="text-sm text-slate-500">/10</p>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                            data.level === 'Advanced' ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-200' :
                            data.level === 'Upper-Intermediate' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200' :
                            data.level === 'Intermediate' ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200' :
                            'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border border-rose-200'
                          }`}>
                            {data.level}
                          </div>
                        </div>
                      </div>
                      
                      {/* Notes */}
                      <div className="mb-5 p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                        <p className="text-slate-700 leading-relaxed text-sm">{data.notes}</p>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Điểm đánh giá</span>
                          <span className="text-sm font-semibold text-slate-800">{data.score}/10</span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ease-out ${
                                data.score >= 8 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                                data.score >= 6 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                                'bg-gradient-to-r from-rose-400 to-rose-500'
                              } shadow-sm`}
                              style={{ width: `${(data.score / 10) * 100}%` }}
                            ></div>
                          </div>
                          {/* Score markers */}
                          <div className="absolute top-0 left-0 w-full h-2 flex justify-between items-center">
                            {[2, 4, 6, 8].map((marker) => (
                              <div 
                                key={marker}
                                className="w-0.5 h-2 bg-white/60"
                                style={{ left: `${(marker / 10) * 100}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-end mt-6">
                <Button 
                  onClick={() => {
                    setShowEntryTestModal(false);
                    setSelectedStudentTest(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleMentor;
