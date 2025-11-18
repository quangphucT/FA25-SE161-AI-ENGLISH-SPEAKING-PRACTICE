import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EnrollingFirstCourseState {
   learnerCourseId: string | null;
  courseId: string | null;
  learningPathCourseId: string | null;
  status: "InProgress" | "Completed" | null;
 


  // HÀM LƯU CẢ 3 GIÁ TRỊ
  setAllLearnerData: (data: {
    learnerCourseId: string | null;
    courseId: string;
    learningPathCourseId: string;
    status: "InProgress" | "Completed" ;
  }) => void;
 // HÀM LẤY CẢ 3 GIÁ TRỊ
  getAllLearnerData: () => {
    learnerCourseId: string | null;
    courseId: string | null;
    learningPathCourseId: string | null;
    status: "InProgress" | "Completed" | null;
  };
  clearLearnerData: () => void;
}

export const useLearnerStore = create<EnrollingFirstCourseState>()(
  persist(
    (set, get) => ({
      learnerCourseId: null,
      courseId: null,
      learningPathCourseId: null,
      status: null,
      setAllLearnerData: ({ learnerCourseId, courseId, learningPathCourseId, status }) =>
        set({
          learnerCourseId,
          courseId,
          learningPathCourseId,
          status,
        }),
      getAllLearnerData: () => ({
        learnerCourseId: get().learnerCourseId,
        courseId: get().courseId,
        learningPathCourseId: get().learningPathCourseId,
        status: get().status,
      }),
      clearLearnerData: () =>
        set({
          learnerCourseId: null,
          courseId: null,
          learningPathCourseId: null,
          status: null,
        }),
    }),
  
    {
      name: "enrollingFirst_courseStorage",
    }
  )
);


