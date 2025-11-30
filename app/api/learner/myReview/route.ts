import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const apiUrl = process.env.BE_API_URL;
    if (!apiUrl) {
        return NextResponse.json(
            { message: "API URL is not configured" },
            { status: 500 }
        );
    }
    try {
        const { searchParams } = new URL(request.url);
        const pageNumber = searchParams.get("pageNumber");
        const pageSize = searchParams.get("pageSize");
        const status = searchParams.get("status");
        const keyword = searchParams.get("keyword");
        const params = new URLSearchParams();
        if (pageNumber) {
            params.set("pageNumber", pageNumber.toString());
        }
        if (pageSize) {
            params.set("pageSize", pageSize.toString());
        }
        if (status) {
            params.set("status", status);
        }
        if (keyword) {
            params.set("keyword", keyword);
        }
        const response = await fetch(`${apiUrl}/LearnerReview/my-history?${params.toString()}`, {
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}