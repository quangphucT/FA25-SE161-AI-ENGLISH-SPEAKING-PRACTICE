// app/api/auth/login/route.ts

import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${process.env.BE_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }); 
    const data = await response.json();
    // Có thể gắn cookie JWT tại đây (nếu backend trả về token)
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Register failed";
    const status = error?.response?.status || 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
