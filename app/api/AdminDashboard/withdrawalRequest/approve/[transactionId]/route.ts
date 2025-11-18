import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { transactionId } = await params;

  try {
    
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/AdminWithdrawal/approve/${transactionId}`,
      {
        method: "PUT",
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
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Ban reviewer failed" },
      { status: 500 }
    );
  }
}
