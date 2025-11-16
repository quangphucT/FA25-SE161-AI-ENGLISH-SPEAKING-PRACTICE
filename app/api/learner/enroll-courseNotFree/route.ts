import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  try {
    const body = await request.json();
    const { learnerCourseId, courseId } = body;

    if (!learnerCourseId || !courseId) {
      return NextResponse.json(
        { message: "LearnerCourseId and courseId are required" },
        { status: 400 }
      );
    }
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/LearningPathCourse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
         learnerCourseId: body.learnerCourseId,
         courseId: body.courseId,
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
        { message: error.message || "Enroll course not free failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Enroll course not free failed" },
      { status: 500 }
    );
  }
}
