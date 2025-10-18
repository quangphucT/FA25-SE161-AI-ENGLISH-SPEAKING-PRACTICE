// app/api/auth/logout/route.ts

import { CustomError } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
  try {
    // Lấy tokens từ cookies của request từ frontend
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Gửi logout request tới backend và chỉ forward refreshToken cookie (BE đọc @CookieValue("refreshToken"))
    const response = await fetch(`${process.env.BE_API_URL}/Auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optional: gửi access token nếu BE có kiểm tra thêm (không bắt buộc cho logout theo BE hiện tại)
        ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
        // Chỉ forward refreshToken theo đúng tên cookie mà BE đang đọc
        ...(refreshToken ? { "Cookie": `refreshToken=${refreshToken}` } : {}),
      },
      // Tránh cache ở lớp fetch khi chạy trên server
      cache: 'no-store',
    }); 
    
    const data = await response.json();
    
    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    // Tạo response thành công và clear cookies
    const successResponse = NextResponse.json(
      { message: data.message || "Logout successful" }, 
      { status: 200 }
    );
    
    // Clear authentication cookies
    successResponse.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expires immediately
      expires: new Date(0),
    });
    
    successResponse.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expires immediately
      expires: new Date(0),
    });
    
    return successResponse;
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Logout failed";
    const status = e.response?.status || 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
