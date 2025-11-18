import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  const search = searchParams.get("search");
  try {
    // Build URL with query parameters
    const backendUrl = new URL(
      `${process.env.BE_API_URL}/AdminManager/list`
    );
    
    if (search) {
        backendUrl.searchParams.set("search", search);
      }
    if (pageNumber) {
      backendUrl.searchParams.set("pageNumber", pageNumber);
    }
    if (pageSize) {
      backendUrl.searchParams.set("pageSize", pageSize);
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

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch manager" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch manager" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const body = await request.json();
  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/Admin/create-manager`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
        { message: error.message || "Failed to fetch manager" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch manager" },
      { status: 500 }
    );
  }
}