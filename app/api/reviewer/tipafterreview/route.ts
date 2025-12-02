import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    
    if (!accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    try {
        // Read request body as JSON
        const body = await request.json();
        console.log("Tip after review request body:", body);
        
        // Try the most likely endpoint first based on pattern from other APIs
        const endpoint = `${process.env.BE_API_URL}/ReviewerReview/tip-after-review`;
        console.log("Calling endpoint:", endpoint);
        
        const backendResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
            credentials: "include",
        });
        
        console.log("Backend response status:", backendResponse.status);
        console.log("Backend response headers:", Object.fromEntries(backendResponse.headers.entries()));
        
        // Read response as text first
        const responseText = await backendResponse.text();
        console.log("Backend response text:", responseText);
        
        let data;
        try {
            // Try to parse as JSON
            data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            // If not JSON, use text as message
            data = { message: responseText || "Failed to tip after review" };
        }
        
        if (!backendResponse.ok) {
            console.error("Backend error:", data);
            return NextResponse.json(
                { 
                    message: data.message || data.error || `Server error: ${backendResponse.status}`,
                    ...data 
                }, 
                { status: backendResponse.status }
            );
        }
        
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        console.error("Tip after review error:", error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message || "Failed to tip after review" }, { status: 500 });
        }
        return NextResponse.json({ message: "Failed to tip after review" }, { status: 500 });
    }
}