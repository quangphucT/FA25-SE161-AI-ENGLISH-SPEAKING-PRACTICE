"use client";
import { useEffect, useRef } from "react";
import { handleLogout } from "@/utils/auth";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function TokenRefresher() {
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pathname = usePathname(); // lấy pathname chính xác ngay khi render
	
	useEffect(() => {
		const AUTH_PUBLIC_PATHS = [
			"/sign-in",
			"/sign-up",
			"/forgot-password",
			"/reset-password",
			"/auth/choosingRole-after-googleLogin",
			"/landing",
			"/pricing",
		];

		const isAuthPublic = AUTH_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
		if (isAuthPublic) {
			// Clear interval if exists when on auth pages
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		let stopped = false;

		const stop = () => {
			stopped = true;
			if (intervalRef.current) clearInterval(intervalRef.current);
			intervalRef.current = null;
		};

		const runOnce = async () => {
			if (stopped) return;
			try {
				const res = await fetch("/api/auth/refresh-token", {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
				});

				if (!res.ok) {
					 await handleLogout();
					stop();
					return;
				}

				// Kiểm tra nếu reviewer bị banned thì đá ra trang sign-in
				const data = await res.json();
				if (data.accessToken) {
					try {
						const base64 = data.accessToken.split(".")[1];
						const decodedPayload = JSON.parse(
							Buffer.from(base64, "base64").toString()
						);
						const role =
							decodedPayload[
								"http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
							];
						const isReviewerActive = decodedPayload["IsReviewerActive"];
						const reviewerStatus = decodedPayload["ReviewerStatus"];

						// Nếu là REVIEWER và bị banned → đá ra trang sign-in
						if (
							role === "REVIEWER" &&
							isReviewerActive === false &&
							reviewerStatus === "Banned"
						) {
							toast.error(
								"Tài khoản của bạn đã bị cấm. Vui lòng liên hệ quản trị viên."
							);
							await handleLogout();
							stop();
							return;
						}
					} catch {
						// Lỗi decode token: bỏ qua, để middleware xử lý
					}
				}
			
			} catch {
				// Lỗi mạng: giữ nguyên interval; sẽ thử lại ở tick kế tiếp
			}
			 // ✅ expose global để trang khác gọi ngay lập tức
    (window as any).forceRefreshToken = runOnce;
		};

		// Clear any existing interval before starting new one
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// Chạy ngay khi mount
		void runOnce();
		// Lặp đều mỗi 45 giây (có thể bị throttle khi tab background)
		intervalRef.current = setInterval(() => {
			void runOnce();
		}, 45 * 1000);

		// Gọi ngay khi người dùng quay lại/tab focus
		const onVisible = () => {
			if (document.visibilityState === "visible") {
				void runOnce();
			}
		};
		const onFocus = () => void runOnce();
		document.addEventListener("visibilitychange", onVisible);
		window.addEventListener("focus", onFocus);

		return () => {
			stop();
			document.removeEventListener("visibilitychange", onVisible);
			window.removeEventListener("focus", onFocus);
		};
	}, [pathname]);

	return null;
}

