import fetchWithAuth from "@/utils/fetchWithAuth";
import { SubmitAnswerQuestionRequest, SubmitAnswerQuestionResponse } from "../../hooks/submitAnswerQuestionHooks/submitAnswerQuestion";

export const submitAnswerQuestionService = async (
  body: SubmitAnswerQuestionRequest
): Promise<SubmitAnswerQuestionResponse> => {
  try {
    const { learningPathQuestionId, audioRecordingUrl, transcribedText, scoreForVoice, explainTheWrongForVoiceAI } = body;
    
    const response = await fetchWithAuth(
      `/api/learner/submitAnswerQuestion/${learningPathQuestionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            audioRecordingUrl,
            transcribedText,
            scoreForVoice,
            explainTheWrongForVoiceAI
        }),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Submit answer question failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Submit answer question failed";
    throw new Error(message);
  }
};