import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerCourse/courses`,
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
        { message: error.message || "Create course failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Create course failed" },
      { status: 500 }
    );
  }
}
