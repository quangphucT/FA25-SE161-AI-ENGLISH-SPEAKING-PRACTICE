// app/api/auth/verify-otp/route.ts

import { CustomError } from "@/types/auth";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    // Call backend API to resend OTP
    const response = await fetch(`${process.env.BE_API_URL}/Auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
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
    const message = e.response?.data?.message || e.message || "Resend OTP failed";
    const status = e.response?.status || 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}