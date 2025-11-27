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

export interface NextQuestion {
  learningPathQuestionId: string;
  questionId: string;
  text: string;
  type: string;
  orderIndex: number;
}

export interface SubmitAnswerQuestionResponse {
  isSucess: boolean; // Note: API returns "isSucess" (typo in backend)
  data: {
    learnerAnswerId: string;
    learningPathExerciseId: string;
    exerciseId: string;
    submittedScore: number;
    averageScore: number;
    totalQuestions: number;
    numberDone: number;
    exerciseStatus: string;
    nextQuestion: NextQuestion | null;
  };
  businessCode: string;
  message: string;
}


export const useSubmitAnswerQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<SubmitAnswerQuestionResponse, Error, SubmitAnswerQuestionRequest>({
    mutationFn: submitAnswerQuestionService,
    onSuccess: (data) => {
      toast.success(data.message || "Nộp bài thành công");
      queryClient.invalidateQueries({ queryKey: ["learningPathCourseFull"] });
      console.log("Submit answer response:", data);
      
    },
    onError: (error) => {
      toast.error(error.message || "Nộp bài thất bại");
    },
  });
};
