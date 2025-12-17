"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LearnerRecordFolderService,
  LearnerRecordFolderCreateService,
  LearnerRecordFolderDeleteService,
  LearnerRecordFolderRenameService,
  LearnerRecordService,
  LearnerRecordCreateService,
  LearnerRecordDeleteService,
  RecordCategoryResponse,
  CreateRecordCategoryResponse,
  DeleteResponse,
  RecordResponse,
  CreateRecordResponse,
  ReviewRecordRequest,
  ReviewRecordResponse,
  LearnerRecordUpdateContentService,
  LearnerRecordUpdateService,
  LearnerBuyRecordChargeService,
} from "../services/learnerRecordService";
import { toast } from "sonner";

// Folder/Category Hooks
export const useLearnerRecordFolders = () => {
  return useQuery<RecordCategoryResponse, Error>({
    queryKey: ["learnerRecordFolders"],
    queryFn: () => LearnerRecordFolderService(),
  });
};

export const useLearnerRecordFolderCreate = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateRecordCategoryResponse, Error, string>({
    mutationFn: (name: string) => LearnerRecordFolderCreateService(name),
    onSuccess: (data) => {
      toast.success(data.message || "Tạo thư mục thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecordFolders"] });
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo thư mục thất bại");
    },
  });
};

export const useLearnerRecordFolderDelete = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, Error, string>({
    mutationFn: (categoryId: string) => LearnerRecordFolderDeleteService(categoryId),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa thư mục thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecordFolders"] });
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa thư mục thất bại");
    },
  });
};

export const useLearnerRecordFolderRename = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateRecordCategoryResponse, Error, { categoryId: string; newName: string }>({
    mutationFn: ({ categoryId, newName }) => LearnerRecordFolderRenameService(categoryId, newName),
    onSuccess: (data) => {
      toast.success(data.message || "Đổi tên thư mục thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecordFolders"] });
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
    },
    onError: (error) => {
      toast.error(error.message || "Đổi tên thư mục thất bại");
    },
  });
};

// Record Hooks
export const useLearnerRecords = (folderId: string | null) => {
  return useQuery<RecordResponse, Error>({
    queryKey: ["learnerRecords", folderId],
    queryFn: () => {
      if (!folderId) {
        return Promise.resolve({ data: [] } as RecordResponse);
      }
      return LearnerRecordService(folderId);
    },
    enabled: !!folderId, // Only query when folderId is provided
  });
};

export const useLearnerRecordCreate = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateRecordResponse, Error, { folderId: string; content: string }>({
    mutationFn: ({ folderId, content }) => LearnerRecordCreateService(folderId, content),
    onSuccess: (data) => {
      toast.success(data.message || "Tạo record thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
      queryClient.invalidateQueries({ queryKey: ["learnerRecordFolders"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo record thất bại");
    },
  });
};

export const useLearnerRecordDelete = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, Error, string>({
    mutationFn: (recordId: string) => LearnerRecordDeleteService(recordId),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa record thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa record thất bại");
    },
  });
};

export const useLearnerRecordUpdateContent = () => {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecordResponse, Error, { recordId: string; content: string }>({
    mutationFn: ({ recordId, content }) => LearnerRecordUpdateContentService(recordId, content),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật nội dung record thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật nội dung record thất bại");
    },
  });
};

export const useLearnerRecordUpdate= () => {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecordResponse, Error, { recordId: string; reviewData: ReviewRecordRequest }>({
    mutationFn: ({ recordId, reviewData }) => LearnerRecordUpdateService(recordId, reviewData),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật nội dung record thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật nội dung record thất bại");
    },
  });
};
export const useLearnerBuyRecordCharge = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { folderId: string; recordChargeId: string }>({
    mutationFn: ({ folderId, recordChargeId }) => LearnerBuyRecordChargeService(folderId, recordChargeId),
    onSuccess: (data) => {
      toast.success(data.message || "Mua đánh giá record thành công");
      queryClient.invalidateQueries({ queryKey: ["learnerRecords"] });
      queryClient.invalidateQueries({ queryKey: ["learnerRecordFolders"] });
    },
    onError: (error) => {
      toast.error(error.message || "Mua đánh giá record thất bại");
    },
  });
};