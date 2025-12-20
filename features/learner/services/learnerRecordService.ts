import fetchWithAuth from "@/utils/fetchWithAuth";

export type Status = "Draft" | "InProgress" | "Done";
// Interfaces
export interface RecordCategory {
  learnerRecordId: string;
  name: string;
  status?: Status;
  createdAt?: Date;
  numberOfRecord?: number;
}

export interface RecordCategoryResponse {
  data: RecordCategory[];
  message?: string;
  isSucess: boolean; // Note: API returns "isSucess" with one 'c'
  businessCode?: string;
}
export type StatusRecord = "Draft"  | "Submitted";
export interface Record {
    recordContentId: string;
    content: string;
    recordId: string;
    audioRecordingURL: string;
    transcribedText: string;
    score: number;
    aiFeedback: string;
    status: StatusRecord;
    createdAt: Date;
    numberOfReview: number;
    isNeedReviewed: boolean;
}

export interface RecordResponse {
  data?: Record[] | Record; // Support both array and single object
  message?: string;
  isSucess?: boolean;
  businessCode?: string;
}

export interface CreateRecordCategoryResponse {
  message?: string;
  data?: RecordCategory;
  isSuccess?: boolean;
}

export interface CreateRecordResponse {
  message?: string;
  data?: Record;
  isSuccess?: boolean;
}

export interface DeleteResponse {
  message?: string;
  isSuccess?: boolean;
}

export interface ReviewRecordRequest {
  score?: number;
  aiFeedback?: string;
  audioRecordingURL?: string;
  transcribedText?: string;
}

export interface ReviewRecordResponse {
  message?: string;
  isSuccess?: boolean;  
}

// Folder/Category Services
export const LearnerRecordFolderService = async (): Promise<RecordCategoryResponse> => {
    try {
        const response = await fetchWithAuth(`/api/learner/recordCategory`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Lấy danh sách thư mục thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Lấy danh sách thư mục thất bại");
        }
        throw new Error("Lấy danh sách thư mục thất bại");
    }
}
export const LearnerRecordFolderCreateService = async (name: string): Promise<CreateRecordCategoryResponse> => {
    try {
        const response = await fetchWithAuth(`/api/learner/recordCategory`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Tạo thư mục thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Tạo thư mục thất bại");
        }
        throw new Error("Tạo thư mục thất bại");
    }
}

export const LearnerRecordFolderDeleteService = async (categoryId: string): Promise<DeleteResponse> => {
    try {
        const response = await fetchWithAuth(`/api/learner/recordCategory/${categoryId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryId }),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Xóa thư mục thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Xóa thư mục thất bại");
        }
        throw new Error("Xóa thư mục thất bại");
    }
}

export const LearnerRecordFolderRenameService = async (categoryId: string, newName: string): Promise<CreateRecordCategoryResponse> => {
    try {
        const response = await fetchWithAuth(`/api/learner/recordCategory/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({  newName }),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Đổi tên thư mục thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Đổi tên thư mục thất bại");
        }
        throw new Error("Đổi tên thư mục thất bại");
    }
}

// Record Services
export const LearnerRecordService = async (folderId: string): Promise<RecordResponse> => {
    try {
        const response = await fetchWithAuth(`/api/learner/record/folder/${folderId}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Lấy danh sách record thất bại");
        } 
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Lấy danh sách record thất bại");
        }
        throw new Error("Lấy danh sách record thất bại");
    }
}

export const LearnerRecordCreateService = async (folderId: string, content: string): Promise<CreateRecordResponse> => {
    try {
        const response = await fetchWithAuth(`/api/learner/record/folder/${folderId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Tạo record thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Tạo record thất bại");
        }
        throw new Error("Tạo record thất bại");
    }
}

export const LearnerRecordDeleteService = async (recordContentId: string): Promise<DeleteResponse> => {
    try {
        if (!recordContentId) {
            throw new Error("Record Content ID is required");
        }
        const response = await fetchWithAuth(`/api/learner/record/recordContent/${recordContentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Xóa record thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Xóa record thất bại");
        }
        throw new Error("Xóa record thất bại");
    }
}

export const LearnerRecordPostSubmitService = async (recordContentId: string, body: ReviewRecordRequest): Promise<ReviewRecordResponse> => {
    try {
        if (!recordContentId) {
            throw new Error("Record Content ID is required");
        }
        const response = await fetchWithAuth(`/api/learner/record/recordContent/${recordContentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Đánh giá record thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Đánh giá record thất bại");
        }
        throw new Error("Đánh giá record thất bại");
    }
}

export const LearnerRecordUpdateContentService = async (recordContentId: string, content: string): Promise<ReviewRecordResponse> => {
    try {
        if (!recordContentId) {
            throw new Error("Record Content ID is required");
        }
        const response = await fetchWithAuth(`/api/learner/record/recordContent/${recordContentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Cập nhật nội dung record thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Cập nhật nội dung record thất bại");
        }
        throw new Error("Cập nhật nội dung record thất bại");
    }
}
export const LearnerBuyRecordChargeService = async (folderId : string, recordChargeId: string): Promise<any> => {
    try {
        if (!folderId) {
            throw new Error("folder ID is required");
        }
        const response = await fetchWithAuth(`/api/learner/recordCategory/folder/${folderId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ recordChargeId }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Mua đánh giá record thất bại");
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Mua đánh giá record thất bại");
        }
        throw new Error("Mua đánh giá record thất bại");
    }
}