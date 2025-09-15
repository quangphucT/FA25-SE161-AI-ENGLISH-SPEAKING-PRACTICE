// app/api/auth/login/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.BE_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    
    const data = await response.json();
    const {accessToken, refreshToken} = data.account;

    const res = NextResponse.json(data, { status: 200 });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Login failed";
    const status = error?.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
