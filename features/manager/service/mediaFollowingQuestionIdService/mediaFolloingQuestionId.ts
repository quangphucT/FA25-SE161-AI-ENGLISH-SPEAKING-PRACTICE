import { CreateMediaRequest, CreateMediaResponse, QuestionMediaResponse } from "@/types/media/mediaType";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { DeleteMediaResponse } from "../../hook/mediaQuestionHooks/useDeleteMedia";
import { UpdateMediaRequest, UpdateMediaResponse } from "../../hook/mediaQuestionHooks/useUpdateMedia";

export const getMediaFollowingQuestionIdService = async (
  questionId: string
): Promise<QuestionMediaResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/manager/mediaApiRoutes/getMediaFollowingQuestionId/${questionId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Get media failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Get media failed";
    throw new Error(message);
  }
};


export const createMediaServiceFollowingQuestionId = async (
  body: CreateMediaRequest
): Promise<CreateMediaResponse> => {
  try {
const { questionId, videoUrl, imageUrl } = body;

const payload: Record<string, string> = {};

if (videoUrl && videoUrl.trim() !== "") {
  payload.videoUrl = videoUrl;
}

if (imageUrl && imageUrl.trim() !== "") {
  payload.imageUrl = imageUrl;
}



    const response = await fetchWithAuth(
      `/api/manager/mediaApiRoutes/createMediaFollowingQuestionId/${questionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Create media failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Create media failed";
    throw new Error(message);
  }
};

export const deleteMediaService = async (id: string): Promise<DeleteMediaResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/mediaApiRoutes/delete-media/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Delete media failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Delete media failed';
    throw new Error(message);
  }
};

export const updateMediaService = async (
  id: string,
  payload: UpdateMediaRequest
): Promise<UpdateMediaResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/mediaApiRoutes/updateMedia/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update media  failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Update media failed';
    throw new Error(message);
  }
};