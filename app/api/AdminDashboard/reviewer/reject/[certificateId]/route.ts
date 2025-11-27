import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { certificateId } = await params;

  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/AdminReviewer/reject/${certificateId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    // Check if response has content before parsing JSON
    const contentType = backendResponse.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      const text = await backendResponse.text();
      data = text ? JSON.parse(text) : {};
    } else {
      const text = await backendResponse.text();
      data = { message: text || "Reject reviewer failed" };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data.message || "Reject reviewer failed", ...data },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Reject reviewer failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Reject reviewer failed" },
      { status: 500 }
    );
  }
}
