import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const learningPathCourseId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;
  
  if (!learningPathCourseId || learningPathCourseId === "[id]") {
    return NextResponse.json(
      { message: "LearningPathCourseId is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { learnerCourseId } = body;

    if (!learnerCourseId) {
      return NextResponse.json(
        { message: "learnerCourseId is required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/LearningPathChapter/by-course/${learningPathCourseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          learnerCourseId,
        }),
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
        { message: error.message || "Create learning path chapter failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Create learning path chapter failed" },
      { status: 500 }
    );
  }
}
