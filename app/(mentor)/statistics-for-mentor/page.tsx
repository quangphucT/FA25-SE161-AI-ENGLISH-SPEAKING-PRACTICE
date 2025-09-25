import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"


const StatisticsForMentor = () => {
  const [showAllFeedback, setShowAllFeedback] = useState(false);
     // Sample data for mentor stats
  const mentorStats = {
    totalStudents: 42,
    totalSessions: 186,
    avgRating: 4.8,
    totalSyllabus: 23
  };

  const feedbackSummary = [
    {
      id: 1,
      studentName: "Nguyễn Văn An",
      rating: 5,
      comment: "Excellent teaching method! Very clear explanations and patient guidance.",
      sessionType: "Speaking Practice",
      date: "Sept 20, 2025",
      avatar: "NVA"
    },
    {
      id: 2,
      studentName: "Trần Thị Bình",
      rating: 4,
      comment: "Great IELTS preparation. Helped me improve my speaking confidence significantly.",
      sessionType: "IELTS Speaking",
      date: "Sept 19, 2025",
      avatar: "TTB"
    },
    {
      id: 3,
      studentName: "Lê Minh Hoàng",
      rating: 5,
      comment: "Professional business English training. Very practical and useful content.",
      sessionType: "Business English",
      date: "Sept 18, 2025",
      avatar: "LMH"
    },
    {
      id: 4,
      studentName: "Phạm Thu Dung",
      rating: 4,
      comment: "Good grammar lessons with clear examples. Would recommend to others.",
      sessionType: "Grammar Review",
      date: "Sept 17, 2025",
      avatar: "PTD"
    },
    {
      id: 5,
      studentName: "Nguyễn Thị Lan",
      rating: 5,
      comment: "Amazing mentor! Very encouraging and creates comfortable learning environment.",
      sessionType: "Conversation Practice",
      date: "Sept 16, 2025",
      avatar: "NTL"
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      student: "Nguyễn Thị Lan",
      time: "10:00 AM",
      date: "Today",
      topic: "Business English Conversation",
      status: "confirmed"
    },
    {
      id: 2,
      student: "Vũ Minh Khôi",
      time: "2:00 PM",
      date: "Today",
      topic: "IELTS Speaking Practice",
      status: "confirmed"
    },
    {
      id: 3,
      student: "Đặng Thị Hạnh",
      time: "9:00 AM",
      date: "Tomorrow",
      topic: "Grammar Review Session",
      status: "pending"
    }
  ];

  // Chỉ hiển thị các session đã confirmed
  const confirmedSessions = upcomingSessions.filter(session => session.status === "confirmed");

  // Full feedback data cho modal
  const allFeedbackData = [
    ...feedbackSummary,
    {
      id: 6,
      studentName: "Hoàng Văn Tùng",
      rating: 5,
      comment: "Outstanding mentor! The lessons are well-structured and very engaging. I've learned so much in just a few sessions.",
      sessionType: "Advanced Speaking",
      date: "Sept 15, 2025",
      avatar: "HVT"
    },
    {
      id: 7,
      studentName: "Lý Thị Mai",
      rating: 4,
      comment: "Great pronunciation coaching. Helped me overcome my accent issues and speak more confidently.",
      sessionType: "Pronunciation",
      date: "Sept 14, 2025",
      avatar: "LTM"
    },
    {
      id: 8,
      studentName: "Trương Minh Đức",
      rating: 5,
      comment: "Excellent TOEFL preparation. The practice tests and tips were incredibly helpful for my exam.",
      sessionType: "TOEFL Prep",
      date: "Sept 13, 2025",
      avatar: "TMD"
    },
    {
      id: 9,
      studentName: "Phan Thị Hương",
      rating: 4,
      comment: "Very patient teacher. Explains complex grammar rules in an easy-to-understand way.",
      sessionType: "Grammar Focus",
      date: "Sept 12, 2025",
      avatar: "PTH"
    },
    {
      id: 10,
      studentName: "Ngô Văn Khang",
      rating: 5,
      comment: "Amazing business English course! Really practical for my work environment. Highly recommended.",
      sessionType: "Business English",
      date: "Sept 11, 2025",
      avatar: "NVK"
    }
  ];

  return (
     <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Learners</p>
                        <p className="text-2xl font-bold text-gray-900">{mentorStats.totalStudents}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-600">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">{mentorStats.totalSessions}</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-600">
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
                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold text-gray-900">{mentorStats.avgRating}/5</p>
                      </div>
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-yellow-500">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total documents uploaded</p>
                        <p className="text-2xl font-bold text-gray-900">{mentorStats.totalSyllabus}</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-purple-600">
                          <path d="M9 11l3 3 8-8"/>
                          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.34 0 2.6.29 3.74.82"/>
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {confirmedSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{session.student}</p>
                            <p className="text-sm text-gray-500">{session.topic}</p>
                            <p className="text-xs text-gray-400">{session.date} at {session.time}</p>
                          </div>
                          <Badge variant="default">
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Summary</CardTitle>
                    <p className="text-sm text-gray-500">Recent feedback from your learners</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feedbackSummary.map((feedback) => (
                        <div key={feedback.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xs">{feedback.avatar}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{feedback.studentName}</h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} width="14" height="14" fill={i < feedback.rating ? "#fbbf24" : "#e5e7eb"} viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">&quot;{feedback.comment}&quot;</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{feedback.sessionType}</span>
                              <span>{feedback.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <button 
                        onClick={() => setShowAllFeedback(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        View all feedback →
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Feedback Modal */}
              {showAllFeedback && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">All Student Feedback</h2>
                        <p className="text-sm text-gray-500">Complete feedback history from your students</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAllFeedback(false)}
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </Button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                      <div className="grid gap-4">
                        {allFeedbackData.map((feedback) => (
                          <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-sm">{feedback.avatar}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-base font-semibold text-gray-900">{feedback.studentName}</h3>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} width="16" height="16" fill={i < feedback.rating ? "#fbbf24" : "#e5e7eb"} viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">({feedback.rating}/5)</span>
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-3 leading-relaxed">&quot;{feedback.comment}&quot;</p>
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {feedback.sessionType}
                                  </span>
                                  <span className="text-sm text-gray-500">{feedback.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Total feedback: <span className="font-semibold">{allFeedbackData.length}</span> reviews
                        </p>
                        <Button
                          onClick={() => setShowAllFeedback(false)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
  )
}

export default StatisticsForMentor
