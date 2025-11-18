export interface GetExcerciseFollowingChapterIdResponse {
    isSuccess: boolean;
    data: Excercise[];
    message: string;
}

export interface Excercise {
  exerciseId: string;
  title: string;
  description: string;
  orderIndex: number;
  numberOfQuestion: number;
  createdAt: string;
}

export interface CreateExcerciseRequest {
  chapterId: string;
  title: string;
  description: string;
  orderIndex: number;
  numberOfQuestion: number;
}
export interface CreateExcerciseResponse {
  isSuccess: boolean;
  data: Excercise;
  message: string;
}