import {  NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CustomError } from "@/types/auth";



export async function POST() {
  try {
    // Lấy refreshToken từ cookies của request gốc
    const cookieStore = await cookies();

const refreshToken = cookieStore.get("refreshToken")?.value;
const decodedToken = refreshToken ? decodeURIComponent(refreshToken) : undefined;

 
    // Server-side fetch sẽ KHÔNG tự đính kèm cookie của client.
    // Cần forward thủ công cookie refreshToken sang BE qua header Cookie.
    const response = await fetch(`${process.env.BE_API_URL}/Auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken: decodedToken }),
    });

    const data = await response.json();

    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
     
      return NextResponse.json(data, { status: response.status });
    }
    const { accessToken } = data;

    const res = NextResponse.json(data, { status: 200 });


    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
       secure: true,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Refresh token failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}