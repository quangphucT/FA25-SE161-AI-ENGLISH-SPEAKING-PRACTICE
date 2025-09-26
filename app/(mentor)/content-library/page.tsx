"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, 
  FileText, 
  Video, 
  Link2, 
  Book,
  Upload,
  Edit,
  Trash2,
  Save,
  X,
  Share2,
  Users,
  Search,
  UserPlus
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  type: 'video' | 'pdf' | 'document' | 'link'
  url: string
  createdAt: string
  isShared: boolean
  sharedWith: string[] // Array of learner IDs
}

interface Learner {
  id: string
  name: string
  email: string
}

const ContentLibrary = () => {
  const [isAddingContent, setIsAddingContent] = useState(false)
  const [editingContent, setEditingContent] = useState<string | null>(null)
  const [sharingContent, setSharingContent] = useState<string | null>(null)
  const [searchEmail, setSearchEmail] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    url: ''
  })
  
  // Mock learners data - sẽ được thay thế bằng API calls
  const [learners] = useState<Learner[]>([
    { id: 'learner1', name: 'Nguyễn Văn An', email: 'an@example.com' },
    { id: 'learner2', name: 'Trần Thị Bình', email: 'binh@example.com' },
    { id: 'learner3', name: 'Lê Văn Cường', email: 'cuong@example.com' },
    { id: 'learner4', name: 'Phạm Thị Dung', email: 'dung@example.com' },
    { id: 'learner5', name: 'Hoàng Văn Em', email: 'em@example.com' }
  ])
  
  // Mock data - sẽ được thay thế bằng API calls
  const [contentList, setContentList] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Business English Presentation Skills',
      type: 'video',
      url: 'https://youtube.com/watch?v=example1',
      createdAt: '2024-01-15',
      isShared: true,
      sharedWith: ['learner1', 'learner2', 'learner3']
    },
    {
      id: '2', 
      title: 'IELTS Writing Task 2 Guide',
      type: 'pdf',
      url: 'https://drive.google.com/file/d/example2',
      createdAt: '2024-01-10',
      isShared: true,
      sharedWith: ['learner1', 'learner4']
    },
    {
      id: '3',
      title: 'English Grammar Handbook',
      type: 'document',
      url: 'https://docs.google.com/document/example3',
      createdAt: '2024-01-05',
      isShared: false,
      sharedWith: []
    }
  ])

  const contentTypes = [
    { value: 'video', label: 'Video', icon: Video },
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'document', label: 'Document', icon: Book },
    { value: 'link', label: 'Website Link', icon: Link2 }
  ]

  const getTypeIcon = (type: string) => {
    const typeConfig = contentTypes.find(t => t.value === type)
    return typeConfig?.icon || FileText
  }

  const getTypeLabel = (type: string) => {
    const typeConfig = contentTypes.find(t => t.value === type)
    return typeConfig?.label || type
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.type || !formData.url) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type as ContentItem['type'],
      url: formData.url,
      createdAt: new Date().toISOString().split('T')[0],
      isShared: false,
      sharedWith: []
    }

    if (editingContent) {
      // Update existing content
      setContentList(prev => 
        prev.map(item => 
          item.id === editingContent 
            ? { 
                ...item, 
                title: formData.title,
                type: formData.type as ContentItem['type'],
                url: formData.url
              }
            : item
        )
      )
      setEditingContent(null)
    } else {
      // Add new content
      setContentList(prev => [newContent, ...prev])
    }

    // Reset form
    setFormData({ title: '', type: '', url: '' })
    setIsAddingContent(false)
  }

  const handleEdit = (content: ContentItem) => {
    setFormData({
      title: content.title,
      type: content.type,
      url: content.url
    })
    setEditingContent(content.id)
    setIsAddingContent(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setContentList(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({ title: '', type: '', url: '' })
    setIsAddingContent(false)
    setEditingContent(null)
  }

  const handleShare = (id: string) => {
    setSharingContent(id)
  }

  const toggleShare = (id: string) => {
    setContentList(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isShared: !item.isShared }
          : item
      )
    )
  }

  const addLearnerToContent = (contentId: string, learnerId: string) => {
    setContentList(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              sharedWith: [...item.sharedWith, learnerId],
              isShared: true
            }
          : item
      )
    )
  }

  const removeLearnerFromContent = (contentId: string, learnerId: string) => {
    setContentList(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              sharedWith: item.sharedWith.filter(id => id !== learnerId)
            }
          : item
      )
    )
  }

  const getLearnerInfo = (learnerId: string) => {
    return learners.find(learner => learner.id === learnerId)
  }

  const getFilteredLearners = (contentId: string) => {
    const content = contentList.find(item => item.id === contentId)
    if (!content) return []
    
    return learners.filter(learner => {
      const isNotShared = !content.sharedWith.includes(learner.id)
      const matchesSearch = searchEmail === '' || 
        learner.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
        learner.name.toLowerCase().includes(searchEmail.toLowerCase())
      
      return isNotShared && matchesSearch
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Upload className="w-7 h-7 text-white" />
            </div>
            Thư viện tài liệu
          </h1>
          <p className="text-gray-600 mt-2">Quản lý và chia sẻ tài liệu giảng dạy của bạn</p>
        </div>
        <Button
          onClick={() => setIsAddingContent(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm tài liệu
        </Button>
      </div>

      {/* Content Table */}
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100">
                <TableHead className="font-bold text-gray-900">Tài liệu</TableHead>
                <TableHead className="font-bold text-gray-900">Loại</TableHead>
                <TableHead className="font-bold text-gray-900">Trạng thái</TableHead>
                <TableHead className="font-bold text-gray-900">Ngày tạo</TableHead>
                <TableHead className="font-bold text-gray-900 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentList.length > 0 ? (
                contentList.map((content) => {
                  const TypeIcon = getTypeIcon(content.type)
                  return (
                    <TableRow key={content.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-blue-400 to-purple-500">
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 text-base">{content.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                          <TypeIcon className="w-4 h-4 mr-2" />
                          {getTypeLabel(content.type)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          {content.isShared ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Users className="w-3 h-3 mr-1" />
                              Đã chia sẻ ({content.sharedWith.length})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Riêng tư
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm text-gray-600">{new Date(content.createdAt).toLocaleDateString('vi-VN')}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(content.id)}
                            className="h-8 w-8 p-0 text-green-500 hover:bg-green-50 hover:text-green-700 rounded-full"
                            title="Chia sẻ với learners"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(content)}
                            className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-full"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(content.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center text-gray-500">
                      <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-600 opacity-50" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-1">Chưa có tài liệu nào</p>
                      <p className="text-sm text-gray-500">Nhấn &quot;Thêm tài liệu&quot; để bắt đầu xây dựng thư viện</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Content Modal */}
      {isAddingContent && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                {editingContent ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Tiêu đề tài liệu *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="VD: Business English Presentation Skills"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              {/* Type Field */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold text-gray-700">
                  Loại tài liệu *
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* URL Field */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-semibold text-gray-700">
                  Đường dẫn tài liệu *
                </Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="VD: https://youtube.com/watch?v=... hoặc https://drive.google.com/..."
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: YouTube, Google Drive, Dropbox, OneDrive, website links, v.v.
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingContent ? 'Cập nhật' : 'Thêm tài liệu'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Content Modal */}
      {sharingContent && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                Chia sẻ tài liệu
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSharingContent(null)
                  setSearchEmail('') // Clear search khi đóng modal
                }}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {(() => {
                const content = contentList.find(item => item.id === sharingContent)
                if (!content) return null
                
                return (
                  <>
                    {/* Content Info */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Loại:</strong> {getTypeLabel(content.type)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>URL:</strong> {content.url}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Đã chia sẻ với:</strong> {content.sharedWith.length} learners
                      </p>
                    </div>

                    {/* Share Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Trạng thái chia sẻ</h4>
                            <p className="text-sm text-gray-600">
                              {content.isShared ? 'Tài liệu đang được chia sẻ công khai' : 'Tài liệu ở chế độ riêng tư'}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => toggleShare(content.id)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                            content.isShared
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {content.isShared ? 'Tắt chia sẻ' : 'Bật chia sẻ'}
                        </Button>
                      </div>

                      {/* Add Learners */}
                      <div className="border border-gray-200 rounded-xl p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Thêm learner
                        </h4>
                        
                        {/* Search Input */}
                        <div className="mb-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder="Tìm kiếm theo email hoặc tên..."
                              value={searchEmail}
                              onChange={(e) => setSearchEmail(e.target.value)}
                              className="pl-10 h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Filtered Learners List */}
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {getFilteredLearners(content.id).map((learner) => (
                            <div key={learner.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-gray-900">{learner.name}</span>
                                <p className="text-xs text-blue-600 font-medium">{learner.email}</p>
                              </div>
                              <Button
                                onClick={() => {
                                  addLearnerToContent(content.id, learner.id)
                                  setSearchEmail('') // Clear search sau khi thêm
                                }}
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                              >
                                <Share2 className="w-3 h-3" />
                                Chia sẻ
                              </Button>
                            </div>
                          ))}
                          
                          {/* No Results Messages */}
                          {searchEmail && getFilteredLearners(content.id).length === 0 && (
                            <div className="text-center py-4">
                              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Không tìm thấy learner với từ khóa &quot;{searchEmail}&quot;</p>
                            </div>
                          )}
                          
                          {!searchEmail && getFilteredLearners(content.id).length === 0 && (
                            <div className="text-center py-4">
                              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 italic">Đã thêm tất cả learners</p>
                            </div>
                          )}
                          
                          {!searchEmail && getFilteredLearners(content.id).length > 0 && (
                            <div className="text-center py-2">
                              <p className="text-xs text-gray-400">
                                Hiển thị {getFilteredLearners(content.id).length} learners có thể thêm
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Learner Access List */}
                      {content.sharedWith.length > 0 && (
                        <div className="border border-gray-200 rounded-xl p-4">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Learners có quyền truy cập ({content.sharedWith.length})
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {content.sharedWith.map((learnerId) => {
                              const learnerInfo = getLearnerInfo(learnerId)
                              return (
                                <div key={learnerId} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {learnerInfo?.name || `Learner ${learnerId}`}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                      {learnerInfo?.email || 'No email'}
                                    </p>
                                  </div>
                                  <Button
                                    onClick={() => removeLearnerFromContent(content.id, learnerId)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50 text-xs"
                                  >
                                    Gỡ bỏ
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Share Link */}
                      {content.isShared && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                          <h4 className="font-medium text-blue-900 mb-2">Link chia sẻ</h4>
                          <div className="flex items-center gap-2">
                            <Input
                              value={`${window.location.origin}/shared-content/${content.id}`}
                              readOnly
                              className="flex-1 text-sm bg-white"
                            />
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/shared-content/${content.id}`)
                                alert('Đã copy link!')
                              }}
                              size="sm"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs text-blue-700 mt-2">
                            Learners có thể truy cập tài liệu qua link này
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <Button
                onClick={() => {
                  setSharingContent(null)
                  setSearchEmail('') // Clear search khi đóng modal
                }}
                className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentLibrary
