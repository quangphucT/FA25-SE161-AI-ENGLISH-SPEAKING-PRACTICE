import fetchWithAuth from "@/utils/fetchWithAuth";
import { NextResponse } from "next/server";
export interface LearnerBuyReviewBuyResponse {
    data: LearnerBuyReviewMenu[];
}
export interface LearnerBuyReviewMenu {
    reviewFeeId: string;
    numberOfReview: number;
    pricePerReviewFee: number;
    amountMoney: number;
}
export const LearnerBuyReviewBuyService = async (learnerAnswerId: string, reviewFeeId: string)=> {
    
    try {
    const response = await fetchWithAuth(`/api/learner/learnerBuyReview/buy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ learnerAnswerId, reviewFeeId }),
        credentials: "include",
        });
        
        // Get response text first to check if it's JSON
        const responseText = await response.text();
        
        // Check if response is empty
        if (!responseText || responseText.trim().length === 0) {
            throw new Error("Server trả về response rỗng");
        }
        
        // Check if response starts with HTML (error page)
        if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
            console.error("Server returned HTML instead of JSON:", responseText.substring(0, 200));
            throw new Error("Server trả về response không hợp lệ. Vui lòng thử lại sau.");
        }
        
        // Try to parse JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            console.error("Response text:", responseText.substring(0, 200));
            throw new Error("Server trả về response không phải JSON hợp lệ");
        }
        
        if (!response.ok) throw new Error(data.message || "Mua đánh giá thất bại");
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Mua đánh giá thất bại");
        }
        throw new Error("Mua đánh giá thất bại");
    }
}
export const LearnerBuyReviewMenuService = async (): Promise<LearnerBuyReviewBuyResponse>  => {
    try {
    const response = await fetchWithAuth(`/api/learner/buy-review/menu`, {
        method: "GET",
        headers:
        {
            "Content-Type": "application/json",
        },
        credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Lấy menu đánh giá thất bại");
        return data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "Lấy menu đánh giá thất bại";
        throw new Error(message);
    }
}
export const LearnerBuyReviewBuyRecordService = async (recordId: string, reviewFeeId: string) => {
    try {
    const response = await fetchWithAuth(`/api/learner/learnerBuyReview/buy-record`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordId, reviewFeeId }),
        credentials: "include",
        });
        
        // Get response text first to check if it's JSON
        const responseText = await response.text();
        
        // Check if response is empty
        if (!responseText || responseText.trim().length === 0) {
            throw new Error("Server trả về response rỗng");
        }
        
        // Check if response starts with HTML (error page)
        if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
            console.error("Server returned HTML instead of JSON:", responseText.substring(0, 200));
            throw new Error("Server trả về response không hợp lệ. Vui lòng thử lại sau.");
        }
        
        // Try to parse JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            console.error("Response text:", responseText.substring(0, 200));
            throw new Error("Server trả về response không phải JSON hợp lệ");
        }
        
        if (!response.ok) throw new Error(data.message || "Mua đánh giá record thất bại");
        return data;
    } catch (error: any) {
        if (error instanceof Error) {
            throw new Error(error.message || "Mua đánh giá record thất bại");
        }
        throw new Error("Mua đánh giá record thất bại");
    }
}