import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get("pageNumber") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "10";
  const type = searchParams.get("type");
  const keyword = searchParams.get("keyword");

  const accessToken = request.cookies.get("accessToken")?.value;
  try {
    // ✅ Nối query string đúng chuẩn
    const query = new URLSearchParams({
      pageNumber,
      pageSize,
      ...(type ? { type } : {}),
      ...(keyword ? { keyword } : {}),
    }).toString();

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerQuestionAssessment/questions?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
        { message: error.message || "Create question test failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Create question test failed" },
      { status: 500 }
    );
  }
}
