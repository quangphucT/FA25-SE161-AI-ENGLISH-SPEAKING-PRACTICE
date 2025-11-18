import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitAnswerQuestionService } from "../../services/submitAnswerQuestionService/submitAnswerQuestion";

export interface SubmitAnswerQuestionRequest {
  learningPathQuestionId: string; // URL param
  audioRecordingUrl: string;
  transcribedText: string;
  scoreForVoice: number;
  explainTheWrongForVoiceAI: string;
}

export interface SubmitAnswerQuestionResponse {
  isSuccess: boolean;
  message: string;
}


export const useSubmitAnswerQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<SubmitAnswerQuestionResponse, Error, SubmitAnswerQuestionRequest>({
    mutationFn: submitAnswerQuestionService,
    onSuccess: (data) => {
      toast.success(data.message || "Nộp bài thành công");
        queryClient.invalidateQueries({ queryKey: ["learningPathCourseFull"] });
    },
    onError: (error) => {
      toast.error(error.message || "Nộp bài thất bại");
    },
  });
};
