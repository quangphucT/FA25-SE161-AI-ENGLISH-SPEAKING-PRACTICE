import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAIConversationPackagesService, deleteAIConversationPackageService, getAllAIConversationPackagesService, updateAIConversationPackageService } from "../../services/aiConversationPackagesServices/packages";


export interface CreateAIConversationPackagesRequest {
  amountCoin: number;
  allowedMinutes: number;
}
export interface CreateAIConversationPackagesResponse {
  message: string;
}
export const useCreateAIConversationPackages = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateAIConversationPackagesResponse, Error, CreateAIConversationPackagesRequest>({
    mutationFn: createAIConversationPackagesService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo gói hội thoại AI thành công");
        queryClient.invalidateQueries({ queryKey: ["getAIConversationPackages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo gói hội thoại AI thất bại");
    },
  });
};

export interface AiConversationCharge {
  aiConversationChargeId: string;
  amountCoin: number;
  allowedMinutes: number;
  status: string; 
  createdAt: string; 
  updatedAt: string;
  isDeleted: boolean;
}
export interface PaginationData<T> {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}
export interface GetAiConversationChargeResponse {
  isSucess: boolean;
  data: PaginationData<AiConversationCharge>;
  businessCode: number;
  message: string;
}
export const getAIConversationPackages = () => {

  return useQuery<GetAiConversationChargeResponse, Error>({
    queryKey: ["getAIConversationPackages"],
    queryFn: () => getAllAIConversationPackagesService(),
  });
  
}
export interface DeleteAIConversationPackageResponse {
  message: string;
}

export const useDeleteAIConversationPackage = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteAIConversationPackageResponse, Error, string>({
    mutationFn: (aiConversationChargeId: string) => deleteAIConversationPackageService(aiConversationChargeId),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa gói hội thoại AI thành công");
      queryClient.invalidateQueries({ queryKey: ["getAIConversationPackages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa gói hội thoại AI thất bại");
    },
  });
};
  
export interface UpdateAIConversationPackageRequest {
  aiConversationPackageId: string;
  amountCoin: number;
  allowedMinutes: number;
}
export interface UpdateAIConversationPackageResponse {
  message: string;
}

export const useUpdateAIConversationPackage = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateAIConversationPackageResponse, Error, UpdateAIConversationPackageRequest>({
    mutationFn: (data) => updateAIConversationPackageService(data),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật gói hội thoại AI thành công");
      queryClient.invalidateQueries({ queryKey: ["getAIConversationPackages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật gói hội thoại AI thất bại");
    },
  });
};