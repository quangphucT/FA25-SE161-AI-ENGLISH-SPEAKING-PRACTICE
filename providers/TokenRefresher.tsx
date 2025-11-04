"use client";
import { useEffect, useRef } from "react";
import { handleLogout } from "@/utils/auth";
import { usePathname } from "next/navigation";
export default function TokenRefresher() {
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startedRef = useRef(false);
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
			return; // Bỏ qua ở các trang public/auth
		}

		if (startedRef.current) {
			return; // Tránh khởi động nhiều lần trong Strict Mode dev
		}
		startedRef.current = true;

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
			
			} catch {
				// Lỗi mạng: giữ nguyên interval; sẽ thử lại ở tick kế tiếp
			}
			 // ✅ expose global để trang khác gọi ngay lập tức
    (window as any).forceRefreshToken = runOnce;
		};

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

