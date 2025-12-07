import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    // ✅ Lấy form-data từ FE
    const formData = await request.formData();

    // ✅ Gửi y chang sang BE upload image
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/Avatar/avatar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ nếu BE cần auth
        },
        body: formData, // ✅ GIỮ NGUYÊN FORM DATA
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
        { message: error.message || "Upload avatar failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Upload avatar failed" },
      { status: 500 }
    );
  }
}
