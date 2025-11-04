
import { UpdateQuestionTestRequest, UpdateQuestionTestResponse } from "@/types/questionTest";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const updateQuestionTestService = async (
  credentials: UpdateQuestionTestRequest,
): Promise<UpdateQuestionTestResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/update-question/${credentials.id}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Update question test failed");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Update question test failed";
    throw new Error(message);
  }
};
