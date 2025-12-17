export interface CreateQuestionTestRequest {
  type: "word" | "phrase" | "sentence";
  content: string;
}

export interface CreateQuestionTestResponse {
  isSuccess: boolean;
  data: {
    questionAssessmentId: string;
    type: "word" | "phrase" | "sentence";
    status: boolean;
    content: string;
  };
  message: string;
}

export interface QuestionAssessmentItem {
  questionAssessmentId: string;
  type: "word" | "phrase" | "sentence";
  status: boolean;
  content: string;
}

export interface GetQuestionTestResponse {
  isSuccess: boolean;
  data: {
    items: QuestionAssessmentItem[];
    totalPages: number;
  };

  message: string;
}

// question type
export type QuestionType = "word" | "phrase" | "sentence";

// update question test

export interface UpdateQuestionTestRequest {
  id: string;
  type: "word" | "phrase" | "sentence";
  content: string;
}
export interface UpdateQuestionTestResponse {
  isSuccess: boolean;
  data: {
    questionAssessmentId: string;
    type: "word" | "phrase" | "sentence";
    status: boolean;
    content: string;
  };
  message: string;
}

export interface ChooseQuestionTestResponse {
  isSuccess: boolean;

  message: string;
}