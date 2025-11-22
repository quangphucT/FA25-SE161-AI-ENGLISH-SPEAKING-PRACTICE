import { CustomError } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const learningPathCourseId = searchParams.get('learningPathCourseId');
  const courseId = searchParams.get('courseId');


  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (learningPathCourseId) {
      queryParams.append('learningPathCourseId', learningPathCourseId);
    }
    if (courseId) {
      queryParams.append('courseId', courseId);
    }
   

    const url = `${process.env.BE_API_URL}/LearningPathCourse/full?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Failed to fetch learning path course";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
