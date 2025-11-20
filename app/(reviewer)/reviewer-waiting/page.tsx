"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { handleLogout } from "@/utils/auth";
import { Loader2, Clock, ShieldAlert, RefreshCw } from "lucide-react";

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
//  useEffect(() => {
  //   if (isApproved) {
  //     router.replace("/dashboard-reviewer-layout");
  //   }
  // }, [isApproved, router]);

  if (isLoading && !meData) {
    return (
      <div className="min-h-screen bg-[#18232a] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18232a] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#1d2a33] border border-[#2ed7ff]/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="flex items-center justify-center">
          {normalizedStatus === "rejected" ? (
            <ShieldAlert className="h-14 w-14 text-red-400" />
          ) : (
            <Clock className="h-14 w-14 text-[#2ed7ff]" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-[#2ed7ff]">
            Trạng thái hồ sơ:{" "}
            <span className="font-semibold text-white">{statusRaw || "Chưa xác định"}</span>
          </p>
          <h1 className="text-2xl font-bold text-white">{statusInfo.title}</h1>
          <p className="text-gray-300">{statusInfo.message}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Button
            onClick={() => router.push("/entrance_information")}
            className="bg-[#2ed7ff] text-[#18232a] font-semibold"
          >
            Cập nhật hồ sơ
          </Button>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-[#2ed7ff]/40 text-white hover:bg-[#22313c]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isFetching ? "Đang kiểm tra..." : "Kiểm tra lại"}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white"
          onClick={() => handleLogout()}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default ReviewerWaitingPage;

