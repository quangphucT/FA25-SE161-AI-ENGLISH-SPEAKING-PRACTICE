

import { GetQuestionsFollowingExerciseIdResponse, CreateQuestionRequest, CreateQuestionResponse, UpdateQuestionRequest } from "@/types/questionFollowingExcerciseId/question";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { DeleteQuestionResponse } from "../../hook/questionsHooks/useDeleteQuestion";
import { UpdateQuestionTestResponse } from "@/types/questionTest";
export const getQuestionsFollowingExerciseIdService = async (
  exerciseId: string
): Promise<GetQuestionsFollowingExerciseIdResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/manager/questionApiRoutes/getQuestionsFollowingExerciseId/${exerciseId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Get questions failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Get questions failed";
    throw new Error(message);
  }
};

export const createQuestionFollowingExerciseId = async (
  body: CreateQuestionRequest
): Promise<CreateQuestionResponse> => {
  try {
    const { exerciseId, questions } = body;
    const response = await fetchWithAuth(
      `/api/manager/questionApiRoutes/createQuestionFollowingExerciseId/${exerciseId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questions),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Create question failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Create question failed";
    throw new Error(message);
  }
};


export const deleteQuestionService = async (id: string): Promise<DeleteQuestionResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/questionApiRoutes/delete-question/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Delete question failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Delete question failed';
    throw new Error(message);
  }
};


export const updateQuestionService = async (
  id: string,
  payload: UpdateQuestionRequest
): Promise<UpdateQuestionTestResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/questionApiRoutes/updateQuestion/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update question failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Update question failed';
    throw new Error(message);
  }
};




