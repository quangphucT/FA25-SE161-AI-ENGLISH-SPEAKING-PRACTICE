"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadVideoService } from "@/features/manager/service/uploadVideoService/uploadVideo";

import { UploadResponse } from "@/types/upload/upload";

export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, Error, File>({
    mutationFn: uploadVideoService,

    onSuccess: (data) => {
      toast.success(data.message || "Upload video thành công");
      queryClient.invalidateQueries({ queryKey: ["getMediaFollowingQuestionId"] });
    },

    onError: (error) => {
      toast.error(error.message || "Upload video thất bại");
    },
  });
};
