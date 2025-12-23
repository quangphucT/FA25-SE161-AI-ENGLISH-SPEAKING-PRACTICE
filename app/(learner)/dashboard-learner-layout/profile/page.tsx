"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Phone } from "lucide-react";

import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { useGetMyProgressAnalytics } from "@/features/learner/hooks/progressAnalyticsHooks/useGetMyProgressAnalytics";
import { useEditLearnerProfile } from "@/features/learner/hooks/learnerProfileHooks/useUpdateLearnerProfile";
import { useUploadAvatar } from "@/features/learner/hooks/uploadAvatarHooks/useUploadAvatar";
import { changePasswordService } from "@/features/shared/services/authService";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function LearnerProfilePage() {
  const { data: userData, isLoading, refetch } = useGetMeQuery();
  const { data: progressData } = useGetMyProgressAnalytics();
const [openChangePassword, setOpenChangePassword] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [isChanging, setIsChanging] = useState(false);

  const updateProfileMutation = useEditLearnerProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const analytics = progressData?.data;

  const [openEdit, setOpenEdit] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  
  const openEditModal = () => {
    setFullName(userData?.fullName || "");
    setPhoneNumber(userData?.phoneNumber || "");
    setOpenEdit(true);
  };

  const handleSubmitEdit = async () => {
    try {
      let avatarUrl = userData?.avatarUrl;

      if (selectedFile) {
        const uploadRes = await uploadAvatarMutation.mutateAsync(selectedFile);
        avatarUrl = uploadRes.url;
      }

      const res = await updateProfileMutation.mutateAsync({
        fullName,
        phoneNumber,
        avatarUrl,
      });

      if (res.isSucess) {
        setOpenEdit(false);
        setSelectedFile(null);
        await refetch();
      }
    } catch (err) {
      console.error("Update profile failed:", err);
    }
  };

const handleChangePassword = async () => {
  // 1. Validate
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp");
    return;
  }

  try {
    setIsChanging(true);

    // 2. Call API
   await changePasswordService({
  currentPassword,
  newPassword,
  confirmPassword,
});


    // 3. Thành công
    alert("Đổi mật khẩu thành công");

    // reset state
    setOpenChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error: any) {
    alert(error.message || "Đổi mật khẩu thất bại");
  } finally {
    setIsChanging(false);
  }
};


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }


  
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
          Hồ sơ cá nhân
        </h1>

        {/* PROFILE */}
        <Card className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 flex flex-col sm:flex-row gap-6">
            <div className="w-28 h-28 rounded-full ring-2 ring-indigo-500 ring-offset-2 overflow-hidden">
              <img
                src={userData?.avatarUrl || "/avatar-default.png"}
                className="w-full h-full object-cover"
              />
            </div>

        <div className="flex-1 flex justify-between">
  <div>
    <h2 className="text-xl font-semibold">{userData?.fullName}</h2>
    <p className="text-sm text-slate-500">{userData?.email}</p>
  </div>

  {/* BUTTON GROUP */}
  <div className="flex flex-col gap-2 items-end">
    <Button
      className="bg-indigo-600 hover:bg-indigo-700 text-white"
      onClick={openEditModal}
    >
      Chỉnh sửa
    </Button>

    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => setOpenChangePassword(true)}
    >
      <Lock className="w-4 h-4" />
      Đổi mật khẩu
    </Button>
  </div>
</div>

         
          </div>
<Dialog open={openChangePassword} onOpenChange={setOpenChangePassword}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Đổi mật khẩu</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <Input
        type="password"
        placeholder="Mật khẩu hiện tại"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => setOpenChangePassword(false)}
        >
          Hủy
        </Button>
        <Button
          disabled={isChanging}
          onClick={handleChangePassword}
        >
          Đổi mật khẩu
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

          <div className="grid grid-cols-1 gap-4 border-t p-6">
  <div className="flex items-center gap-3">
    <Mail className="text-indigo-500 w-5 h-5" />
    <span>{userData?.email}</span>
  </div>

  <div className="flex items-center gap-3">
    <Phone className="text-indigo-500 w-5 h-5" />
    <span>{userData?.phoneNumber || "Chưa cập nhật"}</span>
  </div>
</div>

        </Card>
 {/* HEADER */}
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
          Tiến độ học tập
        </h1>
        {/* STATS – LẤY TỪ PROGRESS ANALYTICS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border rounded-lg">
            <p className="text-sm text-slate-500">Trình độ</p>
          <p className="text-2xl font-semibold text-rose-600 mt-1">
  {userData?.learnerProfile?.level}
</p>
  <p className="text-xs text-slate-400 mt-1">
  Cấp độ hiện tại theo đánh giá của hệ thống
</p>
          </Card>

      <Card className="p-5 bg-white border rounded-lg">
  <p className="text-sm text-slate-500 flex items-center gap-2">
    🎤 Thời gian luyện nói
  </p>

<p className="text-2xl font-semibold text-blue-600 mt-1">
  {analytics?.speakingTime ?? 0} phút
</p>

  <p className="text-xs text-slate-400 mt-1">
    Tổng thời gian bạn đã luyện nói với hệ thống
  </p>
</Card>



       <Card className="p-5 bg-white border rounded-lg">
  <p className="text-sm text-slate-500 flex items-center gap-2">
    📘 Số buổi hoàn thành
  </p>

<p className="text-2xl font-semibold text-emerald-600 mt-1">
  {analytics?.sessionsCompleted ?? 0} buổi
</p>

  <p className="text-xs text-slate-400 mt-1">
    Số lần luyện nói đã hoàn thành
  </p>
</Card>



       <Card className="p-5 bg-white border rounded-lg">
  <p className="text-sm text-slate-500 flex items-center gap-2">
    ⭐ Điểm phát âm trung bình
  </p>
<p className="text-2xl font-semibold text-amber-600 mt-1">
  {analytics?.pronunciationScoreAvg?.toFixed(1) ?? "0.0"}
</p>

  <p className="text-xs text-slate-400 mt-1">
    Trung bình điểm phát âm các bài luyện
  </p>
</Card>

        </div>

        {/* DETAIL */}
        <Card className="bg-white border rounded-lg p-6">
          <div className="flex justify-between py-3 border-b">
            <span>Tham gia từ</span>
            <span>{formatDate(userData?.learnerProfile?.createdAt)}</span>
          </div>
          <div className="flex justify-between py-3">
            <span>Trạng thái</span>
            <span className="text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Đang hoạt động
            </span>
          </div>
        </Card>
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
       <DialogContent className="sm:max-w-md">
  <DialogHeader>
    <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
  </DialogHeader>

  <div className="space-y-4">
    {/* AVATAR */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Ảnh đại diện
      </label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />
    </div>

    {/* HỌ VÀ TÊN */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Họ và tên
      </label>
      <Input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Nhập họ và tên"
      />
    </div>

    {/* SỐ ĐIỆN THOẠI */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Số điện thoại
      </label>
      <Input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Nhập số điện thoại"
      />
    </div>

    {/* ACTIONS */}
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={() => setOpenEdit(false)}>
        Hủy
      </Button>
      <Button
        onClick={handleSubmitEdit}
        disabled={
          updateProfileMutation.isPending ||
          uploadAvatarMutation.isPending
        }
      >
        Lưu
      </Button>
    </div>
  </div>
</DialogContent>

      </Dialog>
    </div>
  );
}
