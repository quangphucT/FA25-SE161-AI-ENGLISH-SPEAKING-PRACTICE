import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/LearnerBuyReview/menu`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }
        return NextResponse.json(data, { status: 200 });
    }  catch (error: unknown) {
        if (error instanceof Error) {
          return NextResponse.json(
            { message: error.message || "Create question test failed" },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { message: "Create question test failed" },
          { status: 500 }
        );
      }
    }