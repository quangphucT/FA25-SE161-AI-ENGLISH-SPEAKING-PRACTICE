// app/api/auth/reset-password/route.ts

import { NextResponse } from "next/server";
import { CustomError } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword, confirmPassword } = body ?? {};

    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "Token, mật khẩu mới và xác nhận mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.BE_API_URL}/Auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(data || { message: "Reset password failed" }, { status: response.status });
    }

    return NextResponse.json(data || { message: "Reset password successful" }, { status: response.status });
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Reset password failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
