// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Account {
  accessToken: string;
  refreshToken: string;
  avatar: string | null;
  createdAt: string;
  description: string | null;
  email: string;
  firstName: string;
  id: number;
  isActive: boolean;
  phone: string | null;
  updatedAt: string;
  lastName: string;
}

interface UserState {
  account: Account | null;
  setAccount: (account: Account) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      account: null,
      setAccount: (account) => set({ account }),
      logout: () => set({ account: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ account: state.account }),
    }
  )
);
