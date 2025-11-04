
import { CreateQuestionTestRequest, CreateQuestionTestResponse } from "@/types/questionTest";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const createQuestionTestService = async (
  credentials: CreateQuestionTestRequest,
): Promise<CreateQuestionTestResponse> => {
  try {
    const response = await fetchWithAuth("/api/manager/create-question-test", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Create question test failed");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Create question test failed";
    throw new Error(message);
  }
};
