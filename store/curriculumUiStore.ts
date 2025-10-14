import { create } from "zustand";

type Role = "instructor" | "viewer";

interface CurriculumUiState {
  role: Role;
  setRole: (role: Role) => void;
  selectedCourseId?: string;
  selectCourse: (id: string) => void;
  selectedChapterId?: string;
  selectChapter: (id: string) => void;
  previewMode: boolean;
  setPreview: (on: boolean) => void;
}

export const useCurriculumUiStore = create<CurriculumUiState>((set) => ({
  role: "instructor",
  setRole: (role) => set({ role }),
  selectedCourseId: undefined,
  selectCourse: (id) =>
    set({ selectedCourseId: id, selectedChapterId: undefined }),
  selectedChapterId: undefined,
  selectChapter: (id) => set({ selectedChapterId: id }),
  previewMode: false,
  setPreview: (on) => set({ previewMode: on }),
}));
