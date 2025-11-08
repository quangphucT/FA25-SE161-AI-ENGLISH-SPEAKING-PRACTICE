import { NextRequest, NextResponse } from "next/server";

// Adapted to Next.js validator which expects params as a Promise in context
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { id } = await context.params;

  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/Coin/status/${id}`, //
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
        { message: error.message || "Lấy trạng thái đơn hàng thất bại" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Lấy trạng thái đơn hàng thất bại" },
      { status: 500 }
    );
  }
}
