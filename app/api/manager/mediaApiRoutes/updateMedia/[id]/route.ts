import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const mediaId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!mediaId || mediaId === "[id]") {
    return NextResponse.json(
      { message: "mediaId is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const {videoUrl, imageUrl } = body;

  

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerQuestionMedia/medias/${mediaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
         
        
          videoUrl,
          imageUrl,
        }),
      }
    );

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Update media failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Update media failed" },
      { status: 500 }
    );
  }
}
