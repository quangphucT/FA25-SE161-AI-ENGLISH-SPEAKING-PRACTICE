// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import axiosClient from "@/lib/axiosClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axiosClient.post(`${process.env.BE_API_URL}/auth/register`, body);
    // Có thể gắn cookie JWT tại đây (nếu backend trả về token)
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Register failed";
    const status = error?.response?.status || 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
