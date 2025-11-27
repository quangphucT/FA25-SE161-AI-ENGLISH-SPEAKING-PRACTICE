import fetchWithAuth from "@/utils/fetchWithAuth";

export interface AdminManagerResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: Manager[];
  };
  businessCode: number;
  message: string;
}
export interface Manager {
  userId: string;
  fullName: string;
  email: string;
  status?: string;
  createdAt: string;
  phoneNumber: string;
  role?: string;
}
export interface AdminManagerCreateResponse {
  message: string;
  email: string;
}
export interface AdminManagerDetailResponse {
  isSucess: boolean;
  data: ManagerDetail;
  businessCode: number;
  message: string;
}
export interface ManagerDetail {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  status: string;
  createdAt: string;
}
export const adminManagerService = async (
  pageNumber: number,
  pageSize: number,
  search: string
): Promise<AdminManagerResponse> => {
  try {
    const params = new URLSearchParams();
    if (pageNumber) params.set("pageNumber", pageNumber.toString());
    if (pageSize) params.set("pageSize", pageSize.toString());
    if (search) params.set("search", search);
    const queryString = params.toString();
    const response = await fetchWithAuth(
      `/api/AdminDashboard/manager${queryString ? `?${queryString}` : ""}`
    );
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    const message =
      (error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? (error.response.data as { message: string }).message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "An unknown error occurred";
    throw new Error(message);
  }
};
export const adminManagerCreateService = async (
  body: {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
  }
): Promise<AdminManagerCreateResponse> => {
  try {
    const response = await fetchWithAuth("/api/AdminDashboard/manager", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Create manager failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Create manager failed";
    throw new Error(message);
  }
};
export const adminManagerDetailService = async (userId: string): Promise<AdminManagerDetailResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/manager/${userId}`);
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    const message =
      (error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? (error.response.data as { message: string }).message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "An unknown error occurred";
    throw new Error(message);
  }
};