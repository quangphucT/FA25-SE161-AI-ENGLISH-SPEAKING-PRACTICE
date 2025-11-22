import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { UpLevelResponse } from "../../hooks/up-level/upLevelHook";

export const updateLevelForLearnerService = async (): Promise<UpLevelResponse> => {
    const response = await fetchWithAuth("/api/learner/up-level", {
        method: "POST",
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Nâng cấp level thất bại" }));
        throw new Error(error.message || "Nâng cấp level thất bại");
    }
    
    return await response.json();
};