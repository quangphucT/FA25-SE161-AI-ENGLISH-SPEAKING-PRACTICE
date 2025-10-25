// app/api/auth/reset-password/route.ts

import { NextResponse } from "next/server";
import { CustomError } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token') || '';
    const body = await request.json();
    const { newPassword, confirmPassword } = body ?? {};
    const payload = { newPassword, confirmPassword };

    if (!token) {
      return NextResponse.json(
        { message: "Thiếu token đặt lại mật khẩu" },
        { status: 400 }
      );
    }

    if (!newPassword || !confirmPassword ) {
      return NextResponse.json(
        { message: "Mật khẩu mới, xác nhận mật khẩu và mật khẩu hiện tại là bắt buộc" },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.BE_API_URL}/Auth/reset-password-by-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

     const data = await response.json();
    
    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    // Trả về thành công
    return NextResponse.json(data, { status: 200 });

  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Reset password failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
