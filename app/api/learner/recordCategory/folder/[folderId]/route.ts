import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ folderId: string }> }) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { folderId } = await params;
    const body = await request.json();
    try {
        const backendResponse = await fetch(`${process.env.BE_API_URL}/RecordCategory/${folderId}/purchase-record`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await backendResponse.json();
        if (!backendResponse.ok) {
            return NextResponse.json({ message: data.message }, { status: backendResponse.status });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Failed to create record category" }, { status: 500 });
    }
}