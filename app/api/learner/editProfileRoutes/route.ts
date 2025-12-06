import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    // ✅ Lấy body từ FE gửi lên
    const body = await request.json();

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/LearnerProfile/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    // ✅ Nếu BE trả lỗi → giữ nguyên status
    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    // ✅ Thành công
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Edit profile failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Edit profile failed" },
      { status: 500 }
    );
  }
}
