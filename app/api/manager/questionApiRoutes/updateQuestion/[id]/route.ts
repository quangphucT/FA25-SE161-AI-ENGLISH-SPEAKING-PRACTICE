import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const questionId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!questionId || questionId === "[id]") {
    return NextResponse.json(
      { message: "questionId is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { text,type, orderIndex, phonemeJson } = body;

    if (!text) {
      return NextResponse.json(
        { message: "text is required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerQuestion/questions/${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text,
          type,
          orderIndex: orderIndex || 0,
          phonemeJson,
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
        { message: error.message || "Update question failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Update question failed" },
      { status: 500 }
    );
  }
}
