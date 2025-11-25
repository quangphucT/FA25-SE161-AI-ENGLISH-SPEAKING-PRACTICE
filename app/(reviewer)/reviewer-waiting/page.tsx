"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { handleLogout } from "@/utils/auth";
import { Loader2, Clock, ShieldAlert, RefreshCw, Plus, LogOut } from "lucide-react";

const statusDescriptions: Record<string, { title: string; message: string }> = {
  pending: {
    title: "Hồ sơ đang được xem xét",
    message:
      "Cảm ơn bạn đã gửi thông tin. Quá trình duyệt có thể mất tới 24-48 giờ làm việc. Chúng tôi sẽ thông báo qua email ngay khi hoàn tất.",
  },
  rejected: {
    title: "Hồ sơ chưa được chấp thuận",
    message:
      "Vui lòng kiểm tra lại thông tin và bổ sung chứng chỉ hoặc liên hệ hỗ trợ để biết thêm chi tiết.",
  },
  default: {
    title: "Đang xác nhận trạng thái hồ sơ",
    message:
      "Chúng tôi đang kiểm tra trạng thái tài khoản của bạn. Nhấn nút làm mới nếu bạn vừa cập nhật thông tin.",
  },
};

const ReviewerWaitingPage = () => {
  const router = useRouter();
  const { data: meData, isLoading, isFetching, refetch } = useGetMeQuery();
  
  const statusRaw = meData?.reviewerProfile?.status || "";
  const normalizedStatus = statusRaw.trim().toLowerCase();

  const statusInfo =
    statusDescriptions[normalizedStatus as keyof typeof statusDescriptions] ||
    statusDescriptions.default;

  useEffect(() => {
    // Only redirect if data is loaded and status is active/approved
    if (!isLoading && meData?.reviewerProfile?.status) {
      const status = meData.reviewerProfile.status.trim().toLowerCase();
      if (status === "approved" || status === "active" || status === "actived") {
        router.replace("/dashboard-reviewer-layout");
      }
    }
  }, [meData, isLoading, router]);

  if (isLoading && !meData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1a1f] via-[#18232a] to-[#0f1a1f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#2ed7ff]" />
          <p className="text-gray-300 text-sm">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1a1f] via-[#18232a] to-[#0f1a1f] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-[#1d2a33] border-2 border-[#2ed7ff]/30 rounded-3xl p-8 md:p-10 text-center space-y-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2ed7ff] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Icon Section */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {normalizedStatus === "rejected" ? (
                <div className="w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-400/30 flex items-center justify-center">
                  <ShieldAlert className="h-12 w-12 text-red-400" strokeWidth={1.5} />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#2ed7ff]/10 border-4 border-[#2ed7ff]/40 flex items-center justify-center animate-pulse">
                  <Clock className="h-12 w-12 text-[#2ed7ff]" strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>

          {/* Status and Title Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-wider text-[#2ed7ff] font-semibold">
                TRẠNG THÁI HỒ SƠ:{" "}
                <span className="text-white font-bold">{statusRaw.toUpperCase() || "CHƯA XÁC ĐỊNH"}</span>
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {statusInfo.title}
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              {statusInfo.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="w-full h-14 bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 backdrop-blur-sm"
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Kiểm tra lại
                </>
              )}
            </Button>
            <Button
              onClick={() => router.push("/entrance_information")}
              className="w-full h-14 bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Chứng chỉ
            </Button>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
              onClick={() => handleLogout()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerWaitingPage;

