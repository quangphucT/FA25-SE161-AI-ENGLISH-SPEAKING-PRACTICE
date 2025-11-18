import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  try {
    const body = await req.json();
    const { learningPathExerciseId, status } = body;

    if (!learningPathExerciseId || !status) {
      return NextResponse.json(
        { isSucess: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        { isSucess: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Call external API
    const response = await fetch(
      `${process.env.BE_API_URL}/LearningPathExercise/${learningPathExerciseId}/status?status=${status}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { isSucess: false, message: data.message || "Failed to start exercise" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Start exercise error:", error);
    return NextResponse.json(
      { isSucess: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
