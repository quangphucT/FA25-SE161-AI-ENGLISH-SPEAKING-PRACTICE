import { useUserStore } from "@/store/useStore";
import axios from "axios";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const account = useUserStore.getState().account;
    if (account?.accessToken) {
      config.headers.Authorization = `Bearer ${account.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ");
      // 👉 Tại đây có thể gọi API refresh token bằng account.refreshToken
    }
    return Promise.reject(error);
  }
);

export default api;
