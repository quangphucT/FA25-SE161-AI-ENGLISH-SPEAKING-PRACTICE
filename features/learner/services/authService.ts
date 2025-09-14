import api from "@/lib/axiosClient";


export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data.account; // chỉ lấy account
};
