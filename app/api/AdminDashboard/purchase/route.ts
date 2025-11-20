import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  const keyword = searchParams.get("keyword");
  const type = searchParams.get("type");
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const backendUrl = new URL(
      `${process.env.BE_API_URL}/AdminPurchase/list`
    );
    if (pageNumber) {
      backendUrl.searchParams.set("pageNumber", pageNumber);
    }
    if (pageSize) {
      backendUrl.searchParams.set("pageSize", pageSize);
    }
    if (keyword) {
      backendUrl.searchParams.set("keyword", keyword);
    }
    if (type) {
      backendUrl.searchParams.set("type", type);
    }
    const backendResponse = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch purchases" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}