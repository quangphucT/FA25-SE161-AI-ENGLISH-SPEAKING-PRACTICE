import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
) {
    const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const learningPathQuestionId = parts[parts.length - 1];
  const accessToken = request.cookies.get("accessToken")?.value;
  try {
    const body = await request.json();
    const { audioRecordingUrl, transcribedText, scoreForVoice, explainTheWrongForVoiceAI } = body;



    const response = await fetch(`${process.env.BE_API_URL}/LearnerAnswer/${learningPathQuestionId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({
        audioRecordingUrl,
        transcribedText,
        scoreForVoice,
        explainTheWrongForVoiceAI,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Submit answer failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
