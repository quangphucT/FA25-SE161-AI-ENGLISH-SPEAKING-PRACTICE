import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { id } = await params;
    try {
        const backendResponse = await fetch(
            `${process.env.BE_API_URL}/AdminReviewFee/review-fee/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
       const contentType = backendResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await backendResponse.text();
            console.error("Non-JSON response received:", text.substring(0, 200));
            return NextResponse.json(
                { message: "Invalid response format from server" },
                { status: 500 }
            );
        }
        
        const data = await backendResponse.json();
        if (!backendResponse.ok) {
            return NextResponse.json({ message: data.message }, { status: backendResponse.status });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message || "Failed to delete review fee package" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Failed to delete review fee package" },
            { status: 500 }
        );
    }
}