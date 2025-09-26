

"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import imageProfile from '../../../public/images/imageLanding.avif'
import { 
  Star, 
  BookOpen, 
  Award, 
  TrendingUp,
  Edit,
  CheckCircle,
  X,
  Save,
  Plus,
} from 'lucide-react'
import Image from 'next/image'

const MentorProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [isAddingTopic, setIsAddingTopic] = useState(false)
  const [skills, setSkills] = useState([
    { name: "Business English", isStrength: true },
    { name: "IELTS Preparation", isStrength: true },
    { name: "Conversation Practice", isStrength: false },
    { name: "Grammar & Writing", isStrength: false }
  ])
  const [topics, setTopics] = useState([
    { title: "Business English", description: "Professional communication, meetings, presentations" },
    { title: "Academic English", description: "Essay writing, research skills, academic vocabulary" },
    { title: "Daily Conversation", description: "Everyday situations, casual speaking, practical English" },
    { title: "Test Preparation", description: "IELTS, TOEIC, and other standardized test prep" }
  ])
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn Minh",
    qualification: "TESOL Certified, Master's in English Literature",
    teachingStyle: "Interactive and conversational",
    voiceAccent: "American English",
    bio: "Passionate English mentor with 5 years of experience helping Vietnamese learners achieve their language goals. Specialized in business communication and test preparation.",
    yearsExperience: 5
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // TODO: API call to update mentor data
    console.log("Saving mentor data:", formData)
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: mentorData.name,
      qualification: mentorData.qualification,
      teachingStyle: mentorData.teachingStyle,
      voiceAccent: mentorData.voiceAccent,
      bio: mentorData.bio,
      yearsExperience: mentorData.yearsExperience
    })
    setIsEditing(false)
  }

  // Mock data - sẽ được thay thế bằng API calls thực tế
  const mentorData = {
    id: "mentor_001",
    name: "Nguyễn Văn Minh",
    avatar: "/api/placeholder/150/150",
    rating: 4.8,
    totalReviews: 156,
    totalLearners: 245,
    yearsExperience: 5,
    qualification: "TESOL Certified, Master's in English Literature",
    teachingStyle: "Interactive and conversational",
    voiceAccent: "American English",
    bio: "Passionate English mentor with 5 years of experience helping Vietnamese learners achieve their language goals. Specialized in business communication and test preparation.",
    responseTime: "Usually responds within 2 hours"
  }

  // Available skills and topics to choose from
  const availableSkills = [
    { name: "Business English" },
    { name: "IELTS Preparation" },
    { name: "TOEIC Preparation" },
    { name: "Conversation Practice" },
    { name: "Grammar & Writing" },
    { name: "Pronunciation" },
    { name: "Academic English" }
  ]

  const availableTopics = [
    { title: "Business English", description: "Professional communication, meetings, presentations" },
    { title: "Academic English", description: "Essay writing, research skills, academic vocabulary" },
    { title: "Daily Conversation", description: "Everyday situations, casual speaking, practical English" },
    { title: "Test Preparation", description: "IELTS, TOEIC, and other standardized test prep" },
    { title: "Technology", description: "IT terminology, digital communication, tech trends" },
    { title: "Culture & Society", description: "Cultural discussions, social topics, lifestyle" },
    { title: "Career Development", description: "Job interviews, professional networking, workplace skills" }
  ]

  const addSkill = (skillName: string, isStrength: boolean = false) => {
    const availableSkill = availableSkills.find(skill => skill.name === skillName)
    if (availableSkill && !skills.some(skill => skill.name === skillName)) {
      setSkills([...skills, { name: skillName, isStrength }])
    }
    setIsAddingSkill(false)
  }

  const addTopic = (topicTitle: string, topicDescription: string) => {
    const availableTopic = availableTopics.find(topic => topic.title === topicTitle)
    if (availableTopic && !topics.some(topic => topic.title === topicTitle)) {
      setTopics([...topics, { title: topicTitle, description: topicDescription }])
    }
    setIsAddingTopic(false)
  }

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(skill => skill.name !== skillName))
  }

  const removeTopic = (topicTitle: string) => {
    setTopics(topics.filter(topic => topic.title !== topicTitle))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Profile Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl"></div>
        
        <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-blue-100/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center lg:items-start space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur"></div>
                  <Image 
                    src={imageProfile} 
                    alt={mentorData.name}
                    className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                    width={160}
                    height={160}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              
                <div className="text-center lg:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                      {mentorData.name}
                    </h1>
                    <div className="mt-3 space-y-1">
                      <p className="text-lg text-gray-700 font-medium">{mentorData.teachingStyle} Teaching Style</p>
                      <p className="text-base text-gray-600">{mentorData.voiceAccent} Accent</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-lg text-gray-900">{mentorData.rating}</span>
                      <span className="text-gray-600 text-sm font-medium">({mentorData.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Professional Information */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Qualification & Experience */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  Trình độ & Chuyên môn
                </h3>
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Chuyên môn thế mạnh
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.filter(skill => skill.isStrength).map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md"
                        >
                          <Star className="w-3 h-3 mr-2 fill-current" />
                          {skill.name}
                        </span>
                      ))}
                      {skills.filter(skill => skill.isStrength).length === 0 && (
                        <span className="text-gray-500 text-sm italic">Chưa có skill thế mạnh</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-2xl border border-blue-100 shadow-lg">
                    <div className="space-y-4">
                      {/* Experience */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Kinh nghiệm</h4>
                          <span className="text-gray-700 font-medium">{mentorData.yearsExperience} năm kinh nghiệm</span>
                        </div>
                      </div>

                      {/* Teaching Style */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Teaching Style</h4>
                          <span className="text-gray-700 font-medium">{mentorData.teachingStyle}</span>
                        </div>
                      </div>

                      {/* Voice Accent */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Voice Accent</h4>
                          <span className="text-gray-700 font-medium">{mentorData.voiceAccent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Thống kê
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Tổng học viên:</span>
                      <span className="font-bold text-2xl text-emerald-600">{mentorData.totalLearners}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Tổng đánh giá:</span>
                      <span className="font-bold text-2xl text-blue-600">{mentorData.totalReviews}</span>
                    </div>
                  </div>
                
                
                </div>
              </div>




            </div>


            

            {/* Action Button */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
              >
                <Edit className="w-5 h-5 mr-2" />
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              Giới thiệu bản thân
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-lg">{mentorData.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-100 to-purple-100 p-2 rounded-2xl border-0 shadow-lg">
          <TabsTrigger 
            value="skills" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 font-semibold rounded-xl transition-all duration-300"
          >
            🎯 Skills
          </TabsTrigger>
          <TabsTrigger 
            value="topics"
            className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-purple-600 font-semibold rounded-xl transition-all duration-300"
          >
            📚 Topics
          </TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-8 mt-8">
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                Kỹ năng của tôi
              </h3>
              <p className="text-gray-600 mt-1">Quản lý và hiển thị các kỹ năng chuyên môn</p>
            </div>
            <Button
              onClick={() => setIsAddingSkill(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Skill
            </Button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100">
                  <TableHead className="font-bold text-gray-900">Kỹ năng</TableHead>
                  <TableHead className="font-bold text-gray-900">Loại</TableHead>
                  <TableHead className="font-bold text-gray-900">Trạng thái</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                            skill.isStrength 
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}>
                            {skill.isStrength ? (
                              <Star className="w-5 h-5 text-white fill-current" />
                            ) : (
                              <Award className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 text-lg">{skill.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {skill.isStrength ? (
                          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md">
                            <Star className="w-4 h-4 mr-2 fill-current" />
                            Skill thế mạnh
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                            <Award className="w-4 h-4 mr-2" />
                            Kỹ năng chuyên môn
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            skill.isStrength ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-600">
                            {skill.isStrength ? 'Thế mạnh' : 'Chuyên môn'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedSkills = skills.map(s => 
                                s.name === skill.name ? { ...s, isStrength: !s.isStrength } : s
                              )
                              setSkills(updatedSkills)
                            }}
                            className={`h-8 w-8 p-0 rounded-full ${
                              skill.isStrength 
                                ? 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700' 
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                            }`}
                            title={skill.isStrength ? "Bỏ skill thế mạnh" : "Đặt làm skill thế mạnh"}
                          >
                            <Star className={`w-4 h-4 ${skill.isStrength ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill(skill.name)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full"
                            title="Xóa skill"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center text-gray-500">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                          <Award className="w-8 h-8 text-blue-600 opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-1">Chưa có skill nào</p>
                        <p className="text-sm text-gray-500">Nhấn &quot;Thêm Skill&quot; để thêm kỹ năng chuyên môn</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-8 mt-8">
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-100">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Chủ đề giảng dạy
              </h3>
              <p className="text-gray-600 mt-1">Quản lý và hiển thị các chủ đề giảng dạy</p>
            </div>
            <Button
              onClick={() => setIsAddingTopic(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Topic
            </Button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-green-50 to-teal-50 hover:bg-gradient-to-r hover:from-green-100 hover:to-teal-100">
                  <TableHead className="font-bold text-gray-900">Tên chủ đề</TableHead>
                  <TableHead className="font-bold text-gray-900">Mô tả</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.length > 0 ? (
                  topics.map((topic, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-green-400 to-teal-500">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 text-lg">{topic.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-gray-600 text-sm leading-relaxed">{topic.description}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTopic(topic.title)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full"
                            title="Xóa topic"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12">
                      <div className="flex flex-col items-center text-gray-500">
                        <div className="w-16 h-16 bg-green-100 rounded-full mb-4 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-green-600 opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-1">Chưa có topic nào</p>
                        <p className="text-sm text-gray-500">Nhấn &quot;Thêm Topic&quot; để thêm chủ đề giảng dạy</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="teachingStyle" className="text-sm font-medium text-gray-700">
                      Teaching Style
                    </Label>
                    <Input
                      id="teachingStyle"
                      value={formData.teachingStyle}
                      onChange={(e) => handleInputChange('teachingStyle', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., Interactive, Structured, Conversational"
                    />
                  </div>

                  <div>
                    <Label htmlFor="voiceAccent" className="text-sm font-medium text-gray-700">
                      Voice Accent
                    </Label>
                    <Input
                      id="voiceAccent"
                      value={formData.voiceAccent}
                      onChange={(e) => handleInputChange('voiceAccent', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., American English, British English, Australian English"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="yearsExperience" className="text-sm font-medium text-gray-700">
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
            
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddingSkill && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Skill</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingSkill(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {availableSkills
                  .filter(skill => !skills.some(s => s.name === skill.name))
                  .map((skill, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => addSkill(skill.name, false)}
                        size="sm"
                        variant="outline"
                      >
                        Add Normal
                      </Button>
                      <Button
                        onClick={() => addSkill(skill.name, true)}
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Add as Strength
                      </Button>
                    </div>
                  </div>
                ))}
                {availableSkills.filter(skill => !skills.some(s => s.name === skill.name)).length === 0 && (
                  <p className="text-center text-gray-500 py-4">All available skills have been added</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {isAddingTopic && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Topic</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingTopic(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {availableTopics
                  .filter(topic => !topics.some(t => t.title === topic.title))
                  .map((topic, index) => (
                  <div key={index} className="flex justify-between items-start p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                    </div>
                    <Button
                      onClick={() => addTopic(topic.title, topic.description)}
                      size="sm"
                      className="ml-3"
                    >
                      Add
                    </Button>
                  </div>
                ))}
                {availableTopics.filter(topic => !topics.some(t => t.title === topic.title)).length === 0 && (
                  <p className="text-center text-gray-500 py-4">All available topics have been added</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MentorProfile
