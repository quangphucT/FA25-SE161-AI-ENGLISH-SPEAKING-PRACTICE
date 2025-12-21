"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useLearnerRecordFolders,
  useLearnerRecordFolderCreate,
  useLearnerRecordFolderDelete,
  useLearnerRecordFolderRename,
  useLearnerRecords,
  useLearnerRecordCreate,
  useLearnerRecordDelete,
  useLearnerRecordUpdateContent,
} from "@/features/learner/hooks/useLearnerRecord";
import { RecordCategory, Record, Status, StatusRecord } from "@/features/learner/services/learnerRecordService";
import {
  FolderPlus,
  FilePlus,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Loader2,
  Folder,
  Music,
  Star,
  MessageSquare,
  Mic,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { formatAiFeedbackHtml } from "@/utils/formatAiFeedback";
import { toast } from "sonner";
import BuyRecordChargeModal from "@/components/BuyRecordChargeModal";

export default function LearnerRecordPage() {
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showCreateRecordDialog, setShowCreateRecordDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showEditContentDialog, setShowEditContentDialog] = useState(false);
  const [folderToRename, setFolderToRename] = useState<RecordCategory | null>(null);
  const [recordToEdit, setRecordToEdit] = useState<Record | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newRecordContent, setNewRecordContent] = useState("");
  const [renamingFolderName, setRenamingFolderName] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const isFoldersCollapsed = false;
  const isRecordsCollapsed = false;
  const [feedbackRecord, setFeedbackRecord] = useState<Record | null>(null);
  const [showBuyRecordChargeDialog, setShowBuyRecordChargeDialog] = useState(false);
  // Queries
  const { data: foldersData, isLoading: isLoadingFolders } = useLearnerRecordFolders();
  const { data: recordsData, isLoading: isLoadingRecords } = useLearnerRecords(selectedFolderId);

  // Mutations
  const { mutateAsync: createFolder, isPending: isCreatingFolder } = useLearnerRecordFolderCreate();
  const { mutateAsync: deleteFolder } = useLearnerRecordFolderDelete();
  const { mutateAsync: renameFolder, isPending: isRenamingFolder } = useLearnerRecordFolderRename();
  const { mutateAsync: createRecord, isPending: isCreatingRecord } = useLearnerRecordCreate();
  const { mutateAsync: deleteRecord } = useLearnerRecordDelete();
  const { mutateAsync: updateRecordContent, isPending: isUpdatingRecordContent } = useLearnerRecordUpdateContent();
  // Handle response structure - data can be array directly or nested in data property
  const folders = (() => {
    if (!foldersData) return [];
    if (Array.isArray(foldersData.data)) {
      return foldersData.data;
    }
    if (Array.isArray(foldersData)) {
      return foldersData;
    }
    return [];
  })();

  const selectedRecords = (() => {
    if (!recordsData) return [];
    // If data is an array, return it
    if (Array.isArray(recordsData.data)) {
      return recordsData.data;
    }
    // If data is an object (single record), wrap it in an array
    if (recordsData.data && typeof recordsData.data === 'object' && 'recordId' in recordsData.data) {
      return [recordsData.data];
    }
    // If recordsData itself is an array
    if (Array.isArray(recordsData)) {
      return recordsData;
    }
    return [];
  })();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName.trim());
      setNewFolderName("");
      setShowCreateFolderDialog(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thư mục này?")) return;
    try {
      await deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
    } catch {
      // Error handled by hook
    }
  };

  const handleRenameFolder = async () => {
    if (!folderToRename || !renamingFolderName.trim()) return;
    try {
      await renameFolder({
        categoryId: folderToRename.learnerRecordId,
        newName: renamingFolderName.trim(),
      });
      setRenamingFolderName("");
      setFolderToRename(null);
      setShowRenameDialog(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleCreateRecord = async () => {
    if (!selectedFolderId || !newRecordContent.trim()) return;
    try {
      // Create record with content first
      await createRecord({
        folderId: selectedFolderId,
        content: newRecordContent.trim(),
      });
      
      // Navigate to practice page with content and folderId
      // The practice page will handle recording and updating the record
      setNewRecordContent("");
      setShowCreateRecordDialog(false);
    } catch {
      // Error handled by hook (toast notification)
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await deleteRecord(recordId);
    } catch {
      // Error handled by hook
    }
  };
  const handleUpdateRecordContent = async () => {
    if (!recordToEdit || !editingContent.trim()) return;
    if (!recordToEdit.recordContentId) {
      toast.error("Không tìm thấy Record Content ID");
      return;
    }
    try {
      await updateRecordContent({ 
        recordContentId: recordToEdit.recordContentId, 
        content: editingContent.trim() 
      });
      setEditingContent("");
      setRecordToEdit(null);
      setShowEditContentDialog(false);
      toast.success("Cập nhật nội dung thành công");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Cập nhật nội dung record thất bại";
      toast.error(message);
      console.error(error);
    }
  };

  const openEditContentDialog = (record: Record) => {
    setRecordToEdit(record);
    setEditingContent(record.content || "");
    setShowEditContentDialog(true);
  };

  const openRenameDialog = (folder: RecordCategory) => {
    setFolderToRename(folder);
    setRenamingFolderName(folder.name);
    setShowRenameDialog(true);
  };

  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) {
      return "Chưa học lần nào";
    }
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      if (isNaN(date.getTime())) {
        return "Chưa học lần nào";
      }
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return typeof dateString === 'string' ? dateString : (dateString?.toString() || "N/A");
    }
  };

  // Map folder status to Vietnamese
  const getFolderStatusLabel = (status: Status | string | undefined): string => {
    if (!status) return "";
    switch (status) {
      case "Draft":
        return "Nháp";
      case "InProgress":
        return "Đang thực hiện";
      case "Done":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  // Map record status to Vietnamese
  const getRecordStatusLabel = (status: StatusRecord | string | undefined): string => {
    if (!status) return "";
    switch (status) {
      case "Draft":
        return "Nháp";
      case "Submitted":
        return "Đã nộp";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-5 h-[87vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Record</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý các thư mục và record của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FolderPlus className="w-4 h-4 mr-2" />
                Tạo thư mục mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo thư mục mới</DialogTitle>
                <DialogDescription>Nhập tên cho thư mục mới của bạn</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Tên thư mục"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim() || isCreatingFolder}
                  >
                    {isCreatingFolder ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-purple-600 hover:bg-purple-700" 
            onClick={() => {
              if (!selectedFolderId) {
                toast.error("Vui lòng chọn một folder trước khi mua gói ghi âm");
                return;
              }
              setShowBuyRecordChargeDialog(true);
            }}
          >
            <Mic className="w-4 h-4 mr-2" />
            Mua gói ghi âm
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 h-max">
        {/* Sidebar - Folders List */}
        <Card className={`lg:col-span-1 transition-all duration-300 flex flex-col h-full min-h-0 ${isFoldersCollapsed ? 'lg:col-span-0 overflow-hidden' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Thư mục
              </CardTitle>
            </div>
            
          </CardHeader>
          {!isFoldersCollapsed && (
            <>
              <CardDescription className="px-6 pb-4">Chọn thư mục để xem records</CardDescription>
              <CardContent className="space-y-2 flex-1 overflow-y-auto min-h-0">
            {isLoadingFolders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : folders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Folder className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Chưa có thư mục nào</p>
                <p className="text-sm">Tạo thư mục mới để bắt đầu</p>
              </div>
            ) : (
              folders.map((folder, index) => (
                <div
                  key={folder.learnerRecordId || `folder-${index}`}
                  className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedFolderId === folder.learnerRecordId
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-500 shadow-md"
                      : "bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedFolderId(folder.learnerRecordId)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        selectedFolderId === folder.learnerRecordId
                          ? "bg-blue-100"
                          : "bg-gray-100 group-hover:bg-blue-100"
                      }`}>
                        <Folder className={`w-5 h-5 ${
                          selectedFolderId === folder.learnerRecordId
                            ? "text-blue-600"
                            : "text-gray-600 group-hover:text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-base mb-2 truncate ${
                          selectedFolderId === folder.learnerRecordId
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}>
                          {folder.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {folder.numberOfRecord !== undefined && folder.numberOfRecord !== null && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <Mic className="w-3 h-3 mr-1" />
                              {folder.numberOfRecord} lượt còn lại
                            </Badge>
                          )}
                          {folder.status && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                folder.status === "Active"
                                  ? "border-green-300 text-green-700 bg-green-50"
                                  : folder.status === "Done"
                                  ? "border-green-300 text-green-700 bg-green-50"
                                  : folder.status === "InProgress"
                                  ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                  : "border-gray-300 text-gray-700 bg-gray-50"
                              }`}
                            >
                              {getFolderStatusLabel(folder.status)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            selectedFolderId === folder.learnerRecordId ? "opacity-100" : ""
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openRenameDialog(folder)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Đổi tên
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteFolder(folder.learnerRecordId)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
              </CardContent>
            </>
          )}
        </Card>

        {/* Main Content - Records List */}
        <Card className={`lg:col-span-2 transition-all duration-300 flex flex-col h-full  min-h-0 ${isRecordsCollapsed ? 'lg:col-span-0 overflow-hidden' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Records
                </CardTitle>
                {!isRecordsCollapsed && (
                  <CardDescription>
                    {selectedFolderId
                      ? `${selectedRecords.length} record trong thư mục này`
                      : "Chọn một thư mục để xem records"}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">  
                {selectedFolderId && !isRecordsCollapsed && (
                  <Dialog open={showCreateRecordDialog} onOpenChange={setShowCreateRecordDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <FilePlus className="w-4 h-4 mr-2" />
                        Tạo record
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Tạo record mới</DialogTitle>
                        <DialogDescription>Nhập thông tin cho record mới của bạn</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Câu mà bạn muốn luyện tập </label>
                          <Input
                            placeholder="Nhập câu mà bạn muốn luyện tập"
                            value={newRecordContent}
                            onChange={(e) => setNewRecordContent(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowCreateRecordDialog(false);
                              setNewRecordContent("");
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            onClick={handleCreateRecord}
                            disabled={!newRecordContent.trim() || isCreatingRecord}
                          >
                            {isCreatingRecord ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang tạo...
                              </>
                            ) : (
                              "Tạo"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                 {selectedFolderId && !isRecordsCollapsed && (
                   <Button 
                     size="sm" 
                     className="bg-blue-600 hover:bg-blue-700"
                     onClick={() => {
                       const firstRecord = selectedRecords[0];
                       if (firstRecord && firstRecord.recordId && firstRecord.content) {
                         router.push(
                           `/learner_record/${selectedFolderId}?recordId=${firstRecord.recordId}&content=${encodeURIComponent(firstRecord.content)}`
                         );
                       } else {
                         toast.error("Không thể tìm thấy record để học");
                       }
                     }}
                     disabled={selectedRecords.length === 0 || isLoadingRecords}
                   >
                     <Play className="w-4 h-4 mr-2" />
                     Học record trong thư mục này
                   </Button>
                 )}
              </div>
            </div>
          </CardHeader>
          {!isRecordsCollapsed && (
            <CardContent className="flex-1 overflow-y-auto min-h-0">
            {!selectedFolderId ? (
              <div className="text-center py-12 text-gray-500">
                <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Chưa chọn thư mục</p>
                <p className="text-sm">Vui lòng chọn một thư mục từ danh sách bên trái</p>
              </div>
            ) : isLoadingRecords ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : selectedRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Chưa có record nào</p>
                <p className="text-sm mb-4">Tạo record mới để bắt đầu</p>
                <Button
                  onClick={() => setShowCreateRecordDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FilePlus className="w-4 h-4 mr-2" />
                  Tạo record đầu tiên
                </Button>
              </div>
            ) : (
                <div className="space-y-4">
                  {selectedRecords.map((record: Record, index: number) => {
                    const hasAiFeedback = Boolean(record.aiFeedback && record.aiFeedback.trim());
                    return (
                      <Card 
                        key={record.recordId || `record-${index}`} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          if (!selectedFolderId) {
                            toast.error("Vui lòng chọn thư mục trước");
                            return;
                          }
                          
                          // Use recordContentId if available, otherwise fallback to recordId
                          const recordIdToUse = record.recordContentId || record.recordId;
                          const contentToUse = record.content || "";
                          
                          if (!recordIdToUse) {
                            toast.error("Record không có ID hợp lệ");
                            return;
                          }
                          
                          if (!contentToUse) {
                            toast.error("Record không có nội dung");
                            return;
                          }
                          
                          router.push(`/learner_record/${selectedFolderId}?recordId=${recordIdToUse}&content=${encodeURIComponent(contentToUse)}`);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-lg">{record.content || "N/A"}</h3>
                                
                                {hasAiFeedback && (
                                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 bg-blue-50">
                                    Có phản hồi AI
                                  </Badge>
                                )}
                              </div>

                              {record.audioRecordingURL && (
                                <div className="flex items-center gap-2">
                                  <audio controls className="w-full max-w-md">
                                    <source src={record.audioRecordingURL} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                  </audio>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-gray-600">Điểm số:</span>
                                  <span className="font-semibold">{record.score ?? 0}/100</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-blue-500" />
                                  <span className="text-gray-600">Trạng thái:</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs font-semibold ${
                                      record.status === "Submitted"
                                        ? "border-green-300 text-green-700 bg-green-50"
                                        : "border-gray-300 text-gray-700 bg-gray-50"
                                    }`}
                                  >
                                    {getRecordStatusLabel(record.status)}
                                  </Badge>
                                </div>
                              </div>

                              <div className="text-xs text-gray-500">
                                Học lần cuối: {formatDate(record.createdAt)}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                                {hasAiFeedback && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFeedbackRecord(record);
                                    }}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <MessageSquare className="w-4 h-4 text-blue-500" />
                                    Xem phản hồi AI
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditContentDialog(record);
                                  }}
                                  className="text-blue-600 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Sửa nội dung
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRecord(record.recordContentId);
                                  }}
                                  className="text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
            )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Rename Folder Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi tên thư mục</DialogTitle>
            <DialogDescription>Nhập tên mới cho thư mục</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Tên thư mục mới"
              value={renamingFolderName}
              onChange={(e) => setRenamingFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameFolder();
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleRenameFolder}
                disabled={!renamingFolderName.trim() || isRenamingFolder}
              >
                {isRenamingFolder ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={showEditContentDialog} onOpenChange={setShowEditContentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sửa nội dung record</DialogTitle>
            <DialogDescription>
              Cập nhật nội dung cho record của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nội dung</label>
              <Input
                placeholder="Nhập nội dung mới"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleUpdateRecordContent();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhấn Ctrl + Enter để lưu nhanh
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditContentDialog(false);
                  setEditingContent("");
                  setRecordToEdit(null);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpdateRecordContent}
                disabled={!editingContent.trim() || isUpdatingRecordContent}
              >
                {isUpdatingRecordContent ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Feedback Dialog */}
      <Dialog open={!!feedbackRecord} onOpenChange={(open) => !open && setFeedbackRecord(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Phản hồi AI</DialogTitle>
            <DialogDescription>
              {feedbackRecord?.content
                ? `Nội dung: "${feedbackRecord.content}"`
                : "AI Feedback chi tiết cho record này"}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {feedbackRecord?.aiFeedback ? (
              <div
                className="text-sm leading-relaxed text-slate-700 space-y-2"
                dangerouslySetInnerHTML={{
                  __html: formatAiFeedbackHtml(feedbackRecord.aiFeedback),
                }}
              />
            ) : (
              <p className="text-sm text-slate-500">Chưa có phản hồi AI.</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setFeedbackRecord(null)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy Record Charge Modal */}
      <BuyRecordChargeModal
        open={showBuyRecordChargeDialog}
        onClose={() => setShowBuyRecordChargeDialog(false)}
        folderId={selectedFolderId || ""}
      />
    </div>
  );
}
