import { create } from "zustand";

interface LearnerState {
  learnerCourseId: string | null;
  setLearnerCourseId: (id: string) => void;
  resetLearnerCourseId: () => void;
}

export const useLearnerStore = create<LearnerState>((set) => ({
  learnerCourseId: null,
  level: null,
  setLearnerCourseId: (id) => set({ learnerCourseId: id }),
  resetLearnerCourseId: () => set({ learnerCourseId: null }),
}));
