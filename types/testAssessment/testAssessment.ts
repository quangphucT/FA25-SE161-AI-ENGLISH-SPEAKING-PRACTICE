export interface AssessmentResponse {
  isSucess: boolean;
  data: Assessment[];
  businessCode: number;
  message: string;
}

export interface Assessment {
  assessmentId: string;
  createdAt: string;
  score: number;
  feedback: string;
  numberOfQuestion: number;
  sections: Section[];
}

export interface Section {
  type: "word" | "phrase" | "sentence"; // 3 loại có thể có
  questions: QuestionAssessment[];
}

export interface QuestionAssessment {
  questionAssessmentId: string;
  content: string;
}
