

import { CustomError } from "@/types/auth";
import { NextResponse } from "next/server";







// register handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${process.env.BE_API_URL}/Auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
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
    const message = e.response?.data?.message || e.message || "Forgot password failed";
    const status = e.response?.status || 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
