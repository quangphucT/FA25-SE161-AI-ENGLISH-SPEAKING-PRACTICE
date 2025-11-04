import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const id = params.id;

  try {
    // Lấy status từ query param
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const status = statusParam === "true"; // chuyển thành boolean

    // Tạo payload gửi lên backend
    const payload = { status };

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerQuestionAssessment/set-status/${id}?status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: unknown) {
    console.error("Update question failed:", error);
    return NextResponse.json(
      { message: "Update question failed" },
      { status: 500 }
    );
  }
}
