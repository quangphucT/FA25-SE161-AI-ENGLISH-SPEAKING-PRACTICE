import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get("pageNumber");
    const pageSize = searchParams.get("pageSize");
    try {
        const backendUrl = new URL(
            `${process.env.BE_API_URL}/ReviewerFeedback/my-feedback`
        );
        if (pageNumber) {
            backendUrl.searchParams.set("pageNumber", pageNumber);
        }
        if (pageSize) {
            backendUrl.searchParams.set("pageSize", pageSize);
        }
        const response = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message }, { status: response.status });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message || "Failed to fetch reviewer feedback" }, { status: 500 });
        }
        return NextResponse.json({ message: "Failed to fetch reviewer feedback" }, { status: 500 });
    }
}