
import { ChooseQuestionTestResponse, UpdateQuestionTestRequest, UpdateQuestionTestResponse } from "@/types/questionTest";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const chooseQuestionForTestAssessmentService = async (
  params: { questionId: string; status: boolean }
): Promise<ChooseQuestionTestResponse> => {
  try {
   // Gửi status qua query param ?status=true/false
    const response = await fetchWithAuth(
      `/api/manager/choose-question/${params.questionId}?status=${params.status}`,
      {
        method: "PUT",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Update question test failed");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Update question test failed";
    throw new Error(message);
  }
};
