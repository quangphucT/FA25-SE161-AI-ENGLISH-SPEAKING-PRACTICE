import fetchWithAuth from "@/utils/fetchWithAuth";
import {
  EnrolledPathChapterRequest,
  EnrolledPathChapterResponse,
  LearningPathChapterResponse,
} from "../../hooks/learnerPathChapterHooks/learnerPathChapter";

export const createLearningPathChapterService = async (
  body: EnrolledPathChapterRequest
): Promise<EnrolledPathChapterResponse> => {
  try {
    const { learnerCourseId, learningPathCourseId } = body;

    const response = await fetchWithAuth(
      `/api/learner/learningPathChapterApiRoutes/createLearningPathChapter/${learningPathCourseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          learnerCourseId,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Create chapter failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Create chapter failed";
    throw new Error(message);
  }
};

export const getLearningPathChaptersService = async (
  learningPathCourseId: string
): Promise<LearningPathChapterResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/learner/learningPathChapterApiRoutes/getLearningPathChapters/${learningPathCourseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Get learning path chapters failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Get learning path chapters failed";
    throw new Error(message);
  }
};
