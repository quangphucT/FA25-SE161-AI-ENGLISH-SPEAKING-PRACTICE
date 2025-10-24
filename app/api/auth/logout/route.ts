// app/api/auth/logout/route.ts

import { CustomError } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const encodedToken = request.cookies.get("refreshToken")?.value;
    const refreshToken = encodedToken ? decodeURIComponent(encodedToken) : "";

    // Gửi logout request tới backend và forward cookies
    const response = await fetch(`${process.env.BE_API_URL}/Auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookie refreshToken
        Cookie: `refreshToken=${refreshToken || ""}`,
      },
    });
    const data = await response.json();

    const nextRes = NextResponse.json(
      { message: data.message || "Logout response" },
      { status: response.status }
    );

    // Clear authentication cookies
    nextRes.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expires immediately
      expires: new Date(0),
    });

    nextRes.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expires immediately
      expires: new Date(0),
    });
    return nextRes;
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Register failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
