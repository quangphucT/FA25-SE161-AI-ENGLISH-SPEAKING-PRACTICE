import { fetchWithAuth } from "@/utils/fetchWithAuth";

export interface AdminWithdrawalResponse {
  isSuccess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: Withdrawal[];
  };
  businessCode: number;
  message: string;
}
export interface Withdrawal {
    transactionId: string;  
    userId: string;
    fullName: string;
    email: string;
    coin: number;
    amountMoney: number;
    bankName: string;
    accountNumber: string;
    orderCode: string;
    status: string;
    createdAt: string;
}
export interface AdminWithdrawalPutResponse {
    isSuccess: boolean;
    data: {
        transactionId: string;
        amountCoin: number;
        amountMoney: number;
        status: string;
    };
    businessCode: number;
    message: string;
}
export const adminWithdrawalService = async (pageNumber: number, pageSize: number): Promise<AdminWithdrawalResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/withdrawalRequest?pageNumber=${pageNumber}&pageSize=${pageSize}`);
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
export const adminWithdrawalApproveService = async (transactionId: string): Promise<AdminWithdrawalPutResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/withdrawalRequest/approve/${transactionId}`);
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
export const adminWithdrawalRejectService = async (transactionId: string): Promise<AdminWithdrawalPutResponse> => {
    try {
        const response = await fetchWithAuth(`/api/AdminDashboard/withdrawalRequest/reject/${transactionId}`);
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