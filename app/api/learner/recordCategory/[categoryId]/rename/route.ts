import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { categoryId } = await params;
    const { newName } = await request.json();
    const apiUrl = process.env.BE_API_URL;
    
    if (!apiUrl) {
        return NextResponse.json(
            { message: "API URL is not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(`${apiUrl}/RecordCategory/${categoryId}/rename`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ newName }),
            credentials: "include",
        });
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Non-JSON response received:", text.substring(0, 200));
            return NextResponse.json(
                { message: "Invalid response format from server" },
                { status: 500 }
            );
        }
        
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message }, { status: response.status });
        }
        return NextResponse.json(data, { status: 200 });
    }
    catch (error: unknown) {
        console.error("Error in PUT /api/learner/recordCategory/[categoryId]/rename:", error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

