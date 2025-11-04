import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const id = params.id;

  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/ManagerQuestionAssessment/questions/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: unknown) {
    console.error("Update question failed:", error);
    return NextResponse.json(
      { message: "Update question failed" },
      { status: 500 }
    );
  }
}
