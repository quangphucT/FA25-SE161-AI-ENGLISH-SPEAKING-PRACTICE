export interface CreateQuestionTestRequest {
  type: "Word" | "Phrase" | "Sentence";
  content: string;
}

export interface CreateQuestionTestResponse {
  isSuccess: boolean;
  data: {
    questionAssessmentId: string;
    type: "Word" | "Phrase" | "Sentence";
    status: boolean;
    content: string;
  };
  message: string;
}

export interface QuestionAssessmentItem {
  questionAssessmentId: string;
  type: "Word" | "Phrase" | "Sentence";
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
export type QuestionType = "Word" | "Phrase" | "Sentence";

// update question test

export interface UpdateQuestionTestRequest {
  id: string;
  type: "Word" | "Phrase" | "Sentence";
  content: string;
}
export interface UpdateQuestionTestResponse {
  isSuccess: boolean;
  data: {
    questionAssessmentId: string;
    type: "Word" | "Phrase" | "Sentence";
    status: boolean;
    content: string;
  };
  message: string;
}

export interface ChooseQuestionTestResponse {
  isSuccess: boolean;

  message: string;
}