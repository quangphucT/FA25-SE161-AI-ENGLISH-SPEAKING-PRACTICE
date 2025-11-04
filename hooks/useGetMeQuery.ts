// hooks/useGetMe.ts
"use client";
import { getMeService } from "@/features/shared/services/authService";
import { UserResponse } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetMeQuery = () => {
  return useQuery<UserResponse, Error>({
    queryKey: ["getMe"],
    queryFn: getMeService,
    staleTime: 1000 * 60 * 5, 
  });
};
