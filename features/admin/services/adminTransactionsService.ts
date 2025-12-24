import { Transaction } from "@/features/learner/services/learnerTransactionService";
import fetchWithAuth from "@/utils/fetchWithAuth";

export interface TransactionAdmin {
  transactionId: string;
  userId: string;
  userName?: string; // Optional - not present in Withdrawal transactions
  servicePackageId?: string; // Optional - not present in Withdrawal transactions
  servicePackageName?: string; // Optional - not present in Withdrawal transactions
  amountMoney: number;
  amountCoin: number;
  orderCode: string;
  bankName?: string; // Optional - might not be present in all transactions
  accountNumber?: string; // Optional - might not be present in all transactions
  description: string;
  type: string;
  status: string;
  createdTransaction: string;
}

export interface PaginatedTransactionsData {
  items: TransactionAdmin[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminTransactionsResponse {
  isSucess: boolean;
  data: PaginatedTransactionsData;
  businessCode: string;
  message: string;
}

export interface AdminDashboardResponse {
  isSuccess: boolean;
  data: {
    totalDepositPaid: number;
    totalWithdrawalApproved: number;
    totalFailTransaction: number;
    totalPendingTransaction: number;
    totalDepositAmount: number;
    totalWithdrawalAmount: number;
  };
}
export const adminTransactionsService = async (pageNumber: number, pageSize: number, search: string, status: string, type: string): Promise<AdminTransactionsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    if (search) {
      queryParams.set("search", search.toString());
    }
    if (status) {
      queryParams.set("status", status.toString());
    }
    if (type) {
      queryParams.set("type", type.toString());
    }
    const response = await fetchWithAuth(`/api/coin/transactions?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to fetch transactions");
    }
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

export const adminDashboardTransactionService = async (): Promise<AdminDashboardResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/transaction/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
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