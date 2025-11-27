import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ recordId: string }> }
) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { recordId } = await params;
    const { content } = await request.json();
    if (!recordId) {
        return NextResponse.json({ message: "Record ID is required" }, { status: 400 });
    }
    const apiUrl = process.env.BE_API_URL;
    if (!apiUrl) {
        return NextResponse.json(
            { message: "API URL is not configured" },
            { status: 500 }
        );
    }
    try {
        const response = await fetch(`${apiUrl}/Record/${recordId}/update-content`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content }),
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message }, { status: response.status });
        }
        return NextResponse.json(data, { status: 200 });
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
