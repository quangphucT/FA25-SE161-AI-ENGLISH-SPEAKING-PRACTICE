"use client";
import { UploadCertificateRequest, UploadCertificateResponse } from "@/types/certificate";
import { useMutation } from "@tanstack/react-query";
import { uploadCertificateService } from "../services/uploadCertificateService";
export const useUploadCertificate = () => {
  return useMutation<UploadCertificateResponse, Error, UploadCertificateRequest>({
    mutationFn: uploadCertificateService,
  });
};
