

import { NextResponse } from "next/server";

interface CustomError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.BE_API_URL}/Auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    
    const data = await response.json();
    console.log("Data:", data)
    const {accessToken, refreshToken} = data;

    const res = NextResponse.json(data, { status: response.status });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 , // 1 minutes
    });
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 120, // 2 minutes
    });
    return res;
  } catch (error: unknown) {
     const e = error as CustomError;
    const message =
      e.response?.data?.message || e.message || "Login failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
