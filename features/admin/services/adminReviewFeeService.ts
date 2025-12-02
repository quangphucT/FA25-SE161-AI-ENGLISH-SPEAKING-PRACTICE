import fetchWithAuth from "@/utils/fetchWithAuth";

export interface CreateReviewFeeRequest {
  reviewFeeId: string;
  appliedDate: string;
  percentOfSystem: number;
  percentOfReviewer: number;
  pricePerReviewFee: number;
}

export interface CreateReviewFeePackageRequest {
   numberOfReview: number;
  pricePerReviewFee: number;
  percentOfSystem: number;
  percentOfReviewer: number;
}
export interface CreateReviewFeePackageResponse {
  isSucess: boolean;
  data: {
    packageId: string;
    numberOfReview: number;
    pricePerReviewFee: number;
    percentOfSystem: number;
    percentOfReviewer: number;
  };
  businessCode: string;
  message: string;
}

export interface CreateReviewFeeResponse {
  message: string;
}
export interface ReviewFeePackagesResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: ReviewFeePackage[];
  };
  businessCode: string;
  message: string;
}
export interface ReviewFeePackage {
  reviewFeeId: string;
  numberOfReview: number;
  currentPricePolicy: CurrentPricePolicy;
}
export interface CurrentPricePolicy {
  reviewFeeDetailId: string;
  pricePerReviewFee: number;
  appliedDate: string;
  percentOfSystem: number;
  percentOfReviewer: number;
}

export interface ReviewFeeDetailResponse {
  isSucess: boolean;
  data: {
    reviewFeeId: string;
    numberOfReview: number;
    status: string;

    currentPolicy: {
      pricePerReviewFee: number;
      reviewerIncome: number;
      percentOfReviewer: number;
      percentOfSystem?: number; 
      appliedFrom: string;
    };

    upcomingPolicy?: {
      pricePerReviewFee: number;
      reviewerIncome: number;
      percentOfReviewer: number;
      willApplyFrom: string;
    };

    historyPolicies: {
      reviewFeeDetailId: string;
      pricePerReviewFee: number;
      reviewerIncome: number;
      percentOfReviewer: number;
      percentOfSystem: number;
      appliedDate: string;
      isCurrent: boolean;
      isUpcoming: boolean;
    }[];
  };
  businessCode: string;
  message: string;
}

export interface HistoryPolicies {
  reviewFeeDetailId: string;
  pricePerReviewFee: number;
  reviewerIncome: string;
  percentOfReviewer: number;
  percentOfSystem: number;
  appliedDate: string;
  isCurrent:boolean;
  isUpcoming:boolean
}
export const adminReviewFeePackageService = async (
  body: CreateReviewFeePackageRequest
): Promise<CreateReviewFeePackageResponse> => {
  try {
    const response = await fetchWithAuth("/api/AdminDashboard/reviewfee-package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Create Review Fee Package failed");

    return data;

  } catch (error: any) {
    throw new Error(error?.message || "Unknown error while creating Review Fee Package");
  }
};

export const adminReviewFeeService = async (
  body: CreateReviewFeeRequest
): Promise<CreateReviewFeeResponse> => {
    try {
      const response = await fetchWithAuth("/api/AdminDashboard/reviewfee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Create review fee failed");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export const getReviewFeePackages = async (pageNumber: number, pageSize: number): Promise<ReviewFeePackagesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    const response = await fetchWithAuth(`/api/AdminDashboard/reviewfee?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch review fee packages");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};


export const getReviewFeeDetail = async (reviewFeeId: string): Promise<ReviewFeeDetailResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/reviewfee/${reviewFeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
            credentials: "include",

    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Lấy chi tiết gói phí đánh giá thất bại");
    }

    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Đã xảy ra lỗi khi lấy chi tiết gói phí đánh giá");
  }
};


export const adminReviewFeePolicyService = async (body: CreateReviewFeeRequest) => {
  try {
    const response = await fetchWithAuth("/api/AdminDashboard/reviewfee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Tạo chính sách phí đánh giá thất bại");

    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error while creating review fee policy");
  }
};
