import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const id = parts[parts.length - 1];
  if (!id) {
    return NextResponse.json(
      { isSucess: false, data: null, businessCode: 2009, message: "Không tìm thấy gói dịch vụ." },
      { status: 400 }
    );
  }
  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/AdminServicePackage/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
        { message: error.message || "Delete failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Delete  failed" },
      { status: 500 }
    );
  }
}
