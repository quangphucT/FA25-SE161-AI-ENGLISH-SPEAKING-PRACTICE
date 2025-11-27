import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { recordId, reviewFeeId } = await request.json();
    const apiUrl = process.env.BE_API_URL;
    
    if (!apiUrl) {
        return NextResponse.json(
            { message: "API URL is not configured" },
            { status: 500 }
        );
    }
    
    try {
        const response = await fetch(`${apiUrl}/LearnerBuyReview/buy-record`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ recordId, reviewFeeId }),
            credentials: "include",
        }); 
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Backend returned non-JSON response:", text.substring(0, 200));
            return NextResponse.json(
                { message: "Backend trả về response không hợp lệ" },
                { status: 500 }
            );
        }
        
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        console.error("Error in buy review record:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message || "Mua đánh giá record thất bại" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Mua đánh giá record thất bại" },
            { status: 500 }
        );
    }
}
