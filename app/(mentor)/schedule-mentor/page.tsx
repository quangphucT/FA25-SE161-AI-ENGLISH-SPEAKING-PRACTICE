

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);

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
    if (selectedDay && startTime && endTime) {
      const newSlot: TimeSlot = {
        id: `${selectedDay}-${startTime.replace(':', '')}-${endTime.replace(':', '')}`,
        day: selectedDay,
        startTime,
        endTime,
        isAvailable: true,
        isBooked: false
      };
      setScheduleData([...scheduleData, newSlot]);
      setSelectedDay("");
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
          
                      disabled={isStartingSession}
                    >
                      {isStartingSession ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Starting...
                        </>
                      ) : (
                        "Start Session"
                      )}
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
                    Day of Week
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day.key} value={day.key}>
                        {day.label}
                      </option>
                    ))}
                  </select>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Overall Score</p>
                      <p className="text-3xl font-bold text-blue-600">{selectedStudentTest.overallScore}/10</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Level</p>
                      <p className="text-2xl font-bold text-green-600">{selectedStudentTest.level}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Test Date</p>
                      <p className="text-lg font-semibold text-gray-700">{selectedStudentTest.testDate}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Scores */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Detailed Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(selectedStudentTest.details).map(([skill, data]: [string, { score: number; level: string; notes: string }]) => (
                      <div key={skill} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 capitalize">{skill}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-blue-600">{data.score}/10</span>
                            <Badge variant="outline">{data.level}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{data.notes}</p>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(data.score / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedStudentTest.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
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
