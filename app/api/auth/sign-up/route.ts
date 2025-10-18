

import { CustomError } from "@/types/auth";
import { NextResponse } from "next/server";







// register handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${process.env.BE_API_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }); 
    let data: any = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }
    // Trả về status code đúng từ BE thay vì luôn 200
    if (!response.ok) {
      const message = (data && (data.message || data.error || data.title)) || "Register failed";
      return NextResponse.json(data ?? { message }, { status: response.status });
    }
    // Success, chuyển nguyên status từ BE (200/201)
    return NextResponse.json(data ?? { success: true }, { status: response.status });
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Register failed";
    const status = e.response?.status || 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
