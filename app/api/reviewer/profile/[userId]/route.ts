import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { userId } = await params;

  try {
    const body = await request.json();
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ReviewerProfile/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Update profile failed" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { userId } = await params;

  try {
    // Build URL with path parameter and query parameters
    const backendUrl = new URL(
      `${process.env.BE_API_URL}/ReviewerProfile/${userId}`
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
        { message: error.message || "Failed to fetch reviewer profile" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch reviewer profile" },
      { status: 500 }
    );
  }
}

