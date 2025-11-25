import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ purchaseId: string }> }) {
    const { purchaseId } = await params;
    const accessToken = request.cookies.get("accessToken")?.value;
    try {
    const backendUrl = new URL(
        `${process.env.BE_API_URL}/AdminPurchase/detail/${purchaseId}`
    );
    const backendResponse = await fetch(backendUrl.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    const data = await backendResponse.json();
    if (!backendResponse.ok) {
        return NextResponse.json({ message: data.message || "Failed to fetch purchase details" }, { status: backendResponse.status });
    }
    return NextResponse.json({ message: "Purchase details fetched successfully", data: data }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch purchase details" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch purchase details" },
      { status: 500 }
    );
  }
}