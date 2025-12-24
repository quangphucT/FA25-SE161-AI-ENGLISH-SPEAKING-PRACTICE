import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const body = await request.json();
    try {
      const backendResponse = await fetch(
        `${process.env.BE_API_URL}/AdminReviewFee/review-fee-policy`,
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
          { message: error.message || "Failed to fetch review fee policy" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: "Failed to fetch review fee policy" },
        { status: 500 }
      );
    }
  }
export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    try {
      const { searchParams } = new URL(request.url);
      const pageNumber = searchParams.get("pageNumber");
      const pageSize = searchParams.get("pageSize");
      const backendUrl = new URL(
        `${process.env.BE_API_URL}/AdminReviewFee/review-fee-packages`
      );
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
          { message: error.message || "Failed to fetch review fee packages" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: "Failed to fetch review fee packages" },
        { status: 500 }
      );
    }
  }

export async function PUT(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const body = await request.json();
  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/AdminReviewFee/review-fee-policy/upcoming`,
      {
        method: "PUT",
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
        { message: error.message || "Failed to update review fee policy" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update review fee policy" },
      { status: 500 }
    );
  }
}
