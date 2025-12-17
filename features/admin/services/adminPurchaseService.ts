import fetchWithAuth from "@/utils/fetchWithAuth";
export interface PurchasesResponse {
  isSuccess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: Purchase[];
  };
  businessCode: number;
  message: string;
}
export interface Purchase {
    purchaseId: string;
    userId: string;
    userName: string;
    status: string;
    coin?: number; // For list response
    amountCoin?: number; // For detail response
    createdAt: string;
    itemType: string;
    itemName?: string; // May not be in detail response
}
export const getPurchases = async (pageNumber: number, pageSize: number, keyword: string, type: string): Promise<PurchasesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      keyword: keyword,
      type: type,
    });
    if (pageNumber) {
      queryParams.set("pageNumber", pageNumber.toString());
    }
    if (pageSize) {
      queryParams.set("pageSize", pageSize.toString());
    }
    if (keyword) {
      queryParams.set("keyword", keyword);
    }
    if (type) {
      queryParams.set("type", type);
    }
    const response = await fetchWithAuth(`/api/AdminDashboard/purchase?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",   
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch purchases");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};
export interface PurchaseDetailsResponse {
  isSucess?: boolean; // Handle typo in API response
  data: {
    info: Purchase;
    itemDetail: CoursePurchaseDetail | ReviewFeePurchaseDetail | AIConversationPurchaseDetail;
  };
  businessCode: number | string;
  message: string;
}
export interface CoursePurchaseDetail {
    courseId: string;
    title: string;
    level: string;
    numberOfChapter: number;
    orderIndex: number;
    price: number;
}
export interface ReviewFeePurchaseDetail {
    reviewFeeId: string;
    numberOfReview: number;
    price: number;
    percentOfSystem: number;
    percentOfReviewer: number;
}
export interface AIConversationPurchaseDetail {
    aiConversationChargeId: string;
    amountCoin: number;
    allowedMinutes: number;
    status: string;
}

export interface AiBuyersResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalPackages: number;
    items: {
      aiConversationChargeId: string;
      allowedMinutes: number;
      totalPurchase: number;
      totalAmountCoin: number;
      totalBuyers: number;
      buyerPageNumber: number;
      buyerPageSize: number;
      buyers: Buyer[];
    }[];
  };
  businessCode: string | number;
  message: string;
}
export interface Buyer {
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
  amountCoin: number;
}
export interface ReviewFeeBuyersResponse {
  isSucess: boolean;
  data: {
    reviewFeeId: string;
    numberOfReview: number;
    totalPurchase: number;
    totalAmountCoin: number;
    buyers: Buyer[];
  }[];
  businessCode: string;
  message?: string;
}
export interface EnrolledCourseResponse {
  isSucess: boolean;
  data: {
    courseId: string;
    title: string;
    level: string;
    totalPurchase: number;
    totalAmountCoin: number;
    price: number;
    buyers: Buyer[];
  };
  businessCode: number;
  message: string;
}
export const getPurchaseDetails = async (purchaseId: string): Promise<PurchaseDetailsResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/purchase/detail/${purchaseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const apiResponse = await response.json();
    if (!response.ok) throw new Error(apiResponse.message || "Failed to fetch purchase details");
    
    // API route returns { message, data: backendResponse }
    // backendResponse has { isSucess, data: { info, itemDetail }, ... }
    // We need to unwrap and return the backendResponse directly
    const backendResponse = apiResponse.data;
    
    // Return in the expected format
    return {
      isSucess: backendResponse.isSucess,
      data: backendResponse.data, // { info, itemDetail }
      businessCode: backendResponse.businessCode,
      message: backendResponse.message,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
  
};

export interface AdminPurchaseDashboardResponse {
  isSucess: boolean;
  data: {
    totalSuccessTransaction: number;
    totalRevenue: number;
  };
  businessCode: number;
  message: string;
}

export const adminDashboardPurchaseService = async (): Promise<AdminPurchaseDashboardResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/purchase/dashboard`, {
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

export const getAiBuyers = async (pageNumber: number, pageSize: number, buyerPageNumber: number, buyerPageSize: number): Promise<AiBuyersResponse> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      buyerPageNumber: buyerPageNumber.toString(),
      buyerPageSize: buyerPageSize.toString(),
    });
    const response = await fetchWithAuth(`/api/AdminDashboard/purchase/ai-buyers?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};
export const getReviewFeeBuyers = async (pageNumber: number, pageSize: number): Promise<ReviewFeeBuyersResponse> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    const response = await fetchWithAuth(`/api/AdminDashboard/purchase/reviewfee-buyers?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};
export const getEnrolledCourseBuyers = async (pageNumber: number, pageSize: number): Promise<EnrolledCourseResponse> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    const response = await fetchWithAuth(`/api/AdminDashboard/purchase/course-enroll?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};