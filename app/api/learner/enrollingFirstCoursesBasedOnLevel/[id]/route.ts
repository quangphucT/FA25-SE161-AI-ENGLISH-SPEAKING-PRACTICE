import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const courseId = params.id;
  const accessToken = request.cookies.get("accessToken")?.value;
  
  if (!courseId ) {
    return NextResponse.json(
      { message: "courseId is required" },
      { status: 400 }
    );
  }
  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/CourseLearner/${courseId}/enroll`,
      {
        method: "POST",
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
        { message: error.message || "Enroll first course failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Enroll first course failed" },
      { status: 500 }
    );
  }
}
