import fetchWithAuth from "@/utils/fetchWithAuth";

export interface Transaction {
  orderCode: string;
  amountMoney: number;
  amountCoin: number;
  status: string;
  description: string;
  createdAt: string;
}

export interface AdminTransactionsResponse {
  data: Transaction[];
}

export const adminTransactionsService = async (): Promise<AdminTransactionsResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/transaction`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch transactions");
    }
    // API trả về array trực tiếp, cần wrap vào object có property data
    return Array.isArray(data) ? { data } : data;
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