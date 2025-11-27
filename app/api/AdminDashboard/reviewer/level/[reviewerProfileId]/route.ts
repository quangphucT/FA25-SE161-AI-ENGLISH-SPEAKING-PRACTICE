import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ reviewerProfileId: string }> }) {
    const { reviewerProfileId } = await params;
    const accessToken = request.cookies.get("accessToken")?.value;
    try {
        const body = await request.json();
        const backendResponse = await fetch(`${process.env.BE_API_URL}/AdminReviewer/level/${reviewerProfileId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
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
                { message: error.message || "Update reviewer level failed" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Update reviewer level failed" },
            { status: 500 }
        );
    }
}

