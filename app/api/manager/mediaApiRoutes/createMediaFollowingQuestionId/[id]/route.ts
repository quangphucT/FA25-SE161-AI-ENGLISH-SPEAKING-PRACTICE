import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const questionId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;
  
  if (!questionId || questionId === "[id]") {
    return NextResponse.json(
      { message: "questionId is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const {videoUrl, imageUrl } = body;

  if (!videoUrl && !imageUrl) {
  return NextResponse.json(
    { message: "Phải có ít nhất một trong video hoặc hình ảnh" },
    { status: 400 }
  );
}



    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerQuestionMedia/medias/${questionId}`,
      {
        method: "POST",
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
        { message: error.message || "Create media failed" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Create media failed" },
      { status: 500 }
    );
  }
}
