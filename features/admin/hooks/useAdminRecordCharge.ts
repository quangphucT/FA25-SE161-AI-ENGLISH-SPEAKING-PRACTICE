import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActiveRecordChargeResponse, AdminRecordChargeDetailResponse, AdminRecordChargeResponse, CreateRecordChargeRequest, RecordChargeCreateItem, createRecordCharge, getActiveRecordCharge, getRecordChargeDetail, getRecordChargeList, updateRecordCharge, UpdateRecordChargeRequest, patchRecordCharge, deleteRecordCharge } from "../services/adminRecordChargeService";
import { toast } from "sonner";

export const useAdminRecordCharge = (pageNumber: number, pageSize: number   ) => {
    return useQuery<AdminRecordChargeResponse, Error>({
        queryKey: ["adminRecordCharge"],
        queryFn: () => getRecordChargeList(pageNumber, pageSize),
    });
}
export const useAdminRecordChargeDetail = (id: string, pageNumber: number, pageSize: number) => {
    return useQuery<AdminRecordChargeDetailResponse, Error>({
        queryKey: ["adminRecordChargeDetail", id, pageNumber, pageSize],
        queryFn: () => getRecordChargeDetail(id, pageNumber, pageSize),
    });
}
export const useAdminRecordChargeActive = () => {
    return useQuery<ActiveRecordChargeResponse, Error>({
        queryKey: ["adminRecordChargeActive"],
        queryFn: () => getActiveRecordCharge(),
    });
}
export const useAdminRecordChargeCreate = (body: CreateRecordChargeRequest) => {
    const queryClient = useQueryClient();
    return useMutation<RecordChargeCreateItem, Error, CreateRecordChargeRequest>({
        mutationFn: () => createRecordCharge(body),
        onSuccess: (data) => {
            toast.success("Tạo record charge thành công");
            queryClient.invalidateQueries({ queryKey: ["adminRecordCharge"] });
        },
        onError: (error) => {
            toast.error(error.message || "Tạo record charge thất bại");
        },
    });
    }
export const useAdminRecordChargeUpdate = (id: string, body: UpdateRecordChargeRequest) => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, UpdateRecordChargeRequest>({
        mutationFn: () => updateRecordCharge(id, body),
        onSuccess: (data) => {
            toast.success("Cập nhật record charge thành công");
            queryClient.invalidateQueries({ queryKey: ["adminRecordCharge"] });
        },
        onError: (error) => {
            toast.error(error.message || "Cập nhật record charge thất bại");
        },
    });
}
export const useAdminRecordChargeDelete = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: () => deleteRecordCharge(id),
        onSuccess: (data) => {
            toast.success("Xóa record charge thành công");
            queryClient.invalidateQueries({ queryKey: ["adminRecordCharge"] });
        },
        onError: (error) => {
            toast.error(error.message || "Xóa record charge thất bại");
        },
    });
}
export const useAdminRecordChargePatch = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: () => patchRecordCharge(id),
        onSuccess: (data) => {
            toast.success("Cập nhật record charge thành công");
            queryClient.invalidateQueries({ queryKey: ["adminRecordCharge"] });
        },
        onError: (error) => {
            toast.error(error.message || "Cập nhật record charge thất bại");
        },
    });
}