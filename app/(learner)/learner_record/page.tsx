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
} from "@/features/learner/hooks/useLearnerRecord";
import { RecordCategory, Record } from "@/features/learner/services/learnerRecordService";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function LearnerRecordPage() {
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showCreateRecordDialog, setShowCreateRecordDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [folderToRename, setFolderToRename] = useState<RecordCategory | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newRecordContent, setNewRecordContent] = useState("");
  const [renamingFolderName, setRenamingFolderName] = useState("");
  const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);
  const [isRecordsCollapsed, setIsRecordsCollapsed] = useState(false);

  // Queries
  const { data: foldersData, isLoading: isLoadingFolders } = useLearnerRecordFolders();
  const { data: recordsData, isLoading: isLoadingRecords } = useLearnerRecords(selectedFolderId);

  // Mutations
  const { mutateAsync: createFolder, isPending: isCreatingFolder } = useLearnerRecordFolderCreate();
  const { mutateAsync: deleteFolder, isPending: isDeletingFolder } = useLearnerRecordFolderDelete();
  const { mutateAsync: renameFolder, isPending: isRenamingFolder } = useLearnerRecordFolderRename();
  const { mutateAsync: createRecord, isPending: isCreatingRecord } = useLearnerRecordCreate();
  const { mutateAsync: deleteRecord, isPending: isDeletingRecord } = useLearnerRecordDelete();

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      // Error handled by hook (toast notification)
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await deleteRecord(recordId);
    } catch (error) {
      // Error handled by hook
    }
  };

  const openRenameDialog = (folder: RecordCategory) => {
    setFolderToRename(folder);
    setRenamingFolderName(folder.name);
    setShowRenameDialog(true);
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return typeof dateString === 'string' ? dateString : dateString.toString();
    }
  };

  return (
    <div className="p-6 space-y-6 h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Record</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý các thư mục và record của bạn</p>
        </div>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Sidebar - Folders List */}
        <Card className={`lg:col-span-1 transition-all duration-300 flex flex-col ${isFoldersCollapsed ? 'lg:col-span-0 overflow-hidden' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Thư mục
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFoldersCollapsed(!isFoldersCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isFoldersCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
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
              folders.map((folder) => (
                <div
                  key={folder.learnerRecordId}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedFolderId === folder.learnerRecordId
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => setSelectedFolderId(folder.learnerRecordId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Folder className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium truncate">{folder.name}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {folder.status && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {folder.status}
                    </Badge>
                  )}
                </div>
              ))
            )}
              </CardContent>
            </>
          )}
        </Card>

        {/* Main Content - Records List */}
        <Card className={`lg:col-span-2 transition-all duration-300 flex flex-col ${isRecordsCollapsed ? 'lg:col-span-0 overflow-hidden' : ''}`}>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRecordsCollapsed(!isRecordsCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  {isRecordsCollapsed ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
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
                       router.push(
                         `/learner_record/${selectedFolderId}`
                       );
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
                {selectedRecords.map((record: Record) => (
                  <Card key={record.recordId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{record.content}</h3>
                            <Badge
                              variant={
                                record.status === "Completed"
                                  ? "default"
                                  : record.status === "Pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {record.status}
                            </Badge>
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
                              <span className="font-semibold">{record.score || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-600">Trạng thái:</span>
                              <span className="font-semibold">{record.status || 0}</span>
                            </div>
                          </div>

                          {record.aiFeedback && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-1">Phản hồi AI:</p>
                              <p className="text-sm">{record.aiFeedback}</p>
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Tạo lúc: {formatDate(record.createdAt)}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteRecord(record.recordId)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
    </div>
  );
}
