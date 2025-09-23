

"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    { name: "Business English" },
    { name: "IELTS Preparation" },
    { name: "Conversation Practice" },
    { name: "Grammar & Writing" }
  ])
  const [topics, setTopics] = useState([
    { name: "Business" },
    { name: "Academic" },
    { name: "Daily Life" },
    { name: "Test Prep" }
  ])
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn Minh",
    qualification: "TESOL Certified, Master's in English Literature",
    specialization: "Business English, IELTS Preparation, Conversation Practice",
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
      specialization: mentorData.specialization,
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
    specialization: "Business English, IELTS Preparation, Conversation Practice",
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
    { name: "Business" },
    { name: "Academic" },
    { name: "Daily Life" },
    { name: "Test Prep" },
    { name: "Technology" },
    { name: "Culture" },
    { name: "Career" }
  ]

  const addSkill = (skillName: string) => {
    const availableSkill = availableSkills.find(skill => skill.name === skillName)
    if (availableSkill && !skills.some(skill => skill.name === skillName)) {
      setSkills([...skills, availableSkill])
    }
    setIsAddingSkill(false)
  }

  const addTopic = (topicName: string) => {
    const availableTopic = availableTopics.find(topic => topic.name === topicName)
    if (availableTopic && !topics.some(topic => topic.name === topicName)) {
      setTopics([...topics, availableTopic])
    }
    setIsAddingTopic(false)
  }

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(skill => skill.name !== skillName))
  }

  const removeTopic = (topicName: string) => {
    setTopics(topics.filter(topic => topic.name !== topicName))
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Profile Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <div className="relative">
                <Image 
                  src={imageProfile} 
                  alt={mentorData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  width={128}
                  height={128}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{mentorData.name}</h1>
                <p className="text-gray-600 mt-2">{mentorData.specialization}</p>
                <div className="flex items-center gap-2 justify-center lg:justify-start mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{mentorData.rating}</span>
                    <span className="text-gray-500 text-sm">({mentorData.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Qualification & Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Trình độ & Chuyên môn
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Qualification</h4>
                    <p className="text-gray-600">{mentorData.qualification}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Years of Experience</h4>
                    <p className="text-gray-600">{mentorData.yearsExperience} years</p>
                  </div>
               
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Thống kê
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Learners:</span>
                    <span className="font-semibold">{mentorData.totalLearners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews:</span>
                    <span className="font-semibold">{mentorData.totalReviews}</span>
                  </div>
                
                  <div>
                    <span className="text-gray-600">Response Time:</span>
                    <p className="text-sm text-gray-500">{mentorData.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
            <p className="text-gray-600 leading-relaxed">{mentorData.bio}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">My Skills</h3>
            <Button
              onClick={() => setIsAddingSkill(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <Card key={index} className="relative group hover:shadow-md transition-all hover:-translate-y-1 border-l-4 border-l-blue-400">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty state */}
            {skills.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-blue-600 opacity-50" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">No skills added yet</p>
                <p className="text-sm text-gray-500">Click &quot;Add Skill&quot; to showcase your expertise</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">My Topics</h3>
            <Button
              onClick={() => setIsAddingTopic(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Topic
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <Card key={index} className="relative group hover:shadow-md transition-all hover:-translate-y-1 border-l-4 border-l-green-400">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">{topic.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTopic(topic.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty state */}
            {topics.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-green-600 opacity-50" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">No topics added yet</p>
                <p className="text-sm text-gray-500">Click &quot;Add Topic&quot; to share your teaching areas</p>
              </div>
            )}
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
                    <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                      Specialization
                    </Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="mt-1"
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
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                
                <div>
                  <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">
                    Qualification
                  </Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
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
                    <div>
                      <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                    </div>
                    <Button
                      onClick={() => addSkill(skill.name)}
                      size="sm"
                    >
                      Add
                    </Button>
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
                  .filter(topic => !topics.some(t => t.name === topic.name))
                  .map((topic, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                    </div>
                    <Button
                      onClick={() => addTopic(topic.name)}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                ))}
                {availableTopics.filter(topic => !topics.some(t => t.name === topic.name)).length === 0 && (
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
