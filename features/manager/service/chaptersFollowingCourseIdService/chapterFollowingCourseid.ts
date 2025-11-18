import { GetChapterFollowingCourseIdResponse, CreateChapterRequest, CreateChapterResponse } from "@/types/chapterFollowingCourseId/chapter";

import fetchWithAuth from "@/utils/fetchWithAuth";

export const getChapterFollowingCourseIdService = async (
  courseId: string
): Promise<GetChapterFollowingCourseIdResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/manager/chapterApiRoutes/getChaptersFollowingCourseId/${courseId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Get chapters failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Get chapters failed";
    throw new Error(message);
  }
};

export const createChapterServiceFollowingCourseId = async (
  body: CreateChapterRequest
): Promise<CreateChapterResponse> => {
  try {
    const { courseId, title, description, numberOfExercise } = body;
    
    const response = await fetchWithAuth(
      `/api/manager/chapterApiRoutes/createChapterFollowingCourseId/${courseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          numberOfExercise,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Create chapter failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Create chapter failed";
    throw new Error(message);
  }
};



export const updateChapterService = async (
  id: string,
  payload: CreateChapterRequest
): Promise<CreateChapterResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/chapterApiRoutes/updateChapter/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update chapter failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Update chapter failed';
    throw new Error(message);
  }
};

export interface DeleteChapterResponse {
  isSucess: boolean;
  businessCode: number;
  message: string;
}
export const deleteChapterService = async (id: string): Promise<DeleteChapterResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/chapterApiRoutes/delete-chapter/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Delete chapter failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Delete chapter failed';
    throw new Error(message);
  }
};