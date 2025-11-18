import { useMutation } from "@tanstack/react-query";
import { UploadCertificateResponse } from "@/types/certificate";
import { reviewerCertificationUploadService } from "../services/reviewerCertificationUploadService";
import { toast } from "sonner";

export const useReviewerCertificationUpload = () => {
    return useMutation<UploadCertificateResponse, Error, { file: File; name: string }>({
      mutationFn: reviewerCertificationUploadService,
      onSuccess: (data) => {
        toast.success(data.message || "Upload certificate successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Upload certificate failed");
      },
    });
  };
 