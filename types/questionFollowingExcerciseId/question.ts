export interface GetQuestionsFollowingExerciseIdResponse {
    isSuccess: boolean;
    data: Question[];
    message: string;
}

export interface Question {
  questionId: string;
  text: string;
  type: string;
  orderIndex: number;
  phonemeJson: number;
}

export interface QuestionInput {
  text: string;
  type: number;
  orderIndex: number;
  phonemeJson: string;
}

export interface CreateQuestionRequest {
  exerciseId: string;
  questions: QuestionInput[];
}

export interface CreateQuestionResponse {
  isSuccess: boolean;
  data: Question[];
  message: string;
}

export interface UpdateQuestionRequest {
  text: string;
  type: number;
  orderIndex: number;
  phonemeJson: string;
}