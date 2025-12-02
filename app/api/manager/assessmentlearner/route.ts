import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value ?? "";
  try {
    const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  const type = searchParams.get("type");
  const keyword = searchParams.get("keyword");
  const backendUrl = new URL(
    `${process.env.BE_API_URL}/Assessment`
  );
  backendUrl.searchParams.set("pageNumber", pageNumber ?? "1");
  backendUrl.searchParams.set("pageSize", pageSize ?? "10");
  backendUrl.searchParams.set("type", type ?? "");
  backendUrl.searchParams.set("keyword", keyword ?? "");
  const response = await fetch(backendUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",   
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch assessments" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}