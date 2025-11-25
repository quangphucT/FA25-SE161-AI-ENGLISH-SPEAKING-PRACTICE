import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateLevelForLearnerService } from "../../services/up-level/updateLevelForLearner";

export interface UpLevelResponse {
    message: string;
}

export const upLevelForLearner = () => {
    const queryClient = useQueryClient();
    
    return useMutation<UpLevelResponse, Error, void>({
        mutationFn: updateLevelForLearnerService,
        onSuccess: (data) => {
            toast.success(data.message || "Nâng cấp level thành công!");
            // Invalidate queries để refetch data mới
            queryClient.invalidateQueries({ queryKey: ["getMe"] }); // User profile
            queryClient.invalidateQueries({ queryKey: ["levelsAndlearnerCourseIds"] }); // Levels data
        },
        onError: (error) => {
            toast.error(error.message || "Nâng cấp level thất bại");
        }
    });
};
