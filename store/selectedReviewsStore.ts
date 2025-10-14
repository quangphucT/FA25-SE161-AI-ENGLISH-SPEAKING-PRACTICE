import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SelectedReviewItem = {
  id: number | string;
  question: string;
  audioUrl?: string;
  learnerAnswer?: string;
};

type SelectedReviewsState = {
  selectedReviews: SelectedReviewItem[];
  setSelectedReviews: (items: SelectedReviewItem[]) => void;
  addSelectedReviews: (items: SelectedReviewItem[]) => void;
  removeSelectedReview: (id: number | string) => void;
  clearSelectedReviews: () => void;
};

export const useSelectedReviewsStore = create<SelectedReviewsState>()(
  persist(
    (set) => ({
      selectedReviews: [],
      setSelectedReviews: (items) => set({ selectedReviews: items }),
      addSelectedReviews: (items) =>
        set((state) => ({
          selectedReviews: [
            ...state.selectedReviews.filter(
              (ex) => !items.some((n) => String(n.id) === String(ex.id))
            ),
            ...items,
          ],
        })),
      removeSelectedReview: (id) =>
        set((state) => ({
          selectedReviews: state.selectedReviews.filter(
            (item) => String(item.id) !== String(id)
          ),
        })),
      clearSelectedReviews: () => set({ selectedReviews: [] }),
    }),
    { name: "selected-reviews-storage" }
  )
);
