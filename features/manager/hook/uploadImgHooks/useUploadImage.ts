"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImageService } from "@/features/manager/service/uploadImageService/uploadImage";
import { UploadResponse } from "@/types/upload/upload";

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, Error, File>({
    mutationFn: uploadImageService,

    onSuccess: (data) => {
      toast.success(data.message || "Upload ảnh thành công");
      queryClient.invalidateQueries({ queryKey: ["getMediaFollowingQuestionId"] });
    },

    onError: (error) => {
      toast.error(error.message || "Upload ảnh thất bại");
    },
  });
};
