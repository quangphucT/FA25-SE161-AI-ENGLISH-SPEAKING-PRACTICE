"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { useEditLearnerProfile } from "@/features/learner/hooks/learnerProfileHooks/useUpdateLearnerProfile";
import { useUploadAvatar } from "@/features/learner/hooks/uploadAvatarHooks/useUploadAvatar";

import { Mail, Phone, Award, TrendingUp, Clock, Calendar } from "lucide-react";

export default function LearnerProfilePage() {
  const { data: userData, isLoading, refetch } = useGetMeQuery();
  const updateProfileMutation = useEditLearnerProfile();

  const [openEdit, setOpenEdit] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const uploadAvatarMutation = useUploadAvatar();


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
    let avatarUrl = userData?.avatarUrl; // mặc định giữ ảnh cũ

    // ✅ NẾU CÓ CHỌN ẢNH → UPLOAD TRƯỚC
    if (selectedFile) {
      const uploadRes = await uploadAvatarMutation.mutateAsync(selectedFile);
      avatarUrl = uploadRes.url; // ✅ LINK CLOUDINARY
    }

    // ✅ SAU ĐÓ MỚI UPDATE PROFILE
    const res = await updateProfileMutation.mutateAsync({
      fullName,
      phoneNumber,
      avatarUrl, // ✅ GỬI LINK ẢNH LÊN BE
    });

    if (res.isSucess) {
      setOpenEdit(false);
      setSelectedFile(null);
      await refetch(); // ✅ load lại avatar mới
    }
  } catch (err) {
    console.error("Update profile failed:", err);
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4">
        <div className="w-full px-6">

        {/* HEADER */}
       <div className="mb-12 flex flex-col gap-2">
  <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
    Hồ sơ cá nhân
  </h1>
  <p className="text-gray-500 max-w-3xl text-base">
    Quản lý thông tin cá nhân, theo dõi quá trình học tập và trạng thái tài khoản của bạn.
  </p>
</div>


        {/* MAIN PROFILE CARD */}
<Card className="mb-10 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border-0 rounded-[28px] bg-white/90 backdrop-blur-xl">
          <div className="h-44 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="relative px-6 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-20">
              <div className="relative">
                  <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                  <img
                    src={userData?.avatarUrl || "/avatar-default.png"}
                    alt={userData?.fullName || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* NAME + EDIT BUTTON */}
              <div className="flex-1 sm:mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    {userData?.fullName}
                  </h2>
                 
                </div>

              <Button
  onClick={openEditModal}
  disabled={updateProfileMutation.isPending}
  className="rounded-full px-6 shadow-md hover:shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
>
  Chỉnh sửa
</Button>

              </div>
            </div>

            {/* CONTACT */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-medium">{userData?.phoneNumber || "Chưa cập nhật"}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 rounded-[22px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-sm">Trình độ</p>
            <p className="text-3xl font-bold">{userData?.learnerProfile?.level}</p>
          </Card>

            <Card className="p-6 rounded-[22px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <Award className="w-8 h-8 mb-2" />
            <p className="text-sm">Điểm phát âm</p>
            <p className="text-3xl font-bold">
              {userData?.learnerProfile?.pronunciationScore?.toFixed(1) ?? "0.0"}/100
            </p>
          </Card>

          <Card className="p-6 rounded-[22px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-sm">Học hôm nay</p>
            <p className="text-3xl font-bold">
              {userData?.learnerProfile?.dailyMinutes ?? 0} phút
            </p>
          </Card>

          <Card className="p-6 rounded-[22px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-teal-500 to-green-600 text-white">
            <Calendar className="w-8 h-8 mb-2" />
            <p className="text-sm">Tham gia từ</p>
            <p className="text-xl font-bold">{formatDate(userData?.learnerProfile?.createdAt)}</p>
          </Card>



         
        </div>
        {/* ADDITIONAL INFO - FULL WIDTH NHƯ FORMAT CŨ */}
<Card className="p-8 border-0 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] rounded-[22px] mt-10 bg-white/95 backdrop-blur">
  <h3 className="text-lg font-bold text-gray-900 mb-4">
    Thông tin chi tiết
  </h3>

  <div className="space-y-3">
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <span className="text-gray-600 font-medium">
        Cập nhật lần cuối
      </span>
      <span className="text-gray-900 font-semibold">
        {formatDate(userData?.learnerProfile?.updatedAt)}
      </span>
    </div>

    <div className="flex justify-between items-center py-3">
      <span className="text-gray-600 font-medium">
        Trạng thái tài khoản
      </span>
     <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm shadow-md">
  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
  Học viên đang hoạt động
</span>

    </div>
  </div>
</Card>

      </div>

      {/* ✅ POPUP EDIT PROFILE NHÚNG TRỰC TIẾP */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
          <Input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }}
/>
{selectedFile && (
  <img
    src={URL.createObjectURL(selectedFile)}
    alt="preview"
  className="w-24 h-24 object-cover rounded-full border mx-auto shadow"
  />
)}



            <Input
              placeholder="Họ tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpenEdit(false)}>
                Hủy
              </Button>
              <Button
  onClick={handleSubmitEdit}
  disabled={
    updateProfileMutation.isPending || uploadAvatarMutation.isPending
  }
>
  {(updateProfileMutation.isPending || uploadAvatarMutation.isPending)
    ? "Đang xử lý..."
    : "Lưu"}
</Button>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
