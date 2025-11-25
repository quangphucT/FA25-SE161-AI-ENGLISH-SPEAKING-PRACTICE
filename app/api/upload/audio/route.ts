import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const apiUrl = process.env.BE_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: "API URL is not configured" },
        { status: 500 }
      );
    }

    // Get FormData from request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate that it's an audio file
    if (!file.type.startsWith("audio/")) {
      return NextResponse.json(
        { success: false, error: "File is not an audio file" },
        { status: 400 }
      );
    }

    // Create new FormData to forward to backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    // Try different endpoint variations
    // From Swagger: POST /api/Upload/audio
    const endpointUrl = `${apiUrl}/Upload/audio`;
    
    // Log for debugging
    console.log("Uploading audio to:", endpointUrl);
    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);
    console.log("BE_API_URL:", apiUrl);

    // Forward request to backend API
    const backendResponse = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      },
      body: backendFormData,
    });

    // Get response text first to check if it's empty
    const responseText = await backendResponse.text();
    
    // Log for debugging
    console.log("Backend response status:", backendResponse.status);
    console.log("Backend response headers:", Object.fromEntries(backendResponse.headers.entries()));
    console.log("Backend response text:", responseText);
    console.log("Requested URL:", endpointUrl);

    // Check if response is empty
    if (!responseText || responseText.trim().length === 0) {
      console.error("Backend returned empty response");
      return NextResponse.json(
        { success: false, error: "Backend returned empty response" },
        { status: backendResponse.status || 500 }
      );
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse backend response as JSON:", parseError);
      console.error("Response text:", responseText);
      return NextResponse.json(
        { success: false, error: "Invalid JSON response from backend" },
        { status: 500 }
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: data.error || data.message || "Upload failed" },
        { status: backendResponse.status }
      );
    }

    // Return backend response (format: { success: true, url: "..." })
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error forwarding audio upload to backend:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message || "Upload failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}