import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const exerciseId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!exerciseId || exerciseId === "[id]") {
    return NextResponse.json(
      { message: "exerciseId is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title,description, orderIndex, numberOfQuestion } = body;

    if (!title) {
      return NextResponse.json(
        { message: "title is required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/Exercise/exercises/${exerciseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          orderIndex: orderIndex || 0,
          numberOfQuestion: numberOfQuestion || 0,
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
        { message: error.message || "Update exercise failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Update exercise failed" },
      { status: 500 }
    );
  }
}
