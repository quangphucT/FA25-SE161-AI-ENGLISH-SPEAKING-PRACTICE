

import { CustomError } from "@/types/auth";
import {  NextRequest, NextResponse } from "next/server";

export async function  GET(request: NextRequest) {
   
    const accessToken = request.cookies.get('accessToken')?.value;


  try {
    const response = await fetch(`${process.env.BE_API_URL}/AdminServicePackage/active`, {
      method: "GET",
       headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    }); 
    
    const data = await response.json();
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
