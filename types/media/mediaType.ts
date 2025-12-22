export interface QuestionMedia {
  questionMediaId: string;
  questionId: string;
  accent: string;
  audioUrl: string;
  videoUrl: string;
  imageUrl: string;
  source: string;
}

export interface QuestionMediaResponse {
  isSucess: boolean;
  data: QuestionMedia[];
  businessCode: number;
  message: string;
}



export interface CreateMediaRequest {
 questionId: string;
  videoUrl?: string;
  imageUrl?: string;
}


export interface CreateMediaResponse {
  isSuccess: boolean;
  data: QuestionMedia;
  message: string;
}