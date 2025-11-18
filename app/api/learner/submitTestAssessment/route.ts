import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/AssessmentLearner/placement-test/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(await request.json()),
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
        { message: error.message || "Submit test assessment failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Submit test assessment failed" },
      { status: 500 }
    );
  }
}
