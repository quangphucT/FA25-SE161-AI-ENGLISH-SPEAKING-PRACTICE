// ===============================
// RESPONSE MODELS (FROM BACKEND)
// ===============================
export interface Question {
  questionId: string;
  text: string;
  type: number;               // FE dùng number, đừng để string
  orderIndex: number;
  phonemeJson?: string;       // optional cho an toàn
}

export interface GetQuestionsFollowingExerciseIdResponse {
  isSuccess: boolean;
  data: Question[];
  message: string;
}

// ===============================
// CREATE QUESTION
// ===============================
export interface CreateQuestionInput {
  text: string;
  type: number;
  phonemeJson?: string;       // CREATE có thể chưa có
}

export interface CreateQuestionRequest {
  exerciseId: string;
  questions: CreateQuestionInput[];
}

export interface CreateQuestionResponse {
  isSuccess: boolean;
  data: Question[];
  message: string;
}

// ===============================
// UPDATE QUESTION
// ===============================
export interface UpdateQuestionRequest {
  text: string;
  type: number;
  orderIndex: number;         // UPDATE BẮT BUỘC
  phonemeJson?: string;
}
