import fetchWithAuth from "@/utils/fetchWithAuth";
export interface AdminRecordChargeResponse {
    isSucess: boolean;
    data: {
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        totalActivePackages: number;
        totalActiveItems: number;
        items: RecordCharge[];
    };
    businessCode: number;
    message: string;
}
export interface RecordCharge {
    recordChargeId: string;
    amountCoin: number;
    allowedRecords: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
export async function getRecordChargeList(pageNumber: number, pageSize: number) :Promise<AdminRecordChargeResponse> {
    try {
        const params = new URLSearchParams();
        if (pageNumber) params.set("pageNumber", pageNumber.toString());
        if (pageSize) params.set("pageSize", pageSize.toString());
        const queryString = params.toString();
        const response = await fetchWithAuth(`/api/AdminDashboard/recordCharge${queryString ? `?${queryString}` : ""}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}
export interface AdminRecordChargeDetailResponse {
    isSucess: boolean;
    // BE có thể trả về 1 object hoặc 1 mảng object, nên để kiểu rộng một chút
    data: RecordChargeDetail | RecordChargeDetail[];
    businessCode: number;
    message: string;
}
export interface RecordChargeDetail {
        summary: {
          totalBuyer: number;
          totalCoin: number;
          allowedRecordCount: number;
        },
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        buyers: Buyer[];
}
export interface Buyer {
        fullName: string;
        email: string;
        coin: number;
        purchaseDate: string;
}
export async function getRecordChargeDetail(id: string, pageNumber: number, pageSize: number): Promise<AdminRecordChargeDetailResponse> {
    try {
    const params = new URLSearchParams();
    // Hiện tại FE tự paginate buyers, nên chỉ giữ lại pageNumber/pageSize nếu sau này cần
    if (pageNumber) params.set("pageNumber", pageNumber.toString());
    if (pageSize) params.set("pageSize", pageSize.toString());
    const queryString = params.toString();
    // Gọi đúng route detail theo id
    const response = await fetchWithAuth(`/api/AdminDashboard/recordCharge/${id}${queryString ? `?${queryString}` : ""}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}
export async function updateRecordCharge(id: string, body: UpdateRecordChargeRequest) :Promise<any > {
    try {
    const response = await fetchWithAuth(`/api/AdminDashboard/recordCharge/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}
export interface UpdateRecordChargeRequest {
    amountCoin: number;
    allowedRecordCount: number;
}
export async function deleteRecordCharge(id: string) {
    try {
    const response = await fetchWithAuth(`/api/AdminDashboard/recordCharge/${id}`, {
        method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}
export async function patchRecordCharge(id: string) {
    try {
    const response = await fetchWithAuth(`/api/AdminDashboard/recordCharge/${id}`, {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error(error.message);
    throw new Error("An unknown error occurred");
  }
}
export interface PatchRecordChargeResponse {
    isSucess: boolean;
    data: RecordChargeActiveItem;
    businessCode: number;
    message: string;
}
export interface ActiveRecordChargeResponse {
    isSucess: boolean;
    data: RecordChargeActiveItem[];
    businessCode: number;
    message: string;
}
export interface RecordChargeActiveItem {
    recordChargeId: string;
    amountCoin: number;
    allowedRecordCount: number;
}
export async function getActiveRecordCharge(): Promise<ActiveRecordChargeResponse> {
    try {
        const response = await fetchWithAuth(`/api/AdminDashboard/recordCharge/active`);
        const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}
export interface CreateRecordChargeRequest {
    amountCoin: number;
    allowedRecordCount: number;
}

export interface RecordChargeCreateItem {
    recordChargeId: string;
    amountCoin: number;
    allowedRecordCount: number;
    status: string;
    purchases: any[];
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export async function createRecordCharge(body: CreateRecordChargeRequest) :Promise<RecordChargeCreateItem> {
    try {
    const response = await fetchWithAuth(`/api/AdminDashboard/recordCharge`, {
        method: "POST",
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}