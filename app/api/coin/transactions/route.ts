import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  try {
    const backendUrl = new URL(
      `${process.env.BE_API_URL}/Coin/transactions/all`
    );
    if (pageNumber) {
      backendUrl.searchParams.set("pageNumber", pageNumber);
    }
    if (pageSize) {
      backendUrl.searchParams.set("pageSize", pageSize);
    }
    if (search) {
      backendUrl.searchParams.set("search", search);
    }
    if (status) {
      backendUrl.searchParams.set("status", status);
    }
    const backendResponse = await fetch(
      backendUrl.toString(),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
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
        { message: error.message || "Failed to fetch transaction" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
