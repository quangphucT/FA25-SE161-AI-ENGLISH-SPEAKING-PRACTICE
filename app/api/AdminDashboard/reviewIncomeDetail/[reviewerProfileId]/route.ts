import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reviewerProfileId: string }> }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { reviewerProfileId } = await params;
  const { searchParams } = new URL(request.url);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const pageNumber = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  try {
    // Build URL with path parameter and query parameters
    const backendUrl = new URL(
      `${process.env.BE_API_URL}/AdminReviewerIncome/reviewer-detail/${reviewerProfileId}`
    );

    if (fromDate) {
      backendUrl.searchParams.set("fromDate", fromDate);
    }
    if (toDate) {
      backendUrl.searchParams.set("toDate", toDate);
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
        { message: error.message || "Failed to fetch reviewer income detail" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch reviewer income detail" },
      { status: 500 }
    );
  }
}

