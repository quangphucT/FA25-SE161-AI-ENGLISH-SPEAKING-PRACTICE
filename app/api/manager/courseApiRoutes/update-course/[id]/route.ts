import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const courseId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;
  
  if (!courseId || courseId === "[id]") {
    return NextResponse.json(
      { message: "courseId is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title, numberOfChapter, orderIndex, level, price } = body;

    if (!title) {
      return NextResponse.json(
        { message: "title is required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerCourse/courses/${courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          numberOfChapter: numberOfChapter || 0,
          orderIndex: orderIndex || 0,
          level: level || 0,
          price: price || 0,
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
        { message: error.message || "Update course failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Update course failed" },
      { status: 500 }
    );
  }
}
