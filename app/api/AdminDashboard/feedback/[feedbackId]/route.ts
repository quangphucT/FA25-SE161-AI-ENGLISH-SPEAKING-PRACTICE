import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ feedbackId: string }> }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { feedbackId } = await params;

  try {
    // Build URL with path parameter and query parameters
    const backendUrl = new URL(
      `${process.env.BE_API_URL}/AdminFeedback/${feedbackId}/detail`
    );

    const backendResponse = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch feedback detail" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch feedback detail" },
      { status: 500 }
    );
  }
}

