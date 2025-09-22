import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const StatisticsForMentor = () => {
     // Sample data for mentor stats
  const mentorStats = {
    totalStudents: 42,
    totalSessions: 186,
    avgRating: 4.8,
    completedAssessments: 23
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
                        <p className="text-sm font-medium text-gray-600">Assessments</p>
                        <p className="text-2xl font-bold text-gray-900">{mentorStats.completedAssessments}</p>
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
                      {upcomingSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{session.student}</p>
                            <p className="text-sm text-gray-500">{session.topic}</p>
                            <p className="text-xs text-gray-400">{session.date} at {session.time}</p>
                          </div>
                          <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'}>
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
                    <p className="text-sm text-gray-500">Recent feedback from your students</p>
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
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">"{feedback.comment}"</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{feedback.sessionType}</span>
                              <span>{feedback.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all feedback →
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
  )
}

export default StatisticsForMentor
