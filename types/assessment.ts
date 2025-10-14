export type AssessmentType = "placement" | "practice";
export type QuestionGranularity = "word" | "sentence" | "paragraph";

export interface Assessment {
  id: string;
  learnerId: string;
  type: AssessmentType;
  score?: number; // overall score if available
  numberOfQuestion: number;
  createdAt: string;
}

export interface AssessmentDetail {
  id: string; // PK AssessmentDetail id
  assessmentId: string; // FK AssessmentID
  questionAssessmentId: string; // FK QuestionAssessmentID
  type: QuestionGranularity; // word | sentence | paragraph
  answerAudio?: string; // URL or identifier
  score?: number; // per-question score
  feedback?: string; // AI feedback
  createdAt: string;
}

export interface PronunciationResult {
  id: string; // PK Result id
  assessmentId: string; // FK AssessmentID
  wordOrPhoneme: string; // surface or phoneme
  expectedSound: string;
  learnerSound: string;
  timestampMs: number; // when it occurred within audio
  accuracyScore: number; // 0..100
}
