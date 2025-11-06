import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/AssessmentLearner/placement-test`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
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
        { message: error.message || "Lấy thông tin đánh giá thất bại" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Lấy thông tin đánh giá thất bại" },
      { status: 500 }
    );
  }
}
