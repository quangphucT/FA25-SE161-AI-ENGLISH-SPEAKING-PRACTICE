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
      console.log("Data:", data)
        // Invalidate và refetch ngay lập tức
        queryClient.invalidateQueries({ 
          queryKey: ["learningPathCourseFull"],
          refetchType: 'active' // Force refetch cho query đang active
        });
    },
    onError: (error) => {
      toast.error(error.message || "Nộp bài thất bại");
    },
  });
};
