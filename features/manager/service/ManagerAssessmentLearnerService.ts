import fetchWithAuth from "@/utils/fetchWithAuth";

export interface AssessmentLearnerResponse {
  isSucess: boolean;
  data: {
    items: AssessmentLearner[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  businessCode: string;
  message: string;
}
export interface AssessmentLearner {
    assessmentId: string;
    createdAt: string;
    score: number;
    feedback: string;
    numberOfQuestion: number;
    learnerProfileId: string;
    assessmentDetails: AssessmentDetail[];
}
export interface AssessmentDetail {
    assessmentDetailId: string;
    score: number;
    type: string;
    aI_Feedback: string;
    answerAudio: string;
    questionAssessment: QuestionAssessment;
}
export interface QuestionAssessment {
    content: string;
}
export const getManagerAssessmentLearnerService = async (pageNumber: number, pageSize: number): Promise<AssessmentLearnerResponse> => {
  try{
    const query = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    }).toString();
    const response = await fetchWithAuth(`/api/manager/assessmentlearner?${query}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    const message =
      (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
        ? (error.response.data as { message: string }).message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "Failed to fetch manager assessment";
    throw new Error(message);
  }
}