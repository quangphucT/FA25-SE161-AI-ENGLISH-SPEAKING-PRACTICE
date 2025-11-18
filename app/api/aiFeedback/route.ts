import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const aiServiceUrl = `${process.env.AI_FEEDBACK_URL}/aiFeedback/`;
    const response = await fetch(aiServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI service error: ${response.status} - ${errorText}`);
    }
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_parseError) {
      throw new Error("Invalid JSON response from AI service");
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to get feedback",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
