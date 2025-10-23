// pages/api/auth/google.ts

import { CustomError } from "@/types/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate idToken
    if (!body.idToken) {
      return NextResponse.json(
        { message: "idToken is required" },
        { status: 400 }
      );
    }

    // call API thật bên BE
    const response = await fetch(
      `${process.env.BE_API_URL}/Auth/google-login-reviewer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json"
         },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    const { accessToken, refreshToken } = data;

    const res = NextResponse.json(data, { status: 200 });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60, // 1 minute
    });
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 120, // 2 minutes
    });
    return res;
  } catch (error) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Login failed";
    const status = e.response?.status || 500;
    console.log("API Error:", error);
    return NextResponse.json({ message }, { status });
  }
}
