import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const courseId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;
  
  if (!courseId || courseId === "[id]") {
    return NextResponse.json(
      { message: "courseId is required" },
      { status: 400 }
    );
  }

  try {
    
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerChapter/chapters/course/${courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Get chapters failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Get chapters failed" },
      { status: 500 }
    );
  }
}
