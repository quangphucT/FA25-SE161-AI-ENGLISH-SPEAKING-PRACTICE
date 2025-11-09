import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
    
    // Body should be an array of questions
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Request body must be an array of questions" },
        { status: 400 }
      );
    }

    // Validate each question has required text field
    for (const question of body) {
      if (!question.text) {
        return NextResponse.json(
          { message: "Each question must have a text field" },
          { status: 400 }
        );
      }
    }

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerQuestion/questions/${exerciseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
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
        { message: error.message || "Create question failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Create question failed" },
      { status: 500 }
    );
  }
}
