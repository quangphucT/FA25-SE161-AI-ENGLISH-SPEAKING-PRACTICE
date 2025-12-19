export interface AssessmentResponse {
  isSucess: boolean;
  data: Assessment;
  businessCode: string;
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
  type: "Word" | "Sentence" | "Phrase"; 
  questions: QuestionAssessment[];
}

export interface QuestionAssessment {
  questionAssessmentId: string;
  content: string;
}
