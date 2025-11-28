// 🧠 Cấu trúc chi tiết từng cấp
export interface Question {
  questionId: string;
  text: string;
  type: string;
  orderIndex: number;
  ipa: string;
  phonemeJson: string;
}

export interface Exercise {
  exerciseId: string;
  title: string;
  description: string;
  orderIndex: number;
  numberOfQuestion: number;
  isFree: boolean;
  questions: Question[];
}

export interface Chapter {
  chapterId: string;
  title: string;
  description: string;
  createdAt: string; // ISO date string
  numberOfExercise: number;
  exercises: Exercise[];
}

export interface Course {
  courseId: string;
  title: string;
  description?: string;
  type: string;
  numberOfChapter: number;
  orderIndex: number;
  level: string;
  price: number;
  status: "Active" | "Inactive";
  duration: number;
  chapters: Chapter[];
}
export interface CreateCourseResponse {
  isSucess: boolean;
  data: Course;
  businessCode: number;
  message: string;
}
export interface CreateCourseRequest {
  title: string;
  description: string;
  numberOfChapter: number;
  orderIndex: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
   price: number;
  duration: number;
  status: "Active" | "Inactive";
}

// ✅ Response khi lấy danh sách khóa học
export interface GetCoursesResponse {
  isSucess: boolean;
  data: {
    items: Course[];
    totalPages: number;
  };
  businessCode: number;
  message: string;
}


export interface GetCoursesOfLevelResponse{
  isSucess: boolean;
  data: CourseOfLevel[];
  businessCode: number;
  message: string;
}

interface CourseOfLevel {
  courseId: string;
  title: string;
  type: string;
  numberOfChapter: number;
  orderIndex: number;
  level: string;
  price: number;
}