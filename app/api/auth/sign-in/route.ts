

import { CustomError } from "@/types/auth";
import { NextResponse } from "next/server";


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
    const {accessToken, refreshToken} = data;

    const res = NextResponse.json(data, { status: response.status });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
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
