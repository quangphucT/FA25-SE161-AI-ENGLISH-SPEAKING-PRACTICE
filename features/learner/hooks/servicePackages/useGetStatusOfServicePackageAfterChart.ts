"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrderCodeStatusResponse } from "@/types/coin_servicePackage";
import { getOrderCodeStatusService } from "../../services/getOrderCodeStatusService";

export const useGetOrderCodeStatusQuery = (orderCode: string) => {
  return useQuery<getOrderCodeStatusResponse, Error>({
    queryKey: ["getOrderCodeStatus", orderCode], // <-- Thêm orderCode để theo dõi sự thay đổi
    queryFn: () => getOrderCodeStatusService(orderCode),
    enabled: !!orderCode, // <-- Chỉ chạy khi orderCode có giá trị
  
  });
};