"use client";
import { CreateMediaRequest, CreateMediaResponse } from "@/types/media/mediaType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMediaServiceFollowingQuestionId } from "../../service/mediaFollowingQuestionIdService/mediaFolloingQuestionId";


export const useCreateMediaFollowingQuestionId = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateMediaResponse, Error, CreateMediaRequest>({
    mutationFn: createMediaServiceFollowingQuestionId,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo media thành công");
      queryClient.invalidateQueries({ queryKey: ["getMediaFollowingQuestionId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo media thất bại");
    },
  });
};
