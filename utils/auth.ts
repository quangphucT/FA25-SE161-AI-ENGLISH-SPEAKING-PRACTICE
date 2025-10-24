import { toast } from "sonner";

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
    handleTokenExpiration("Đăng xuất thành công.");
  }
};

export const isClientSide = () => typeof window !== "undefined";
