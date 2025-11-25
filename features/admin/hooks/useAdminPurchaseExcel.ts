"use client";

import { useMutation } from "@tanstack/react-query";
import {
  downloadPurchaseExcel,
  triggerExcelDownload,
} from "../services/adminPurchaseExcelService";
import { toast } from "sonner";

export const useDownloadPurchaseExcel = () => {
  return useMutation(
    {
      mutationFn: () => downloadPurchaseExcel(),
      onSuccess: (result) => {
        triggerExcelDownload(result.blob, result.filename);
        toast.success("Excel file downloaded successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to download Excel file");
      },
    }
  );
};

