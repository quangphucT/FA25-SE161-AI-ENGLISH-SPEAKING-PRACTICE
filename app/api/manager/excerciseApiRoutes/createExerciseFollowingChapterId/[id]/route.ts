import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const chapterId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;
  
  if (!chapterId || chapterId === "[id]") {
    return NextResponse.json(
      { message: "chapterId is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title, description, orderIndex, numberOfQuestion } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "title and description are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/Exercise/exercises/${chapterId}`,
      {
        method: "POST",
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
        { message: error.message || "Create exercise failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Create exercise failed" },
      { status: 500 }
    );
  }
}
