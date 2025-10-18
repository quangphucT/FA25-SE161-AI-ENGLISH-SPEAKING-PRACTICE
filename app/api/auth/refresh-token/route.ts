import {  NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CustomError } from "@/types/auth";



export async function POST() {
  try {
    // Lấy refreshToken từ cookies
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Call API backend để refresh token
    const response = await fetch(
      `${process.env.BE_API_URL}/Auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const data = await response.json();

    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
      // Nếu refresh token hết hạn hoặc không hợp lệ, xóa cookies và redirect
      if (response.status === 401) {
        const res = NextResponse.json(
          { 
            errorCode: "TOKEN_EXPIRED", 
            message: "Refresh token expired", 
            status: 401,
            redirectToLogin: true
          }, 
          { status: 401 }
        );
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }
      return NextResponse.json(data, { status: response.status });
    }

    const { accessToken } = data;

    const res = NextResponse.json(data, { status: 200 });

    // Set lại cookies với token mới
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60, // 1 minute
    });

    return res;
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Refresh token failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}