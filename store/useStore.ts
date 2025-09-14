// store/userStore.ts
import { create } from "zustand";

interface Account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  accessToken: string;
  refreshToken: string;
}

interface UserState {
  account: Account | null;
  setAccount: (account: Account) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
  logout: () => set({ account: null }),
}));
