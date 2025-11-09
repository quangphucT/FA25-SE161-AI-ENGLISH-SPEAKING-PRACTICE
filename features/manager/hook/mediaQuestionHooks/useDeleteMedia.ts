"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMediaService } from "../../service/mediaFollowingQuestionIdService/mediaFolloingQuestionId";

export interface DeleteMediaResponse {
  message: string;
}
export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteMediaResponse, Error, string>({
    mutationFn: (id) => deleteMediaService(id),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa media thành công");
      queryClient.invalidateQueries({ queryKey: ["getMediaFollowingQuestionId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa media thất bại");
    },
  });
};
