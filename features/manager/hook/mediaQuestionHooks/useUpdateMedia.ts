"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMediaService } from "../../service/mediaFollowingQuestionIdService/mediaFolloingQuestionId";
export interface UpdateMediaRequest {
  videoUrl?: string;
  imageUrl?: string;
}
export interface UpdateMediaResponse {
  message: string;
}

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateMediaResponse, Error, { id: string; payload: UpdateMediaRequest }>({
    mutationFn: ({ id, payload }) => updateMediaService(id, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật media thành công");
      queryClient.invalidateQueries({ queryKey: ["getMediaFollowingQuestionId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật media thất bại");
    },
  });
};
