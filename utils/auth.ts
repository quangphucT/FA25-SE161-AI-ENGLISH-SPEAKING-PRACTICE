import { toast } from "sonner";
import { useLearnerStore } from "@/store/useLearnerStore";

export const handleTokenExpiration = (message?: string) => {
  if (typeof window !== "undefined") {
    toast.error(
      message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
    );

    // // Redirect to login
    window.location.href = "/sign-in";
  }
};

export const handleLogout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    // Clear dữ liệu learner ở localStorage
    useLearnerStore.getState().clearLearnerData();
    
    // Clear các dữ liệu khác nếu có
    if (typeof window !== "undefined") {
      localStorage.removeItem("messages"); // Clear tin nhắn AI conversation
      localStorage.removeItem("enrollingFirst_courseStorage"); // Clear Zustand persist storage
      localStorage.removeItem("entrance_test_progress"); 
    }
    
    handleTokenExpiration("Đăng xuất thành công.");
  }
};

export const isClientSide = () => typeof window !== "undefined";
